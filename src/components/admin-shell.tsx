"use client";

import React, { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Sidebar } from "./sidebar";
import { Header } from "./header";
import { useAuth } from "./auth-provider";
import { ToastContainer } from "./ui";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const isLoginRoute = pathname === "/admin/login";

  // Redirect to login if not authenticated (skip if already on login page)
  React.useEffect(() => {
    if (!isLoading && !isAuthenticated && !isLoginRoute) {
      router.replace(`/admin/login?next=${encodeURIComponent(pathname)}`);
    }
  }, [isLoading, isAuthenticated, router, pathname, isLoginRoute]);

  // Redirect to dashboard if already logged in and on login page
  React.useEffect(() => {
    if (!isLoading && isAuthenticated && isLoginRoute) {
      router.replace("/admin/dashboard");
    }
  }, [isLoading, isAuthenticated, router, isLoginRoute]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg)]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 rounded-md bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] animate-pulse-soft" />
          <div className="text-sm text-[var(--text-muted)]">Loading…</div>
        </div>
      </div>
    );
  }

  // Render login page without the admin shell
  if (isLoginRoute) {
    return (
      <>
        {children}
      </>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="min-h-screen flex bg-[var(--bg)]">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 p-4 lg:p-8 animate-fade-in">
          <div className="max-w-[1600px] mx-auto">{children}</div>
        </main>
      </div>
      <ToastContainer />
    </div>
  );
}
