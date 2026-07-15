import {
  loginUserController,
  registerUserController,
} from "../controllers/authController";
import { Router } from "express";

export const authRouter = Router();

authRouter.post("/register", registerUserController);
authRouter.post("/login", loginUserController);
