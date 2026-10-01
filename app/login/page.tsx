import { Suspense } from "react";
import LoginPage from "@/components/auth/LoginPage";

export default function LoginRoute() {
  return (
    <Suspense fallback={<main className="auth-check-screen">Loading sign in</main>}>
      <LoginPage />
    </Suspense>
  );
}