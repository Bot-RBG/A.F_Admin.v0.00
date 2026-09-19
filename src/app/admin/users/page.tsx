"use client";

import React from "react";
import Link from "next/link";
import { UserCog, Plus, Mail, Phone, Shield } from "lucide-react";
import { Card, Button, StatusBadge, UserAvatar, PageHeader, Badge, EmptyState } from "@/components/ui";
import { users } from "@/lib/mock-data";
import { formatDate, formatRelativeTime } from "@/lib/utils";

export default function UsersPage() {
  return (
    <div>
      <PageHeader
        title="Staff & Users"
        description={`${users.length} team members`}
        breadcrumbs={[{ label: "Dashboard", href: "/admin/dashboard" }, { label: "Staff" }]}
        actions={
          <Button size="sm" leftIcon={<Plus className="h-3.5 w-3.5" />}>Add Staff Member</Button>
        }
      />

      <Card padding="none">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[var(--surface-muted)] border-b border-[var(--border)]">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--text-subtle)]">Name</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--text-subtle)] hidden md:table-cell">Email</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--text-subtle)] hidden lg:table-cell">Phone</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--text-subtle)]">Role</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--text-subtle)]">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--text-subtle)] hidden lg:table-cell">Last Login</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-[var(--surface-muted)]">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <UserAvatar name={u.name} size="sm" imageUrl={u.avatarUrl} />
                      <div>
                        <div className="font-medium text-[var(--text)]">{u.name}</div>
                        <div className="text-xs text-[var(--text-subtle)] md:hidden">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <a href={`mailto:${u.email}`} className="text-[var(--text-muted)] hover:text-[var(--primary)]">
                      {u.email}
                    </a>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell text-[var(--text-muted)]">{u.phone || "—"}</td>
                  <td className="px-4 py-3">
                    <Badge variant="primary">{u.roleName}</Badge>
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={u.status} /></td>
                  <td className="px-4 py-3 hidden lg:table-cell text-xs text-[var(--text-muted)]">
                    {u.lastLoginAt ? formatRelativeTime(u.lastLoginAt) : "Never"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
