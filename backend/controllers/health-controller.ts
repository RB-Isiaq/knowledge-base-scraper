import type { Request, Response } from "express";

export class HealthController {
  /**
   * Get server health status
   */
  getHealth(req: Request, res: Response) {
    res.json({
      status: "OK",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      version: process.version,
    });
  }

  /**
   * Get API information and available endpoints
   */
  getInfo(req: Request, res: Response) {
    res.json({
      message: "Web Scraper API",
      version: "1.0.0",
      endpoints: {
        "POST /api/scrape-url": "Scrape a single URL",
        "POST /api/scrape-bulk": "Scrape multiple URLs",
        "POST /api/scrape-pdf": "Process PDF file",
        "GET /health": "Health check",
        "GET /api-docs": "API documentation",
      },
      documentation: "/api-docs",
    });
  }
}
