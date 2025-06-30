import { Router } from "express";
import { HealthController } from "../controllers/health-controller";

const router = Router();
const healthController = new HealthController();

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check endpoint
 *     description: Returns the current health status of the API server
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Server is healthy
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HealthResponse'
 */
router.get("/health", healthController.getHealth.bind(healthController));

/**
 * @swagger
 * /:
 *   get:
 *     summary: API information
 *     description: Returns basic information about the API and available endpoints
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: API information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Web Scraper API"
 *                 version:
 *                   type: string
 *                   example: "1.0.0"
 *                 endpoints:
 *                   type: object
 *                   description: Available API endpoints
 *                 documentation:
 *                   type: string
 *                   format: uri
 *                   example: "https://github.com/your-repo/web-scraper"
 */
router.get("/", healthController.getInfo.bind(healthController));

export { router as healthRoutes };
