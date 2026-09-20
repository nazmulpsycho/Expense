import { Router } from "express";
import { auth } from "../middleware/auth.js";
import Expense from "../models/Expense.js";
import Budget from "../models/Budget.js";
import { dashboardQueryValidation } from "./validators.js";
import { createHttpError } from "../middleware/errorHandler.js";

const router = Router();

router.use(auth);

router.get("/", dashboardQueryValidation, async (req, res, next) => {
  try {
    const user = req.user!.userId;
    const qStart = req.query.startDate as string | undefined;
    const qEnd = req.query.endDate as string | undefined;

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const startOfToday = startOfDay.toISOString().slice(0, 10);

    const startOfWeek = new Date(startOfDay);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    const startOfWeekStr = startOfWeek.toISOString().slice(0, 10);

    const startOfMonth = new Date(startOfDay.getFullYear(), startOfDay.getMonth(), 1);
    const startOfMonthStr = startOfMonth.toISOString().slice(0, 10);

    const startOfYear = new Date(startOfDay.getFullYear(), 0, 1);
    const startOfYearStr = startOfYear.toISOString().slice(0, 10);

    const today = startOfDay.toISOString().slice(0, 10);
    const weekRange: [string, string] = [startOfWeekStr, today];
    const monthRange: [string, string] = [startOfMonthStr, today];
    const yearRange: [string, string] = [startOfYearStr, today];

    const defFilter = { userId: user };
    const todayStats = await statsForRange(defFilter, [today, today]);
    const weekStats = await statsForRange(defFilter, weekRange);
    const monthStats = await statsForRange(defFilter, monthRange);
    const yearStats = await statsForRange(defFilter, yearRange);

    // Recent transactions
    const recent = await Expense.find({ userId: user }).sort({ createdAt: -1 }).limit(8);
    const recentMap = recent.map(serializeExpense);

    // Daily spend series for the last 30 days
    const thirtyDaysAgo = new Date(startOfDay);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29);
    const seriesRange: [string, string] = [thirtyDaysAgo.toISOString().slice(0, 10), today];
    const dailySeries = await seriesForRange(defFilter, seriesRange);

    // Category breakdown for the month
    const categoryBreak = await Expense.aggregate([
      { $match: { userId: mongoose.Types.ObjectId(user), date: { $gte: monthRange[0], $lte: monthRange[1] } } },
      { $group: { _id: "$category", total: { $sum: "$amount" }, count: { $sum: 1 } } },
      { $sort: { total: -1 } },
    ]);

    // Budget
    let budget = await Budget.findOne({ userId: user });
    if (!budget) budget = await new Budget({ userId: user }).save();

    res.json({
      stats: {
        today: todayStats,
        weekly: weekStats,
        monthly: monthStats,
        yearly: yearStats,
        averageDailySpend: monthStats.count ? monthStats.total / Math.max(1, daysInRange(monthRange)) : 0,
        highestCategory: monthStats.total ? monthStats.category : null,
      },
      recent: recentMap,
      dailySeries,
      categoryBreakdown: categoryBreak.map((c) => ({ category: c._id, total: c.total, count: c.count })),
      budget: {
        dailyBudget: budget.dailyBudget,
        weeklyBudget: budget.weeklyBudget,
        monthlyBudget: budget.monthlyBudget,
      },
      dateRange: {
        today,
        weekStart: weekRange[0],
        monthStart: monthRange[0],
        yearStart: yearRange[0],
      },
    });
  } catch (err) {
    next(err);
  }
});

async function statsForRange(filter: object, range: [string, string]) {
  const [start, end] = range;
  const extended: any = { ...filter, date: { $gte: start, $lte: end } };
  const [summary] = await Expense.aggregate([
    { $match: extended },
    {
      $group: {
        _id: null,
        total: { $sum: "$amount" },
        count: { $sum: 1 },
        avg: { $avg: "$amount" },
      },
    },
  ]);
  const [top] = await Expense.aggregate([
    { $match: extended },
    { $group: { _id: "$category", total: { $sum: "$amount" } } },
    { $sort: { total: -1 } },
    { $limit: 1 },
  ]);
  return {
    total: summary?.total || 0,
    count: summary?.count || 0,
    avg: summary?.avg || 0,
    category: top?._id || null,
    categoryTotal: top?.total || 0,
  };
}

async function seriesForRange(filter: object, range: [string, string]) {
  const [start, end] = range;
  const extended: any = { ...filter, date: { $gte: start, $lte: end } };
  const rows = await Expense.aggregate([
    { $match: extended },
    { $group: { _id: "$date", total: { $sum: "$amount" }, count: { $sum: 1 } } },
    { $sort: { _id: 1 } },
  ]);
  return rows.map((r) => ({ date: r._id, total: r.total, count: r.count }));
}

function daysInRange([start, end]: [string, string]) {
  const a = new Date(start);
  const b = new Date(end);
  return Math.max(1, Math.round((b.getTime() - a.getTime()) / 86400000) + 1);
}

import mongoose from "mongoose";

function serializeExpense(e) {
  return { id: e._id, expenseName: e.expenseName, amount: e.amount, category: e.category, note: e.note, receipt: e.receipt, date: e.date, time: e.time, createdAt: e.createdAt };
}

export default router;
