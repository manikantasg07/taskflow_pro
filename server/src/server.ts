import express from "express";
import dotenv from "dotenv";
// import { prisma } from "./lib/prisma";

dotenv.config();

const app = express();
const PORT = process.env.SERVER_PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "TaskFlow API running" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
