"use client";

import React, { useState } from "react";
import { ListChecks, Plus, Calendar, User } from "lucide-react";
import { Card, Button, StatusBadge, UserAvatar, PageHeader, Tabs, EmptyState } from "@/components/ui";
import { tasks } from "@/lib/mock-data";
import { formatDate } from "@/lib/utils";
import type { TaskStatus } from "@/lib/types";

export default function TasksPage() {
  const [view, setView] = useState<"list" | "kanban">("kanban");

  const kanbanColumns: Array<{ id: TaskStatus; label: string }> = [
    { id: "pending", label: "Pending" },
    { id: "in_progress", label: "In Progress" },
    { id: "completed", label: "Completed" },
    { id: "cancelled", label: "Cancelled" },
  ];

  return (
    <div>
      <PageHeader
        title="Tasks"
        description={`${tasks.filter((t) => t.status !== "completed" && t.status !== "cancelled").length} active tasks`}
        breadcrumbs={[{ label: "Dashboard", href: "/admin/dashboard" }, { label: "Tasks" }]}
        actions={
          <>
            <div className="flex items-center gap-1 bg-[var(--surface-muted)] rounded-md p-0.5">
              <button
                onClick={() => setView("list")}
                className={`px-3 py-1 text-xs font-medium rounded ${view === "list" ? "bg-[var(--surface)] shadow-sm text-[var(--text)]" : "text-[var(--text-muted)]"}`}
              >
                List
              </button>
              <button
                onClick={() => setView("kanban")}
                className={`px-3 py-1 text-xs font-medium rounded ${view === "kanban" ? "bg-[var(--surface)] shadow-sm text-[var(--text)]" : "text-[var(--text-muted)]"}`}
              >
                Kanban
              </button>
            </div>
            <Button size="sm" leftIcon={<Plus className="h-3.5 w-3.5" />}>New Task</Button>
          </>
        }
      />

      {view === "list" ? (
        <Card padding="none">
          <div className="divide-y divide-[var(--border)]">
            {tasks.map((t) => (
              <div key={t.id} className="flex items-center gap-3 p-4 hover:bg-[var(--surface-muted)]">
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-[var(--text)]">{t.name}</div>
                  <div className="flex items-center gap-3 mt-1 text-xs text-[var(--text-muted)]">
                    {t.projectName && <span>{t.projectName}</span>}
                    {t.customerName && <span>{t.customerName}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-[var(--text-subtle)]">
                  <Calendar className="h-3 w-3" />
                  {formatDate(t.dueDate)}
                </div>
                {t.assignedUserName && <UserAvatar name={t.assignedUserName} size="xs" />}
                <StatusBadge status={t.priority} />
                <StatusBadge status={t.status} />
              </div>
            ))}
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {kanbanColumns.map((col) => {
            const columnTasks = tasks.filter((t) => t.status === col.id);
            return (
              <div key={col.id} className="bg-[var(--surface-muted)] rounded-lg p-3">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                    {col.label}
                  </h3>
                  <span className="text-xs font-bold text-[var(--text)]">{columnTasks.length}</span>
                </div>
                <div className="space-y-2">
                  {columnTasks.map((t) => (
                    <Card key={t.id} padding="sm" className="!p-3">
                      <div className="text-sm font-medium text-[var(--text)] mb-2">{t.name}</div>
                      {t.customerName && (
                        <div className="text-xs text-[var(--text-muted)] mb-2 truncate">
                          {t.customerName}
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <StatusBadge status={t.priority} />
                        <div className="flex items-center gap-1 text-[10px] text-[var(--text-subtle)]">
                          <Calendar className="h-2.5 w-2.5" />
                          {formatDate(t.dueDate)}
                        </div>
                      </div>
                      {t.assignedUserName && (
                        <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-[var(--border)]">
                          <UserAvatar name={t.assignedUserName} size="xs" />
                          <span className="text-[11px] text-[var(--text-muted)] truncate">
                            {t.assignedUserName}
                          </span>
                        </div>
                      )}
                    </Card>
                  ))}
                  {columnTasks.length === 0 && (
                    <div className="text-center py-6 text-xs text-[var(--text-subtle)] italic">
                      No tasks
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
