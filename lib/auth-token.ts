import { createHash, createHmac, randomBytes, scrypt, timingSafeEqual } from "node:crypto";

export interface TokenUser {
  id: string;
  username: string;
  role: string;
}

interface JwtPayload extends TokenUser {
  iat: number;
  exp: number;
}

export const DEMO_CREDENTIALS = {
  username: "demo",
  password: "defi123",
};

export const SESSION_DURATION_SECONDS = 8 * 60 * 60;

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (secret) return secret;
  if (process.env.NODE_ENV === "production") {
    throw new Error("JWT_SECRET must be configured in production.");
  }
  return "local-demo-only-secret-change-before-deploying";
}

function encode(value: object) {
  return Buffer.from(JSON.stringify(value)).toString("base64url");
}

function derivePassword(password: string, salt: Buffer) {
  return new Promise<Buffer>((resolve, reject) => {
    scrypt(password, salt, 64, (error, key) => {
      if (error) reject(error);
      else resolve(Buffer.from(key));
    });
  });
}

export async function hashPassword(password: string) {
  const salt = randomBytes(16);
  const derivedKey = await derivePassword(password, salt);
  return `${salt.toString("hex")}:${derivedKey.toString("hex")}`;
}

export async function verifyPassword(password: string, passwordHash: string) {
  const [saltHex, keyHex, extra] = passwordHash.split(":");
  if (!saltHex || !keyHex || extra) return false;

  try {
    const expected = Buffer.from(keyHex, "hex");
    const actual = await derivePassword(password, Buffer.from(saltHex, "hex"));
    return expected.length === actual.length && timingSafeEqual(expected, actual);
  } catch {
    return false;
  }
}

export function hashAuthToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function createAuthToken(user: TokenUser) {
  const issuedAt = Math.floor(Date.now() / 1000);
  const header = encode({ alg: "HS256", typ: "JWT" });
  const payload = encode({ ...user, iat: issuedAt, exp: issuedAt + SESSION_DURATION_SECONDS });
  const signingInput = `${header}.${payload}`;
  const signature = createHmac("sha256", getJwtSecret()).update(signingInput).digest("base64url");
  return `${signingInput}.${signature}`;
}

export function verifyDemoToken(token: string): TokenUser | null {
  try {
    const [header, payload, signature, extra] = token.split(".");
    if (!header || !payload || !signature || extra) return null;

    const decodedHeader = JSON.parse(Buffer.from(header, "base64url").toString("utf8")) as { alg?: string };
    if (decodedHeader.alg !== "HS256") return null;

    const expected = createHmac("sha256", getJwtSecret()).update(`${header}.${payload}`).digest();
    const received = Buffer.from(signature, "base64url");
    if (expected.length !== received.length || !timingSafeEqual(expected, received)) return null;

    const claims = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as JwtPayload;
    if (typeof claims.exp !== "number" || claims.exp <= Math.floor(Date.now() / 1000)) return null;
    if (typeof claims.id !== "string" || typeof claims.username !== "string" || typeof claims.role !== "string") return null;

    return { id: claims.id, username: claims.username, role: claims.role };
  } catch {
    return null;
  }
}