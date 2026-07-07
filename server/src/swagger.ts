import swaggerJSDoc from "swagger-jsdoc";
import path from "path";

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Taskflow Pro Api",
    version: "1.0.0",
    description: "Taskflow Pro REST API Documentation",
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "Development Server",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: {
      Error: {
        type: "object",
        properties: {
          success: {
            type: "boolean",
            example: false,
          },
          error: {
            message: "string",
            code: "string",
            statusCode: "string",
          },
        },
      },
      HealthResponse: {
        type: "object",
        properties: {
          status: {
            type: "string",
            enum: ["ok", "degraded"],
            example: "ok",
          },
          timestamp: {
            type: "string",
            example: "1234567890",
          },
          services: {
            type: "object",
            properties: {
              database: {
                type: "string",
                enum: ["ok", "error"],
                example: "ok",
              },
              redis: {
                type: "string",
                enum: ["ok", "error"],
                example: "ok",
              },
            },
          },
        },
      },
    },
  },
};

const options = {
  swaggerDefinition,
  apis: [
    path.join(__dirname, "./routes/*.ts"),
    path.join(__dirname, "./server.ts"),
  ],
};

export const swaggerSpec = swaggerJSDoc(options);
