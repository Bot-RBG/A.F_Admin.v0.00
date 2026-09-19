"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Inbox as InboxIcon, MessageSquare, Phone, Mail, Bell, Star } from "lucide-react";
import { Card, Button, StatusBadge, UserAvatar, PageHeader, Badge, Tabs, EmptyState } from "@/components/ui";
import { enquiries, communications } from "@/lib/mock-data";
import { formatRelativeTime, truncate } from "@/lib/utils";

type Category = "all" | "enquiries" | "callbacks" | "messages" | "notifications";

export default function InboxPage() {
  const [category, setCategory] = useState<Category>("all");

  const inboxItems = [
    ...enquiries
      .filter((e) => e.status === "new" || e.status === "contacted")
      .map((e) => ({
        id: e.id,
        type: "enquiry" as const,
        customer: e.customerName,
        subject: e.service,
        preview: e.requirement,
        date: e.createdAt,
        status: e.status,
        unread: e.status === "new",
        href: `/admin/enquiries/${e.id}`,
      })),
    ...communications
      .slice(0, 5)
      .map((c) => ({
        id: c.id,
        type: "message" as const,
        customer: c.customerName || "Unknown",
        subject: c.subject || `${c.type} ${c.direction}`,
        preview: c.summary || "",
        date: c.occurredAt,
        status: "contacted",
        unread: false,
        href: `/admin/communications`,
      })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const categories = [
    { id: "all", label: "All", count: inboxItems.length },
    { id: "enquiries", label: "Website Enquiries", count: inboxItems.filter((i) => i.type === "enquiry").length },
    { id: "callbacks", label: "Callbacks", count: 0 },
    { id: "messages", label: "Messages", count: inboxItems.filter((i) => i.type === "message").length },
    { id: "notifications", label: "Notifications", count: 3 },
  ];

  const filtered = category === "all" ? inboxItems : inboxItems.filter((i) => {
    if (category === "enquiries") return i.type === "enquiry";
    if (category === "messages") return i.type === "message";
    return true;
  });

  return (
    <div>
      <PageHeader
        title="Inbox"
        description="All incoming enquiries, messages and notifications in one place."
        breadcrumbs={[{ label: "Dashboard", href: "/admin/dashboard" }, { label: "Inbox" }]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-1 space-y-1">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setCategory(c.id as Category)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md text-sm transition-colors ${
                category === c.id
                  ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                  : "text-[var(--text-muted)] hover:bg-[var(--surface-muted)]"
              }`}
            >
              <span className="font-medium">{c.label}</span>
              <Badge variant={category === c.id ? "primary" : "default"}>
                {c.count}
              </Badge>
            </button>
          ))}
        </div>

        <div className="lg:col-span-3">
          <Card padding="none">
            {filtered.length === 0 ? (
              <EmptyState
                icon={<InboxIcon className="h-12 w-12" />}
                title="Inbox zero"
                description="No messages in this category."
              />
            ) : (
              <div className="divide-y divide-[var(--border)]">
                {filtered.map((item) => (
                  <Link
                    key={item.id}
                    href={item.href}
                    className="flex items-start gap-3 p-4 hover:bg-[var(--surface-muted)] transition-colors"
                  >
                    <UserAvatar name={item.customer} size="sm" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-sm ${item.unread ? "font-semibold text-[var(--text)]" : "font-medium text-[var(--text)]"}`}>
                          {item.customer}
                        </span>
                        {item.unread && <span className="h-2 w-2 rounded-full bg-[var(--primary)]" />}
                        <Badge variant="outline">{item.type}</Badge>
                      </div>
                      <div className="text-sm text-[var(--text)] mt-0.5">{item.subject}</div>
                      <div className="text-xs text-[var(--text-muted)] mt-0.5 line-clamp-1">{truncate(item.preview, 120)}</div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-[11px] text-[var(--text-subtle)]">
                        {formatRelativeTime(item.date)}
                      </div>
                      <div className="mt-1">
                        <StatusBadge status={item.status} />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
