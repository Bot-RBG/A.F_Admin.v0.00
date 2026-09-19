"use client";

import React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Calendar, MapPin, User, FolderKanban, Edit } from "lucide-react";
import { Card, CardHeader, CardTitle, Button, StatusBadge, UserAvatar, PageHeader, EmptyState } from "@/components/ui";
import { projects, tasks, customers } from "@/lib/mock-data";
import { formatDate, formatCurrency } from "@/lib/utils";

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const project = projects.find((p) => p.id === id);
  const customer = project ? customers.find((c) => c.id === project.customerId) : null;
  const projectTasks = tasks.filter((t) => t.projectId === id);

  if (!project) {
    return (
      <div>
        <PageHeader title="Project not found" />
        <EmptyState icon={<FolderKanban className="h-12 w-12" />} title="Project not found" action={<Link href="/admin/projects"><Button>Back to Projects</Button></Link>} />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title={project.name}
        description={project.number}
        breadcrumbs={[
          { label: "Dashboard", href: "/admin/dashboard" },
          { label: "Projects", href: "/admin/projects" },
          { label: project.name },
        ]}
        actions={
          <>
            <Button variant="outline" size="sm" leftIcon={<ArrowLeft className="h-3.5 w-3.5" />} onClick={() => router.back()}>Back</Button>
            <Button variant="outline" size="sm" leftIcon={<Edit className="h-3.5 w-3.5" />}>Edit</Button>
          </>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          {/* Progress */}
          <Card padding="md">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-xs text-[var(--text-subtle)] mb-1">Status</div>
                <StatusBadge status={project.status} size="md" />
              </div>
              <div className="text-right">
                <div className="text-xs text-[var(--text-subtle)] mb-1">Progress</div>
                <div className="text-2xl font-bold text-[var(--primary)]">{project.progress}%</div>
              </div>
            </div>
            <div className="h-3 bg-[var(--border)] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] transition-all"
                style={{ width: `${project.progress}%` }}
              />
            </div>
            <div className="mt-3 grid grid-cols-3 gap-4 text-xs">
              <div>
                <div className="text-[var(--text-subtle)]">Start Date</div>
                <div className="font-semibold text-[var(--text)] mt-0.5">{project.startDate ? formatDate(project.startDate) : "—"}</div>
              </div>
              <div>
                <div className="text-[var(--text-subtle)]">Expected Completion</div>
                <div className="font-semibold text-[var(--text)] mt-0.5">{project.expectedCompletion ? formatDate(project.expectedCompletion) : "—"}</div>
              </div>
              <div>
                <div className="text-[var(--text-subtle)]">Value</div>
                <div className="font-bold text-[var(--primary)] mt-0.5">{project.value ? formatCurrency(project.value) : "—"}</div>
              </div>
            </div>
          </Card>

          {/* Description */}
          {project.description && (
            <Card padding="md">
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <p className="text-sm text-[var(--text-muted)] whitespace-pre-line">{project.description}</p>
            </Card>
          )}

          {/* Tasks */}
          <Card padding="none">
            <div className="px-5 py-4 border-b border-[var(--border)]">
              <CardTitle>Project Tasks</CardTitle>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">{projectTasks.length} tasks</p>
            </div>
            {projectTasks.length === 0 ? (
              <div className="p-6">
                <EmptyState icon={<FolderKanban className="h-10 w-10" />} title="No tasks yet" />
              </div>
            ) : (
              <div className="divide-y divide-[var(--border)]">
                {projectTasks.map((t) => (
                  <div key={t.id} className="flex items-center justify-between p-4">
                    <div>
                      <div className="text-sm font-medium text-[var(--text)]">{t.name}</div>
                      <div className="text-xs text-[var(--text-muted)] mt-0.5">Due {formatDate(t.dueDate)}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusBadge status={t.priority} />
                      <StatusBadge status={t.status} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <Card padding="md">
            <CardHeader>
              <CardTitle>Customer</CardTitle>
            </CardHeader>
            {customer && (
              <Link href={`/admin/customers/${customer.id}`} className="block">
                <div className="flex items-center gap-3 mb-3">
                  <UserAvatar name={customer.name} size="md" />
                  <div>
                    <div className="font-semibold text-[var(--text)]">{customer.name}</div>
                    <div className="text-xs text-[var(--text-muted)]">{customer.phone}</div>
                  </div>
                </div>
              </Link>
            )}
          </Card>

          <Card padding="md">
            <CardHeader>
              <CardTitle>Project Info</CardTitle>
            </CardHeader>
            <div className="space-y-2 text-sm">
              {project.location && (
                <div className="flex items-center gap-2 text-[var(--text-muted)]">
                  <MapPin className="h-3.5 w-3.5 text-[var(--text-subtle)]" />
                  {project.location}
                </div>
              )}
              {project.type && (
                <div className="flex items-center gap-2 text-[var(--text-muted)]">
                  <FolderKanban className="h-3.5 w-3.5 text-[var(--text-subtle)]" />
                  <span className="capitalize">{project.type.replace(/_/g, " ")}</span>
                </div>
              )}
              {project.assignedManagerName && (
                <div className="flex items-center gap-2 text-[var(--text-muted)]">
                  <User className="h-3.5 w-3.5 text-[var(--text-subtle)]" />
                  {project.assignedManagerName}
                </div>
              )}
              <div className="flex items-center gap-2 text-[var(--text-muted)]">
                <Calendar className="h-3.5 w-3.5 text-[var(--text-subtle)]" />
                Created {formatDate(project.createdAt)}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
