import { Request, Response, NextFunction } from "express";

export function createHttpError(status, message) {
  const err = new Error(message);
  (err as any).status = status;
  (err as any).statusCode = status;
  return err;
}

export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  const status = err.statusCode || err.status || 500;
  const message = status === 500 ? "Internal server error" : err.message;
  console.error("API error:", status, message, err.stack);
  res.status(status).json({
    error: {
      status,
      message,
      ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
    },
  });
}
