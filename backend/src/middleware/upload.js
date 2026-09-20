import multer from "multer";
import path from "path";
import fs from "fs";
import config from "../config/index.js";
import { v4 as uuidv4 } from "uuid";

const ensureDir = (dir: string) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  return dir;
};

const avatarDir = ensureDir(path.resolve(config.uploadDir, "avatars"));

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, avatarDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname) || ".png";
    cb(null, `${uuidv4()}${ext}`);
  },
});

const fileFilter = (_req: any, file: any, cb: any) => {
  const allowed = ["image/png", "image/jpeg", "image/webp", "image/gif"];
  if (allowed.includes(file.mimetype)) return cb(null, true);
  cb(new Error("Only image files are allowed"), false);
};

export const uploadAvatar = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});
