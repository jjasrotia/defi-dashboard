import { z } from "zod";
import { getAuthenticatedUser } from "@/lib/auth-session";
import { prisma } from "@/lib/prisma";

const assetInput = z.object({
  symbol: z.string().trim().min(1).max(16).transform((value) => value.toUpperCase()),
  name: z.string().trim().min(1).max(80),
  amount: z.coerce.number().positive(),
  priceUsd: z.coerce.number().nonnegative(),
});

export async function GET(request: Request) {
  let user;
  try {
    user = await getAuthenticatedUser(request);
  } catch {
    return Response.json({ error: "Could not verify your session." }, { status: 503 });
  }
  if (!user) return Response.json({ error: "Unauthorized." }, { status: 401 });

  try {
    const assets = await prisma.portfolioAsset.findMany({
      where: { userId: user.id },
      orderBy: { symbol: "asc" },
    });
    return Response.json({ assets }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json({ error: "Could not load portfolio assets." }, { status: 503 });
  }
}

export async function POST(request: Request) {
  let user;
  try {
    user = await getAuthenticatedUser(request);
  } catch {
    return Response.json({ error: "Could not verify your session." }, { status: 503 });
  }
  if (!user) return Response.json({ error: "Unauthorized." }, { status: 401 });

  const parsed = assetInput.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return Response.json({ error: "Invalid asset details.", details: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const asset = await prisma.portfolioAsset.upsert({
      where: { userId_symbol: { userId: user.id, symbol: parsed.data.symbol } },
      create: { ...parsed.data, userId: user.id },
      update: { name: parsed.data.name, amount: parsed.data.amount, priceUsd: parsed.data.priceUsd },
    });
    return Response.json({ asset }, { status: 201, headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json({ error: "Could not save the asset." }, { status: 503 });
  }
}