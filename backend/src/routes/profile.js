import { Router } from "express";
import { auth } from "../middleware/auth.js";
import User from "../models/User.js";
import { updateProfileValidation, changePasswordValidation } from "./validators.js";
import { comparePasswords, hashPassword } from "../utils/auth.js";
import { createHttpError } from "../middleware/errorHandler.js";
import { uploadAvatar } from "../middleware/upload.js";

const router = Router();

router.use(auth);

router.get("/", async (req, res, next) => {
  try {
    const user = await User.findById(req.user!.userId).select("-password");
    if (!user) return next(createHttpError(404, "User not found"));
    res.json({ user: serializeUser(user) });
  } catch (err) {
    next(err);
  }
});

router.put("/", updateProfileValidation, async (req, res, next) => {
  try {
    const { name, username, email } = req.body;
    const existing = await User.findById(req.user!.userId);
    if (!existing) return next(createHttpError(404, "User not found"));
    if (username && username !== existing.username) {
      const taken = await User.findOne({ username, _id: { $ne: req.user!.userId } });
      if (taken) return next(createHttpError(409, "Username already taken"));
    }
    if (email && email !== existing.email) {
      const taken = await User.findOne({ email, _id: { $ne: req.user!.userId } });
      if (taken) return next(createHttpError(409, "Email already in use"));
    }
    if (name !== undefined) existing.name = name;
    if (username !== undefined) existing.username = username;
    if (email !== undefined) existing.email = email;
    await existing.save();
    res.json({ user: serializeUser(existing) });
  } catch (err) {
    next(err);
  }
});

router.post("/avatar", auth, uploadAvatar.single("avatar"), async (req, res, next) => {
  try {
    const user = await User.findById(req.user!.userId);
    if (!user) return next(createHttpError(404, "User not found"));
    if (req.file) {
      user.avatar = `/uploads/avatars/${req.file.filename}`;
      await user.save();
    }
    res.json({ user: serializeUser(user) });
  } catch (err) {
    next(err);
  }
});

router.post("/change-password", changePasswordValidation, async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user!.userId).select("+password");
    if (!user) return next(createHttpError(404, "User not found"));
    const match = await comparePasswords(currentPassword, user.password);
    if (!match) return next(createHttpError(400, "Current password is incorrect"));
    user.password = await hashPassword(newPassword);
    await user.save();
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

export default router;

function serializeUser(user) {
  return { id: user._id, name: user.name, username: user.username, email: user.email, avatar: user.avatar || "", createdAt: user.createdAt };
}
