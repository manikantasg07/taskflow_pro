import { registerUserController } from "../controllers/authController";
import { Router } from "express";

const router = Router();

router.post("/auth/register", registerUserController);
