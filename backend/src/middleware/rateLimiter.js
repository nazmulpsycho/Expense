import rateLimit from "express-rate-limit";
import config from "../config/index.js";

export const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: { status: 429, message: "Too many requests, please try again later." } },
});
