import express from "express";
import { fileURLToPath } from "url";
import path from "path";
import config from "./config/index.js";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import expenseRoutes from "./routes/expenses.js";
import budgetRoutes from "./routes/budget.js";
import dashboardRoutes from "./routes/dashboard.js";
import reportRoutes from "./routes/reports.js";
import profileRoutes from "./routes/profile.js";
import categoryRoutes from "./routes/categories.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { apiLimiter } from "./middleware/rateLimiter.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Security / middleware
app.use(config.enableCors);
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use(helmet({ contentSecurityPolicy: false, crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(morgan(config.nodeEnv === "production" ? "combined" : "dev"));
app.use(cookieParser());
app.use(apiLimiter);

// Health
app.get("/ping", (_req, res) => res.json({ ok: true, timestamp: new Date().toISOString() }));

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/budget", budgetRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/categories", categoryRoutes);

// Static fallback (optional; let frontend proxy serve UI)
app.use(express.static(path.join(__dirname, "../frontend/dist")));
app.use("*", (_req, res) => res.sendFile(path.join(__dirname, "../frontend/dist/index.html")));

// Error handling
app.use(errorHandler);

async function run() {
  await connectDB();
  const port = config.port;
  app.listen(port, "0.0.0.0", () => {
    console.log(`ExpenseFlow AI backend listening on port ${port} in ${config.nodeEnv} mode`);
  });
}

run().catch((err) => {
  console.error("Backend failed to start:", err);
  process.exit(1);
});
