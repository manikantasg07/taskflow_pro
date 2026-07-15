import { AppError } from "../lib/AppError";
import { prisma } from "../lib/prisma";
import { registerSchema, loginSchema } from "../validators/authValidators";
import { ErrorCodes } from "shared";
import { env } from "../config/env";
import bcrypt from "bcryptjs";
import { getAccessToken, getRefreshToken } from "../lib/jwt";
import { getExpiryDate } from "../utils/date";
import { RegisterType, LoginType } from "shared";

export const register = async (body: RegisterType) => {
  const parsed = registerSchema.safeParse(body);

  if (!parsed.success) {
    throw new AppError(
      parsed.error.flatten().fieldErrors.toString(),
      422,
      ErrorCodes.UNPROCESSABLE,
    );
  }

  // check email exists
  const emailExist = await prisma.user.findUnique({
    where: { email: parsed.data.email },
  });

  if (emailExist) {
    throw new AppError("Email already exists", 409, ErrorCodes.CONFLICT);
  }
  const hashedPassword = await bcrypt.hash(
    parsed.data.password,
    env.SALT_ROUNDS,
  );

  const result = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        email: parsed.data.email,
        name: parsed.data.name,
        passwordHash: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    const payload = {
      id: user.id,
      name: user.name,
      email: user.email,
    };

    const accessToken = getAccessToken(payload);
    const refreshToken = getRefreshToken(payload);

    const hashedToken = await bcrypt.hash(refreshToken, env.SALT_ROUNDS);
    const expiresAt = getExpiryDate(env.REFRESH_TOKEN_EXPIRY);

    await tx.refreshToken.create({
      data: {
        tokenHash: hashedToken,
        userId: user.id,
        expiresAt,
      },
    });

    return { user, accessToken, refreshToken };
  });

  return result;
};

export const login = async (body: LoginType) => {
  // 1. validate input
  const parsed = loginSchema.safeParse(body);

  if (!parsed.success) {
    throw new AppError(
      parsed.error.flatten().fieldErrors.toString(),
      422,
      ErrorCodes.UNPROCESSABLE,
    );
  }

  // 2. find user
  const user = await prisma.user.findUnique({
    where: {
      email: parsed.data.email,
    },
  });

  // 3. generic error — don't reveal if email exists ✅
  if (!user || !user.passwordHash) {
    throw new AppError("Invalid credentials", 401, ErrorCodes.UNAUTHORIZED);
  }

  // 4. verify password
  const isMatch = await bcrypt.compare(parsed.data.password, user.passwordHash);

  // 5. check result
  if (!isMatch) {
    throw new AppError("Invalid credentials", 401, ErrorCodes.UNAUTHORIZED);
  }

  // 6. generate tokens
  const payload = { id: user.id, email: user.email, name: user.name };

  const accessToken = getAccessToken(payload);
  const refreshToken = getRefreshToken(payload);

  // 7. hash and store refresh token
  const hashedToken = await bcrypt.hash(refreshToken, env.SALT_ROUNDS);

  await prisma.refreshToken.create({
    data: {
      tokenHash: hashedToken,
      userId: user.id,
      expiresAt: getExpiryDate(env.REFRESH_TOKEN_EXPIRY),
    },
  });

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  };
};
