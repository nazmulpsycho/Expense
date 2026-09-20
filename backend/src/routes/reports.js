import { Router } from "express";
import { auth } from "../middleware/auth.js";
import Expense from "../models/Expense.js";
import { reportQueryValidation } from "./validators.js";
import { createHttpError } from "../middleware/errorHandler.js";
import Budget from "../models/Budget.js";

const router = Router();

router.use(auth);

router.get("/daily", reportQueryValidation, async (req, res, next) => {
  try {
    const user = req.user!.userId;
    const date = req.query.startDate || new Date().toISOString().slice(0, 10);
    const nextDate = new Date(new Date(date).getTime() + 86400000).toISOString().slice(0, 10);
    const items = await Expense.find({ userId: user, date: { $gte: date, $lt: nextDate } }).sort({ time: 1 });
    const total = items.reduce((s, i) => s + i.amount, 0);
    res.json({ date, total, count: items.length, expenses: items.map(serializeExpense) });
  } catch (err) {
    next(err);
  }
});

router.get("/weekly", reportQueryValidation, async (req, res, next) => {
  try {
    const user = req.user!.userId;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    const start = startOfWeek.toISOString().slice(0, 10);
    const end = today.toISOString().slice(0, 10);
    const items = await Expense.find({ userId: user, date: { $gte: start, $lte: end } }).sort({ date: 1, time: 1 });
    const total = items.reduce((s, i) => s + i.amount, 0);
    const dailyTotals = dailyGroup(items);
    res.json({ start, end, total, count: items.length, dailyTotals, expenses: items.map(serializeExpense) });
  } catch (err) {
    next(err);
  }
});

router.get("/monthly", reportQueryValidation, async (req, res, next) => {
  try {
    const user = req.user!.userId;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const start = startOfMonth.toISOString().slice(0, 10);
    const end = today.toISOString().slice(0, 10);
    const items = await Expense.find({ userId: user, date: { $gte: start, $lte: end } }).sort({ date: 1, time: 1 });
    const total = items.reduce((s, i) => s + i.amount, 0);
    const dailyTotals = dailyGroup(items);
    const categoryTotals = categoryGroup(items);
    const budget = await Budget.findOne({ userId: user });
    res.json({ start, end, total, count: items.length, dailyTotals, categoryTotals, expenses: items.map(serializeExpense), budget: budget ? { dailyBudget: budget.dailyBudget, weeklyBudget: budget.weeklyBudget, monthlyBudget: budget.monthlyBudget } : null });
  } catch (err) {
    next(err);
  }
});

router.get("/yearly", reportQueryValidation, async (req, res, next) => {
  try {
    const user = req.user!.userId;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startOfYear = new Date(today.getFullYear(), 0, 1);
    const start = startOfYear.toISOString().slice(0, 10);
    const end = today.toISOString().slice(0, 10);
    const items = await Expense.find({ userId: user, date: { $gte: start, $lte: end } }).sort({ date: 1, time: 1 });
    const total = items.reduce((s, i) => s + i.amount, 0);
    const monthlyTotals = monthlyGroup(items);
    const categoryTotals = categoryGroup(items);
    const budget = await Budget.findOne({ userId: user });
    res.json({ start, end, total, count: items.length, monthlyTotals, categoryTotals, expenses: items.map(serializeExpense), budget: budget ? { dailyBudget: budget.dailyBudget, weeklyBudget: budget.weeklyBudget, monthlyBudget: budget.monthlyBudget } : null });
  } catch (err) {
    next(err);
  }
});

function dailyGroup(items) {
  const map = new Map();
  for (const i of items) {
    const d = i.date;
    if (!map.has(d)) map.set(d, { date: d, total: 0, count: 0 });
    const entry = map.get(d);
    entry.total += i.amount;
    entry.count += 1;
  }
  return Array.from(map.values()).sort((a, b) => a.date.localeCompare(b.date));
}

function monthlyGroup(items) {
  const map = new Map();
  for (const i of items) {
    const m = i.date.slice(0, 7);
    if (!map.has(m)) map.set(m, { month: m, total: 0, count: 0 });
    const entry = map.get(m);
    entry.total += i.amount;
    entry.count += 1;
  }
  return Array.from(map.values()).sort((a, b) => a.month.localeCompare(b.month));
}

function categoryGroup(items) {
  const map = new Map();
  for (const i of items) {
    if (!map.has(i.category)) map.set(i.category, { category: i.category, total: 0, count: 0 });
    const entry = map.get(i.category);
    entry.total += i.amount;
    entry.count += 1;
  }
  return Array.from(map.values()).sort((a, b) => b.total - a.total);
}

function serializeExpense(e) {
  return { id: e._id, expenseName: e.expenseName, amount: e.amount, category: e.category, note: e.note, receipt: e.receipt, date: e.date, time: e.time, createdAt: e.createdAt };
}

export default router;
