import type { Request, Response, NextFunction } from "express";
import { ScraperService } from "../services/scraper-service";
import { logger } from "../utils/logger";
import type fileUpload from "express-fileupload";

export class ScraperController {
  private scraperService: ScraperService;

  constructor() {
    this.scraperService = new ScraperService();
  }

  async scrapeUrl(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { url, team_id, user_id } = req.body;

      logger.info(`Starting scrape for URL: ${url}`);

      const result = await this.scraperService.scrapeUrl(url, team_id, user_id);

      logger.info(`Scrape completed. Found ${result.items.length} items`);

      res.json(result);
    } catch (error) {
      logger.error("URL scraping error:", error);
      next(error);
    }
  }

  async scrapeBulk(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { urls, team_id, user_id } = req.body;

      logger.info(`Starting bulk scrape for ${urls.length} URLs`);

      const result = await this.scraperService.scrapeBulkUrls(
        urls,
        team_id,
        user_id
      );

      logger.info(
        `Bulk scrape completed. Found ${result.items.length} total items`
      );

      res.json(result);
    } catch (error) {
      logger.error("Bulk scraping error:", error);
      next(error);
    }
  }

  async scrapePdf(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { team_id, user_id } = req.body;
      const pdfFile = req.files!.pdf as fileUpload.UploadedFile;

      logger.info(`Processing PDF: ${pdfFile.name}`);

      const result = await this.scraperService.processPdf(
        pdfFile.data,
        pdfFile.name,
        team_id,
        user_id
      );

      logger.info(
        `PDF processing completed. Found ${result.items.length} sections`
      );

      res.json(result);
    } catch (error) {
      logger.error("PDF processing error:", error);
      next(error);
    }
  }
}
