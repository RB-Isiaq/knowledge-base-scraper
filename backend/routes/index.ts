import type { Application } from "express";
import { healthRoutes } from "./health-routes";
import { scraperRoutes } from "./scraper-routes";

export function setupRoutes(app: Application) {
  app.use("/api", scraperRoutes);

  app.use("/", healthRoutes);
}
