"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  GraduationCap,
  Target,
  Bell,
  Users,
  Building2,
  BarChart3,
  Settings,
  ExternalLink,
  Plus,
  Database,
  Shield,
  UserPlus,
} from "lucide-react";

interface AdminCard {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  count?: number;
  badge?: string;
  badgeVariant?: "default" | "secondary" | "destructive" | "outline";
}

const adminCards: AdminCard[] = [
  {
    title: "Universities / HBCUs",
    description: "Manage registered HBCU/MSI institutions, colors, capabilities, and GovCon readiness scores.",
    icon: <GraduationCap className="h-6 w-6" />,
    href: "/portal/admin/fedsignal/universities",
    count: 6,
    badge: "Core",
  },
  {
    title: "Opportunities",
    description: "Create, edit, and manage government funding opportunities. Set match scores, deadlines, and tags.",
    icon: <Target className="h-6 w-6" />,
    href: "/portal/admin/fedsignal/opportunities",
    count: 47,
    badge: "12 new",
    badgeVariant: "default",
  },
  {
    title: "Strategic Alerts",
    description: "Manage alerts shown to university users. Create deadline, intelligence, and partnership alerts.",
    icon: <Bell className="h-6 w-6" />,
    href: "/portal/admin/fedsignal/alerts",
    count: 6,
    badge: "3 urgent",
    badgeVariant: "destructive",
  },
  {
    title: "Consortiums",
    description: "Manage multi-university partnerships and consortium workspaces for collaborative proposals.",
    icon: <Users className="h-6 w-6" />,
    href: "/portal/admin/fedsignal/consortiums",
    count: 3,
  },
  {
    title: "Contacts & CRM",
    description: "Manage prime contractors, agency contacts, and partner relationships across the HBCU network.",
    icon: <Building2 className="h-6 w-6" />,
    href: "/portal/admin/fedsignal/contacts",
    count: 24,
  },
  {
    title: "Funding Domains",
    description: "Configure funding domains (Cybersecurity, Defense R&D, AI/ML, etc.) and their funding totals.",
    icon: <BarChart3 className="h-6 w-6" />,
    href: "/portal/admin/fedsignal/domains",
  },
  {
    title: "Access Control (RBAC)",
    description: "Manage user roles, permissions, and Firebase Authentication settings for FedSignal.",
    icon: <Shield className="h-6 w-6" />,
    href: "/portal/admin/fedsignal/rbac",
    count: 43,
    badge: "Security",
    badgeVariant: "outline",
  },
  {
    title: "HBCU Onboarding",
    description: "Manage university onboarding wizard, registration progress, and team invitations.",
    icon: <UserPlus className="h-6 w-6" />,
    href: "/portal/admin/fedsignal/onboarding",
    count: 2,
    badge: "Setup",
    badgeVariant: "secondary",
  },
  {
    title: "Platform Settings",
    description: "Configure FedSignal platform settings: fiscal year, default university, feature flags, phase banner.",
    icon: <Settings className="h-6 w-6" />,
    href: "/portal/admin/fedsignal/settings",
  },
  {
    title: "Database Seeder",
    description: "Seed the Firestore database with sample HBCU data, opportunities, and alerts for development.",
    icon: <Database className="h-6 w-6" />,
    href: "/portal/admin/fedsignal/seed",
    badge: "Dev",
    badgeVariant: "secondary",
  },
];

export default function FedSignalAdminPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">FedSignal Administration</h1>
          <p className="text-muted-foreground mt-1">
            Manage the Government Funding Intelligence platform for HBCUs
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" asChild>
            <Link href="/fedsignal" target="_blank">
              <ExternalLink className="h-4 w-4 mr-2" />
              Open FedSignal
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Universities", value: "6", color: "text-blue-600" },
          { label: "Active Opportunities", value: "47", color: "text-green-600" },
          { label: "Pipeline Value", value: "$14.2M", color: "text-amber-600" },
          { label: "Consortiums", value: "3", color: "text-purple-600" },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Admin Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {adminCards.map((card) => (
          <Link key={card.title} href={card.href}>
            <Card className="h-full hover:shadow-md transition-shadow cursor-pointer border-muted hover:border-primary/30">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="p-2 rounded-lg bg-[#0f2a4a]/5 text-[#1a56db]">
                    {card.icon}
                  </div>
                  <div className="flex items-center gap-2">
                    {card.count !== undefined && (
                      <span className="text-sm font-mono text-muted-foreground">{card.count}</span>
                    )}
                    {card.badge && (
                      <Badge variant={card.badgeVariant || "outline"} className="text-[10px]">
                        {card.badge}
                      </Badge>
                    )}
                  </div>
                </div>
                <CardTitle className="text-base mt-3">{card.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-xs">{card.description}</CardDescription>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Firestore Collections Reference */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Firestore Collections</CardTitle>
          <CardDescription>
            FedSignal data is stored in prefixed Firestore collections (fs_*) to keep it isolated from the main platform.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {[
              "fs_universities",
              "fs_opportunities",
              "fs_contacts",
              "fs_capabilities",
              "fs_consortiums",
              "fs_alerts",
              "fs_proposals",
              "fs_winLoss",
              "fs_calendarEvents",
              "fs_activities",
              "fs_reports",
              "fs_settings",
            ].map((col) => (
              <code
                key={col}
                className="text-xs bg-muted px-2 py-1.5 rounded font-mono"
              >
                {col}
              </code>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
