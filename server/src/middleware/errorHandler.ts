import { ErrorCodes } from "../../../shared/src/ErrorCodes";

import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import { Request, Response, NextFunction } from "express";
import { AppError } from "../lib/AppError";

const errorHandler = async (
  error: AppError,
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  let statusCode = error.statusCode || 500;
  let message = error.message || "Something Went Wrong";
  let code = error.code || ErrorCodes.INTERNAL;

  //handling prisma errors
  if (error instanceof PrismaClientKnownRequestError) {
    switch (error.code) {
      case "P2002": {
        const field = (error.meta?.target as string[])?.join(", ");
        statusCode = 409;
        message = `${field} already exists`;
        code = ErrorCodes.CONFLICT;
        break;
      }

      case "P2025": {
        statusCode = 404;
        message = "Record not found";
        code = ErrorCodes.NOT_FOUND;
        break;
      }

      default: {
        statusCode = 500;
        message = "Something Went Wrong";
        code = ErrorCodes.INTERNAL;
      }
    }
  }
  console.error("Error", error);
  return res.status(statusCode).json({
    success: false,
    error: {
      message,
      code,
      statusCode,
    },
  });
};

export default errorHandler;
