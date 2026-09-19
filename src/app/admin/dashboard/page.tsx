"use client";

import React from "react";
import Link from "next/link";
import {
  MessageSquare,
  FileText,
  FolderKanban,
  ListChecks,
  Users,
  IndianRupee,
  TrendingUp,
  ArrowRight,
  Plus,
  Phone,
  Mail,
  Calendar as CalendarIcon,
  Clock,
} from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import {
  Card,
  CardHeader,
  CardTitle,
  Badge,
  StatusBadge,
  UserAvatar,
  PageHeader,
  Button,
  EmptyState,
} from "@/components/ui";
import {
  enquiries,
  projects,
  tasks,
  activityLogs,
  customers,
  quotations,
  payments,
  getDashboardStats,
} from "@/lib/mock-data";
import {
  formatCurrency,
  formatDate,
  formatRelativeTime,
  truncate,
} from "@/lib/utils";

export default function DashboardPage() {
  const stats = getDashboardStats();

  // Enquiry pipeline data (for funnel/bar chart)
  const enquiryPipeline = [
    { name: "New", value: enquiries.filter((e) => e.status === "new").length, color: "#5a97b5" },
    { name: "Contacted", value: enquiries.filter((e) => e.status === "contacted").length, color: "#7ea368" },
    { name: "Quoted", value: enquiries.filter((e) => e.status === "quoted").length, color: "#c48f5c" },
    { name: "Negotiation", value: enquiries.filter((e) => e.status === "negotiation").length, color: "#c89045" },
    { name: "Converted", value: enquiries.filter((e) => e.status === "approved").length, color: "#4f7a3f" },
    { name: "Closed", value: enquiries.filter((e) => ["rejected", "completed", "archived"].includes(e.status)).length, color: "#7d7063" },
  ];

  // Project status distribution
  const projectOverview = [
    { name: "Planning", value: projects.filter((p) => p.status === "planning").length, color: "#9a8d7a" },
    { name: "In Progress", value: projects.filter((p) => ["design", "measurement", "procurement", "manufacturing"].includes(p.status)).length, color: "#c48f5c" },
    { name: "Installation", value: projects.filter((p) => p.status === "installation").length, color: "#c89045" },
    { name: "Completed", value: projects.filter((p) => p.status === "completed").length, color: "#4f7a3f" },
  ];

  // Revenue (last 6 months, mock)
  const revenueData = [
    { month: "Aug", value: 245000 },
    { month: "Sep", value: 312000 },
    { month: "Oct", value: 289000 },
    { month: "Nov", value: 421000 },
    { month: "Dec", value: 378000 },
    { month: "Jan", value: 495000 },
  ];

  const recentEnquiries = [...enquiries]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const upcomingTasks = [...tasks]
    .filter((t) => t.status !== "completed" && t.status !== "cancelled")
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 5);

  const recentActivity = [...activityLogs]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 6);

  const statCards = [
    {
      label: "New Enquiries",
      value: stats.newEnquiries,
      icon: MessageSquare,
      trend: "+3 this week",
      trendUp: true,
      href: "/admin/enquiries",
      color: "text-[var(--info)]",
      bg: "bg-[var(--info-bg)]",
    },
    {
      label: "Pending Quotes",
      value: stats.pendingQuotes,
      icon: FileText,
      trend: "Awaiting response",
      href: "/admin/quotations",
      color: "text-[var(--warning)]",
      bg: "bg-[var(--warning-bg)]",
    },
    {
      label: "Active Projects",
      value: stats.activeProjects,
      icon: FolderKanban,
      trend: `${projects.filter((p) => p.status === "installation").length} in installation`,
      href: "/admin/projects",
      color: "text-[var(--primary)]",
      bg: "bg-[var(--primary)]/10",
    },
    {
      label: "Today's Tasks",
      value: stats.todaysTasks,
      icon: ListChecks,
      trend: "Action required",
      href: "/admin/tasks",
      color: "text-[var(--danger)]",
      bg: "bg-[var(--danger-bg)]",
    },
    {
      label: "New Customers",
      value: stats.newCustomers,
      icon: Users,
      trend: "Last 7 days",
      trendUp: true,
      href: "/admin/customers",
      color: "text-[var(--success)]",
      bg: "bg-[var(--success-bg)]",
    },
    {
      label: "Outstanding Payments",
      value: formatCurrency(stats.outstanding),
      icon: IndianRupee,
      trend: "Due this month",
      href: "/admin/payments",
      color: "text-[var(--accent)]",
      bg: "bg-[var(--accent)]/10",
      isString: true,
    },
  ];

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Overview of your business performance and recent activity."
        actions={
          <>
            <Link href="/admin/enquiries">
              <Button variant="outline" size="sm" leftIcon={<Plus className="h-3.5 w-3.5" />}>
                New Enquiry
              </Button>
            </Link>
            <Link href="/admin/quotations/new">
              <Button size="sm" leftIcon={<Plus className="h-3.5 w-3.5" />}>
                New Quotation
              </Button>
            </Link>
          </>
        }
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link key={card.label} href={card.href}>
              <Card padding="md" hover className="h-full group">
                <div className="flex items-start justify-between mb-3">
                  <div
                    className={`h-9 w-9 rounded-md flex items-center justify-center ${card.bg} ${card.color}`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 text-[var(--text-subtle)] opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="text-[11px] text-[var(--text-muted)] font-medium uppercase tracking-wider">
                  {card.label}
                </div>
                <div className="mt-1 text-2xl font-bold text-[var(--text)] tracking-tight">
                  {card.value}
                </div>
                <div className="mt-2 text-[11px] text-[var(--text-subtle)] flex items-center gap-1">
                  {card.trendUp && <TrendingUp className="h-3 w-3 text-[var(--success)]" />}
                  {card.trend}
                </div>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {/* Revenue Chart */}
        <Card padding="md" className="lg:col-span-2">
          <CardHeader>
            <div>
              <CardTitle>Revenue Collection</CardTitle>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                Monthly payments received (last 6 months)
              </p>
            </div>
            <Badge variant="success" size="md">
              {formatCurrency(revenueData[revenueData.length - 1].value)} this month
            </Badge>
          </CardHeader>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#c48f5c" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#c48f5c" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis
                  dataKey="month"
                  stroke="var(--text-subtle)"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="var(--text-subtle)"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--surface)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                  formatter={(value) => formatCurrency(Number(value) || 0)}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#c48f5c"
                  strokeWidth={2.5}
                  dot={{ fill: "#c48f5c", r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Project Overview */}
        <Card padding="md">
          <CardHeader>
            <div>
              <CardTitle>Project Overview</CardTitle>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                Active project stages
              </p>
            </div>
          </CardHeader>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={projectOverview}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                >
                  {projectOverview.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--surface)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-2">
            {projectOverview.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-[var(--text-muted)]">{item.name}</span>
                </div>
                <span className="font-semibold text-[var(--text)]">{item.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Enquiry Pipeline */}
      <Card padding="md" className="mb-6">
        <CardHeader>
          <div>
            <CardTitle>Enquiry Pipeline</CardTitle>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              Where enquiries are in your sales process
            </p>
          </div>
          <Link href="/admin/enquiries" className="text-xs font-medium text-[var(--primary)] hover:underline">
            View all →
          </Link>
        </CardHeader>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={enquiryPipeline} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis
                dataKey="name"
                stroke="var(--text-subtle)"
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="var(--text-subtle)"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
                cursor={{ fill: "var(--surface-muted)" }}
              />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {enquiryPipeline.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Bottom row: Recent enquiries + Upcoming tasks + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent Enquiries */}
        <Card padding="none" className="lg:col-span-2">
          <div className="px-5 py-4 border-b border-[var(--border)] flex items-center justify-between">
            <div>
              <CardTitle>Recent Enquiries</CardTitle>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                Latest enquiries from customers
              </p>
            </div>
            <Link href="/admin/enquiries" className="text-xs font-medium text-[var(--primary)] hover:underline">
              View all →
            </Link>
          </div>
          <div className="divide-y divide-[var(--border)]">
            {recentEnquiries.map((enq) => {
              const customer = customers.find((c) => c.id === enq.customerId);
              return (
                <Link
                  key={enq.id}
                  href={`/admin/enquiries/${enq.id}`}
                  className="flex items-center gap-3 p-4 hover:bg-[var(--surface-muted)] transition-colors"
                >
                  <UserAvatar name={enq.customerName} size="sm" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-sm text-[var(--text)]">
                        {enq.customerName}
                      </span>
                      <span className="text-[11px] text-[var(--text-subtle)] font-mono">
                        {enq.number}
                      </span>
                    </div>
                    <div className="text-xs text-[var(--text-muted)] mt-0.5 truncate">
                      {enq.service} · {truncate(enq.requirement, 60)}
                    </div>
                  </div>
                  <div className="hidden sm:flex flex-col items-end gap-1">
                    <StatusBadge status={enq.status} />
                    <span className="text-[10px] text-[var(--text-subtle)]">
                      {formatRelativeTime(enq.createdAt)}
                    </span>
                  </div>
                </Link>
              );
            })}
            {recentEnquiries.length === 0 && (
              <EmptyState
                icon={<MessageSquare className="h-10 w-10" />}
                title="No enquiries yet"
                description="When customers submit enquiries through the website, they will appear here."
              />
            )}
          </div>
        </Card>

        {/* Upcoming Tasks */}
        <Card padding="none">
          <div className="px-5 py-4 border-b border-[var(--border)] flex items-center justify-between">
            <div>
              <CardTitle>Upcoming Tasks</CardTitle>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">Due soon</p>
            </div>
            <Link href="/admin/tasks" className="text-xs font-medium text-[var(--primary)] hover:underline">
              All →
            </Link>
          </div>
          <div className="divide-y divide-[var(--border)]">
            {upcomingTasks.map((task) => (
              <Link
                key={task.id}
                href="/admin/tasks"
                className="block p-4 hover:bg-[var(--surface-muted)] transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-[var(--text)] line-clamp-1">
                      {task.name}
                    </div>
                    <div className="text-xs text-[var(--text-muted)] mt-1 line-clamp-1">
                      {task.customerName || task.projectName || "General task"}
                    </div>
                  </div>
                  <StatusBadge status={task.priority} />
                </div>
                <div className="flex items-center gap-3 mt-2 text-[11px] text-[var(--text-subtle)]">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatDate(task.dueDate)}
                  </span>
                  {task.assignedUserName && (
                    <span className="flex items-center gap-1">
                      <UserAvatar name={task.assignedUserName} size="xs" />
                      {task.assignedUserName.split(" ")[0]}
                    </span>
                  )}
                </div>
              </Link>
            ))}
            {upcomingTasks.length === 0 && (
              <EmptyState
                icon={<ListChecks className="h-10 w-10" />}
                title="All caught up"
                description="No pending tasks."
              />
            )}
          </div>
        </Card>
      </div>

      {/* Activity log */}
      <Card padding="none" className="mt-6">
        <div className="px-5 py-4 border-b border-[var(--border)] flex items-center justify-between">
          <div>
            <CardTitle>Recent Activity</CardTitle>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              Audit trail of business events
            </p>
          </div>
          <Link href="/admin/activity" className="text-xs font-medium text-[var(--primary)] hover:underline">
            View all →
          </Link>
        </div>
        <div className="divide-y divide-[var(--border)]">
          {recentActivity.map((log) => (
            <div key={log.id} className="flex items-start gap-3 p-4">
              <UserAvatar name={log.userName || "System"} size="sm" />
              <div className="flex-1 min-w-0">
                <div className="text-sm text-[var(--text)]">
                  <span className="font-semibold">{log.userName}</span>{" "}
                  <span className="text-[var(--text-muted)]">{log.description}</span>
                </div>
                <div className="text-[11px] text-[var(--text-subtle)] mt-0.5">
                  {formatRelativeTime(log.createdAt)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
