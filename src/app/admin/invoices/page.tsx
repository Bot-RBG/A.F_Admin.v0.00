"use client";

import React from "react";
import Link from "next/link";
import { Receipt, Plus, Download } from "lucide-react";
import { Card, Button, StatusBadge, PageHeader, Badge, EmptyState } from "@/components/ui";
import { invoices } from "@/lib/mock-data";
import { formatDate, formatCurrency } from "@/lib/utils";

export default function InvoicesPage() {
  return (
    <div>
      <PageHeader
        title="Invoices"
        description={`${invoices.length} total · ${invoices.filter((i) => i.status === "paid").length} paid`}
        breadcrumbs={[{ label: "Dashboard", href: "/admin/dashboard" }, { label: "Invoices" }]}
        actions={
          <>
            <Button variant="outline" size="sm" leftIcon={<Download className="h-3.5 w-3.5" />}>Export</Button>
            <Button size="sm" leftIcon={<Plus className="h-3.5 w-3.5" />}>New Invoice</Button>
          </>
        }
      />

      <Card padding="none">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[var(--surface-muted)] border-b border-[var(--border)]">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--text-subtle)]">Invoice #</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--text-subtle)]">Customer</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--text-subtle)] hidden md:table-cell">Project</th>
                <th className="text-right px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--text-subtle)]">Total</th>
                <th className="text-right px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--text-subtle)] hidden lg:table-cell">Paid</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--text-subtle)]">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--text-subtle)] hidden lg:table-cell">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {invoices.map((i) => (
                <tr key={i.id} className="hover:bg-[var(--surface-muted)]">
                  <td className="px-4 py-3 font-mono text-xs text-[var(--primary)] font-semibold">{i.number}</td>
                  <td className="px-4 py-3">
                    <Link href={`/admin/customers/${i.customerId}`} className="font-medium text-[var(--text)] hover:underline">
                      {i.customerName}
                    </Link>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell text-[var(--text-muted)] text-sm">{i.projectName || "—"}</td>
                  <td className="px-4 py-3 text-right font-bold text-[var(--text)]">{formatCurrency(i.total)}</td>
                  <td className="px-4 py-3 text-right text-[var(--text-muted)] hidden lg:table-cell">{formatCurrency(i.amountPaid)}</td>
                  <td className="px-4 py-3"><StatusBadge status={i.status} /></td>
                  <td className="px-4 py-3 hidden lg:table-cell text-xs text-[var(--text-muted)]">{formatDate(i.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
