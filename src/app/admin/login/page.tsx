"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Hammer, Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import { Button, Input } from "@/components/ui";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  const [email, setEmail] = useState("demo");
  const [password, setPassword] = useState("demo");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password.");
      return;
    }
    setLoading(true);
    try {
      await login(email.trim(), password, remember);
      const next = searchParams.get("next") || "/admin/dashboard";
      router.replace(next);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Authentication failed. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[var(--bg)]">
      {/* Left side — branding / hero (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-[#3a2616] via-[#5a3a22] to-[#7a502e] text-white">
        {/* Decorative wood-grain pattern */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, transparent 0, transparent 40px, rgba(255,255,255,0.04) 40px, rgba(255,255,255,0.04) 41px), repeating-linear-gradient(90deg, transparent 0, transparent 80px, rgba(0,0,0,0.08) 80px, rgba(0,0,0,0.08) 82px)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

        <div className="relative z-10 p-12 flex flex-col justify-between w-full">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-lg bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/20">
              <Hammer className="h-6 w-6 text-white" strokeWidth={2} />
            </div>
            <div>
              <div className="text-xl font-bold tracking-tight leading-tight">
                AMIT FURNITURE
              </div>
              <div className="text-[11px] uppercase tracking-[0.25em] text-white/70 mt-0.5">
                Admin Portal
              </div>
            </div>
          </div>

          <div className="max-w-md">
            <h1 className="text-4xl xl:text-5xl font-bold leading-tight tracking-tight">
              Build things
              <br />
              with <em className="text-[#e4b889] not-italic">love</em> and{" "}
              <em className="text-[#e4b889] not-italic">care</em>.
            </h1>
            <p className="mt-6 text-white/75 leading-relaxed">
              Manage your customers, enquiries, quotations, projects and
              payments — all in one place. Crafted for the way Amit Furniture
              actually works.
            </p>
            <div className="mt-8 flex items-center gap-6 text-sm">
              <div>
                <div className="text-2xl font-bold">500+</div>
                <div className="text-white/60 text-xs uppercase tracking-wider mt-1">
                  Projects Delivered
                </div>
              </div>
              <div className="h-10 w-px bg-white/20" />
              <div>
                <div className="text-2xl font-bold">North Bengal</div>
                <div className="text-white/60 text-xs uppercase tracking-wider mt-1">
                  Service Area
                </div>
              </div>
            </div>
          </div>

          <div className="text-xs text-white/50">
            © 2026 Amit Furniture · Established 2025 · Founder: Amit Kumar Sharma
          </div>
        </div>
      </div>

      {/* Right side — login form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden mb-8 flex items-center gap-3">
            <div className="h-11 w-11 rounded-lg bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] flex items-center justify-center shadow-sm">
              <Hammer className="h-5 w-5 text-[var(--primary-foreground)]" strokeWidth={2.2} />
            </div>
            <div>
              <div className="text-lg font-bold tracking-tight leading-tight">
                AMIT FURNITURE
              </div>
              <div className="text-[10px] uppercase tracking-widest text-[var(--text-subtle)] font-medium">
                Admin Portal
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold tracking-tight text-[var(--text)]">
              Welcome back
            </h2>
            <p className="mt-1.5 text-sm text-[var(--text-muted)]">
              Sign in to continue to the admin dashboard.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email or username"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="amit@amitfurniture.com"
              autoComplete="username"
              autoFocus
            />

            <Input
              label="Password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[var(--text-subtle)] hover:text-[var(--text)]"
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              }
            />

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="h-4 w-4 rounded border-[var(--border)] text-[var(--primary)] focus:ring-[var(--ring)] accent-[var(--primary)]"
                />
                <span className="text-xs text-[var(--text-muted)]">
                  Remember me
                </span>
              </label>
              <button
                type="button"
                onClick={() =>
                  alert(
                    "Password reset is handled by the backend API. Contact your administrator."
                  )
                }
                className="text-xs font-medium text-[var(--primary)] hover:underline"
              >
                Forgot password?
              </button>
            </div>

            {error && (
              <div className="p-3 bg-[var(--danger-bg)] border border-[var(--danger)]/20 rounded-md text-sm text-[var(--danger)]">
                {error}
              </div>
            )}

            <Button
              type="submit"
              size="lg"
              className="w-full mt-2"
              isLoading={loading}
              leftIcon={loading ? <Loader2 className="h-4 w-4 animate-spin" /> : undefined}
            >
              {loading ? "Signing in…" : "Sign in"}
            </Button>
          </form>

          <div className="mt-8 p-4 bg-[var(--surface-muted)] border border-[var(--border)] rounded-lg">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-subtle)] mb-2">
              Demo Credentials
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <div className="text-[var(--text-subtle)]">Username</div>
                <div className="font-mono font-semibold text-[var(--text)]">
                  demo
                </div>
              </div>
              <div>
                <div className="text-[var(--text-subtle)]">Password</div>
                <div className="font-mono font-semibold text-[var(--text)]">
                  demo
                </div>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-[var(--border)] text-[11px] text-[var(--text-muted)]">
              Or use any staff email from the system with any password.
            </div>
          </div>

          <div className="mt-6 text-center text-[11px] text-[var(--text-subtle)]">
            Protected system · Access is restricted to authorised staff only.
          </div>
        </div>
      </div>
    </div>
  );
}
