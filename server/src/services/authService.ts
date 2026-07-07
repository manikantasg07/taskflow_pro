import { AppError } from "../lib/AppError";
import { registerSchema } from "../validators/authValidators";
import { ErrorCodes } from "shared";

export const register = async (body) => {
  const parsed = registerSchema.safeParse(body);

  if (!parsed.success) {
    throw new AppError(parsed.error.message, 400, ErrorCodes.BAD_REQUEST);
  }
};
