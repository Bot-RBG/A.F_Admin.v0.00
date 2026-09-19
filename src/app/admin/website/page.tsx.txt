"use client";

import React from "react";
import Link from "next/link";
import { Globe, Image as ImageIcon, MessageSquareQuote, HelpCircle, Bell, Plus, Edit } from "lucide-react";
import { Card, CardHeader, CardTitle, Button, PageHeader, Badge } from "@/components/ui";

export default function WebsitePage() {
  const sections = [
    { id: "services", label: "Services", description: "Manage services listed on the public website", icon: Globe, count: 18, href: "/admin/website" },
    { id: "gallery", label: "Gallery", description: "Project photos and images", icon: ImageIcon, count: 42, href: "/admin/website" },
    { id: "testimonials", label: "Testimonials", description: "Customer reviews and feedback", icon: MessageSquareQuote, count: 12, href: "/admin/website" },
    { id: "faqs", label: "FAQs", description: "Frequently asked questions", icon: HelpCircle, count: 8, href: "/admin/website" },
    { id: "announcements", label: "Announcements", description: "Website banners and notices", icon: Bell, count: 3, href: "/admin/website" },
  ];

  return (
    <div>
      <PageHeader
        title="Website"
        description="Manage content displayed on the public Amit Furniture website."
        breadcrumbs={[{ label: "Dashboard", href: "/admin/dashboard" }, { label: "Website" }]}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {sections.map((s) => {
          const Icon = s.icon;
          return (
            <Link key={s.id} href={s.href}>
              <Card padding="md" hover className="h-full">
                <div className="flex items-start gap-3">
                  <div className="h-11 w-11 rounded-md bg-[var(--primary)]/10 flex items-center justify-center shrink-0">
                    <Icon className="h-5 w-5 text-[var(--primary)]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="font-semibold text-[var(--text)]">{s.label}</div>
                      <Badge variant="outline">{s.count}</Badge>
                    </div>
                    <div className="text-sm text-[var(--text-muted)] mt-1">{s.description}</div>
                  </div>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>

      <Card padding="md">
        <CardHeader>
          <CardTitle>Page Sections</CardTitle>
          <Button size="sm" leftIcon={<Plus className="h-3.5 w-3.5" />}>Add Section</Button>
        </CardHeader>
        <div className="space-y-2">
          {["Homepage", "About", "Services", "Projects", "Contact", "Footer"].map((p) => (
            <div key={p} className="flex items-center justify-between p-3 bg-[var(--surface-muted)] rounded-md">
              <div>
                <div className="text-sm font-medium text-[var(--text)]">{p}</div>
                <div className="text-xs text-[var(--text-muted)]">Static page content</div>
              </div>
              <Button variant="outline" size="sm" leftIcon={<Edit className="h-3.5 w-3.5" />}>Edit</Button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
