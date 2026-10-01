"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, Eye, EyeOff, Fingerprint, LockKeyhole, ShieldCheck } from "lucide-react";
import { login } from "@/store/authSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import "./login.css";

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = useAppSelector((state) => state.auth.error);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [username, setUsername] = useState("demo");
  const [password, setPassword] = useState("defi123");
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    const result = await dispatch(login({ username, password }));
    if (login.fulfilled.match(result)) {
      const returnTo = searchParams.get("returnTo");
      router.replace(returnTo?.startsWith("/") && !returnTo.startsWith("//") ? returnTo : "/");
      return;
    }
    setIsSubmitting(false);
  }

  return (
    <main className="login-page">
      <div aria-hidden="true" className="login-orbit login-orbit-one" />
      <div aria-hidden="true" className="login-orbit login-orbit-two" />
      <div className="login-frame">
        <section className="login-story">
          <Link aria-label="Forma Finance home" className="login-brand" href="/">
            <span className="brand-mark"><span>F</span></span>
            <span className="brand-name">FORMA<span>finance</span></span>
          </Link>
          <div className="login-story-content">
            <p className="login-kicker"><span /> A clearer view of decentralized finance</p>
            <h1>Make your<br />assets <em>work</em><br />with purpose.</h1>
            <p className="login-story-copy">One considered view of your digital portfolio, on-chain activity, and earning positions.</p>
            <div className="login-story-metrics">
              <div><strong>$24.5k</strong><span>sample portfolio</span></div>
              <span className="metric-divider" />
              <div><strong>8.42%</strong><span>sample avg. APY</span></div>
            </div>
          </div>
          <div className="login-footnote"><span>01</span><span>Personal finance, rebuilt for on-chain assets.</span></div>
        </section>

        <section aria-labelledby="login-title" className="login-form-side">
          <div className="login-card">
            <div className="login-mobile-brand">
              <span className="brand-mark"><span>F</span></span>
              <span className="brand-name">FORMA<span>finance</span></span>
            </div>
            <div className="login-icon"><Fingerprint size={21} strokeWidth={1.7} /></div>
            <p className="login-kicker login-kicker-dark">Member access</p>
            <h2 id="login-title">Welcome back</h2>
            <p className="login-intro">Sign in to continue to your portfolio.</p>

            <form className="login-form" onSubmit={handleSubmit}>
              <label htmlFor="username">Username</label>
              <div className="login-input-wrap">
                <input autoComplete="username" id="username" onChange={(event) => setUsername(event.target.value)} required value={username} />
              </div>

              <div className="password-label-row"><label htmlFor="password">Password</label><span>Demo access</span></div>
              <div className="login-input-wrap password-input-wrap">
                <LockKeyhole aria-hidden="true" size={16} />
                <input autoComplete="current-password" id="password" onChange={(event) => setPassword(event.target.value)} required type={showPassword ? "text" : "password"} value={password} />
                <button aria-label={showPassword ? "Hide password" : "Show password"} className="password-visibility" onClick={() => setShowPassword(!showPassword)} type="button">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {error && <p className="login-error" role="alert">{error}</p>}

              <button className="login-submit" disabled={isSubmitting} type="submit">
                <span>{isSubmitting ? "Signing in..." : "Sign in to Forma"}</span>
                <ArrowRight size={17} />
              </button>
            </form>

            <div className="demo-credentials"><div><span className="demo-credential-icon"><ShieldCheck size={15} /></span><strong>First-time demo setup</strong></div><p>Username <code>demo</code><span>·</span>Password <code>defi123</code></p><small className="demo-setup-note">Account is saved to the database after the first successful sign-in.</small></div>
            <p className="login-security"><LockKeyhole size={13} /> Your session stays in this browser tab.</p>
          </div>
          <footer className="login-legal"><span>© 2026 Forma Finance</span><span>Demo interface · Not financial advice</span></footer>
        </section>
      </div>
    </main>
  );
}