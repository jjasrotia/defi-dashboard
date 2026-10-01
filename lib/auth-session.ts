import { hashAuthToken, verifyDemoToken, type TokenUser } from "@/lib/auth-token";

export function getBearerToken(request: Request) {
  const authorization = request.headers.get("authorization");
  return authorization?.startsWith("Bearer ") ? authorization.slice(7) : "";
}

export async function getAuthenticatedUser(request: Request): Promise<TokenUser | null> {
  const token = getBearerToken(request);
  if (!token) return null;

  const claims = verifyDemoToken(token);
  if (!claims) return null;

  if (process.env.AUTH_USE_DATABASE !== "true") return claims;

  const { prisma } = await import("@/lib/prisma");
  const session = await prisma.authSession.findUnique({
    where: { tokenHash: hashAuthToken(token) },
    select: { expiresAt: true, user: { select: { id: true, username: true, role: true } } },
  });

  if (!session || session.expiresAt <= new Date() || session.user.id !== claims.id) return null;
  return session.user;
}