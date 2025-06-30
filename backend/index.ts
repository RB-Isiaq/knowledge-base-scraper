import express from "express";
import { setupMiddleware } from "./middleware";
import { setupRoutes } from "./routes";
import { errorHandler } from "./middleware/error-handler";
import { logger } from "./utils/logger";

const app = express();
const PORT = process.env.PORT || 3001;

setupMiddleware(app);

setupRoutes(app);

app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`🚀 Server running on port ${PORT}`);
  logger.info(`📊 Health check: http://localhost:${PORT}/health`);
  logger.info(`📖 API docs: http://localhost:${PORT}/api-docs`);
});
