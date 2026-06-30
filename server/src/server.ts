import express from "express";
import dotenv from "dotenv";
// import { prisma } from "./lib/prisma";
import { AppError } from "./lib/AppError";
import errorHandler from "./middleware/errorHandler";
import rateLimit from "express-rate-limit";
import { Request, Response, NextFunction } from "express";
import { ErrorCodes } from "../../shared/src/ErrorCodes";

const limiter = rateLimit({
  windowMs: 2 * 60 * 1000,
  limit: 5,
  handler: function (req: Request, res: Response, next: NextFunction) {
    next(
      new AppError(
        "Too many requests, please try again later",
        429,
        ErrorCodes.TOO_MANY_REQUESTS,
      ),
    );
  },
});

dotenv.config();

const app = express();
const PORT = process.env.SERVER_PORT || 3000;

app.use(express.json());
app.use(limiter);

app.get("/", (_req, res) => {
  res.json({ message: "TaskFlow API running" });
});

app.use((_req, _res, _next) => {
  throw new AppError("Requested URL Not Found", 404, "NOT_FOUND");
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
