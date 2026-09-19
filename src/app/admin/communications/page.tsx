"use client";

import React from "react";
import { PhoneCall, Phone, Mail, MessageCircle, Plus, Filter } from "lucide-react";
import { Card, Button, PageHeader, Badge, EmptyState } from "@/components/ui";
import { communications } from "@/lib/mock-data";
import { formatRelativeTime } from "@/lib/utils";

export default function CommunicationsPage() {
  const typeIcons: Record<string, React.ElementType> = {
    phone: Phone,
    email: Mail,
    whatsapp: MessageCircle,
    sms: MessageCircle,
    visit: PhoneCall,
    note: PhoneCall,
  };

  return (
    <div>
      <PageHeader
        title="Communications"
        description="Log of all customer interactions"
        breadcrumbs={[{ label: "Dashboard", href: "/admin/dashboard" }, { label: "Communications" }]}
        actions={
          <Button size="sm" leftIcon={<Plus className="h-3.5 w-3.5" />}>Log Communication</Button>
        }
      />

      <Card padding="none">
        <div className="divide-y divide-[var(--border)]">
          {communications.map((c) => {
            const Icon = typeIcons[c.type] || PhoneCall;
            return (
              <div key={c.id} className="flex items-start gap-3 p-4 hover:bg-[var(--surface-muted)]">
                <div className="h-9 w-9 rounded-md bg-[var(--surface-muted)] flex items-center justify-center shrink-0">
                  <Icon className="h-4 w-4 text-[var(--primary)]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-[var(--text)]">{c.customerName}</span>
                    <Badge variant="outline">{c.type}</Badge>
                    <Badge variant={c.direction === "inbound" ? "info" : "default"}>
                      {c.direction}
                    </Badge>
                  </div>
                  {c.subject && <div className="text-sm text-[var(--text)] mt-1 font-medium">{c.subject}</div>}
                  <div className="text-sm text-[var(--text-muted)] mt-1">{c.summary}</div>
                  <div className="text-[11px] text-[var(--text-subtle)] mt-1">
                    {c.staffName && `By ${c.staffName} · `}{formatRelativeTime(c.occurredAt)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
