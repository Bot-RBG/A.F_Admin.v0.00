"use client";

import React from "react";
import { User, Camera, Mail, Phone, Shield, Calendar } from "lucide-react";
import { Card, CardHeader, CardTitle, Button, Input, PageHeader, UserAvatar, Badge, toast } from "@/components/ui";
import { useAuth } from "@/components/auth-provider";
import { formatDate } from "@/lib/utils";

export default function ProfilePage() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div>
      <PageHeader
        title="My Profile"
        description="Manage your account information and preferences."
        breadcrumbs={[{ label: "Dashboard", href: "/admin/dashboard" }, { label: "Profile" }]}
        actions={
          <Button size="sm" onClick={() => toast("success", "Profile updated", "Your profile has been saved.")}>
            Save Changes
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card padding="md" className="text-center">
          <div className="relative inline-block">
            <UserAvatar name={user.name} size="lg" imageUrl={user.avatarUrl} />
            <button className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-[var(--primary)] text-[var(--primary-foreground)] flex items-center justify-center border-2 border-[var(--surface)]">
              <Camera className="h-4 w-4" />
            </button>
          </div>
          <div className="mt-4">
            <div className="text-lg font-bold text-[var(--text)]">{user.name}</div>
            <div className="text-sm text-[var(--text-muted)]">{user.roleName}</div>
            <div className="mt-2"><Badge variant="success">{user.status}</Badge></div>
          </div>

          <div className="mt-6 space-y-2 text-left">
            <div className="flex items-center gap-2 p-2 text-sm">
              <Mail className="h-4 w-4 text-[var(--text-subtle)]" />
              <span className="text-[var(--text-muted)]">{user.email}</span>
            </div>
            <div className="flex items-center gap-2 p-2 text-sm">
              <Phone className="h-4 w-4 text-[var(--text-subtle)]" />
              <span className="text-[var(--text-muted)]">{user.phone || "—"}</span>
            </div>
            <div className="flex items-center gap-2 p-2 text-sm">
              <Shield className="h-4 w-4 text-[var(--text-subtle)]" />
              <span className="text-[var(--text-muted)]">{user.roleName}</span>
            </div>
            <div className="flex items-center gap-2 p-2 text-sm">
              <Calendar className="h-4 w-4 text-[var(--text-subtle)]" />
              <span className="text-[var(--text-muted)]">Member since {formatDate(user.createdAt)}</span>
            </div>
          </div>
        </Card>

        <div className="lg:col-span-2 space-y-4">
          <Card padding="md">
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input label="Full Name" defaultValue={user.name} />
              <Input label="Email" defaultValue={user.email} />
              <Input label="Phone" defaultValue={user.phone || ""} />
              <Input label="Role" defaultValue={user.roleName} disabled />
            </div>
          </Card>

          <Card padding="md">
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
            </CardHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input label="Current Password" type="password" />
              <div />
              <Input label="New Password" type="password" />
              <Input label="Confirm New Password" type="password" />
            </div>
            <div className="mt-3">
              <Button variant="outline" size="sm">Update Password</Button>
            </div>
          </Card>

          <Card padding="md">
            <CardHeader>
              <CardTitle>Login Sessions</CardTitle>
            </CardHeader>
            <div className="space-y-2">
              <div className="p-3 bg-[var(--surface-muted)] rounded-md flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-[var(--text)]">Chrome on macOS</div>
                  <div className="text-xs text-[var(--text-muted)]">Siliguri, India · Active now</div>
                </div>
                <Badge variant="success">Current</Badge>
              </div>
              <div className="p-3 bg-[var(--surface-muted)] rounded-md flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-[var(--text)]">Safari on iPhone</div>
                  <div className="text-xs text-[var(--text-muted)]">Siliguri, India · 2 hours ago</div>
                </div>
                <Button variant="outline" size="sm">Revoke</Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
