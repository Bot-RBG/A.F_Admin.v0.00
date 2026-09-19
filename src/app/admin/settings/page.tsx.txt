"use client";

import React, { useState } from "react";
import { Settings as SettingsIcon, Building, FileText, Bell, Shield, Palette, Save } from "lucide-react";
import { Card, CardHeader, CardTitle, Button, Input, Select, Textarea, PageHeader, Tabs, Badge, toast } from "@/components/ui";

export default function SettingsPage() {
  const [tab, setTab] = useState("business");

  return (
    <div>
      <PageHeader
        title="Settings"
        description="Configure your business, quotations, notifications and security."
        breadcrumbs={[{ label: "Dashboard", href: "/admin/dashboard" }, { label: "Settings" }]}
        actions={
          <Button size="sm" leftIcon={<Save className="h-3.5 w-3.5" />} onClick={() => toast("success", "Settings saved", "Your changes have been saved.")}>
            Save Changes
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-1 space-y-1">
          {[
            { id: "business", label: "Business", icon: Building },
            { id: "quotations", label: "Quotations", icon: FileText },
            { id: "invoices", label: "Invoices", icon: FileText },
            { id: "notifications", label: "Notifications", icon: Bell },
            { id: "security", label: "Security", icon: Shield },
            { id: "appearance", label: "Appearance", icon: Palette },
          ].map((s) => {
            const Icon = s.icon;
            return (
              <button
                key={s.id}
                onClick={() => setTab(s.id)}
                className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-md text-sm transition-colors ${
                  tab === s.id
                    ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                    : "text-[var(--text-muted)] hover:bg-[var(--surface-muted)]"
                }`}
              >
                <Icon className="h-4 w-4" />
                {s.label}
              </button>
            );
          })}
        </div>

        <div className="lg:col-span-3">
          {tab === "business" && (
            <Card padding="md">
              <CardHeader>
                <CardTitle>Business Information</CardTitle>
              </CardHeader>
              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Input label="Business Name" defaultValue="Amit Furniture" />
                  <Input label="Tagline" defaultValue="Build things with love and care" />
                  <Input label="Founder" defaultValue="Amit Kumar Sharma" />
                  <Input label="Established" defaultValue="2025" />
                  <Input label="Phone" defaultValue="+91 98765 43210" />
                  <Input label="WhatsApp" defaultValue="+91 98765 43210" />
                  <Input label="Email" defaultValue="info@amitfurniture.com" />
                  <Input label="Website" defaultValue="https://amitfurniture.com" />
                </div>
                <Textarea label="Address" defaultValue="Siliguri, Darjeeling, West Bengal, India" rows={2} />
                <Textarea label="Service Areas" defaultValue="Siliguri, Darjeeling, Jalpaiguri, North Bengal" rows={2} />
                <Textarea label="Business Hours" defaultValue="Monday - Saturday: 9:00 AM - 7:00 PM&#10;Sunday: Closed" rows={3} />
              </div>
            </Card>
          )}

          {tab === "quotations" && (
            <Card padding="md">
              <CardHeader>
                <CardTitle>Quotation Settings</CardTitle>
              </CardHeader>
              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Input label="Quote Prefix" defaultValue="AF-Q" />
                  <Input label="Validity (days)" type="number" defaultValue="15" />
                  <Input label="Default Tax Rate (%)" type="number" defaultValue="18" />
                </div>
                <Textarea label="Default Payment Terms" defaultValue="40% advance, 40% on manufacturing completion, 20% on installation" rows={3} />
                <Textarea label="Default Terms & Conditions" defaultValue="• Prices are valid for 15 days from date of quotation.&#10;• GST applicable as per government norms.&#10;• Delivery timeline may vary based on material availability." rows={6} />
              </div>
            </Card>
          )}

          {tab === "invoices" && (
            <Card padding="md">
              <CardHeader>
                <CardTitle>Invoice Settings</CardTitle>
              </CardHeader>
              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Input label="Invoice Prefix" defaultValue="AF-INV" />
                  <Input label="Default Tax Rate (%)" type="number" defaultValue="18" />
                  <Input label="GST Number" defaultValue="19AABCU9603R1ZM" />
                  <Input label="PAN Number" defaultValue="AABCU9603R" />
                </div>
                <Textarea label="Bank Details (for invoices)" defaultValue="Bank: State Bank of India&#10;A/C: 1234567890&#10;IFSC: SBIN0001234" rows={4} />
              </div>
            </Card>
          )}

          {tab === "notifications" && (
            <Card padding="md">
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
              </CardHeader>
              <div className="space-y-3">
                {[
                  "New enquiry received",
                  "Quotation accepted by customer",
                  "Payment received",
                  "Project deadline approaching",
                  "Follow-up due today",
                  "Daily summary email",
                ].map((n) => (
                  <div key={n} className="flex items-center justify-between py-2 border-b border-[var(--border)] last:border-0">
                    <span className="text-sm text-[var(--text)]">{n}</span>
                    <div className="flex items-center gap-2">
                      <label className="flex items-center gap-1 text-xs">
                        <input type="checkbox" defaultChecked className="accent-[var(--primary)]" />
                        Email
                      </label>
                      <label className="flex items-center gap-1 text-xs">
                        <input type="checkbox" defaultChecked className="accent-[var(--primary)]" />
                        In-app
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {tab === "security" && (
            <Card padding="md">
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
              </CardHeader>
              <div className="space-y-3">
                <div>
                  <div className="text-sm font-semibold text-[var(--text)] mb-1">Change Password</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Input label="Current Password" type="password" />
                    <div />
                    <Input label="New Password" type="password" />
                    <Input label="Confirm New Password" type="password" />
                  </div>
                </div>
                <div className="pt-4 border-t border-[var(--border)]">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-semibold text-[var(--text)]">Two-Factor Authentication</div>
                      <div className="text-xs text-[var(--text-muted)] mt-0.5">
                        Add an extra layer of security to your account
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Enable</Button>
                  </div>
                </div>
                <div className="pt-4 border-t border-[var(--border)]">
                  <div className="text-sm font-semibold text-[var(--text)] mb-2">Active Sessions</div>
                  <div className="space-y-2">
                    <div className="p-3 bg-[var(--surface-muted)] rounded-md flex items-center justify-between">
                      <div>
                        <div className="text-sm text-[var(--text)]">Chrome on macOS · Siliguri, IN</div>
                        <div className="text-xs text-[var(--text-muted)]">Current session · Active now</div>
                      </div>
                      <Badge variant="success">Current</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {tab === "appearance" && (
            <Card padding="md">
              <CardHeader>
                <CardTitle>Appearance</CardTitle>
              </CardHeader>
              <div className="space-y-3">
                <Select
                  label="Theme"
                  options={[
                    { value: "light", label: "Light" },
                    { value: "dark", label: "Dark" },
                    { value: "system", label: "System" },
                  ]}
                  defaultValue="light"
                />
                <div className="pt-2 text-xs text-[var(--text-muted)]">
                  Theme preference is stored locally on your device.
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
