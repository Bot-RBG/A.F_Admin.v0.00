"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import {
  Search,
  Plus,
  Filter,
  MoreVertical,
  Download,
  Phone,
  Mail,
} from "lucide-react";
import {
  Card,
  Input,
  Select,
  Button,
  StatusBadge,
  UserAvatar,
  PageHeader,
  Badge,
  Dropdown,
  EmptyState,
} from "@/components/ui";
import { enquiries, users, customers } from "@/lib/mock-data";
import type { EnquiryStatus, Priority } from "@/lib/types";
import { formatDate, formatRelativeTime, truncate } from "@/lib/utils";

export default function EnquiriesPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [priorityFilter, setPriorityFilter] = useState<string>("");
  const [assignedFilter, setAssignedFilter] = useState<string>("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const filtered = useMemo(() => {
    return enquiries.filter((e) => {
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        e.number.toLowerCase().includes(q) ||
        e.customerName.toLowerCase().includes(q) ||
        e.service.toLowerCase().includes(q) ||
        e.requirement.toLowerCase().includes(q);
      const matchesStatus = !statusFilter || e.status === statusFilter;
      const matchesPriority = !priorityFilter || e.priority === priorityFilter;
      const matchesAssigned =
        !assignedFilter || e.assignedUserId === assignedFilter;
      return matchesSearch && matchesStatus && matchesPriority && matchesAssigned;
    });
  }, [search, statusFilter, priorityFilter, assignedFilter]);

  const sorted = useMemo(
    () =>
      [...filtered].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),
    [filtered]
  );

  const paginated = sorted.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.ceil(sorted.length / pageSize);

  const statusCounts = enquiries.reduce(
    (acc, e) => {
      acc[e.status] = (acc[e.status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return (
    <div>
      <PageHeader
        title="Enquiries"
        description={`${enquiries.length} total · ${statusCounts.new || 0} new · ${statusCounts.approved || 0} converted`}
        breadcrumbs={[
          { label: "Dashboard", href: "/admin/dashboard" },
          { label: "Enquiries" },
        ]}
        actions={
          <>
            <Button variant="outline" size="sm" leftIcon={<Download className="h-3.5 w-3.5" />}>
              Export
            </Button>
            <Link href="/admin/enquiries">
              <Button size="sm" leftIcon={<Plus className="h-3.5 w-3.5" />}>
                New Enquiry
              </Button>
            </Link>
          </>
        }
      />

      {/* Filters */}
      <Card padding="md" className="mb-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <Input
            placeholder="Search by ID, customer, service..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            leftIcon={<Search className="h-4 w-4" />}
          />
          <Select
            options={[
              { value: "new", label: `New (${statusCounts.new || 0})` },
              { value: "contacted", label: `Contacted (${statusCounts.contacted || 0})` },
              { value: "followup", label: `Follow-up (${statusCounts.followup || 0})` },
              { value: "quoted", label: `Quoted (${statusCounts.quoted || 0})` },
              { value: "negotiation", label: `Negotiation (${statusCounts.negotiation || 0})` },
              { value: "approved", label: `Approved (${statusCounts.approved || 0})` },
              { value: "rejected", label: `Rejected (${statusCounts.rejected || 0})` },
              { value: "completed", label: `Completed (${statusCounts.completed || 0})` },
            ]}
            placeholder="All statuses"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
          />
          <Select
            options={[
              { value: "low", label: "Low" },
              { value: "medium", label: "Medium" },
              { value: "high", label: "High" },
              { value: "urgent", label: "Urgent" },
            ]}
            placeholder="All priorities"
            value={priorityFilter}
            onChange={(e) => {
              setPriorityFilter(e.target.value);
              setPage(1);
            }}
          />
          <Select
            options={users.map((u) => ({ value: u.id, label: u.name }))}
            placeholder="All staff"
            value={assignedFilter}
            onChange={(e) => {
              setAssignedFilter(e.target.value);
              setPage(1);
            }}
          />
        </div>
      </Card>

      {/* Table */}
      <Card padding="none">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[var(--surface-muted)] border-b border-[var(--border)]">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--text-subtle)]">
                  Enquiry
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--text-subtle)]">
                  Customer
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--text-subtle)] hidden lg:table-cell">
                  Service
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--text-subtle)] hidden md:table-cell">
                  Requirement
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--text-subtle)]">
                  Status
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--text-subtle)] hidden xl:table-cell">
                  Assigned
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--text-subtle)] hidden lg:table-cell">
                  Date
                </th>
                <th className="px-4 py-3 w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {paginated.map((enq) => (
                <tr
                  key={enq.id}
                  className="hover:bg-[var(--surface-muted)] transition-colors"
                >
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/enquiries/${enq.id}`}
                      className="block"
                    >
                      <div className="font-mono text-xs text-[var(--primary)] font-semibold">
                        {enq.number}
                      </div>
                      <div className="text-xs text-[var(--text-subtle)] mt-0.5">
                        {formatRelativeTime(enq.createdAt)}
                      </div>
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/enquiries/${enq.id}`}
                      className="flex items-center gap-2"
                    >
                      <UserAvatar name={enq.customerName} size="sm" />
                      <div>
                        <div className="font-medium text-[var(--text)] text-sm">
                          {enq.customerName}
                        </div>
                        <div className="text-xs text-[var(--text-subtle)]">
                          {customers.find((c) => c.id === enq.customerId)?.phone}
                        </div>
                      </div>
                    </Link>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <div className="font-medium text-[var(--text)]">{enq.service}</div>
                    {enq.category && (
                      <div className="text-xs text-[var(--text-subtle)] capitalize mt-0.5">
                        {enq.category}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <div className="text-[var(--text-muted)] text-sm max-w-xs truncate">
                      {truncate(enq.requirement, 80)}
                    </div>
                    {enq.budget && (
                      <div className="text-xs text-[var(--text-subtle)] mt-0.5">
                        Budget: ₹{Number(enq.budget).toLocaleString("en-IN")}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-1">
                      <StatusBadge status={enq.status} />
                      <StatusBadge status={enq.priority} />
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden xl:table-cell">
                    {enq.assignedUserName ? (
                      <div className="flex items-center gap-2">
                        <UserAvatar name={enq.assignedUserName} size="xs" />
                        <span className="text-sm text-[var(--text)]">
                          {enq.assignedUserName}
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs text-[var(--text-subtle)]">
                        Unassigned
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell text-xs text-[var(--text-muted)]">
                    {formatDate(enq.createdAt)}
                    {enq.followUpDate && (
                      <div className="mt-0.5 flex items-center gap-1 text-[var(--warning)]">
                        <span className="text-[10px]">Follow-up:</span>
                        {formatDate(enq.followUpDate)}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <Dropdown
                      align="right"
                      trigger={
                        <button className="p-1 text-[var(--text-subtle)] hover:text-[var(--text)] hover:bg-[var(--surface-muted)] rounded">
                          <MoreVertical className="h-4 w-4" />
                        </button>
                      }
                      items={[
                        {
                          label: "View details",
                          onClick: () => {},
                        },
                        {
                          label: "Call customer",
                          icon: <Phone className="h-3.5 w-3.5" />,
                          onClick: () => {},
                        },
                        {
                          label: "Email customer",
                          icon: <Mail className="h-3.5 w-3.5" />,
                          onClick: () => {},
                        },
                        { divider: true },
                        { label: "Create quotation", onClick: () => {} },
                      ]}
                    />
                  </td>
                </tr>
              ))}
              {paginated.length === 0 && (
                <tr>
                  <td colSpan={8}>
                    <EmptyState
                      icon={<Search className="h-10 w-10" />}
                      title="No enquiries found"
                      description="Try adjusting your filters or search query."
                    />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="px-4 py-3 border-t border-[var(--border)] flex items-center justify-between text-sm">
            <div className="text-xs text-[var(--text-muted)]">
              Showing {(page - 1) * pageSize + 1}–
              {Math.min(page * pageSize, sorted.length)} of {sorted.length}
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Prev
              </Button>
              <span className="px-3 text-xs text-[var(--text-muted)]">
                {page} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
