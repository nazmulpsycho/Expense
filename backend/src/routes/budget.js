import { Router } from "express";
import { auth } from "../middleware/auth.js";
import Budget from "../models/Budget.js";
import { createHttpError } from "../middleware/errorHandler.js";
import { body, runValidation } from "express-validator";

const router = Router();

const budgetBodyValidation = [
  body("dailyBudget").optional().isFloat({ min: 0 }),
  body("weeklyBudget").optional().isFloat({ min: 0 }),
  body("monthlyBudget").optional().isFloat({ min: 0 }),
  runValidation,
];

router.use(auth);

router.get("/", async (req, res, next) => {
  try {
    let budget = await Budget.findOne({ userId: req.user!.userId });
    if (!budget) {
      budget = await new Budget({ userId: req.user!.userId }).save();
    }
    res.json({ data: serializeBudget(budget) });
  } catch (err) {
    next(err);
  }
});

router.post("/", budgetBodyValidation, async (req, res, next) => {
  try {
    const { dailyBudget, weeklyBudget, monthlyBudget } = req.body;
    let budget = await Budget.findOne({ userId: req.user!.userId });
    if (!budget) {
      budget = await new Budget({ userId: req.user!.userId }).save();
    }
    if (dailyBudget !== undefined) budget.dailyBudget = dailyBudget;
    if (weeklyBudget !== undefined) budget.weeklyBudget = weeklyBudget;
    if (monthlyBudget !== undefined) budget.monthlyBudget = monthlyBudget;
    await budget.save();
    res.json({ data: serializeBudget(budget) });
  } catch (err) {
    next(err);
  }
});

export default router;

function serializeBudget(b) {
  return {
    id: b._id,
    userId: b.userId,
    dailyBudget: b.dailyBudget,
    weeklyBudget: b.weeklyBudget,
    monthlyBudget: b.monthlyBudget,
    createdAt: b.createdAt,
    updatedAt: b.updatedAt,
  };
}
