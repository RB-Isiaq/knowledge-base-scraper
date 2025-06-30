import type { Request, Response, NextFunction } from "express";

export function validateScrapeUrl(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const { url, team_id, user_id } = req.body;

  if (!url || typeof url !== "string") {
    res.status(400).json({
      error: "Validation failed",
      message: "URL is required and must be a string",
    });
    return;
  }

  if (!team_id || typeof team_id !== "string") {
    res.status(400).json({
      error: "Validation failed",
      message: "team_id is required and must be a string",
    });
    return;
  }

  if (!user_id || typeof user_id !== "string") {
    res.status(400).json({
      error: "Validation failed",
      message: "user_id is required and must be a string",
    });
    return;
  }

  // Validate URL format
  try {
    new URL(url);
  } catch {
    res.status(400).json({
      error: "Validation failed",
      message: "Invalid URL format",
    });
    return;
  }

  next();
}

export function validateBulkScrape(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const { urls, team_id, user_id } = req.body;

  if (!urls || !Array.isArray(urls)) {
    res.status(400).json({
      error: "Validation failed",
      message: "urls is required and must be an array",
    });
    return;
  }

  if (urls.length === 0) {
    res.status(400).json({
      error: "Validation failed",
      message: "At least one URL is required",
    });
    return;
  }

  if (urls.length > 10) {
    res.status(400).json({
      error: "Validation failed",
      message: "Maximum 10 URLs allowed per request",
    });
    return;
  }

  // Validate each URL
  for (const url of urls) {
    if (typeof url !== "string") {
      res.status(400).json({
        error: "Validation failed",
        message: "All URLs must be strings",
      });
      return;
    }

    try {
      new URL(url);
    } catch {
      res.status(400).json({
        error: "Validation failed",
        message: `Invalid URL format: ${url}`,
      });
      return;
    }
  }

  if (!team_id || typeof team_id !== "string") {
    res.status(400).json({
      error: "Validation failed",
      message: "team_id is required and must be a string",
    });
    return;
  }

  if (!user_id || typeof user_id !== "string") {
    res.status(400).json({
      error: "Validation failed",
      message: "user_id is required and must be a string",
    });
    return;
  }

  next();
}

export function validatePdfUpload(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const { team_id, user_id } = req.body;

  if (!req.files || !req.files.pdf) {
    res.status(400).json({
      error: "Validation failed",
      message: "PDF file is required",
    });
    return;
  }

  if (!team_id || typeof team_id !== "string") {
    res.status(400).json({
      error: "Validation failed",
      message: "team_id is required and must be a string",
    });
    return;
  }

  if (!user_id || typeof user_id !== "string") {
    res.status(400).json({
      error: "Validation failed",
      message: "user_id is required and must be a string",
    });
    return;
  }

  next();
}
