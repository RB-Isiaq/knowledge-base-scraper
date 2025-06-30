import type { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger";

export function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  logger.error(`Error in ${req.method} ${req.path}:`, error);

  const isDevelopment = process.env.NODE_ENV === "development";

  res.status(500).json({
    error: "Internal server error",
    message: isDevelopment ? error.message : "Something went wrong",
    ...(isDevelopment && { stack: error.stack }),
  });
}
