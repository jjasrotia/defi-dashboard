import { z } from "zod";

import { getAuthenticatedUser } from "@/lib/auth-session";

const assetInput = z.object({
  symbol: z
    .string()
    .trim()
    .min(1)
    .max(16)
    .transform((value) => value.toUpperCase()),

  name: z.string().trim().min(1).max(80),

  amount: z.coerce.number().positive(),

  priceUsd: z.coerce.number().nonnegative(),
});

// Temporary mock data
const mockAssets = [
  {
    id: "1",
    symbol: "ETH",
    name: "Ethereum",
    amount: 2.84,
    priceUsd: 2901.52,
  },
  {
    id: "2",
    symbol: "USDC",
    name: "USD Coin",
    amount: 6320,
    priceUsd: 1,
  },
  {
    id: "3",
    symbol: "WBTC",
    name: "Wrapped Bitcoin",
    amount: 0.061,
    priceUsd: 83942.30,
  },
  {
    id: "4",
    symbol: "LINK",
    name: "Chainlink",
    amount: 48.21,
    priceUsd: 66.67,
  },
];

export async function GET(request: Request) {
  let user;

  try {
    user = await getAuthenticatedUser(request);
  } catch {
    return Response.json(
      { error: "Could not verify your session." },
      { status: 503 }
    );
  }

  if (!user) {
    return Response.json(
      { error: "Unauthorized." },
      { status: 401 }
    );
  }

  return Response.json(
    { assets: mockAssets },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    }
  );
}

export async function POST(request: Request) {
  let user;

  try {
    user = await getAuthenticatedUser(request);
  } catch {
    return Response.json(
      { error: "Could not verify your session." },
      { status: 503 }
    );
  }

  if (!user) {
    return Response.json(
      { error: "Unauthorized." },
      { status: 401 }
    );
  }

  const parsed = assetInput.safeParse(
    await request.json().catch(() => null)
  );

  if (!parsed.success) {
    return Response.json(
      {
        error: "Invalid asset details.",
        details: parsed.error.flatten(),
      },
      { status: 400 }
    );
  }

  // Temporary response instead of saving to database
  const asset = {
    id: crypto.randomUUID(),
    ...parsed.data,
  };

  return Response.json(
    { asset },
    {
      status: 201,
      headers: {
        "Cache-Control": "no-store",
      },
    }
  );
}