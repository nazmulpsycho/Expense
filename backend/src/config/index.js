import "dotenv/config";
export default {
  nodeEnv: process.env.NODE_ENV || "development",
  port: parseInt(process.env.PORT || "4000", 10),
  mongoUri: process.env.MONGO_URI || "",
  jwtSecret: process.env.JWT_SECRET || "change-me-in-production",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  refreshExpiresIn: process.env.REFRESH_EXPIRES_IN || "30d",
  enableCors: {
    origin: (process.env.FRONTEND_URL || "http://localhost:5173").split(","),
    credentials: true,
  },
  redisUrl: process.env.REDIS_URL || null,
  uploadDir: process.env.UPLOAD_DIR || path.resolve("uploads"),
};
