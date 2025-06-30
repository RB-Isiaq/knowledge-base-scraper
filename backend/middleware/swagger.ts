import type { Application } from "express";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "../config/swagger";

export function setupSwagger(app: Application) {
  // Swagger JSON endpoint
  app.get("/api-docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });

  // Swagger UI
  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      explorer: true,
      customCss: `
        .swagger-ui .topbar { display: none }
        .swagger-ui .info { margin: 20px 0 }
        .swagger-ui .info .title { color: #3b82f6 }
      `,
      customSiteTitle: "Web Scraper API Documentation",
      swaggerOptions: {
        persistAuthorization: true,
        displayRequestDuration: true,
        docExpansion: "list",
        filter: true,
        showExtensions: true,
        showCommonExtensions: true,
      },
    })
  );
}
