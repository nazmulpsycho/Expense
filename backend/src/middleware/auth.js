import jwt from "jsonwebtoken";
import config from "../config/index.js";
import User from "../models/User.js";
import { createHttpError } from "./errorHandler.js";

export function auth(req, res, next) {
  try {
    const token = (req.headers.authorization || "").replace(/^Bearer\s+/i, "") || req.cookies.accessToken;
    if (!token) return next(createHttpError(401, "Authentication required"));
    const payload = jwt.verify(token, config.jwtSecret) as any;
    if (payload.type === "refresh") return next(createHttpError(401, "Use access token"));
    const user = await User.findById(payload.userId).select("-password");
    if (!user) return next(createHttpError(401, "User not found"));
    req.user = { userId: payload.userId, user };
    next();
  } catch (err) {
    if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
      return next(createHttpError(401, "Invalid or expired token"));
    }
    next(err);
  }
}
