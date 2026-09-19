"use client";

import React from "react";
import { Shield, Users, Edit, Check, X, Plus } from "lucide-react";
import { Card, CardHeader, CardTitle, Button, PageHeader, Badge, EmptyState } from "@/components/ui";

const ROLES = [
  {
    id: "r1",
    name: "Super Admin",
    description: "Full access to all features and settings",
    permissions: ["all"],
    userCount: 1,
    color: "bg-[var(--danger)]/10 text-[var(--danger)]",
  },
  {
    id: "r2",
    name: "Admin",
    description: "Business management access",
    permissions: ["customers", "enquiries", "quotations", "projects", "tasks", "payments", "invoices", "reports"],
    userCount: 1,
    color: "bg-[var(--primary)]/10 text-[var(--primary)]",
  },
  {
    id: "r3",
    name: "Sales Staff",
    description: "Manage customers and enquiries",
    permissions: ["customers", "enquiries", "quotations"],
    userCount: 1,
    color: "bg-[var(--accent)]/10 text-[var(--accent)]",
  },
  {
    id: "r4",
    name: "Accountant",
    description: "Financial management access",
    permissions: ["payments", "invoices", "reports"],
    userCount: 1,
    color: "bg-[var(--success)]/10 text-[var(--success)]",
  },
  {
    id: "r5",
    name: "Workshop Lead",
    description: "Assigned projects and tasks only",
    permissions: ["tasks", "projects"],
    userCount: 1,
    color: "bg-[var(--info)]/10 text-[var(--info)]",
  },
  {
    id: "r6",
    name: "Viewer",
    description: "Read-only access",
    permissions: ["view"],
    userCount: 0,
    color: "bg-[var(--surface-muted)] text-[var(--text-muted)]",
  },
];

const ALL_PERMISSIONS = [
  "customers",
  "enquiries",
  "quotations",
  "projects",
  "tasks",
  "payments",
  "invoices",
  "documents",
  "communications",
  "reports",
  "website",
  "users",
  "settings",
];

export default function RolesPage() {
  return (
    <div>
      <PageHeader
        title="Roles & Permissions"
        description="Define what each role can access."
        breadcrumbs={[{ label: "Dashboard", href: "/admin/dashboard" }, { label: "Roles" }]}
        actions={
          <Button size="sm" leftIcon={<Plus className="h-3.5 w-3.5" />}>New Role</Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {ROLES.map((role) => (
          <Card key={role.id} padding="md">
            <div className="flex items-start justify-between mb-3">
              <div className={`h-10 w-10 rounded-md flex items-center justify-center ${role.color}`}>
                <Shield className="h-5 w-5" />
              </div>
              <Button variant="outline" size="sm" leftIcon={<Edit className="h-3.5 w-3.5" />}>Edit</Button>
            </div>
            <div className="mb-2">
              <div className="text-base font-semibold text-[var(--text)]">{role.name}</div>
              <div className="text-xs text-[var(--text-muted)] mt-0.5">{role.description}</div>
            </div>
            <div className="text-xs text-[var(--text-subtle)] mb-3">
              {role.userCount} user{role.userCount !== 1 ? "s" : ""}
            </div>
            <div className="pt-3 border-t border-[var(--border)]">
              <div className="text-[10px] font-semibold text-[var(--text-subtle)] uppercase tracking-wider mb-2">
                Permissions
              </div>
              <div className="flex flex-wrap gap-1">
                {role.permissions.map((p) => (
                  <Badge key={p} variant="outline" size="sm">
                    {p}
                  </Badge>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card padding="md" className="mt-6">
        <CardHeader>
          <CardTitle>Permission Matrix</CardTitle>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className="text-left py-2 pr-4 text-xs font-semibold text-[var(--text-subtle)] uppercase">Permission</th>
                {ROLES.slice(0, 5).map((r) => (
                  <th key={r.id} className="text-center px-3 py-2 text-xs font-semibold text-[var(--text-subtle)] uppercase">
                    {r.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {ALL_PERMISSIONS.map((perm) => (
                <tr key={perm}>
                  <td className="py-2 pr-4 text-[var(--text)] capitalize">{perm}</td>
                  {ROLES.slice(0, 5).map((r) => {
                    const has = r.permissions.includes("all") || r.permissions.includes(perm);
                    return (
                      <td key={r.id} className="text-center px-3 py-2">
                        {has ? (
                          <Check className="h-4 w-4 text-[var(--success)] mx-auto" />
                        ) : (
                          <X className="h-4 w-4 text-[var(--text-subtle)] mx-auto" />
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
