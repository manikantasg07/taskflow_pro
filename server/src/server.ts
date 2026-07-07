import express from "express";
// import { prisma } from "./lib/prisma";
import { AppError } from "./lib/AppError";
import errorHandler from "./middleware/errorHandler";
import { Request, Response, NextFunction } from "express";
import { ErrorCodes } from "shared";
import { env } from "./config/env";
import { healthRouter } from "./routes/health";
import swaggerUI from "swagger-ui-express";
import { swaggerSpec } from "./swagger";

const app = express();
const PORT = env.SERVER_PORT || 3000;

if (env.NODE_ENV === "development") {
  app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));
}

app.use(express.json());

app.use("/health", healthRouter);

app.use((_req: Request, _res: Response, next: NextFunction) => {
  next(new AppError("Requested URL Not Found", 404, ErrorCodes.NOT_FOUND));
});

app.use(errorHandler);

app.listen(PORT, () => {
  //   console.log(`Server running on port ${PORT}`);
});
