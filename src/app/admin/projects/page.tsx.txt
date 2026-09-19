"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { Search, Plus, FolderKanban, Download } from "lucide-react";
import { Card, Input, Select, Button, StatusBadge, UserAvatar, PageHeader, EmptyState } from "@/components/ui";
import { projects } from "@/lib/mock-data";
import { formatDate, formatCurrency } from "@/lib/utils";

export default function ProjectsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [view, setView] = useState<"grid" | "list">("grid");

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      const s = search.toLowerCase();
      return (
        (!s || p.name.toLowerCase().includes(s) || p.number.toLowerCase().includes(s) || p.customerName.toLowerCase().includes(s)) &&
        (!statusFilter || p.status === statusFilter)
      );
    });
  }, [search, statusFilter]);

  return (
    <div>
      <PageHeader
        title="Projects"
        description={`${projects.length} total · ${projects.filter((p) => p.status === "completed").length} completed`}
        breadcrumbs={[{ label: "Dashboard", href: "/admin/dashboard" }, { label: "Projects" }]}
        actions={
          <>
            <Button variant="outline" size="sm" leftIcon={<Download className="h-3.5 w-3.5" />}>Export</Button>
            <Button size="sm" leftIcon={<Plus className="h-3.5 w-3.5" />}>New Project</Button>
          </>
        }
      />

      <Card padding="md" className="mb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Input placeholder="Search projects..." value={search} onChange={(e) => setSearch(e.target.value)} leftIcon={<Search className="h-4 w-4" />} />
          <Select
            options={[
              { value: "planning", label: "Planning" },
              { value: "design", label: "Design" },
              { value: "measurement", label: "Measurement" },
              { value: "procurement", label: "Procurement" },
              { value: "manufacturing", label: "Manufacturing" },
              { value: "installation", label: "Installation" },
              { value: "completed", label: "Completed" },
            ]}
            placeholder="All statuses"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          />
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map((p) => (
          <Link key={p.id} href={`/admin/projects/${p.id}`}>
            <Card padding="md" hover className="h-full">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0">
                  <div className="font-mono text-[10px] text-[var(--primary)] font-semibold">{p.number}</div>
                  <div className="font-semibold text-[var(--text)] text-sm mt-0.5 truncate">{p.name}</div>
                </div>
                <StatusBadge status={p.status} />
              </div>

              <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] mb-3">
                <UserAvatar name={p.customerName} size="xs" />
                <span className="truncate">{p.customerName}</span>
              </div>

              {p.location && (
                <div className="text-xs text-[var(--text-subtle)] mb-2 truncate">📍 {p.location}</div>
              )}

              {/* Progress bar */}
              <div className="mt-3">
                <div className="flex justify-between text-[10px] text-[var(--text-subtle)] mb-1">
                  <span>Progress</span>
                  <span className="font-semibold">{p.progress}%</span>
                </div>
                <div className="h-1.5 bg-[var(--border)] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[var(--primary)] to-[var(--accent)]"
                    style={{ width: `${p.progress}%` }}
                  />
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-[var(--border)] flex items-center justify-between text-xs">
                <div className="text-[var(--text-muted)]">
                  {p.value && <span className="font-bold text-[var(--primary)]">{formatCurrency(p.value)}</span>}
                </div>
                <div className="text-[var(--text-subtle)]">
                  {p.expectedCompletion && <span>Due {formatDate(p.expectedCompletion)}</span>}
                </div>
              </div>
            </Card>
          </Link>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full">
            <EmptyState icon={<FolderKanban className="h-12 w-12" />} title="No projects found" />
          </div>
        )}
      </div>
    </div>
  );
}
