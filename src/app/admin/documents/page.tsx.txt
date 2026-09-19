"use client";

import React, { useState } from "react";
import { FileStack, Upload, Download, Search, Trash2, FileText, FileImage, FileSpreadsheet } from "lucide-react";
import { Card, Input, Select, Button, PageHeader, Badge, EmptyState } from "@/components/ui";
import { documents } from "@/lib/mock-data";
import { formatDate } from "@/lib/utils";

export default function DocumentsPage() {
  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");

  const filtered = documents.filter((d) => {
    const s = search.toLowerCase();
    return (
      (!s || d.name.toLowerCase().includes(s) || d.fileName.toLowerCase().includes(s)) &&
      (!category || d.category === category)
    );
  });

  const getFileIcon = (mimeType?: string | null) => {
    if (!mimeType) return FileText;
    if (mimeType.startsWith("image/")) return FileImage;
    if (mimeType.includes("sheet") || mimeType.includes("csv")) return FileSpreadsheet;
    return FileText;
  };

  return (
    <div>
      <PageHeader
        title="Documents"
        description={`${documents.length} documents stored`}
        breadcrumbs={[{ label: "Dashboard", href: "/admin/dashboard" }, { label: "Documents" }]}
        actions={
          <Button size="sm" leftIcon={<Upload className="h-3.5 w-3.5" />}>Upload</Button>
        }
      />

      <Card padding="md" className="mb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Input placeholder="Search documents..." value={search} onChange={(e) => setSearch(e.target.value)} leftIcon={<Search className="h-4 w-4" />} />
          <Select
            options={[
              { value: "quotation", label: "Quotations" },
              { value: "invoice", label: "Invoices" },
              { value: "receipt", label: "Receipts" },
              { value: "design", label: "Designs" },
              { value: "measurement", label: "Measurements" },
              { value: "agreement", label: "Agreements" },
              { value: "project_image", label: "Project Images" },
              { value: "customer_attachment", label: "Customer Attachments" },
              { value: "other", label: "Other" },
            ]}
            placeholder="All categories"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map((d) => {
          const Icon = getFileIcon(d.mimeType);
          return (
            <Card key={d.id} padding="md" className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-md bg-[var(--surface-muted)] flex items-center justify-center shrink-0">
                <Icon className="h-5 w-5 text-[var(--primary)]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-[var(--text)] truncate">{d.name}</div>
                <div className="text-xs text-[var(--text-muted)] truncate">{d.fileName}</div>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline">{d.category.replace(/_/g, " ")}</Badge>
                  <span className="text-[10px] text-[var(--text-subtle)]">{formatDate(d.createdAt)}</span>
                </div>
              </div>
              <div className="flex gap-1">
                <button className="p-1 text-[var(--text-subtle)] hover:text-[var(--primary)]">
                  <Download className="h-3.5 w-3.5" />
                </button>
                <button className="p-1 text-[var(--text-subtle)] hover:text-[var(--danger)]">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </Card>
          );
        })}
        {filtered.length === 0 && (
          <div className="col-span-full">
            <EmptyState icon={<FileStack className="h-12 w-12" />} title="No documents found" />
          </div>
        )}
      </div>
    </div>
  );
}
