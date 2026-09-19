"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { Search, Plus, Download, FileText, MoreVertical } from "lucide-react";
import { Card, Input, Select, Button, StatusBadge, PageHeader, Badge, Dropdown, EmptyState } from "@/components/ui";
import { quotations, customers } from "@/lib/mock-data";
import { formatDate, formatCurrency, truncate } from "@/lib/utils";

export default function QuotationsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const filtered = useMemo(() => {
    return quotations.filter((q) => {
      const s = search.toLowerCase();
      return (
        (!s || q.number.toLowerCase().includes(s) || q.customerName.toLowerCase().includes(s) || (q.projectName || "").toLowerCase().includes(s)) &&
        (!statusFilter || q.status === statusFilter)
      );
    });
  }, [search, statusFilter]);

  return (
    <div>
      <PageHeader
        title="Quotations"
        description={`${quotations.length} total · ${quotations.filter((q) => q.status === "accepted").length} accepted`}
        breadcrumbs={[{ label: "Dashboard", href: "/admin/dashboard" }, { label: "Quotations" }]}
        actions={
          <>
            <Button variant="outline" size="sm" leftIcon={<Download className="h-3.5 w-3.5" />}>Export</Button>
            <Link href="/admin/quotations/new">
              <Button size="sm" leftIcon={<Plus className="h-3.5 w-3.5" />}>New Quotation</Button>
            </Link>
          </>
        }
      />

      <Card padding="md" className="mb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Input
            placeholder="Search by number, customer, project..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search className="h-4 w-4" />}
          />
          <Select
            options={[
              { value: "draft", label: "Draft" },
              { value: "sent", label: "Sent" },
              { value: "viewed", label: "Viewed" },
              { value: "negotiation", label: "Negotiation" },
              { value: "accepted", label: "Accepted" },
              { value: "rejected", label: "Rejected" },
              { value: "expired", label: "Expired" },
            ]}
            placeholder="All statuses"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          />
        </div>
      </Card>

      <Card padding="none">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[var(--surface-muted)] border-b border-[var(--border)]">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--text-subtle)]">Quote #</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--text-subtle)]">Customer</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--text-subtle)] hidden md:table-cell">Project</th>
                <th className="text-right px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--text-subtle)]">Amount</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--text-subtle)]">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--text-subtle)] hidden lg:table-cell">Created</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--text-subtle)] hidden lg:table-cell">Valid Until</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {filtered.map((q) => (
                <tr key={q.id} className="hover:bg-[var(--surface-muted)]">
                  <td className="px-4 py-3">
                    <Link href="/admin/quotations" className="font-mono text-xs font-semibold text-[var(--primary)]">
                      {q.number}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <Link href={`/admin/customers/${q.customerId}`} className="text-sm font-medium text-[var(--text)] hover:underline">
                      {q.customerName}
                    </Link>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell text-sm text-[var(--text-muted)]">
                    {q.projectName || "—"}
                  </td>
                  <td className="px-4 py-3 text-right text-sm font-bold text-[var(--text)]">
                    {formatCurrency(q.total)}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={q.status} />
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell text-xs text-[var(--text-muted)]">
                    {formatDate(q.createdAt)}
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell text-xs text-[var(--text-muted)]">
                    {q.validUntil ? formatDate(q.validUntil) : "—"}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7}>
                    <EmptyState icon={<FileText className="h-10 w-10" />} title="No quotations found" />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
