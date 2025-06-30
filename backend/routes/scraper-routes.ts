import { Router } from "express";
import { ScraperController } from "../controllers/scraper-controller";
import {
  validateScrapeUrl,
  validateBulkScrape,
  validatePdfUpload,
  pdfUploadMiddleware,
} from "../middleware/validation";

const router = Router();
const scraperController = new ScraperController();

router.post(
  "/scrape-url",
  validateScrapeUrl,
  scraperController.scrapeUrl.bind(scraperController)
);

router.post(
  "/scrape-bulk",
  validateBulkScrape,
  scraperController.scrapeBulk.bind(scraperController)
);

router.post(
  "/scrape-pdf",
  pdfUploadMiddleware,
  validatePdfUpload,
  scraperController.scrapePdf.bind(scraperController)
);

export { router as scraperRoutes };
