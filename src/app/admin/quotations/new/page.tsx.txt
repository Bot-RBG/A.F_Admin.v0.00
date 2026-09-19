"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Trash2, Save, Send, Eye, FileText } from "lucide-react";
import { Card, CardHeader, CardTitle, Input, Select, Button, Textarea, PageHeader, toast } from "@/components/ui";
import { customers } from "@/lib/mock-data";

interface QuoteItem {
  id: string;
  name: string;
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  discount: number;
  taxRate: number;
}

export default function NewQuotationPage() {
  const router = useRouter();
  const [customerId, setCustomerId] = useState("");
  const [projectName, setProjectName] = useState("");
  const [validityDays, setValidityDays] = useState(15);
  const [paymentTerms, setPaymentTerms] = useState("40% advance, 40% midway, 20% on completion");
  const [deliveryTerms, setDeliveryTerms] = useState("4-6 weeks from advance payment");
  const [notes, setNotes] = useState("");

  const [items, setItems] = useState<QuoteItem[]>([
    { id: "1", name: "", description: "", quantity: 1, unit: "piece", unitPrice: 0, discount: 0, taxRate: 18 },
  ]);

  const addItem = () => {
    setItems([
      ...items,
      { id: Date.now().toString(), name: "", description: "", quantity: 1, unit: "piece", unitPrice: 0, discount: 0, taxRate: 18 },
    ]);
  };

  const removeItem = (id: string) => {
    setItems(items.filter((i) => i.id !== id));
  };

  const updateItem = (id: string, field: keyof QuoteItem, value: string | number) => {
    setItems(items.map((i) => (i.id === id ? { ...i, [field]: value } : i)));
  };

  // Calculations
  const subtotal = items.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0);
  const totalDiscount = items.reduce((sum, i) => sum + i.discount, 0);
  const afterDiscount = subtotal - totalDiscount;
  const totalTax = items.reduce((sum, i) => {
    const line = i.quantity * i.unitPrice - i.discount;
    return sum + (line * i.taxRate) / 100;
  }, 0);
  const grandTotal = afterDiscount + totalTax;

  const handleSave = (status: "draft" | "sent") => {
    if (!customerId) {
      toast("error", "Customer required", "Please select a customer.");
      return;
    }
    if (items.some((i) => !i.name)) {
      toast("error", "Item name required", "All items must have a name.");
      return;
    }
    toast("success", status === "draft" ? "Draft saved" : "Quotation sent", `Quotation ${status === "draft" ? "saved as draft" : "sent to customer"}.`);
    router.push("/admin/quotations");
  };

  return (
    <div>
      <PageHeader
        title="New Quotation"
        description="Create a professional quotation for a customer."
        breadcrumbs={[
          { label: "Dashboard", href: "/admin/dashboard" },
          { label: "Quotations", href: "/admin/quotations" },
          { label: "New" },
        ]}
        actions={
          <>
            <Button variant="outline" size="sm" leftIcon={<ArrowLeft className="h-3.5 w-3.5" />} onClick={() => router.back()}>
              Cancel
            </Button>
            <Button variant="outline" size="sm" leftIcon={<Save className="h-3.5 w-3.5" />} onClick={() => handleSave("draft")}>
              Save Draft
            </Button>
            <Button size="sm" leftIcon={<Send className="h-3.5 w-3.5" />} onClick={() => handleSave("sent")}>
              Save & Send
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <Card padding="md">
            <CardHeader>
              <CardTitle>Quotation Details</CardTitle>
            </CardHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Select
                label="Customer *"
                options={customers.map((c) => ({ value: c.id, label: c.name }))}
                placeholder="Select customer"
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
              />
              <Input
                label="Project name"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="e.g., Modular Kitchen - Das Residence"
              />
            </div>
          </Card>

          <Card padding="md">
            <CardHeader>
              <CardTitle>Items</CardTitle>
              <Button variant="outline" size="sm" leftIcon={<Plus className="h-3.5 w-3.5" />} onClick={addItem}>
                Add Item
              </Button>
            </CardHeader>
            <div className="space-y-4">
              {items.map((item, idx) => {
                const lineTotal = item.quantity * item.unitPrice - item.discount;
                const lineTax = (lineTotal * item.taxRate) / 100;
                return (
                  <div key={item.id} className="p-4 border border-[var(--border)] rounded-md bg-[var(--surface-muted)]">
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-xs font-semibold text-[var(--text-subtle)] uppercase tracking-wider">
                        Item #{idx + 1}
                      </div>
                      {items.length > 1 && (
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-[var(--text-subtle)] hover:text-[var(--danger)]"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
                      <div className="md:col-span-3">
                        <Input
                          label="Item name"
                          value={item.name}
                          onChange={(e) => updateItem(item.id, "name", e.target.value)}
                          placeholder="e.g., Custom wardrobe"
                        />
                      </div>
                      <div className="md:col-span-3">
                        <Input
                          label="Description"
                          value={item.description}
                          onChange={(e) => updateItem(item.id, "description", e.target.value)}
                          placeholder="Optional description"
                        />
                      </div>
                      <Input
                        label="Qty"
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateItem(item.id, "quantity", parseFloat(e.target.value) || 0)}
                      />
                      <Select
                        label="Unit"
                        options={[
                          { value: "piece", label: "piece" },
                          { value: "set", label: "set" },
                          { value: "sqft", label: "sq ft" },
                          { value: "job", label: "job" },
                        ]}
                        value={item.unit}
                        onChange={(e) => updateItem(item.id, "unit", e.target.value)}
                      />
                      <Input
                        label="Unit price (₹)"
                        type="number"
                        value={item.unitPrice}
                        onChange={(e) => updateItem(item.id, "unitPrice", parseFloat(e.target.value) || 0)}
                      />
                      <Input
                        label="Discount (₹)"
                        type="number"
                        value={item.discount}
                        onChange={(e) => updateItem(item.id, "discount", parseFloat(e.target.value) || 0)}
                      />
                      <Input
                        label="Tax %"
                        type="number"
                        value={item.taxRate}
                        onChange={(e) => updateItem(item.id, "taxRate", parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <div className="mt-3 text-right text-sm">
                      <span className="text-[var(--text-muted)]">Line total: </span>
                      <span className="font-bold text-[var(--text)]">₹{(lineTotal + lineTax).toLocaleString("en-IN")}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          <Card padding="md">
            <CardHeader>
              <CardTitle>Terms & Notes</CardTitle>
            </CardHeader>
            <div className="space-y-3">
              <Textarea
                label="Payment terms"
                value={paymentTerms}
                onChange={(e) => setPaymentTerms(e.target.value)}
                rows={2}
              />
              <Textarea
                label="Delivery terms"
                value={deliveryTerms}
                onChange={(e) => setDeliveryTerms(e.target.value)}
                rows={2}
              />
              <Textarea
                label="Additional notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any special notes for the customer..."
                rows={3}
              />
            </div>
          </Card>
        </div>

        {/* Summary */}
        <div className="space-y-4">
          <Card padding="md" className="sticky top-20">
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-[var(--text-muted)]">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-[var(--text-muted)]">
                <span>Discount</span>
                <span>- ₹{totalDiscount.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-[var(--text-muted)]">
                <span>Tax</span>
                <span>+ ₹{Math.round(totalTax).toLocaleString("en-IN")}</span>
              </div>
              <div className="h-px bg-[var(--border)] my-2" />
              <div className="flex justify-between text-lg font-bold text-[var(--text)]">
                <span>Grand Total</span>
                <span>₹{Math.round(grandTotal).toLocaleString("en-IN")}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-[var(--border)] space-y-3">
              <div>
                <div className="text-xs text-[var(--text-subtle)] mb-1">Quote validity (days)</div>
                <Input
                  type="number"
                  value={validityDays}
                  onChange={(e) => setValidityDays(parseInt(e.target.value) || 0)}
                />
              </div>
              <div className="text-xs text-[var(--text-muted)]">
                Valid until:{" "}
                <span className="font-semibold text-[var(--text)]">
                  {new Date(Date.now() + validityDays * 86400000).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-[var(--border)] space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start" leftIcon={<Eye className="h-3.5 w-3.5" />}>
                Preview
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start" leftIcon={<FileText className="h-3.5 w-3.5" />}>
                Generate PDF
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
