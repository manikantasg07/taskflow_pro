import fs from "node:fs";
import path from "node:path";

class PrivateKey {
  private static key: string | undefined;

  static getKey(): string {
    if (!PrivateKey.key) {
      try {
        PrivateKey.key = fs.readFileSync(
          path.join(__dirname, "../../private.key"),
          "utf-8",
        );
      } catch (error) {
        throw new Error(
          "Private key not found. Generate with: openssl genrsa -out private.key 2048",
          { cause: error },
        );
      }
    }
    return PrivateKey.key;
  }
}

export const key = PrivateKey.getKey();
