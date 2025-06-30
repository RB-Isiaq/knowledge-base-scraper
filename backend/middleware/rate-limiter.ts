import type { Request, Response, NextFunction } from "express";

// Simple in-memory rate limiter
const requests = new Map<string, { count: number; resetTime: number }>();

export function rateLimiter(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const ip = req.ip || req.socket.remoteAddress || "unknown";
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxRequests = 100; // Max requests per window

  const clientData = requests.get(ip);

  if (!clientData || now > clientData.resetTime) {
    requests.set(ip, { count: 1, resetTime: now + windowMs });
    next();
    return;
  }

  if (clientData.count >= maxRequests) {
    res.status(429).json({
      error: "Too many requests",
      message: "Rate limit exceeded. Please try again later.",
    });
    return;
  }

  clientData.count++;
  next();
}
