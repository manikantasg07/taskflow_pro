import { key } from "./privatekey";
import jwt, { SignOptions } from "jsonwebtoken";
import { env } from "../config/env";

type Payload = {
  id: string;
  name: string;
  email: string;
};

export const getAccessToken = (payload: Payload) => {
  const signingOptions: SignOptions = {
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

export const getRefreshToken = (payload: Payload) => {
  const signingOptions: SignOptions = {
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
