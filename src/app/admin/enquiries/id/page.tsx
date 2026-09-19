"use client";

import React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  Calendar,
  User,
  FileText,
  MessageSquare,
  Clock,
  Plus,
  Edit,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  Button,
  StatusBadge,
  UserAvatar,
  PageHeader,
  Badge,
  Tabs,
  EmptyState,
} from "@/components/ui";
import { enquiries, customers, users, quotations, activityLogs } from "@/lib/mock-data";
import { formatDate, formatCurrency, formatRelativeTime } from "@/lib/utils";

export default function EnquiryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const enquiry = enquiries.find((e) => e.id === id);
  const customer = enquiry ? customers.find((c) => c.id === enquiry.customerId) : null;
  const relatedQuotations = quotations.filter((q) => q.enquiryId === id);
  const logs = activityLogs
    .filter((l) => l.resourceType === "enquiry" && l.resourceId === id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  if (!enquiry || !customer) {
    return (
      <div>
        <PageHeader
          title="Enquiry not found"
          breadcrumbs={[
            { label: "Dashboard", href: "/admin/dashboard" },
            { label: "Enquiries", href: "/admin/enquiries" },
            { label: "Not Found" },
          ]}
        />
        <EmptyState
          icon={<MessageSquare className="h-12 w-12" />}
          title="Enquiry not found"
          description="The enquiry you're looking for doesn't exist or has been removed."
          action={
            <Link href="/admin/enquiries">
              <Button>Back to Enquiries</Button>
            </Link>
          }
        />
      </div>
    );
  }

  const assignedUser = users.find((u) => u.id === enquiry.assignedUserId);

  return (
    <div>
      <PageHeader
        title={enquiry.number}
        description={`${enquiry.service} · ${enquiry.customerName}`}
        breadcrumbs={[
          { label: "Dashboard", href: "/admin/dashboard" },
          { label: "Enquiries", href: "/admin/enquiries" },
          { label: enquiry.number },
        ]}
        actions={
          <>
            <Button
              variant="outline"
              size="sm"
              leftIcon={<ArrowLeft className="h-3.5 w-3.5" />}
              onClick={() => router.back()}
            >
              Back
            </Button>
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Edit className="h-3.5 w-3.5" />}
            >
              Edit
            </Button>
            <Link href="/admin/quotations/new">
              <Button size="sm" leftIcon={<FileText className="h-3.5 w-3.5" />}>
                Create Quotation
              </Button>
            </Link>
          </>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left column — main content */}
        <div className="lg:col-span-2 space-y-4">
          {/* Status & Priority */}
          <Card padding="md">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <div>
                  <div className="text-xs text-[var(--text-subtle)] mb-1">Status</div>
                  <StatusBadge status={enquiry.status} size="md" />
                </div>
                <div>
                  <div className="text-xs text-[var(--text-subtle)] mb-1">Priority</div>
                  <StatusBadge status={enquiry.priority} size="md" />
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-[var(--text-subtle)] mb-1">Created</div>
                <div className="text-sm font-semibold text-[var(--text)]">
                  {formatDate(enquiry.createdAt)}
                </div>
                <div className="text-xs text-[var(--text-muted)]">
                  {formatRelativeTime(enquiry.createdAt)}
                </div>
              </div>
            </div>
          </Card>

          {/* Requirement */}
          <Card padding="md">
            <CardHeader>
              <CardTitle>Requirement Details</CardTitle>
            </CardHeader>
            <div className="space-y-4">
              <div>
                <div className="text-xs font-semibold text-[var(--text-subtle)] uppercase tracking-wider mb-1">
                  Service
                </div>
                <div className="text-sm text-[var(--text)] font-medium">{enquiry.service}</div>
              </div>
              <div>
                <div className="text-xs font-semibold text-[var(--text-subtle)] uppercase tracking-wider mb-1">
                  Requirement
                </div>
                <div className="text-sm text-[var(--text)]">{enquiry.requirement}</div>
              </div>
              {enquiry.description && (
                <div>
                  <div className="text-xs font-semibold text-[var(--text-subtle)] uppercase tracking-wider mb-1">
                    Description
                  </div>
                  <div className="text-sm text-[var(--text-muted)] whitespace-pre-line">
                    {enquiry.description}
                  </div>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-[var(--border)]">
                {enquiry.dimensions && (
                  <div>
                    <div className="text-xs text-[var(--text-subtle)]">Dimensions</div>
                    <div className="text-sm text-[var(--text)]">{enquiry.dimensions}</div>
                  </div>
                )}
                {enquiry.material && (
                  <div>
                    <div className="text-xs text-[var(--text-subtle)]">Material</div>
                    <div className="text-sm text-[var(--text)]">{enquiry.material}</div>
                  </div>
                )}
                {enquiry.designPreference && (
                  <div>
                    <div className="text-xs text-[var(--text-subtle)]">Design Preference</div>
                    <div className="text-sm text-[var(--text)]">{enquiry.designPreference}</div>
                  </div>
                )}
                {enquiry.budget && (
                  <div>
                    <div className="text-xs text-[var(--text-subtle)]">Budget</div>
                    <div className="text-sm text-[var(--text)] font-semibold">
                      {formatCurrency(enquiry.budget)}
                    </div>
                  </div>
                )}
                {enquiry.expectedCompletion && (
                  <div>
                    <div className="text-xs text-[var(--text-subtle)]">Expected Completion</div>
                    <div className="text-sm text-[var(--text)]">
                      {formatDate(enquiry.expectedCompletion)}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Related Quotations */}
          <Card padding="none">
            <div className="px-5 py-4 border-b border-[var(--border)]">
              <CardTitle>Quotations</CardTitle>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                {relatedQuotations.length} quotation{relatedQuotations.length !== 1 ? "s" : ""} created
              </p>
            </div>
            {relatedQuotations.length === 0 ? (
              <div className="p-6">
                <EmptyState
                  icon={<FileText className="h-10 w-10" />}
                  title="No quotations yet"
                  description="Create a quotation to send pricing details to the customer."
                  action={
                    <Link href="/admin/quotations/new">
                      <Button size="sm" leftIcon={<Plus className="h-3.5 w-3.5" />}>
                        Create Quotation
                      </Button>
                    </Link>
                  }
                />
              </div>
            ) : (
              <div className="divide-y divide-[var(--border)]">
                {relatedQuotations.map((q) => (
                  <Link
                    key={q.id}
                    href="/admin/quotations"
                    className="flex items-center justify-between p-4 hover:bg-[var(--surface-muted)] transition-colors"
                  >
                    <div>
                      <div className="font-mono text-xs font-semibold text-[var(--primary)]">
                        {q.number}
                      </div>
                      <div className="text-sm text-[var(--text)] mt-0.5">
                        {q.projectName || "Quotation"}
                      </div>
                      <div className="text-xs text-[var(--text-muted)] mt-0.5">
                        {formatDate(q.createdAt)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-[var(--text)]">
                        {formatCurrency(q.total)}
                      </div>
                      <StatusBadge status={q.status} />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </Card>

          {/* Activity Timeline */}
          <Card padding="md">
            <CardHeader>
              <CardTitle>Activity Timeline</CardTitle>
            </CardHeader>
            {logs.length === 0 ? (
              <div className="text-sm text-[var(--text-muted)] text-center py-6">
                No activity recorded yet.
              </div>
            ) : (
              <div className="space-y-4">
                {logs.map((log) => (
                  <div key={log.id} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="h-2 w-2 rounded-full bg-[var(--primary)] mt-1.5" />
                      <div className="w-px flex-1 bg-[var(--border)]" />
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="text-sm text-[var(--text)]">
                        {log.description}
                      </div>
                      <div className="text-xs text-[var(--text-subtle)] mt-0.5">
                        {log.userName} · {formatRelativeTime(log.createdAt)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Right column — customer & assignment */}
        <div className="space-y-4">
          {/* Customer */}
          <Card padding="md">
            <CardHeader>
              <CardTitle>Customer</CardTitle>
              <Link
                href={`/admin/customers/${customer.id}`}
                className="text-xs text-[var(--primary)] hover:underline"
              >
                View profile →
              </Link>
            </CardHeader>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <UserAvatar name={customer.name} size="md" />
                <div>
                  <div className="font-semibold text-[var(--text)]">{customer.name}</div>
                  {customer.company && (
                    <div className="text-xs text-[var(--text-muted)]">{customer.company}</div>
                  )}
                </div>
              </div>
              <div className="space-y-2 pt-3 border-t border-[var(--border)]">
                <a
                  href={`tel:${customer.phone}`}
                  className="flex items-center gap-2 text-sm text-[var(--text)] hover:text-[var(--primary)]"
                >
                  <Phone className="h-3.5 w-3.5 text-[var(--text-subtle)]" />
                  {customer.phone}
                </a>
                {customer.email && (
                  <a
                    href={`mailto:${customer.email}`}
                    className="flex items-center gap-2 text-sm text-[var(--text)] hover:text-[var(--primary)]"
                  >
                    <Mail className="h-3.5 w-3.5 text-[var(--text-subtle)]" />
                    {customer.email}
                  </a>
                )}
                {customer.address && (
                  <div className="flex items-start gap-2 text-sm text-[var(--text-muted)]">
                    <MapPin className="h-3.5 w-3.5 text-[var(--text-subtle)] mt-0.5 shrink-0" />
                    <span>
                      {[
                        customer.address.line1,
                        customer.address.city,
                        customer.address.state,
                        customer.address.pincode,
                      ]
                        .filter(Boolean)
                        .join(", ")}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex gap-2 pt-3">
                <Button variant="outline" size="sm" className="flex-1" leftIcon={<Phone className="h-3.5 w-3.5" />}>
                  Call
                </Button>
                <Button variant="outline" size="sm" className="flex-1" leftIcon={<Mail className="h-3.5 w-3.5" />}>
                  Email
                </Button>
              </div>
            </div>
          </Card>

          {/* Assignment */}
          <Card padding="md">
            <CardHeader>
              <CardTitle>Assignment</CardTitle>
            </CardHeader>
            <div className="space-y-3">
              <div>
                <div className="text-xs text-[var(--text-subtle)] mb-1.5">Assigned To</div>
                {assignedUser ? (
                  <div className="flex items-center gap-2">
                    <UserAvatar name={assignedUser.name} size="sm" />
                    <div>
                      <div className="text-sm font-medium text-[var(--text)]">
                        {assignedUser.name}
                      </div>
                      <div className="text-xs text-[var(--text-muted)]">
                        {assignedUser.roleName}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-[var(--text-subtle)] italic">Unassigned</div>
                )}
              </div>
              {enquiry.followUpDate && (
                <div className="pt-3 border-t border-[var(--border)]">
                  <div className="text-xs text-[var(--text-subtle)] mb-1">Next Follow-up</div>
                  <div className="flex items-center gap-2 text-sm text-[var(--warning)] font-medium">
                    <Calendar className="h-3.5 w-3.5" />
                    {formatDate(enquiry.followUpDate)}
                  </div>
                </div>
              )}
              <div className="pt-3 border-t border-[var(--border)]">
                <div className="text-xs text-[var(--text-subtle)] mb-1">Source</div>
                <Badge variant="outline">{enquiry.source || "Unknown"}</Badge>
              </div>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card padding="md">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <div className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start" leftIcon={<FileText className="h-3.5 w-3.5" />}>
                Create Quotation
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start" leftIcon={<MessageSquare className="h-3.5 w-3.5" />}>
                Add Internal Note
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start" leftIcon={<User className="h-3.5 w-3.5" />}>
                Reassign Staff
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start" leftIcon={<Clock className="h-3.5 w-3.5" />}>
                Schedule Follow-up
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
