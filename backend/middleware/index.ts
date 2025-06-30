import express, { type Application } from "express";
import cors from "cors";
import fileUpload from "express-fileupload";
import { requestLogger } from "./request-logger";
import { rateLimiter } from "./rate-limiter";
import { setupSwagger } from "./swagger";

export function setupMiddleware(app: Application) {
  app.use(cors());

  app.use(requestLogger);

  app.use(rateLimiter);

  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ extended: true, limit: "50mb" }));

  app.use(
    fileUpload({
      limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
      abortOnLimit: true,
      responseOnLimit: "File size limit exceeded",
    })
  );

  setupSwagger(app);
}
