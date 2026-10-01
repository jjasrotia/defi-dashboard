import { getAuthenticatedUser, getBearerToken } from "@/lib/auth-session";
import { hashAuthToken } from "@/lib/auth-token";

export async function GET(request: Request) {
  let user;
  try {
    user = await getAuthenticatedUser(request);
  } catch {
    return Response.json({ error: "Could not verify your session." }, { status: 503 });
  }

  if (!user) {
    return Response.json({ error: "Session is invalid or expired." }, {
      status: 401,
      headers: { "Cache-Control": "no-store" },
    });
  }

  return Response.json({ user }, { headers: { "Cache-Control": "no-store" } });
}

export async function DELETE(request: Request) {
  const token = getBearerToken(request);
  if (!token) return Response.json({ error: "Unauthorized." }, { status: 401 });

  if (process.env.AUTH_USE_DATABASE !== "true") {
    return Response.json({ success: true }, { headers: { "Cache-Control": "no-store" } });
  }

  try {
    const { prisma } = await import("@/lib/prisma");
    await prisma.authSession.deleteMany({ where: { tokenHash: hashAuthToken(token) } });
    return Response.json({ success: true }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json({ error: "Could not end the session." }, { status: 503 });
  }
}