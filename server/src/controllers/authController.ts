import { NextFunction, Request, Response } from "express";
import { RegisterType } from "shared";
import { register } from "../services/authService";

/**
 *
 * @param req
 * @param res
 * @param next
 * @returns
 */
export const registerUserController = async (
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  const boody: RegisterType = req.body;

  const { refreshToken, accessToken, user } = await register(boody);

  res.cookie("refresh_token", refreshToken, {
    httpOnly: true,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, //7days
  });

  return res.status(201).json({
    accessToken,
    user,
  });
};
