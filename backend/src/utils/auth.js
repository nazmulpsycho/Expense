import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import config from "../config/index.js";

export function generateTokens(userId) {
  const accessToken = jwt.sign({ userId }, config.jwtSecret, { expiresIn: config.jwtExpiresIn });
  const refreshToken = jwt.sign({ userId, type: "refresh" }, config.jwtSecret, { expiresIn: config.refreshExpiresIn });
  return { accessToken, refreshToken };
}

export function verifyToken(token) {
  return jwt.verify(token, config.jwtSecret);
}

export async function hashPassword(password) {
  return bcrypt.hash(password, 12);
}

export async function comparePasswords(candidate, hashed) {
  return bcrypt.compare(candidate, hashed);
}
