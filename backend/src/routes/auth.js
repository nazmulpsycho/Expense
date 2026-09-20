import { Router } from "express";
import { hashPassword, generateTokens, comparePasswords } from "../utils/auth.js";
import { registerValidation, loginValidation } from "./validators.js";
import User from "../models/User.js";
import config from "../config/index.js";
import { setTokenCookie } from "../middleware/auth.js";
import { createHttpError } from "../middleware/errorHandler.js";

const router = Router();

router.post("/register", registerValidation, async (req, res, next) => {
  try {
    const { name, username, email, password } = req.body;
    const existing = await User.findOne({ $or: [{ email }, { username }] }).select("email username");
    if (existing) {
      if (existing.email === email) return next(createHttpError(409, "Email already registered"));
      return next(createHttpError(409, "Username already taken"));
    }
    const passwordHash = await hashPassword(password);
    const user = await new User({ name, username, email, password: passwordHash }).save();
    const { accessToken, refreshToken } = generateTokens(user._id);
    setTokenCookie(res, accessToken, refreshToken);
    res.status(201).json({ user: serializeUser(user), accessToken, refreshToken });
  } catch (err) {
    next(err);
  }
});

router.post("/login", loginValidation, async (req, res, next) => {
  try {
    const { email, password, remember } = req.body;
    const user = await User.findOne({ email }).select("+password");
    if (!user) return next(createHttpError(401, "Invalid email or password"));
    const match = await comparePasswords(password, user.password);
    if (!match) return next(createHttpError(401, "Invalid email or password"));
    const { accessToken, refreshToken } = generateTokens(user._id);
    setTokenCookie(res, accessToken, refreshToken, remember);
    res.json({ user: serializeUser(user), accessToken, refreshToken });
  } catch (err) {
    next(err);
  }
});

router.post("/logout", (_req, res) => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  res.json({ ok: true });
});

export default router;

function serializeUser(user) {
  return { id: user._id, name: user.name, username: user.username, email: user.email, avatar: user.avatar, createdAt: user.createdAt };
}
