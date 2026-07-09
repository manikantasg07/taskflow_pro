import { key } from "./privatekey";
import jwt from "jsonwebtoken";
import { env } from "../config/env";

type Payload = {
  id: string;
  name: string;
  email: string;
};

export const getAccessToken = async (payload: Payload) => {
  const signingOptions = {
    issuer: "taskflow-pro",
    subject: payload.id,
    audience: "taskflow-pro-client",
    expiresIn: env.ACCESS_TOKEN_EXPIRY,
    algorithm: "RS256",
    jwtid: crypto.randomUUID(),
  };

  const token = jwt.sign(payload, key, signingOptions);

  return token;
};

export const getRefreshToken = async (payload: Payload) => {
  const signingOptions = {
    issuer: "taskflow-pro",
    subject: payload.id,
    audience: "taskflow-pro-client",
    expiresIn: env.REFRESH_TOKEN_EXPIRY,
    algorithm: "RS256",
    jwtid: crypto.randomUUID(),
  };

  const token = jwt.sign(payload, key, signingOptions);

  return token;
};
