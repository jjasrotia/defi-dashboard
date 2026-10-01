import { z } from "zod";
import { DEMO_CREDENTIALS, createAuthToken, hashAuthToken, hashPassword, SESSION_DURATION_SECONDS, verifyPassword, type TokenUser } from "@/lib/auth-token";

const credentialsSchema = z.object({
  username: z.string().trim().min(1).max(64),
  password: z.string().min(1).max(256),
});

export async function POST(request: Request) {
  const parsed = credentialsSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "Enter a valid username and password." }, { status: 400 });

  if (parsed.data.username !== DEMO_CREDENTIALS.username || parsed.data.password !== DEMO_CREDENTIALS.password) {
    return Response.json({ error: "Those demo credentials are not correct." }, { status: 401 });
  }

  try {
    if (process.env.AUTH_USE_DATABASE !== "true") {
      const user: TokenUser = { id: "demo-user-01", username: DEMO_CREDENTIALS.username, role: "viewer" };
      return Response.json({ token: createAuthToken(user), user }, {
        headers: { "Cache-Control": "no-store" },
      });
    }

    const { prisma } = await import("@/lib/prisma");
    let user = await prisma.user.findUnique({ where: { username: parsed.data.username } });

    if (!user) {
      user = await prisma.user.upsert({
        where: { username: DEMO_CREDENTIALS.username },
        create: {
          username: DEMO_CREDENTIALS.username,
          passwordHash: await hashPassword(DEMO_CREDENTIALS.password),
          role: "viewer",
        },
        update: {},
      });
    }

    if (!await verifyPassword(parsed.data.password, user.passwordHash)) {
      return Response.json({ error: "Those demo credentials are not correct." }, { status: 401 });
    }

    const token = createAuthToken({ id: user.id, username: user.username, role: user.role });
    const expiresAt = new Date(Date.now() + SESSION_DURATION_SECONDS * 1000);
    await prisma.authSession.create({
      data: { userId: user.id, tokenHash: hashAuthToken(token), expiresAt },
    });

    return Response.json({
      token,
      user: { id: user.id, username: user.username, role: user.role },
    }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json({ error: "Could not connect to the account database." }, { status: 503 });
  }
}