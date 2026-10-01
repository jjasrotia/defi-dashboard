This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## PostgreSQL

The app uses Prisma 7 with PostgreSQL through `@prisma/adapter-pg`. Copy `.env.example` to `.env.local` and set `DATABASE_URL` and a long random `JWT_SECRET`. Keep `.env.local` private; it is ignored by Git.

Generate Prisma Client and create/update the portfolio tables:

```bash
npm run db:generate
npm run db:push
```

`npm run build` also generates Prisma Client before the Next.js build. Portfolio assets are persisted through `/api/portfolio/assets`, and transactions through `/api/transactions`; both endpoints require the demo JWT as a bearer token. Use `npm run db:studio` to inspect the database.

The direct Supabase database hostname resolves to IPv6. If your network does not support IPv6, copy the IPv4-compatible Session Pooler connection string from Supabase Project Settings > Database and use that as `DATABASE_URL` before running `db:push`.

The demo sign-in is `demo` / `defi123`. It is for local UI development only, not production authentication.

Authentication currently defaults to a signed demo JWT without a PostgreSQL dependency so sign-in works while the database is offline. Set `AUTH_USE_DATABASE="true"` in `.env.local` after the database schema has been pushed to enable persisted users and revocable sessions again.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
