"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Inbox,
  Users,
  MessageSquare,
  FileText,
  FolderKanban,
  ListChecks,
  Calendar,
  CreditCard,
  Receipt,
  FileStack,
  PhoneCall,
  Globe,
  BarChart3,
  UserCog,
  Shield,
  Activity,
  Settings,
  X,
  Hammer,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number | string;
  section?: string;
}

export const NAV_ITEMS: NavItem[] = [
  { id: "dashboard", label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard, section: "overview" },
  { id: "inbox", label: "Inbox", href: "/admin/inbox", icon: Inbox, badge: 3, section: "overview" },

  { id: "customers", label: "Customers", href: "/admin/customers", icon: Users, section: "crm" },
  { id: "enquiries", label: "Enquiries", href: "/admin/enquiries", icon: MessageSquare, badge: 5, section: "crm" },
  { id: "quotations", label: "Quotations", href: "/admin/quotations", icon: FileText, section: "crm" },
  { id: "projects", label: "Projects", href: "/admin/projects", icon: FolderKanban, section: "crm" },

  { id: "tasks", label: "Tasks", href: "/admin/tasks", icon: ListChecks, badge: 7, section: "operations" },
  { id: "calendar", label: "Calendar", href: "/admin/calendar", icon: Calendar, section: "operations" },
  { id: "payments", label: "Payments", href: "/admin/payments", icon: CreditCard, section: "operations" },
  { id: "invoices", label: "Invoices", href: "/admin/invoices", icon: Receipt, section: "operations" },
  { id: "documents", label: "Documents", href: "/admin/documents", icon: FileStack, section: "operations" },
  { id: "communications", label: "Communications", href: "/admin/communications", icon: PhoneCall, section: "operations" },

  { id: "website", label: "Website", href: "/admin/website", icon: Globe, section: "content" },
  { id: "reports", label: "Reports", href: "/admin/reports", icon: BarChart3, section: "content" },

  { id: "users", label: "Staff & Users", href: "/admin/users", icon: UserCog, section: "admin" },
  { id: "roles", label: "Roles & Permissions", href: "/admin/roles", icon: Shield, section: "admin" },
  { id: "activity", label: "Activity Log", href: "/admin/activity", icon: Activity, section: "admin" },
  { id: "settings", label: "Settings", href: "/admin/settings", icon: Settings, section: "admin" },
];

const SECTIONS = [
  { id: "overview", label: "Overview" },
  { id: "crm", label: "Business" },
  { id: "operations", label: "Operations" },
  { id: "content", label: "Content" },
  { id: "admin", label: "Administration" },
];

export function Sidebar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/admin/dashboard") return pathname === href;
    return pathname.startsWith(href);
  };

  const content = (
    <div className="flex flex-col h-full">
      {/* Logo / Brand */}
      <div className="px-5 py-6 border-b border-[var(--border)]">
        <Link href="/admin/dashboard" className="flex items-start gap-3 group">
          <div className="shrink-0 h-10 w-10 rounded-md bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] flex items-center justify-center shadow-sm">
            <Hammer className="h-5 w-5 text-[var(--primary-foreground)]" strokeWidth={2.2} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[15px] font-bold tracking-tight text-[var(--text)] leading-tight">
              AMIT
            </div>
            <div className="text-[15px] font-bold tracking-tight text-[var(--text)] leading-tight">
              FURNITURE
            </div>
            <div className="mt-0.5 text-[10px] uppercase tracking-widest text-[var(--text-subtle)] font-medium">
              Admin
            </div>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        {SECTIONS.map((section) => {
          const items = NAV_ITEMS.filter((i) => i.section === section.id);
          if (items.length === 0) return null;
          return (
            <div key={section.id}>
              <div className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-wider text-[var(--text-subtle)]">
                {section.label}
              </div>
              <ul className="space-y-0.5">
                {items.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);
                  return (
                    <li key={item.id}>
                      <Link
                        href={item.href}
                        onClick={onClose}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all",
                          active
                            ? "bg-[var(--primary)] text-[var(--primary-foreground)] shadow-sm"
                            : "text-[var(--text-muted)] hover:bg-[var(--surface-muted)] hover:text-[var(--text)]"
                        )}
                      >
                        <Icon className="h-4 w-4 shrink-0" />
                        <span className="flex-1 truncate">{item.label}</span>
                        {item.badge && (
                          <span
                            className={cn(
                              "text-[10px] font-semibold px-1.5 py-0.5 rounded-md",
                              active
                                ? "bg-white/20 text-[var(--primary-foreground)]"
                                : "bg-[var(--surface-muted)] text-[var(--text-muted)]"
                            )}
                          >
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </nav>

      {/* Footer tagline */}
      <div className="px-5 py-4 border-t border-[var(--border)]">
        <div className="text-[11px] text-[var(--text-subtle)] italic">
          "Build things with love and care"
        </div>
        <div className="text-[10px] text-[var(--text-subtle)] mt-1">
          Est. 2025 · North Bengal
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40 animate-fade-in"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:sticky top-0 left-0 h-screen w-[260px] bg-[var(--surface)] border-r border-[var(--border)] z-50 transition-transform",
          "lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Mobile close button */}
        <button
          onClick={onClose}
          className="lg:hidden absolute top-4 right-4 p-1 text-[var(--text-muted)] hover:text-[var(--text)]"
          aria-label="Close sidebar"
        >
          <X className="h-5 w-5" />
        </button>
        {content}
      </aside>
    </>
  );
}
