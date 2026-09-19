"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Search,
  Bell,
  Sun,
  Moon,
  Menu,
  User,
  LogOut,
  Settings,
  Shield,
  X,
} from "lucide-react";
import { useTheme } from "./theme-provider";
import { useAuth } from "./auth-provider";
import { UserAvatar } from "./ui";
import { formatRelativeTime } from "@/lib/utils";
import { notifications as allNotifications } from "@/lib/mock-data";
import { customers, enquiries, quotations, projects, invoices } from "@/lib/mock-data";

export function Header({ onMenuClick }: { onMenuClick: () => void }) {
  const { theme, toggle } = useTheme();
  const { user, logout } = useAuth();

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Global search results
  const searchResults = React.useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    const results: Array<{ type: string; label: string; sublabel: string; href: string }> = [];

    customers.forEach((c) => {
      if (
        c.name.toLowerCase().includes(q) ||
        (c.email || "").toLowerCase().includes(q) ||
        c.phone.includes(q)
      ) {
        results.push({
          type: "Customer",
          label: c.name,
          sublabel: c.phone,
          href: `/admin/customers/${c.id}`,
        });
      }
    });
    enquiries.forEach((e) => {
      if (
        e.number.toLowerCase().includes(q) ||
        e.customerName.toLowerCase().includes(q) ||
        e.service.toLowerCase().includes(q)
      ) {
        results.push({
          type: "Enquiry",
          label: `${e.number} · ${e.service}`,
          sublabel: e.customerName,
          href: `/admin/enquiries/${e.id}`,
        });
      }
    });
    quotations.forEach((q2) => {
      if (
        q2.number.toLowerCase().includes(q) ||
        q2.customerName.toLowerCase().includes(q)
      ) {
        results.push({
          type: "Quotation",
          label: `${q2.number}`,
          sublabel: q2.customerName,
          href: `/admin/quotations`,
        });
      }
    });
    projects.forEach((p) => {
      if (
        p.number.toLowerCase().includes(q) ||
        p.name.toLowerCase().includes(q) ||
        p.customerName.toLowerCase().includes(q)
      ) {
        results.push({
          type: "Project",
          label: p.name,
          sublabel: p.customerName,
          href: `/admin/projects/${p.id}`,
        });
      }
    });
    invoices.forEach((i) => {
      if (
        i.number.toLowerCase().includes(q) ||
        i.customerName.toLowerCase().includes(q)
      ) {
        results.push({
          type: "Invoice",
          label: i.number,
          sublabel: i.customerName,
          href: `/admin/invoices`,
        });
      }
    });

    return results.slice(0, 8);
  }, [searchQuery]);

  const userNotifications = allNotifications.filter(
    (n) => n.userId === (user?.id || "u1")
  );
  const unreadCount = userNotifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-30 bg-[var(--bg)]/85 backdrop-blur-md border-b border-[var(--border)]">
      <div className="flex items-center gap-3 px-4 lg:px-6 h-16">
        {/* Mobile menu button */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-muted)] rounded-md"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Search */}
        <div ref={searchRef} className="flex-1 max-w-xl relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-subtle)]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setSearchOpen(true);
              }}
              onFocus={() => setSearchOpen(true)}
              placeholder="Search customers, enquiries, quotations, projects..."
              className="w-full h-9 pl-9 pr-3 bg-[var(--surface)] border border-[var(--border)] rounded-md text-sm text-[var(--text)] placeholder:text-[var(--text-subtle)] focus-ring focus:border-[var(--ring)]"
            />
            <kbd className="hidden md:block absolute right-2 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[10px] text-[var(--text-subtle)] border border-[var(--border)] rounded">
              ⌘K
            </kbd>
          </div>

          {/* Search results dropdown */}
          {searchOpen && searchQuery && (
            <div className="absolute top-full left-0 right-0 mt-1.5 bg-[var(--surface)] border border-[var(--border)] rounded-lg shadow-lg max-h-96 overflow-y-auto z-40 animate-fade-in">
              {searchResults.length === 0 ? (
                <div className="p-4 text-sm text-[var(--text-muted)] text-center">
                  No results for "{searchQuery}"
                </div>
              ) : (
                <div>
                  {searchResults.map((r, i) => (
                    <Link
                      key={i}
                      href={r.href}
                      onClick={() => {
                        setSearchOpen(false);
                        setSearchQuery("");
                      }}
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-[var(--surface-muted)] transition-colors border-b border-[var(--border)] last:border-0"
                    >
                      <span className="text-[10px] uppercase tracking-wider text-[var(--text-subtle)] font-semibold w-20">
                        {r.type}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-[var(--text)] truncate">
                          {r.label}
                        </div>
                        <div className="text-xs text-[var(--text-muted)] truncate">
                          {r.sublabel}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-1">
          {/* Theme toggle */}
          <button
            onClick={toggle}
            className="p-2 text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-muted)] rounded-md transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "light" ? (
              <Moon className="h-4 w-4" />
            ) : (
              <Sun className="h-4 w-4" />
            )}
          </button>

          {/* Notifications */}
          <div ref={notifRef} className="relative">
            <button
              onClick={() => setNotifOpen(!notifOpen)}
              className="relative p-2 text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-muted)] rounded-md transition-colors"
              aria-label="Notifications"
            >
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 h-4 min-w-[16px] px-1 flex items-center justify-center text-[10px] font-bold bg-[var(--danger)] text-white rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>

            {notifOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-[360px] max-w-[calc(100vw-2rem)] bg-[var(--surface)] border border-[var(--border)] rounded-lg shadow-lg z-40 animate-fade-in">
                <div className="px-4 py-3 border-b border-[var(--border)] flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-[var(--text)]">
                    Notifications
                  </h3>
                  {unreadCount > 0 && (
                    <span className="text-[10px] font-semibold text-[var(--primary)] uppercase tracking-wider">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {userNotifications.length === 0 ? (
                    <div className="p-6 text-center text-sm text-[var(--text-muted)]">
                      No notifications
                    </div>
                  ) : (
                    userNotifications.map((n) => (
                      <Link
                        key={n.id}
                        href={n.link || "#"}
                        onClick={() => setNotifOpen(false)}
                        className="block px-4 py-3 border-b border-[var(--border)] last:border-0 hover:bg-[var(--surface-muted)] transition-colors"
                      >
                        <div className="flex items-start gap-2.5">
                          {!n.read && (
                            <span className="mt-1.5 h-2 w-2 rounded-full bg-[var(--primary)] shrink-0" />
                          )}
                          <div className={n.read ? "pl-[14px]" : ""}>
                            <div className="text-sm font-medium text-[var(--text)]">
                              {n.title}
                            </div>
                            {n.message && (
                              <div className="text-xs text-[var(--text-muted)] mt-0.5 line-clamp-2">
                                {n.message}
                              </div>
                            )}
                            <div className="text-[10px] text-[var(--text-subtle)] mt-1">
                              {formatRelativeTime(n.createdAt)}
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Profile menu */}
          <div ref={profileRef} className="relative ml-1">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 p-1 pr-2 rounded-md hover:bg-[var(--surface-muted)] transition-colors"
            >
              <UserAvatar
                name={user?.name || "Admin"}
                size="sm"
                imageUrl={user?.avatarUrl}
              />
              <div className="hidden md:block text-left">
                <div className="text-xs font-semibold text-[var(--text)] leading-tight">
                  {user?.name}
                </div>
                <div className="text-[10px] text-[var(--text-subtle)] leading-tight">
                  {user?.roleName}
                </div>
              </div>
            </button>

            {profileOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-[240px] bg-[var(--surface)] border border-[var(--border)] rounded-lg shadow-lg z-40 animate-fade-in">
                <div className="p-3 border-b border-[var(--border)]">
                  <div className="text-sm font-semibold text-[var(--text)]">
                    {user?.name}
                  </div>
                  <div className="text-xs text-[var(--text-muted)] truncate">
                    {user?.email}
                  </div>
                </div>
                <div className="py-1">
                  <Link
                    href="/admin/profile"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-[var(--text)] hover:bg-[var(--surface-muted)]"
                  >
                    <User className="h-4 w-4 text-[var(--text-subtle)]" />
                    My Profile
                  </Link>
                  <Link
                    href="/admin/settings"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-[var(--text)] hover:bg-[var(--surface-muted)]"
                  >
                    <Settings className="h-4 w-4 text-[var(--text-subtle)]" />
                    Account Settings
                  </Link>
                  <Link
                    href="/admin/settings"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-[var(--text)] hover:bg-[var(--surface-muted)]"
                  >
                    <Shield className="h-4 w-4 text-[var(--text-subtle)]" />
                    Security
                  </Link>
                </div>
                <div className="border-t border-[var(--border)] py-1">
                  <button
                    onClick={() => {
                      logout();
                      setProfileOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[var(--danger)] hover:bg-[var(--danger-bg)]"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

// Small helper for the search close
export { X as SearchClose };
