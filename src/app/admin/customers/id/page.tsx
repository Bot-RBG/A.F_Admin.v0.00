"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  MessageSquare,
  FileText,
  FolderKanban,
  CreditCard,
  FileStack,
  PhoneCall,
  ListChecks,
  Activity,
  Edit,
  User,
  Building,
  Calendar,
  Plus,
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
import {
  customers,
  enquiries,
  quotations,
  projects,
  payments,
  documents,
  communications,
  tasks,
  activityLogs,
} from "@/lib/mock-data";
import {
  formatDate,
  formatCurrency,
  formatRelativeTime,
  truncate,
} from "@/lib/utils";

export default function CustomerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [tab, setTab] = useState("overview");

  const customer = customers.find((c) => c.id === id);
  const customerEnquiries = enquiries.filter((e) => e.customerId === id);
  const customerQuotations = quotations.filter((q) => q.customerId === id);
  const customerProjects = projects.filter((p) => p.customerId === id);
  const customerPayments = payments.filter((p) => p.customerId === id);
  const customerDocs = documents.filter((d) => d.customerId === id);
  const customerComms = communications.filter((c) => c.customerId === id);
  const customerTasks = tasks.filter((t) => t.customerId === id);

  if (!customer) {
    return (
      <div>
        <PageHeader
          title="Customer not found"
          breadcrumbs={[
            { label: "Dashboard", href: "/admin/dashboard" },
            { label: "Customers", href: "/admin/customers" },
            { label: "Not Found" },
          ]}
        />
        <EmptyState
          icon={<User className="h-12 w-12" />}
          title="Customer not found"
          action={
            <Link href="/admin/customers">
              <Button>Back to Customers</Button>
            </Link>
          }
        />
      </div>
    );
  }

  const totalPaid = customerPayments
    .filter((p) => p.status === "paid")
    .reduce((sum, p) => sum + parseFloat(p.amount), 0);

  const activeProjects = customerProjects.filter(
    (p) => !["completed", "cancelled"].includes(p.status)
  );

  return (
    <div>
      <PageHeader
        title={customer.name}
        description={customer.company || "Individual customer"}
        breadcrumbs={[
          { label: "Dashboard", href: "/admin/dashboard" },
          { label: "Customers", href: "/admin/customers" },
          { label: customer.name },
        ]}
        actions={
          <>
            <Button variant="outline" size="sm" leftIcon={<ArrowLeft className="h-3.5 w-3.5" />} onClick={() => router.back()}>
              Back
            </Button>
            <Button variant="outline" size="sm" leftIcon={<Edit className="h-3.5 w-3.5" />}>
              Edit
            </Button>
            <Link href="/admin/enquiries">
              <Button size="sm" leftIcon={<Plus className="h-3.5 w-3.5" />}>
                New Enquiry
              </Button>
            </Link>
          </>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {/* Customer profile card */}
        <Card padding="md" className="lg:col-span-1">
          <div className="flex flex-col items-center text-center mb-4">
            <UserAvatar name={customer.name} size="lg" />
            <div className="mt-3">
              <div className="text-lg font-bold text-[var(--text)]">{customer.name}</div>
              {customer.company && (
                <div className="text-sm text-[var(--text-muted)] flex items-center justify-center gap-1 mt-0.5">
                  <Building className="h-3 w-3" />
                  {customer.company}
                </div>
              )}
              <div className="mt-1">
                <Badge variant={customer.source === "referral" ? "success" : "outline"}>
                  {customer.source || "Unknown source"}
                </Badge>
              </div>
            </div>
          </div>

          <div className="space-y-2.5">
            <a
              href={`tel:${customer.phone}`}
              className="flex items-center gap-2.5 p-2 rounded-md hover:bg-[var(--surface-muted)] transition-colors"
            >
              <Phone className="h-4 w-4 text-[var(--text-subtle)]" />
              <div className="flex-1 text-left">
                <div className="text-[10px] text-[var(--text-subtle)] uppercase tracking-wider">
                  Phone
                </div>
                <div className="text-sm text-[var(--text)] font-medium">{customer.phone}</div>
              </div>
            </a>
            {customer.email && (
              <a
                href={`mailto:${customer.email}`}
                className="flex items-center gap-2.5 p-2 rounded-md hover:bg-[var(--surface-muted)] transition-colors"
              >
                <Mail className="h-4 w-4 text-[var(--text-subtle)]" />
                <div className="flex-1 text-left">
                  <div className="text-[10px] text-[var(--text-subtle)] uppercase tracking-wider">
                    Email
                  </div>
                  <div className="text-sm text-[var(--text)] truncate">{customer.email}</div>
                </div>
              </a>
            )}
            {customer.address && (
              <div className="flex items-start gap-2.5 p-2">
                <MapPin className="h-4 w-4 text-[var(--text-subtle)] mt-0.5 shrink-0" />
                <div className="flex-1">
                  <div className="text-[10px] text-[var(--text-subtle)] uppercase tracking-wider">
                    Address
                  </div>
                  <div className="text-sm text-[var(--text-muted)]">
                    {[
                      customer.address.line1,
                      customer.address.line2,
                      customer.address.city,
                      customer.address.district,
                      customer.address.state,
                      customer.address.pincode,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </div>
                </div>
              </div>
            )}
            <div className="flex items-center gap-2.5 p-2">
              <Calendar className="h-4 w-4 text-[var(--text-subtle)]" />
              <div className="flex-1">
                <div className="text-[10px] text-[var(--text-subtle)] uppercase tracking-wider">
                  Customer since
                </div>
                <div className="text-sm text-[var(--text)]">{formatDate(customer.createdAt)}</div>
              </div>
            </div>
          </div>

          {customer.notes && (
            <div className="mt-4 p-3 bg-[var(--surface-muted)] rounded-md">
              <div className="text-[10px] font-semibold text-[var(--text-subtle)] uppercase tracking-wider mb-1">
                Notes
              </div>
              <div className="text-xs text-[var(--text-muted)]">{customer.notes}</div>
            </div>
          )}

          <div className="mt-4 grid grid-cols-2 gap-2">
            <Button variant="outline" size="sm" leftIcon={<Phone className="h-3.5 w-3.5" />}>
              Call
            </Button>
            <Button variant="outline" size="sm" leftIcon={<Mail className="h-3.5 w-3.5" />}>
              Email
            </Button>
          </div>
        </Card>

        {/* Stats + Recent Activity */}
        <div className="lg:col-span-2 space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Card padding="md">
              <div className="text-xs text-[var(--text-muted)]">Enquiries</div>
              <div className="text-2xl font-bold text-[var(--text)] mt-1">
                {customerEnquiries.length}
              </div>
              <div className="text-[11px] text-[var(--text-subtle)] mt-1">
                {customerEnquiries.filter((e) => e.status === "new").length} new
              </div>
            </Card>
            <Card padding="md">
              <div className="text-xs text-[var(--text-muted)]">Active Projects</div>
              <div className="text-2xl font-bold text-[var(--text)] mt-1">
                {activeProjects.length}
              </div>
              <div className="text-[11px] text-[var(--text-subtle)] mt-1">
                of {customerProjects.length} total
              </div>
            </Card>
            <Card padding="md">
              <div className="text-xs text-[var(--text-muted)]">Total Paid</div>
              <div className="text-xl font-bold text-[var(--success)] mt-1">
                {formatCurrency(totalPaid)}
              </div>
              <div className="text-[11px] text-[var(--text-subtle)] mt-1">
                {customerPayments.length} payments
              </div>
            </Card>
            <Card padding="md">
              <div className="text-xs text-[var(--text-muted)]">Business Value</div>
              <div className="text-xl font-bold text-[var(--primary)] mt-1">
                {formatCurrency(customer.totalBusinessValue)}
              </div>
              <div className="text-[11px] text-[var(--text-subtle)] mt-1">
                Lifetime
              </div>
            </Card>
          </div>

          <Card padding="none">
            <Tabs
              value={tab}
              onChange={setTab}
              tabs={[
                { id: "overview", label: "Overview" },
                { id: "enquiries", label: "Enquiries", count: customerEnquiries.length },
                { id: "quotations", label: "Quotations", count: customerQuotations.length },
                { id: "projects", label: "Projects", count: customerProjects.length },
                { id: "payments", label: "Payments", count: customerPayments.length },
                { id: "documents", label: "Documents", count: customerDocs.length },
                { id: "communications", label: "Communications", count: customerComms.length },
                { id: "tasks", label: "Tasks", count: customerTasks.length },
              ]}
            />
            <div className="p-5">
              {tab === "overview" && (
                <div className="space-y-6">
                  {/* Recent enquiries */}
                  <div>
                    <div className="text-xs font-semibold text-[var(--text-subtle)] uppercase tracking-wider mb-2">
                      Recent Enquiries
                    </div>
                    {customerEnquiries.slice(0, 3).map((e) => (
                      <Link
                        key={e.id}
                        href={`/admin/enquiries/${e.id}`}
                        className="flex items-center justify-between py-2 border-b border-[var(--border)] last:border-0"
                      >
                        <div>
                          <div className="text-sm font-medium text-[var(--text)]">{e.service}</div>
                          <div className="text-xs text-[var(--text-muted)] mt-0.5">
                            {e.number} · {formatDate(e.createdAt)}
                          </div>
                        </div>
                        <StatusBadge status={e.status} />
                      </Link>
                    ))}
                    {customerEnquiries.length === 0 && (
                      <div className="text-xs text-[var(--text-subtle)] italic">No enquiries</div>
                    )}
                  </div>

                  {/* Recent projects */}
                  <div>
                    <div className="text-xs font-semibold text-[var(--text-subtle)] uppercase tracking-wider mb-2">
                      Active Projects
                    </div>
                    {activeProjects.slice(0, 3).map((p) => (
                      <Link
                        key={p.id}
                        href={`/admin/projects/${p.id}`}
                        className="flex items-center justify-between py-2 border-b border-[var(--border)] last:border-0"
                      >
                        <div>
                          <div className="text-sm font-medium text-[var(--text)]">{p.name}</div>
                          <div className="text-xs text-[var(--text-muted)] mt-0.5">
                            {p.number} · {p.progress}% complete
                          </div>
                        </div>
                        <StatusBadge status={p.status} />
                      </Link>
                    ))}
                    {activeProjects.length === 0 && (
                      <div className="text-xs text-[var(--text-subtle)] italic">No active projects</div>
                    )}
                  </div>
                </div>
              )}

              {tab === "enquiries" && (
                <div className="space-y-2">
                  {customerEnquiries.map((e) => (
                    <Link
                      key={e.id}
                      href={`/admin/enquiries/${e.id}`}
                      className="flex items-center justify-between p-3 bg-[var(--surface-muted)] rounded-md hover:bg-[var(--border)] transition-colors"
                    >
                      <div>
                        <div className="text-sm font-semibold text-[var(--text)]">{e.service}</div>
                        <div className="text-xs text-[var(--text-muted)] mt-0.5">
                          {e.number} · {formatDate(e.createdAt)}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {e.budget && (
                          <span className="text-xs text-[var(--text-subtle)]">
                            {formatCurrency(e.budget)}
                          </span>
                        )}
                        <StatusBadge status={e.status} />
                      </div>
                    </Link>
                  ))}
                  {customerEnquiries.length === 0 && (
                    <EmptyState
                      icon={<MessageSquare className="h-10 w-10" />}
                      title="No enquiries"
                    />
                  )}
                </div>
              )}

              {tab === "quotations" && (
                <div className="space-y-2">
                  {customerQuotations.map((q) => (
                    <div
                      key={q.id}
                      className="flex items-center justify-between p-3 bg-[var(--surface-muted)] rounded-md"
                    >
                      <div>
                        <div className="font-mono text-xs font-semibold text-[var(--primary)]">
                          {q.number}
                        </div>
                        <div className="text-sm text-[var(--text)] mt-0.5">
                          {q.projectName}
                        </div>
                        <div className="text-xs text-[var(--text-muted)]">
                          {formatDate(q.createdAt)}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-[var(--text)]">
                          {formatCurrency(q.total)}
                        </div>
                        <StatusBadge status={q.status} />
                      </div>
                    </div>
                  ))}
                  {customerQuotations.length === 0 && (
                    <EmptyState icon={<FileText className="h-10 w-10" />} title="No quotations" />
                  )}
                </div>
              )}

              {tab === "projects" && (
                <div className="space-y-2">
                  {customerProjects.map((p) => (
                    <Link
                      key={p.id}
                      href={`/admin/projects/${p.id}`}
                      className="block p-3 bg-[var(--surface-muted)] rounded-md hover:bg-[var(--border)] transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-semibold text-[var(--text)]">{p.name}</div>
                          <div className="text-xs text-[var(--text-muted)] mt-0.5">
                            {p.number} · {formatDate(p.startDate)}
                          </div>
                        </div>
                        <StatusBadge status={p.status} />
                      </div>
                      <div className="mt-2 h-1.5 bg-[var(--border)] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[var(--primary)]"
                          style={{ width: `${p.progress}%` }}
                        />
                      </div>
                      <div className="text-[11px] text-[var(--text-subtle)] mt-1">
                        {p.progress}% complete
                      </div>
                    </Link>
                  ))}
                  {customerProjects.length === 0 && (
                    <EmptyState icon={<FolderKanban className="h-10 w-10" />} title="No projects" />
                  )}
                </div>
              )}

              {tab === "payments" && (
                <div className="space-y-2">
                  {customerPayments.map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center justify-between p-3 bg-[var(--surface-muted)] rounded-md"
                    >
                      <div>
                        <div className="font-mono text-xs text-[var(--primary)]">{p.number}</div>
                        <div className="text-sm text-[var(--text)] mt-0.5">{p.projectName}</div>
                        <div className="text-xs text-[var(--text-muted)]">
                          {formatDate(p.paymentDate)} · {p.method}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-[var(--text)]">
                          {formatCurrency(p.amount)}
                        </div>
                        <StatusBadge status={p.status} />
                      </div>
                    </div>
                  ))}
                  {customerPayments.length === 0 && (
                    <EmptyState icon={<CreditCard className="h-10 w-10" />} title="No payments" />
                  )}
                </div>
              )}

              {tab === "documents" && (
                <div className="space-y-2">
                  {customerDocs.map((d) => (
                    <div
                      key={d.id}
                      className="flex items-center gap-3 p-3 bg-[var(--surface-muted)] rounded-md"
                    >
                      <FileStack className="h-8 w-8 text-[var(--primary)]" />
                      <div className="flex-1">
                        <div className="text-sm font-medium text-[var(--text)]">{d.name}</div>
                        <div className="text-xs text-[var(--text-muted)]">
                          {d.fileName} · {formatDate(d.createdAt)}
                        </div>
                      </div>
                      <Badge variant="outline">{d.category}</Badge>
                    </div>
                  ))}
                  {customerDocs.length === 0 && (
                    <EmptyState icon={<FileStack className="h-10 w-10" />} title="No documents" />
                  )}
                </div>
              )}

              {tab === "communications" && (
                <div className="space-y-2">
                  {customerComms.map((c) => (
                    <div
                      key={c.id}
                      className="p-3 bg-[var(--surface-muted)] rounded-md"
                    >
                      <div className="flex items-center gap-2 text-xs">
                        <Badge variant="outline">{c.type}</Badge>
                        <Badge variant={c.direction === "inbound" ? "info" : "default"}>
                          {c.direction}
                        </Badge>
                        <span className="text-[var(--text-subtle)]">
                          {formatRelativeTime(c.occurredAt)}
                        </span>
                      </div>
                      <div className="text-sm text-[var(--text)] mt-2">{c.summary}</div>
                      {c.staffName && (
                        <div className="text-xs text-[var(--text-subtle)] mt-1">
                          By {c.staffName}
                        </div>
                      )}
                    </div>
                  ))}
                  {customerComms.length === 0 && (
                    <EmptyState icon={<PhoneCall className="h-10 w-10" />} title="No communications" />
                  )}
                </div>
              )}

              {tab === "tasks" && (
                <div className="space-y-2">
                  {customerTasks.map((t) => (
                    <div
                      key={t.id}
                      className="flex items-center justify-between p-3 bg-[var(--surface-muted)] rounded-md"
                    >
                      <div>
                        <div className="text-sm font-medium text-[var(--text)]">{t.name}</div>
                        <div className="text-xs text-[var(--text-muted)] mt-0.5">
                          Due {formatDate(t.dueDate)}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <StatusBadge status={t.priority} />
                        <StatusBadge status={t.status} />
                      </div>
                    </div>
                  ))}
                  {customerTasks.length === 0 && (
                    <EmptyState icon={<ListChecks className="h-10 w-10" />} title="No tasks" />
                  )}
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
