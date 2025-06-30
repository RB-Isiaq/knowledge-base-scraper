import { ScrapedData } from "../interface";
import { scrapeUrl, scrapeBulkUrls, processPdf } from "../logic/scraper-logic";
import { logger } from "../utils/logger";

export class ScraperService {
  async scrapeUrl(
    url: string,
    teamId: string,
    userId: string
  ): Promise<ScrapedData> {
    try {
      logger.debug(`ScraperService: Starting URL scrape for ${url}`);
      const result = await scrapeUrl(url, teamId, userId);
      logger.debug(
        `ScraperService: URL scrape completed with ${result.items.length} items`
      );
      return result;
    } catch (error) {
      logger.error(`ScraperService: URL scrape failed for ${url}:`, error);
      throw error;
    }
  }

  async scrapeBulkUrls(
    urls: string[],
    teamId: string,
    userId: string
  ): Promise<ScrapedData> {
    try {
      logger.debug(
        `ScraperService: Starting bulk scrape for ${urls.length} URLs`
      );
      const result = await scrapeBulkUrls(urls, teamId, userId);
      logger.debug(
        `ScraperService: Bulk scrape completed with ${result.items.length} total items`
      );
      return result;
    } catch (error) {
      logger.error(`ScraperService: Bulk scrape failed:`, error);
      throw error;
    }
  }

  async processPdf(
    pdfBuffer: Buffer,
    filename: string,
    teamId: string,
    userId: string
  ): Promise<ScrapedData> {
    try {
      logger.debug(`ScraperService: Starting PDF processing for ${filename}`);
      const result = await processPdf(pdfBuffer, filename, teamId, userId);
      logger.debug(
        `ScraperService: PDF processing completed with ${result.items.length} sections`
      );
      return result;
    } catch (error) {
      logger.error(
        `ScraperService: PDF processing failed for ${filename}:`,
        error
      );
      throw error;
    }
  }
}
