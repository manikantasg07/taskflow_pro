import { NextFunction, Request, Response } from "express";
import { RegisterType } from "shared";
import { register, login } from "../services/authService";
import { env } from "../config/env";

/**
 * @openapi
 * /auth/register:
 *   post:
 *     summary: Register a user
 *     description: Create a user in the database and receives tokens.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 example: Password1!
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *       422:
 *         description: Unprocessable
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: Email already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export const registerUserController = async (
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  const body: RegisterType = req.body;

  const { refreshToken, accessToken, user } = await register(body);

  res.cookie("refresh_token", refreshToken, {
    httpOnly: true,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, //7days,
    secure: env.NODE_ENV === "production",
  });

  return res.status(201).json({
    accessToken,
    user,
  });
};

/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Login a user
 *     description: Login into application and receives tokens.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 example: Password1!
 *     responses:
 *       200:
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *       422:
 *         description: Unprocessable
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Invalid Credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export const loginUserController = async (
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  const body = req.body;
  const { refreshToken, accessToken, user } = await login(body);
  res.cookie("refresh_token", refreshToken, {
    httpOnly: true,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, //7days,
    secure: env.NODE_ENV === "production",
  });

  return res.status(200).json({
    accessToken,
    user,
  });
};
