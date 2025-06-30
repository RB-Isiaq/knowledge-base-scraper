import type { Application } from "express";
import cors from "cors";
import fileUpload from "express-fileupload";
import { requestLogger } from "./request-logger";
import { rateLimiter } from "./rate-limiter";
import { setupSwagger } from "./swagger";

export function setupMiddleware(app: Application): void {
  app.use(cors());

  app.use(requestLogger);

  app.use(rateLimiter);

  const maxFileSize =
    process.env.VERCEL_ENV === "production"
      ? 4.5 * 1024 * 1024 // 4.5MB for Vercel Hobby
      : 50 * 1024 * 1024; // 50MB for local development

  app.use(
    fileUpload({
      limits: {
        fileSize: maxFileSize,
        files: 1,
        fields: 10,
      },
      abortOnLimit: true,
      responseOnLimit: `File size limit exceeded. Maximum allowed: ${
        maxFileSize / 1024 / 1024
      }MB`,
      useTempFiles: false,
      tempFileDir: "/tmp/",
      debug: process.env.NODE_ENV === "development",
    })
  );

  setupSwagger(app);
}
