import { AppError } from "../lib/AppError";
import { prisma } from "../lib/prisma";
import { registerSchema } from "../validators/authValidators";
import { ErrorCodes } from "shared";
import { env } from "../config/env";
import bcrypt from "bcryptjs";
// import { getAccessToken,getRefreshToken } from "../lib/jwt";

export const register = async (body) => {
  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    throw new AppError(parsed.error.message, 400, ErrorCodes.BAD_REQUEST);
  }

  const exisitingemail = await prisma.user.findUnique({
    where: { email: parsed.email },
  });

  if (exisitingemail) {
    throw new AppError("Email already Exists", 409, ErrorCodes.CONFLICT);
  }

  const hashedPassword = await bcrypt.hash(parsed.password, env.SALT_ROUNDS);

  // const user =

  await prisma.user.create({
    data: {
      email: parsed.email,
      name: parsed.name,
      password: hashedPassword,
    },
  });

  //   const payload  = {
  //     id:user.id,
  //     name:user.name,
  //     email:user.email
  //   }

  // const _accessToken = getAccessToken(payload);

  // const refreshToken = getRefreshToken(payload);

  // const _hashedToken = await bcrypt.hash(refreshToken,env.SALT_ROUNDS);

  // await prisma.refreshToken.create({
  //   data:{
  //     tokenHash: hashedToken,
  //     userId: user.id,
  //     expiresAt:
  //   }
  // })
};
