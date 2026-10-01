"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAppSelector } from "@/store/hooks";

export default function AuthGate({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const status = useAppSelector((state) => state.auth.status);
  const isLoginPage = pathname === "/login";

  useEffect(() => {
    if (status === "unauthenticated" && !isLoginPage) {
      router.replace(`/login?returnTo=${encodeURIComponent(pathname)}`);
    } else if (status === "authenticated" && isLoginPage) {
      router.replace("/");
    }
  }, [isLoginPage, pathname, router, status]);

  if (isLoginPage && status !== "authenticated") return children;
  if (status === "authenticated") return children;

  return (
    <main className="auth-check-screen" aria-live="polite">
      <span className="auth-check-mark">F</span>
      <span>Checking your session</span>
    </main>
  );
}