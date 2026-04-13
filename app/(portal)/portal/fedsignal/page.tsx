"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  LayoutDashboard,
  Target,
  Bell,
  Radar,
  GraduationCap,
  Users,
  TrendingUp,
  Award,
  Zap,
  ArrowRight,
  Building2,
  Briefcase,
  FileText,
  Calendar,
  BarChart3,
} from "lucide-react";

interface StatCard {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down" | "neutral";
  icon: React.ReactNode;
}

const stats: StatCard[] = [
  {
    title: "Active Opportunities",
    value: "47",
    change: "+12 this week",
    trend: "up",
    icon: <Target className="h-5 w-5" />,
  },
  {
    title: "Match Score Average",
    value: "84%",
    change: "+5% vs last month",
    trend: "up",
    icon: <Radar className="h-5 w-5" />,
  },
  {
    title: "HBCU Network",
    value: "101",
    change: "+3 new partners",
    trend: "up",
    icon: <GraduationCap className="h-5 w-5" />,
  },
  {
    title: "Proposals Won",
    value: "$2.4M",
    change: "YTD funding secured",
    trend: "up",
    icon: <Award className="h-5 w-5" />,
  },
];

const quickActions = [
  { name: "Opportunity Feed", href: "/portal/fedsignal/opportunities", icon: Target },
  { name: "Strategic Alerts", href: "/portal/fedsignal/alerts", icon: Bell },
  { name: "HBCU Scoreboard", href: "/portal/fedsignal/scoreboard", icon: TrendingUp },
  { name: "Capability Graph", href: "/portal/fedsignal/capabilities", icon: Zap },
  { name: "Proposal Pal", href: "/portal/fedsignal/proposalpal", icon: FileText },
  { name: "CRM & Contacts", href: "/portal/fedsignal/crm", icon: Users },
];

const recentAlerts = [
  { id: 1, type: "deadline", message: "NIH SBIR Deadline approaching", time: "2 days", priority: "high" },
  { id: 2, type: "match", message: "New 95% match opportunity: DoD AI Research", time: "5 hours ago", priority: "high" },
  { id: 3, type: "network", message: "Howard University seeking teaming partner", time: "1 day ago", priority: "medium" },
];

const topOpportunities = [
  { id: 1, agency: "Department of Defense", title: "AI/ML Research Initiative", match: 94, deadline: "Mar 15", value: "$2.5M" },
  { id: 2, agency: "NIH", title: "Health Disparities Research", match: 89, deadline: "Mar 22", value: "$1.8M" },
  { id: 3, agency: "NSF", title: "HBCU STEM Excellence Program", match: 87, deadline: "Apr 1", value: "$3.2M" },
];

export default function FedSignalDashboard() {
  const [selectedUni, setSelectedUni] = useState("Tuskegee University");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <LayoutDashboard className="h-6 w-6 text-primary" />
            Command Center
          </h1>
          <p className="text-muted-foreground">
            Welcome back to FedSignal Intelligence Platform
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select 
            className="rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={selectedUni}
            onChange={(e) => setSelectedUni(e.target.value)}
          >
            <option>Tuskegee University</option>
            <option>Howard University</option>
            <option>Florida A&M University</option>
            <option>Alabama A&M University</option>
            <option>NC A&T State University</option>
            <option>Morehouse College</option>
          </select>
          <Button asChild>
            <Link href="/portal/fedsignal/opportunities">
              <Target className="mr-2 h-4 w-4" />
              Browse Opportunities
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="rounded-lg bg-primary/10 p-2">
                  {stat.icon}
                </div>
                {stat.trend === "up" && (
                  <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                    <TrendingUp className="mr-1 h-3 w-3" />
                    {stat.change}
                  </Badge>
                )}
              </div>
              <div className="mt-4">
                <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Quick Actions */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Zap className="h-5 w-5 text-amber-500" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2">
            {quickActions.map((action) => (
              <Link
                key={action.name}
                href={action.href}
                className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted"
              >
                <action.icon className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">{action.name}</span>
                <ArrowRight className="ml-auto h-4 w-4 text-muted-foreground" />
              </Link>
            ))}
          </CardContent>
        </Card>

        {/* Top Opportunities */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Top Matched Opportunities
              </CardTitle>
              <CardDescription>Based on your institution capabilities</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/portal/fedsignal/opportunities">View All</Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {topOpportunities.map((opp) => (
              <div
                key={opp.id}
                className="flex items-center justify-between rounded-lg border p-4"
              >
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">{opp.agency}</p>
                  <p className="font-semibold">{opp.title}</p>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-muted-foreground">Deadline: {opp.deadline}</span>
                    <span className="text-muted-foreground">•</span>
                    <span className="font-medium text-green-600">{opp.value}</span>
                  </div>
                </div>
                <div className="text-right">
                  <Badge className={opp.match >= 90 ? "bg-green-600" : opp.match >= 80 ? "bg-blue-600" : "bg-amber-600"}>
                    {opp.match}% Match
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Alerts & Scoreboard */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <Bell className="h-5 w-5 text-red-500" />
                Strategic Alerts
                <Badge variant="destructive" className="ml-2">6</Badge>
              </CardTitle>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/portal/fedsignal/alerts">View All</Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentAlerts.map((alert) => (
              <div
                key={alert.id}
                className="flex items-start gap-3 rounded-lg border p-3"
              >
                <div className={`mt-0.5 h-2 w-2 rounded-full ${
                  alert.priority === "high" ? "bg-red-500" : "bg-amber-500"
                }`} />
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">{alert.message}</p>
                  <p className="text-xs text-muted-foreground">{alert.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                GovCon Readiness Score
              </CardTitle>
              <CardDescription>Your institution's competitive position</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/portal/fedsignal/scoreboard">Full Scoreboard</Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Tuskegee University</span>
                <span className="text-2xl font-bold text-primary">87</span>
              </div>
              <Progress value={87} className="h-2" />
              <p className="text-xs text-muted-foreground">
                Top 15% of HBCU institutions
              </p>
            </div>
            <div className="space-y-3">
              <p className="text-sm font-medium">Score Breakdown</p>
              <div className="space-y-2">
                {[
                  { label: "Research Capacity", value: 92 },
                  { label: "Past Performance", value: 78 },
                  { label: "Teaming Network", value: 85 },
                  { label: "Compliance Score", value: 95 },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{item.label}</span>
                    <div className="flex items-center gap-2">
                      <Progress value={item.value} className="h-1.5 w-24" />
                      <span className="w-8 text-right font-medium">{item.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
