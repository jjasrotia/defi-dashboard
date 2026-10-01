import { z } from "zod";
import { getAuthenticatedUser } from "@/lib/auth-session";
import { prisma } from "@/lib/prisma";

const transactionInput = z.object({
  type: z.enum(["swap", "supply", "withdraw", "reward"]),
  assetSymbol: z.string().trim().min(1).max(16).transform((value) => value.toUpperCase()),
  amount: z.coerce.number().positive(),
  valueUsd: z.coerce.number().nonnegative(),
  status: z.enum(["pending", "completed", "failed"]).default("completed"),
  occurredAt: z.coerce.date().optional(),
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
    const transactions = await prisma.portfolioTransaction.findMany({
      where: { userId: user.id },
      orderBy: { occurredAt: "desc" },
      take: 50,
    });
    return Response.json({ transactions }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json({ error: "Could not load transactions." }, { status: 503 });
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

  const parsed = transactionInput.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return Response.json({ error: "Invalid transaction details.", details: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const transaction = await prisma.portfolioTransaction.create({
      data: { ...parsed.data, userId: user.id },
    });
    return Response.json({ transaction }, { status: 201, headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json({ error: "Could not save the transaction." }, { status: 503 });
  }
}