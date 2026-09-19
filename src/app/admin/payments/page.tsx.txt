"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { CreditCard, Plus, Download, Calendar } from "lucide-react";
import { Card, Input, Select, Button, StatusBadge, PageHeader, Badge, EmptyState } from "@/components/ui";
import { payments, projects } from "@/lib/mock-data";
import { formatDate, formatCurrency } from "@/lib/utils";

export default function PaymentsPage() {
  const [statusFilter, setStatusFilter] = useState("");
  const totalPaid = payments.filter((p) => p.status === "paid").reduce((s, p) => s + parseFloat(p.amount), 0);
  const totalPending = payments.filter((p) => p.status === "pending").reduce((s, p) => s + parseFloat(p.amount), 0);

  const filtered = payments.filter((p) => !statusFilter || p.status === statusFilter);

  return (
    <div>
      <PageHeader
        title="Payments"
        description="Track customer payments and outstanding balances."
        breadcrumbs={[{ label: "Dashboard", href: "/admin/dashboard" }, { label: "Payments" }]}
        actions={
          <>
            <Button variant="outline" size="sm" leftIcon={<Download className="h-3.5 w-3.5" />}>Export</Button>
            <Button size="sm" leftIcon={<Plus className="h-3.5 w-3.5" />}>Record Payment</Button>
          </>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
        <Card padding="md">
          <div className="text-xs text-[var(--text-muted)] uppercase tracking-wider">Total Received</div>
          <div className="text-2xl font-bold text-[var(--success)] mt-1">{formatCurrency(totalPaid)}</div>
          <div className="text-[11px] text-[var(--text-subtle)] mt-1">{payments.filter((p) => p.status === "paid").length} payments</div>
        </Card>
        <Card padding="md">
          <div className="text-xs text-[var(--text-muted)] uppercase tracking-wider">Pending</div>
          <div className="text-2xl font-bold text-[var(--warning)] mt-1">{formatCurrency(totalPending)}</div>
          <div className="text-[11px] text-[var(--text-subtle)] mt-1">{payments.filter((p) => p.status === "pending").length} pending</div>
        </Card>
        <Card padding="md">
          <div className="text-xs text-[var(--text-muted)] uppercase tracking-wider">This Month</div>
          <div className="text-2xl font-bold text-[var(--primary)] mt-1">{formatCurrency(totalPaid * 0.3)}</div>
          <div className="text-[11px] text-[var(--text-subtle)] mt-1">Collected so far</div>
        </Card>
      </div>

      <Card padding="none">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[var(--surface-muted)] border-b border-[var(--border)]">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--text-subtle)]">Payment #</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--text-subtle)]">Customer</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--text-subtle)] hidden md:table-cell">Project</th>
                <th className="text-right px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--text-subtle)]">Amount</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--text-subtle)]">Method</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--text-subtle)]">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--text-subtle)] hidden lg:table-cell">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-[var(--surface-muted)]">
                  <td className="px-4 py-3 font-mono text-xs text-[var(--primary)] font-semibold">{p.number}</td>
                  <td className="px-4 py-3">
                    <Link href={`/admin/customers/${p.customerId}`} className="font-medium text-[var(--text)] hover:underline">
                      {p.customerName}
                    </Link>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell text-[var(--text-muted)] text-sm">{p.projectName || "—"}</td>
                  <td className="px-4 py-3 text-right font-bold text-[var(--text)]">{formatCurrency(p.amount)}</td>
                  <td className="px-4 py-3"><Badge variant="outline">{p.method}</Badge></td>
                  <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
                  <td className="px-4 py-3 hidden lg:table-cell text-xs text-[var(--text-muted)]">{formatDate(p.paymentDate)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
