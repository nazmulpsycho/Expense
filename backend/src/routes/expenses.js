import { Router } from "express";
import { auth } from "../middleware/auth.js";
import {
  expenseValidation,
  updateExpenseValidation,
  reportQueryValidation,
  dashboardQueryValidation,
} from "./validators.js";
import Expense from "../models/Expense.js";
import { categorize } from "../utils/categorizer.js";
import Budget from "../models/Budget.js";
import { createHttpError } from "../middleware/errorHandler.js";

const router = Router();

router.use(auth);

router.get("/", async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search = "", category = "", sort = "createdAt", order = "desc", startDate, endDate } = req.query;
    const filter = { userId: req.user!.userId };
    if (search) {
      filter.$or = [
        { expenseName: { $regex: search, $options: "i" } },
        { note: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
      ];
    }
    if (category) filter.category = category;
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = startDate;
      if (endDate) filter.date.$lte = endDate;
    }
    const sortField = ["expenseName", "amount", "date", "time", "createdAt"].includes(sort) ? sort : "createdAt";
    const sortOrder = order === "asc" ? 1 : -1;
    const total = await Expense.countDocuments(filter);
    const items = await Expense.find(filter)
      .sort({ [sortField]: sortOrder })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));
    res.json({ data: items.map(serializeExpense), pagination: { page: Number(page), limit: Number(limit), total, pages: Math.max(1, Math.ceil(total / Number(limit))) } });
  } catch (err) {
    next(err);
  }
});

router.post("/", expenseValidation, async (req, res, next) => {
  try {
    const { expenseName, amount, category: forcedCategory, note, receipt } = req.body;
    const { category, confidence } = categorize(expenseName, note);
    const finalCategory = forcedCategory && forcedCategory.trim() ? forcedCategory : category;
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10);
    const timeStr = now.toTimeString().slice(0, 8);
    const expense = await new Expense({
      userId: req.user!.userId,
      expenseName: expenseName.trim(),
      amount: Number(amount),
      category: finalCategory,
      note: note ? note.trim() : "",
      receipt: receipt || "",
      date: dateStr,
      time: timeStr,
    }).save();
    res.status(201).json({ data: serializeExpense(expense), autoCategory: { category, confidence, overridden: !!forcedCategory } });
  } catch (err) {
    next(err);
  }
});

router.put("/:id", updateExpenseValidation, async (req, res, next) => {
  try {
    const { id } = req.params;
    const existing = await Expense.findOne({ _id: id, userId: req.user!.userId });
    if (!existing) return next(createHttpError(404, "Expense not found"));
    const { expenseName, amount, category: forcedCategory, note, receipt } = req.body;
    const { category, confidence } = categorize(expenseName || existing.expenseName, note || existing.note);
    const finalCategory = forcedCategory && forcedCategory.trim() ? forcedCategory : (expenseName || amount || note || receipt ? category : existing.category);
    Object.assign(existing, {
      ...(expenseName !== undefined ? { expenseName: expenseName.trim() } : {}),
      ...(amount !== undefined ? { amount: Number(amount) } : {}),
      ...(forcedCategory !== undefined ? { category: forcedCategory.trim() } : { category: finalCategory }),
      ...(note !== undefined ? { note: note.trim() } : {}),
      ...(receipt !== undefined ? { receipt: receipt || "" } : {}),
    });
    await existing.save();
    res.json({ data: serializeExpense(existing), autoCategory: { category, confidence, overridden: !!forcedCategory } });
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await Expense.deleteOne({ _id: id, userId: req.user!.userId });
    if (!result.deletedCount) return next(createHttpError(404, "Expense not found"));
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

router.post("/:id/duplicate", async (req, res, next) => {
  try {
    const { id } = req.params;
    const original = await Expense.findOne({ _id: id, userId: req.user!.userId });
    if (!original) return next(createHttpError(404, "Expense not found"));
    const dup = await new Expense({
      userId: req.user!.userId,
      expenseName: original.expenseName,
      amount: original.amount,
      category: original.category,
      note: original.note,
      receipt: original.receipt,
      date: new Date().toISOString().slice(0, 10),
      time: new Date().toTimeString().slice(0, 8),
    }).save();
    res.status(201).json({ data: serializeExpense(dup) });
  } catch (err) {
    next(err);
  }
});

router.get("/summary", async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    const filter = { userId: req.user!.userId };
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = startDate;
      if (endDate) filter.date.$lte = endDate;
    }
    const stats = await Expense.aggregate([
      { $match: filter },
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
          total: { $sum: "$amount" },
          avg: { $avg: "$amount" },
        },
      },
      { $sort: { total: -1 } },
    ]);
    res.json({ data: stats.map((s) => ({ category: s._id, count: s.count, total: s.total, avg: s.avg })) });
  } catch (err) {
    next(err);
  }
});

export default router;

function serializeExpense(e) {
  return {
    id: e._id,
    expenseName: e.expenseName,
    amount: e.amount,
    category: e.category,
    note: e.note,
    receipt: e.receipt,
    date: e.date,
    time: e.time,
    createdAt: e.createdAt,
  };
}
