"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Plus, Save, Shield, UserCog, Users, Lock, Mail, CheckCircle2, AlertTriangle } from "lucide-react";

// FedSignal RBAC Role definitions
const fsRoles = [
  {
    id: "admin",
    name: "Platform Admin",
    description: "Full access to all FedSignal features and university data",
    permissions: ["read", "write", "delete", "manage_users", "manage_settings", "view_all_universities"],
    color: "bg-red-100 text-red-800",
    userCount: 2,
  },
  {
    id: "vp_research",
    name: "VP Research",
    description: "University leadership with full access to their institution's data",
    permissions: ["read", "write", "manage_team", "view_analytics"],
    color: "bg-blue-100 text-blue-800",
    userCount: 6,
  },
  {
    id: "researcher",
    name: "Researcher",
    description: "Faculty and researchers who can view opportunities and track proposals",
    permissions: ["read", "write_proposals", "track_opportunities"],
    color: "bg-green-100 text-green-800",
    userCount: 24,
  },
  {
    id: "bd_manager",
    name: "BD Manager",
    description: "Business development staff who manage partnerships and contacts",
    permissions: ["read", "manage_contacts", "manage_consortiums", "view_crm"],
    color: "bg-amber-100 text-amber-800",
    userCount: 8,
  },
  {
    id: "president",
    name: "University President",
    description: "Executive view with read-only access to all institutional data",
    permissions: ["read", "view_analytics", "view_board_reports"],
    color: "bg-purple-100 text-purple-800",
    userCount: 3,
  },
];

// Sample users
const sampleUsers = [
  { id: "1", email: "admin@logicorehsv.com", name: "Platform Administrator", role: "admin", universityId: null, status: "active", lastLogin: "2025-04-12 09:30" },
  { id: "2", email: "wilson@tuskegee.edu", name: "Dr. James Wilson", role: "vp_research", universityId: "tuskegee", status: "active", lastLogin: "2025-04-11 14:22" },
  { id: "3", email: "davis@howard.edu", name: "Dr. Angela Davis", role: "vp_research", universityId: "howard", status: "active", lastLogin: "2025-04-10 11:45" },
  { id: "4", email: "researcher@tuskegee.edu", name: "Research Team", role: "researcher", universityId: "tuskegee", status: "active", lastLogin: "2025-04-09 16:30" },
  { id: "5", email: "bd@famu.edu", name: "BD Manager", role: "bd_manager", universityId: "famu", status: "pending", lastLogin: null },
];

// Firebase Auth settings
const authSettings = {
  requireEmailVerification: true,
  allowPasswordReset: true,
  mfaRequired: false,
  sessionTimeout: 24, // hours
  passwordMinLength: 12,
  passwordRequireSpecialChar: true,
  oauthProviders: ["google", "microsoft"],
};

export default function FSRBACPage() {
  const [activeTab, setActiveTab] = useState<"roles" | "users" | "auth">("roles");
  const [settings, setSettings] = useState(authSettings);
  const [showInviteModal, setShowInviteModal] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/portal/admin/fedsignal">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Shield className="h-6 w-6" />
            Role-Based Access Control
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage FedSignal user roles, permissions, and Firebase Authentication settings
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b pb-2">
        {[
          { id: "roles", label: "Roles & Permissions", icon: UserCog },
          { id: "users", label: "User Management", icon: Users },
          { id: "auth", label: "Firebase Auth Settings", icon: Lock },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "bg-primary text-primary-foreground"
                : "hover:bg-muted"
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Roles Tab */}
      {activeTab === "roles" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">FedSignal Roles</h2>
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Create Custom Role
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {fsRoles.map((role) => (
              <Card key={role.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className={`px-3 py-1 rounded-full text-xs font-semibold ${role.color}`}>
                        {role.name}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{role.name}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{role.description}</p>
                        <div className="flex flex-wrap gap-2 mt-3">
                          {role.permissions.map((permission) => (
                            <Badge key={permission} variant="outline" className="text-[10px] capitalize">
                              {permission.replace("_", " ")}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">{role.userCount}</div>
                      <div className="text-xs text-muted-foreground">users</div>
                      <Button variant="ghost" size="sm" className="mt-2">
                        Edit Role
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="bg-amber-50 border-amber-200">
            <CardContent className="p-4 flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-amber-800">
                <strong>Role Changes Apply Immediately</strong>
                <p className="mt-1">
                  Changes to role permissions will take effect the next time a user refreshes their session. Users will not be logged out automatically.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === "users" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold">FedSignal Users</h2>
              <p className="text-sm text-muted-foreground">{sampleUsers.length} total users across all universities</p>
            </div>
            <Button onClick={() => setShowInviteModal(true)}>
              <Mail className="h-4 w-4 mr-2" />
              Invite User
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/40">
                    <th className="text-left px-4 py-3 font-medium">User</th>
                    <th className="text-left px-4 py-3 font-medium">Role</th>
                    <th className="text-left px-4 py-3 font-medium">University</th>
                    <th className="text-center px-4 py-3 font-medium">Status</th>
                    <th className="text-left px-4 py-3 font-medium">Last Login</th>
                    <th className="text-right px-4 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sampleUsers.map((user) => {
                    const role = fsRoles.find((r) => r.id === user.role);
                    return (
                      <tr key={user.id} className="border-b hover:bg-muted/20">
                        <td className="px-4 py-3">
                          <div className="font-medium">{user.name}</div>
                          <div className="text-xs text-muted-foreground font-mono">{user.email}</div>
                        </td>
                        <td className="px-4 py-3">
                          <Badge className={role?.color}>{role?.name}</Badge>
                        </td>
                        <td className="px-4 py-3 capitalize">{user.universityId || "Platform"}</td>
                        <td className="px-4 py-3 text-center">
                          <Badge
                            variant={user.status === "active" ? "default" : "secondary"}
                            className={user.status === "pending" ? "bg-amber-100 text-amber-800" : ""}
                          >
                            {user.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">{user.lastLogin || "Never"}</td>
                        <td className="px-4 py-3 text-right">
                          <Button variant="ghost" size="sm">Edit</Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Auth Settings Tab */}
      {activeTab === "auth" && (
        <div className="space-y-6 max-w-2xl">
          <div>
            <h2 className="text-lg font-semibold mb-4">Firebase Authentication Settings</h2>
            <p className="text-sm text-muted-foreground">
              Configure how users authenticate with FedSignal. Changes require Firebase Console admin access.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email & Password Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Require Email Verification</div>
                  <div className="text-sm text-muted-foreground">Users must verify email before accessing platform</div>
                </div>
                <Switch
                  checked={settings.requireEmailVerification}
                  onCheckedChange={(checked) => setSettings({ ...settings, requireEmailVerification: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Allow Password Reset</div>
                  <div className="text-sm text-muted-foreground">Enable self-service password reset via email</div>
                </div>
                <Switch
                  checked={settings.allowPasswordReset}
                  onCheckedChange={(checked) => setSettings({ ...settings, allowPasswordReset: checked })}
                />
              </div>

              <div className="pt-4 border-t space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Minimum Password Length</Label>
                    <Input
                      type="number"
                      value={settings.passwordMinLength}
                      onChange={(e) => setSettings({ ...settings, passwordMinLength: parseInt(e.target.value) })}
                      min={8}
                      max={32}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Session Timeout (hours)</Label>
                    <Input
                      type="number"
                      value={settings.sessionTimeout}
                      onChange={(e) => setSettings({ ...settings, sessionTimeout: parseInt(e.target.value) })}
                      min={1}
                      max={168}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Require Special Characters</div>
                    <div className="text-sm text-muted-foreground">Passwords must contain at least one special character</div>
                  </div>
                  <Switch
                    checked={settings.passwordRequireSpecialChar}
                    onCheckedChange={(checked) => setSettings({ ...settings, passwordRequireSpecialChar: checked })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Lock className="h-4 w-4" />
                OAuth Providers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { id: "google", name: "Google", enabled: settings.oauthProviders.includes("google") },
                  { id: "microsoft", name: "Microsoft", enabled: settings.oauthProviders.includes("microsoft") },
                  { id: "github", name: "GitHub", enabled: false },
                ].map((provider) => (
                  <div key={provider.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-muted flex items-center justify-center text-lg">
                        {provider.id === "google" ? "G" : provider.id === "microsoft" ? "M" : "GH"}
                      </div>
                      <div>
                        <div className="font-medium">{provider.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {provider.enabled ? "Enabled" : "Disabled"}
                        </div>
                      </div>
                    </div>
                    <Switch checked={provider.enabled} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                Multi-Factor Authentication (MFA)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Require MFA for Admin Roles</div>
                  <div className="text-sm text-muted-foreground">
                    Platform admins and VP Research roles must use 2FA
                  </div>
                </div>
                <Switch
                  checked={settings.mfaRequired}
                  onCheckedChange={(checked) => setSettings({ ...settings, mfaRequired: checked })}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button>
              <Save className="h-4 w-4 mr-2" />
              Save Auth Settings
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
