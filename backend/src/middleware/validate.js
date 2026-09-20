import { body, validationResult } from "express-validator";
import { createHttpError } from "./errorHandler.js";

export function runValidation(req: any, res: any, next: Function) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(createHttpError(400, { errors: errors.array() }));
  }
  next();
}
