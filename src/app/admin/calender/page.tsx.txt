"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { Calendar as CalendarIcon, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { Card, Button, Badge, PageHeader, EmptyState } from "@/components/ui";
import { calendarEvents } from "@/lib/mock-data";
import { formatDate } from "@/lib/utils";

export default function CalendarPage() {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDay = firstDay.getDay();
  const monthName = firstDay.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  const days = [];
  for (let i = 0; i < startingDay; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);

  const getEventsForDay = (day: number) => {
    return calendarEvents.filter((e) => {
      const d = new Date(e.startsAt);
      return d.getDate() === day && d.getMonth() === month && d.getFullYear() === year;
    });
  };

  const eventTypeColors: Record<string, string> = {
    visit: "bg-[var(--info)]",
    measurement: "bg-[var(--primary)]",
    followup: "bg-[var(--warning)]",
    meeting: "bg-[var(--accent)]",
    installation: "bg-[var(--success)]",
    deadline: "bg-[var(--danger)]",
    payment_reminder: "bg-[var(--warning)]",
    other: "bg-[var(--text-subtle)]",
  };

  return (
    <div>
      <PageHeader
        title="Calendar"
        description="Schedule visits, meetings, installations and deadlines."
        breadcrumbs={[{ label: "Dashboard", href: "/admin/dashboard" }, { label: "Calendar" }]}
        actions={
          <Button size="sm" leftIcon={<Plus className="h-3.5 w-3.5" />}>New Event</Button>
        }
      />

      <Card padding="md">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-[var(--text)]">{monthName}</h2>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm"><ChevronLeft className="h-4 w-4" /></Button>
            <Button variant="outline" size="sm">Today</Button>
            <Button variant="outline" size="sm"><ChevronRight className="h-4 w-4" /></Button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-px bg-[var(--border)] rounded-lg overflow-hidden">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <div key={d} className="bg-[var(--surface-muted)] py-2 text-center text-xs font-semibold text-[var(--text-subtle)] uppercase">
              {d}
            </div>
          ))}
          {days.map((day, i) => {
            const events = day ? getEventsForDay(day) : [];
            const isToday = day === today.getDate();
            return (
              <div
                key={i}
                className={`bg-[var(--surface)] min-h-[90px] p-1.5 ${!day ? "opacity-40" : ""}`}
              >
                {day && (
                  <>
                    <div className={`text-xs font-semibold mb-1 ${isToday ? "text-[var(--primary)]" : "text-[var(--text-muted)]"}`}>
                      {day}
                    </div>
                    <div className="space-y-0.5">
                      {events.slice(0, 2).map((e) => (
                        <div
                          key={e.id}
                          className="text-[10px] text-white px-1.5 py-0.5 rounded truncate"
                          style={{ backgroundColor: "var(--primary)" }}
                          title={e.title}
                        >
                          {e.title}
                        </div>
                      ))}
                      {events.length > 2 && (
                        <div className="text-[10px] text-[var(--text-subtle)]">+{events.length - 2} more</div>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-6">
          <h3 className="text-sm font-semibold text-[var(--text)] mb-3">Upcoming Events</h3>
          <div className="space-y-2">
            {calendarEvents.slice(0, 5).map((e) => (
              <div key={e.id} className="flex items-center gap-3 p-3 bg-[var(--surface-muted)] rounded-md">
                <div className={`h-10 w-1 rounded-full ${eventTypeColors[e.type || "other"]}`} />
                <div className="flex-1">
                  <div className="text-sm font-medium text-[var(--text)]">{e.title}</div>
                  <div className="text-xs text-[var(--text-muted)] mt-0.5">
                    {formatDate(e.startsAt)} {e.location && `· ${e.location}`}
                  </div>
                </div>
                {e.customerName && <Badge variant="outline">{e.customerName}</Badge>}
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
