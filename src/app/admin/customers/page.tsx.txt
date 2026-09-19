"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { Search, Plus, Download, Mail, Phone, MapPin, MoreVertical } from "lucide-react";
import {
  Card,
  Input,
  Button,
  UserAvatar,
  PageHeader,
  Badge,
  Dropdown,
  EmptyState,
} from "@/components/ui";
import { customers, enquiries, projects } from "@/lib/mock-data";
import { formatCurrency, formatDate, truncate } from "@/lib/utils";

export default function CustomersPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 12;

  const customersWithStats = useMemo(() => {
    return customers.map((c) => {
      const enqs = enquiries.filter((e) => e.customerId === c.id);
      const projs = projects.filter((p) => p.customerId === c.id);
      const activeProjects = projs.filter((p) => !["completed", "cancelled"].includes(p.status)).length;
      return {
        ...c,
        totalEnquiries: enqs.length,
        activeProjects,
        lastInteraction: enqs.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())[0]?.updatedAt,
      };
    });
  }, []);

  const filtered = customersWithStats.filter((c) => {
    const q = search.toLowerCase();
    return (
      !q ||
      c.name.toLowerCase().includes(q) ||
      (c.email || "").toLowerCase().includes(q) ||
      c.phone.includes(q) ||
      (c.company || "").toLowerCase().includes(q)
    );
  });

  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.ceil(filtered.length / pageSize);

  return (
    <div>
      <PageHeader
        title="Customers"
        description={`${customers.length} total customers`}
        breadcrumbs={[
          { label: "Dashboard", href: "/admin/dashboard" },
          { label: "Customers" },
        ]}
        actions={
          <>
            <Button variant="outline" size="sm" leftIcon={<Download className="h-3.5 w-3.5" />}>
              Export
            </Button>
            <Button size="sm" leftIcon={<Plus className="h-3.5 w-3.5" />}>
              New Customer
            </Button>
          </>
        }
      />

      <Card padding="md" className="mb-4">
        <Input
          placeholder="Search customers by name, phone, email, company..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          leftIcon={<Search className="h-4 w-4" />}
        />
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {paginated.map((c) => (
          <Link key={c.id} href={`/admin/customers/${c.id}`}>
            <Card padding="md" hover className="h-full">
              <div className="flex items-start gap-3">
                <UserAvatar name={c.name} size="md" />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-[var(--text)] truncate">{c.name}</div>
                  {c.company && (
                    <div className="text-xs text-[var(--text-muted)] truncate">{c.company}</div>
                  )}
                  <div className="flex items-center gap-1 mt-1 text-xs text-[var(--text-subtle)]">
                    <Phone className="h-3 w-3" />
                    <span className="truncate">{c.phone}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-[var(--border)]">
                <div>
                  <div className="text-[10px] text-[var(--text-subtle)] uppercase tracking-wider">
                    Enquiries
                  </div>
                  <div className="text-base font-bold text-[var(--text)] mt-0.5">
                    {c.totalEnquiries}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-[var(--text-subtle)] uppercase tracking-wider">
                    Active
                  </div>
                  <div className="text-base font-bold text-[var(--text)] mt-0.5">
                    {c.activeProjects}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-[var(--text-subtle)] uppercase tracking-wider">
                    Value
                  </div>
                  <div className="text-sm font-bold text-[var(--primary)] mt-0.5 truncate">
                    {formatCurrency(c.totalBusinessValue)}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-3 text-xs text-[var(--text-subtle)]">
                {c.address?.city && (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {c.address.city}
                  </span>
                )}
                <span className="ml-auto">
                  {c.source && (
                    <Badge variant="outline">{c.source}</Badge>
                  )}
                </span>
              </div>
            </Card>
          </Link>
        ))}
        {paginated.length === 0 && (
          <div className="col-span-full">
            <EmptyState
              icon={<Search className="h-12 w-12" />}
              title="No customers found"
              description="Try adjusting your search query."
            />
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
            Prev
          </Button>
          <span className="text-sm text-[var(--text-muted)]">
            Page {page} of {totalPages}
          </span>
          <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
