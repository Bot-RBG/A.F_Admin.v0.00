"use client";

import React from "react";
import { Activity as ActivityIcon, Filter, Download } from "lucide-react";
import { Card, Button, PageHeader, UserAvatar, Badge, EmptyState } from "@/components/ui";
import { activityLogs } from "@/lib/mock-data";
import { formatDateTime, formatRelativeTime } from "@/lib/utils";

export default function ActivityPage() {
  const actionColors: Record<string, string> = {
    "user.login": "bg-[var(--info-bg)] text-[var(--info)]",
    "customer.created": "bg-[var(--success-bg)] text-[var(--success)]",
    "enquiry.created": "bg-[var(--info-bg)] text-[var(--info)]",
    "enquiry.status_changed": "bg-[var(--warning-bg)] text-[var(--warning)]",
    "quotation.sent": "bg-[var(--primary)]/10 text-[var(--primary)]",
    "quotation.accepted": "bg-[var(--success-bg)] text-[var(--success)]",
    "payment.recorded": "bg-[var(--success-bg)] text-[var(--success)]",
    "project.status_changed": "bg-[var(--accent)]/10 text-[var(--accent)]",
    "task.completed": "bg-[var(--success-bg)] text-[var(--success)]",
    "document.uploaded": "bg-[var(--info-bg)] text-[var(--info)]",
  };

  const logs = [...activityLogs].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div>
      <PageHeader
        title="Activity Log"
        description="Audit trail of all important actions in the system."
        breadcrumbs={[{ label: "Dashboard", href: "/admin/dashboard" }, { label: "Activity" }]}
        actions={
          <>
            <Button variant="outline" size="sm" leftIcon={<Filter className="h-3.5 w-3.5" />}>Filter</Button>
            <Button variant="outline" size="sm" leftIcon={<Download className="h-3.5 w-3.5" />}>Export</Button>
          </>
        }
      />

      <Card padding="none">
        <div className="divide-y divide-[var(--border)]">
          {logs.map((log) => (
            <div key={log.id} className="flex items-start gap-3 p-4 hover:bg-[var(--surface-muted)]">
              <UserAvatar name={log.userName || "System"} size="sm" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-semibold text-[var(--text)]">{log.userName || "System"}</span>
                  <Badge
                    variant="outline"
                    size="sm"
                    className={actionColors[log.action] || ""}
                  >
                    {log.action.replace(/\./g, " ")}
                  </Badge>
                </div>
                <div className="text-sm text-[var(--text-muted)] mt-1">
                  {log.description}
                </div>
                <div className="flex items-center gap-3 mt-1.5 text-[11px] text-[var(--text-subtle)]">
                  <span>{formatRelativeTime(log.createdAt)}</span>
                  <span className="hidden md:inline">·</span>
                  <span className="hidden md:inline">{formatDateTime(log.createdAt)}</span>
                  {log.resourceType && (
                    <>
                      <span>·</span>
                      <span className="capitalize">{log.resourceType}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
