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

      logger.info(
        `Processing PDF: ${pdfFile.name} (${(
          pdfFile.size /
          1024 /
          1024
        ).toFixed(2)}MB)`
      );

      // Add timeout wrapper for Vercel
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => {
          reject(new Error("PDF processing timeout after 50 seconds"));
        }, 50000); // 50 seconds to leave buffer for Vercel's 60s limit
      });

      const processingPromise = this.scraperService.processPdf(
        pdfFile.data,
        pdfFile.name,
        team_id,
        user_id
      );

      const result = await Promise.race([processingPromise, timeoutPromise]);

      logger.info(
        `PDF processing completed. Found ${
          (result as any).items.length
        } sections`
      );

      res.json(result);
    } catch (error) {
      logger.error("PDF processing error:", error);

      if (error instanceof Error) {
        if (error.message.includes("timeout")) {
          res.status(408).json({
            error: "Processing timeout",
            message:
              "PDF processing took too long. Try a smaller or simpler PDF.",
            details: "Vercel functions have a 60-second timeout limit.",
          });
          return;
        }

        if (
          error.message.includes("File too large") ||
          error.message.includes("413")
        ) {
          res.status(413).json({
            error: "File too large",
            message: "PDF file exceeds the size limit.",
            details: "Maximum file size is 4.5MB on Vercel Hobby plan.",
          });
          return;
        }
      }

      next(error);
    }
  }
}
