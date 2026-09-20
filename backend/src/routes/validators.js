import { body, param, query } from "express-validator";
import { runValidation } from "../middleware/validate.js";

export const registerValidation = [
  body("name").trim().notEmpty().withMessage("Name is required").isLength({ max: 100 }).withMessage("Name too long"),
  body("username").trim().notEmpty().withMessage("Username is required").matches(/^[a-z0-9_]{3,20}$/i).withMessage("Username must be 3-20 alphanumeric characters or underscores"),
  body("email").trim().isEmail().withMessage("Valid email required").normalizeEmail(),
  body("password").trim().isLength({ min: 8 }).withMessage("Password must be at least 8 characters"),
  runValidation,
];

export const loginValidation = [
  body("email").trim().isEmail().withMessage("Valid email required").normalizeEmail(),
  body("password").trim().notEmpty().withMessage("Password is required"),
  runValidation,
];

export const updateProfileValidation = [
  body("name").optional().trim().notEmpty().withMessage("Name cannot be empty").isLength({ max: 100 }),
  body("username").optional().trim().matches(/^[a-z0-9_]{3,20}$/i).withMessage("Username must be 3-20 alphanumeric characters or underscores"),
  body("email").optional().trim().isEmail().withMessage("Valid email required").normalizeEmail(),
  runValidation,
];

export const changePasswordValidation = [
  body("currentPassword").trim().notEmpty().withMessage("Current password is required"),
  body("newPassword").trim().isLength({ min: 8 }).withMessage("New password must be at least 8 characters"),
  runValidation,
];

export const expenseValidation = [
  body("expenseName").trim().notEmpty().withMessage("Expense name is required").isLength({ max: 200 }),
  body("amount").trim().isFloat({ min: 0.01 }).withMessage("Amount must be a positive number"),
  body("category").optional().trim().notEmpty(),
  body("note").optional().trim().isLength({ max: 2000 }),
  body("receipt").optional().trim(),
  runValidation,
];

export const updateExpenseValidation = [
  param("id").isMongoId().withMessage("Invalid expense id"),
  body("expenseName").optional().trim().notEmpty().withMessage("Expense name cannot be empty").isLength({ max: 200 }),
  body("amount").optional().isFloat({ min: 0.01 }).withMessage("Amount must be a positive number"),
  body("category").optional().trim().notEmpty(),
  body("note").optional().trim().isLength({ max: 2000 }),
  body("receipt").optional().trim(),
  runValidation,
];

export const budgetValidation = [
  body("dailyBudget").optional().isFloat({ min: 0 }).withMessage("Daily budget must be a non-negative number"),
  body("weeklyBudget").optional().isFloat({ min: 0 }).withMessage("Weekly budget must be a non-negative number"),
  body("monthlyBudget").optional().isFloat({ min: 0 }).withMessage("Monthly budget must be a non-negative number"),
  runValidation,
];

export const reportQueryValidation = [
  query("period").optional().isIn(["daily", "weekly", "monthly", "yearly"]).withMessage("Period must be daily, weekly, monthly, or yearly"),
  query("startDate").optional().isISO8601(),
  query("endDate").optional().isISO8601(),
  runValidation,
];

export const dashboardQueryValidation = [
  query("startDate").optional().isISO8601(),
  query("endDate").optional().isISO8601(),
  runValidation,
];
