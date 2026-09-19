"use client";

import React from "react";
import { BarChart3, Download, TrendingUp, Calendar, Users, IndianRupee } from "lucide-react";
import { Card, CardHeader, CardTitle, Button, PageHeader, Badge } from "@/components/ui";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { enquiries, quotations, projects, payments } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";

export default function ReportsPage() {
  const monthlyRevenue = [
    { month: "Aug", value: 245000 },
    { month: "Sep", value: 312000 },
    { month: "Oct", value: 289000 },
    { month: "Nov", value: 421000 },
    { month: "Dec", value: 378000 },
    { month: "Jan", value: 495000 },
  ];

  const reportCategories = [
    {
      title: "Enquiries",
      icon: TrendingUp,
      stats: [
        { label: "Total Enquiries", value: enquiries.length },
        { label: "New (this month)", value: enquiries.filter((e) => e.status === "new").length },
        { label: "Converted", value: enquiries.filter((e) => e.status === "approved").length },
        { label: "Conversion Rate", value: "34%" },
      ],
    },
    {
      title: "Sales",
      icon: IndianRupee,
      stats: [
        { label: "Quotations Created", value: quotations.length },
        { label: "Accepted", value: quotations.filter((q) => q.status === "accepted").length },
        { label: "Total Value", value: formatCurrency(quotations.reduce((s, q) => s + parseFloat(q.total), 0)) },
        { label: "Avg. Value", value: formatCurrency(quotations.reduce((s, q) => s + parseFloat(q.total), 0) / quotations.length) },
      ],
    },
    {
      title: "Projects",
      icon: Calendar,
      stats: [
        { label: "Active", value: projects.filter((p) => !["completed", "cancelled"].includes(p.status)).length },
        { label: "Completed", value: projects.filter((p) => p.status === "completed").length },
        { label: "Total Value", value: formatCurrency(projects.reduce((s, p) => s + parseFloat(p.value || "0"), 0)) },
      ],
    },
    {
      title: "Payments",
      icon: IndianRupee,
      stats: [
        { label: "Total Collected", value: formatCurrency(payments.filter((p) => p.status === "paid").reduce((s, p) => s + parseFloat(p.amount), 0)) },
        { label: "Outstanding", value: formatCurrency(payments.filter((p) => p.status === "pending").reduce((s, p) => s + parseFloat(p.amount), 0)) },
        { label: "Transactions", value: payments.length },
      ],
    },
  ];

  return (
    <div>
      <PageHeader
        title="Reports"
        description="Business intelligence and performance analytics."
        breadcrumbs={[{ label: "Dashboard", href: "/admin/dashboard" }, { label: "Reports" }]}
        actions={
          <>
            <Button variant="outline" size="sm" leftIcon={<Download className="h-3.5 w-3.5" />}>Export CSV</Button>
            <Button variant="outline" size="sm" leftIcon={<Download className="h-3.5 w-3.5" />}>Export PDF</Button>
          </>
        }
      />

      <Card padding="md" className="mb-6">
        <CardHeader>
          <CardTitle>Monthly Revenue</CardTitle>
          <Badge variant="success" size="md">Last 6 months</Badge>
        </CardHeader>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="month" stroke="var(--text-subtle)" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--text-subtle)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
              <Tooltip contentStyle={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: "8px", fontSize: "12px" }} formatter={(v) => formatCurrency(Number(v) || 0)} />
              <Bar dataKey="value" fill="#c48f5c" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reportCategories.map((cat) => {
          const Icon = cat.icon;
          return (
            <Card key={cat.title} padding="md">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-9 w-9 rounded-md bg-[var(--primary)]/10 flex items-center justify-center">
                  <Icon className="h-4 w-4 text-[var(--primary)]" />
                </div>
                <h3 className="text-base font-semibold text-[var(--text)]">{cat.title}</h3>
              </div>
              <div className="space-y-2">
                {cat.stats.map((s) => (
                  <div key={s.label} className="flex justify-between items-center py-1.5 border-b border-[var(--border)] last:border-0">
                    <span className="text-sm text-[var(--text-muted)]">{s.label}</span>
                    <span className="text-sm font-bold text-[var(--text)]">{s.value}</span>
                  </div>
                ))}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
