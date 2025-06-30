import swaggerJsdoc from "swagger-jsdoc";
import type { Options } from "swagger-jsdoc";

const options: Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Web Scraper API",
      version: "1.0.0",
      description: `
        A powerful web scraping API for extracting content from blogs, websites, and PDFs.
        
        ## Features
        - Single URL scraping with automatic content detection
        - Bulk URL processing with concurrency control
        - PDF processing with intelligent chunking
        - Markdown output format
        - Rate limiting and validation
        
        ## Authentication
        Currently no authentication required. Team ID and User ID are used for content organization.
        
        ## Rate Limits
        - 100 requests per 15 minutes per IP address
        - Maximum 10 URLs per bulk request
        - Maximum 50MB file upload size
      `,
      contact: {
        name: "API Support",
        email: "support@example.com",
      },
      license: {
        name: "MIT",
        url: "https://opensource.org/licenses/MIT",
      },
    },
    servers: [
      {
        url: "http://localhost:3001",
        description: "Development server",
      },
      {
        url: "https://api.yourapp.com",
        description: "Production server",
      },
    ],
    components: {
      schemas: {
        ScrapedItem: {
          type: "object",
          required: ["title", "content", "content_type", "author", "user_id"],
          properties: {
            title: {
              type: "string",
              description: "Title of the scraped content",
              example: "How to Build Scalable APIs",
            },
            content: {
              type: "string",
              description: "Main content in markdown format",
              example: "# Introduction\n\nThis article covers...",
            },
            content_type: {
              type: "string",
              enum: [
                "blog",
                "guide",
                "tutorial",
                "book",
                "educational",
                "interview_guide",
                "other",
              ],
              description: "Type of content scraped",
              example: "blog",
            },
            source_url: {
              type: "string",
              format: "uri",
              description: "Original URL of the content",
              example: "https://example.com/article",
            },
            author: {
              type: "string",
              description: "Author of the content",
              example: "John Doe",
            },
            user_id: {
              type: "string",
              description: "ID of the user who initiated the scraping",
              example: "user123",
            },
          },
        },
        ScrapedData: {
          type: "object",
          required: ["team_id", "items"],
          properties: {
            team_id: {
              type: "string",
              description: "Team identifier for organizing content",
              example: "aline123",
            },
            items: {
              type: "array",
              items: {
                $ref: "#/components/schemas/ScrapedItem",
              },
              description: "Array of scraped content items",
            },
          },
        },
        ErrorResponse: {
          type: "object",
          required: ["error"],
          properties: {
            error: {
              type: "string",
              description: "Error type or category",
              example: "Validation failed",
            },
            message: {
              type: "string",
              description: "Detailed error message",
              example: "URL is required and must be a string",
            },
            details: {
              type: "string",
              description: "Additional error details (development only)",
              example: "Invalid URL format provided",
            },
          },
        },
        HealthResponse: {
          type: "object",
          properties: {
            status: {
              type: "string",
              example: "OK",
            },
            timestamp: {
              type: "string",
              format: "date-time",
              example: "2024-01-15T10:30:00.000Z",
            },
            uptime: {
              type: "number",
              description: "Server uptime in seconds",
              example: 3600,
            },
            memory: {
              type: "object",
              description: "Memory usage statistics",
            },
            version: {
              type: "string",
              description: "Node.js version",
              example: "v18.17.0",
            },
          },
        },
      },
      responses: {
        BadRequest: {
          description: "Bad request - validation failed",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
            },
          },
        },
        InternalServerError: {
          description: "Internal server error",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
            },
          },
        },
        TooManyRequests: {
          description: "Rate limit exceeded",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
            },
          },
        },
      },
    },
    tags: [
      {
        name: "Scraping",
        description: "Content scraping operations",
      },
      {
        name: "Health",
        description: "Health check and system information",
      },
    ],
  },
  apis: ["./routes/*.ts", "./controllers/*.ts"], // Path to the API files
};

export const swaggerSpec = swaggerJsdoc(options);
