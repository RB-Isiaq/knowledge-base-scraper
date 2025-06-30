import { Router } from "express";
import { ScraperController } from "../controllers/scraper-controller";
import {
  validateScrapeUrl,
  validateBulkScrape,
  validatePdfUpload,
} from "../middleware/validation";

const router = Router();
const scraperController = new ScraperController();

/**
 * @swagger
 * /api/scrape-url:
 *   post:
 *     summary: Scrape content from a single URL
 *     description: |
 *       Scrapes content from a single blog or website URL. The scraper automatically detects
 *       if the URL is a blog listing page and will scrape individual articles, or if it's
 *       a single article page.
 *     tags: [Scraping]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - url
 *               - team_id
 *               - user_id
 *             properties:
 *               url:
 *                 type: string
 *                 format: uri
 *                 description: The URL to scrape content from
 *                 example: "https://interviewing.io/blog"
 *               team_id:
 *                 type: string
 *                 description: Team identifier for organizing content
 *                 example: "aline123"
 *               user_id:
 *                 type: string
 *                 description: User identifier who initiated the scraping
 *                 example: "user123"
 *     responses:
 *       200:
 *         description: Successfully scraped content
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ScrapedData'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       429:
 *         $ref: '#/components/responses/TooManyRequests'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.post(
  "/scrape-url",
  validateScrapeUrl,
  scraperController.scrapeUrl.bind(scraperController)
);

/**
 * @swagger
 * /api/scrape-bulk:
 *   post:
 *     summary: Scrape content from multiple URLs
 *     description: |
 *       Scrapes content from multiple URLs in a single request. Processing is done
 *       with concurrency control to avoid overwhelming target servers. Maximum 10 URLs per request.
 *     tags: [Scraping]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - urls
 *               - team_id
 *               - user_id
 *             properties:
 *               urls:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: uri
 *                 minItems: 1
 *                 maxItems: 10
 *                 description: Array of URLs to scrape (max 10)
 *                 example:
 *                   - "https://interviewing.io/blog"
 *                   - "https://nilmamano.com/blog/category/dsa"
 *               team_id:
 *                 type: string
 *                 description: Team identifier for organizing content
 *                 example: "aline123"
 *               user_id:
 *                 type: string
 *                 description: User identifier who initiated the scraping
 *                 example: "user123"
 *     responses:
 *       200:
 *         description: Successfully scraped content from URLs
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ScrapedData'
 *                 - type: object
 *                   properties:
 *                     errors:
 *                       type: array
 *                       items:
 *                         type: string
 *                       description: Any errors encountered during scraping
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       429:
 *         $ref: '#/components/responses/TooManyRequests'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.post(
  "/scrape-bulk",
  validateBulkScrape,
  scraperController.scrapeBulk.bind(scraperController)
);

/**
 * @swagger
 * /api/scrape-pdf:
 *   post:
 *     summary: Process and extract content from PDF files
 *     description: |
 *       Uploads and processes a PDF file, extracting text content and intelligently
 *       chunking it into sections. Automatically detects chapter boundaries when possible.
 *     tags: [Scraping]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - pdf
 *               - team_id
 *               - user_id
 *             properties:
 *               pdf:
 *                 type: string
 *                 format: binary
 *                 description: PDF file to process (max 50MB)
 *               team_id:
 *                 type: string
 *                 description: Team identifier for organizing content
 *                 example: "aline123"
 *               user_id:
 *                 type: string
 *                 description: User identifier who initiated the processing
 *                 example: "user123"
 *     responses:
 *       200:
 *         description: Successfully processed PDF
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ScrapedData'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       429:
 *         $ref: '#/components/responses/TooManyRequests'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.post(
  "/scrape-pdf",
  validatePdfUpload,
  scraperController.scrapePdf.bind(scraperController)
);

export { router as scraperRoutes };
