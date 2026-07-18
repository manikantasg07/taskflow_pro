import { env } from "../config/env";

class PrivateKey {
  private static key: string | undefined;

  static getKey(): string {
    if (!PrivateKey.key) {
      try {
        PrivateKey.key = Buffer.from(env.PRIVATE_KEY_ENCODED).toString("utf-8");
      } catch (error) {
        throw new Error("Error in decoding", { cause: error });
      }
    }
    return PrivateKey.key;
  }
}

export const key = PrivateKey.getKey();
