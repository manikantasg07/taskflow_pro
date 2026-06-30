import express from "express";
import dotenv from "dotenv";
// import { prisma } from "./lib/prisma";
import { AppError } from "./lib/AppError";
import errorHandler from "./middleware/errorHandler";
import { Request, Response, NextFunction } from "express";
import { ErrorCodes } from "shared";

dotenv.config();

const app = express();
const PORT = process.env.SERVER_PORT || 3000;

app.use(express.json());

app.get("/", (_req: Request, res: Response) => {
  res.json({ message: "TaskFlow API running" });
});

app.use((_req: Request, _res: Response, next: NextFunction) => {
  next(new AppError("Requested URL Not Found", 404, ErrorCodes.NOT_FOUND));
});

app.use(errorHandler);

app.listen(PORT, () => {
  //   console.log(`Server running on port ${PORT}`);
});
