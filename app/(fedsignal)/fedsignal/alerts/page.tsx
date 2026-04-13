"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, Clock, AlertTriangle, CheckCircle, Info, Filter, Settings } from "lucide-react";
import Link from "next/link";

interface Alert {
  id: string;
  type: "deadline" | "match" | "network" | "news" | "system";
  priority: "high" | "medium" | "low";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  action?: { label: string; href: string };
}

const mockAlerts: Alert[] = [
  {
    id: "1",
    type: "deadline",
    priority: "high",
    title: "NIH SBIR Phase I Deadline Approaching",
    message: "Your application for 'AI-Powered Health Diagnostics' is due in 2 days. Complete submission soon.",
    timestamp: "2 hours ago",
    read: false,
    action: { label: "View Application", href: "/portal/fedsignal/proposalpal" },
  },
  {
    id: "2",
    type: "match",
    priority: "high",
    title: "New 95% Match Opportunity",
    message: "Department of Defense seeking AI/ML research partners. Strong alignment with your capabilities.",
    timestamp: "5 hours ago",
    read: false,
    action: { label: "View Opportunity", href: "/portal/fedsignal/opportunities" },
  },
  {
    id: "3",
    type: "network",
    priority: "medium",
    title: "Howard University Seeking Teaming Partner",
    message: "Howard University posted a collaboration request for cybersecurity research consortium.",
    timestamp: "1 day ago",
    read: true,
    action: { label: "View Profile", href: "/portal/fedsignal/directory" },
  },
  {
    id: "4",
    type: "news",
    priority: "medium",
    title: "New NSF HBCU Funding Program Announced",
    message: "$50M new funding pool for HBCU STEM initiatives. Applications open next month.",
    timestamp: "2 days ago",
    read: true,
  },
  {
    id: "5",
    type: "system",
    priority: "low",
    title: "Weekly Match Report Ready",
    message: "Your personalized opportunity digest is ready for review.",
    timestamp: "3 days ago",
    read: true,
  },
];

const getAlertIcon = (type: string) => {
  switch (type) {
    case "deadline":
      return <Clock className="h-5 w-5 text-red-500" />;
    case "match":
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    case "network":
      return <Bell className="h-5 w-5 text-blue-500" />;
    case "news":
      return <Info className="h-5 w-5 text-amber-500" />;
    default:
      return <AlertTriangle className="h-5 w-5 text-gray-500" />;
  }
};

const getPriorityBadge = (priority: string) => {
  switch (priority) {
    case "high":
      return <Badge variant="destructive">High</Badge>;
    case "medium":
      return <Badge variant="secondary">Medium</Badge>;
    default:
      return <Badge variant="outline">Low</Badge>;
  }
};

export default function AlertsPage() {
  const unreadCount = mockAlerts.filter((a) => !a.read).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Bell className="h-6 w-6 text-primary" />
            Strategic Alerts
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2">{unreadCount} new</Badge>
            )}
          </h1>
          <p className="text-muted-foreground">
            Stay informed about deadlines, opportunities, and networking events
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Unread</p>
              <p className="text-2xl font-bold">{unreadCount}</p>
            </div>
            <Bell className="h-8 w-8 text-primary opacity-50" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">This Week</p>
              <p className="text-2xl font-bold">12</p>
            </div>
            <Clock className="h-8 w-8 text-amber-500 opacity-50" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total</p>
              <p className="text-2xl font-bold">{mockAlerts.length}</p>
            </div>
            <Info className="h-8 w-8 text-blue-500 opacity-50" />
          </CardContent>
        </Card>
      </div>

      {/* Alerts List */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Alerts</CardTitle>
          <CardDescription>Important updates and notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {mockAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`flex gap-4 rounded-lg border p-4 transition-colors ${
                !alert.read ? "bg-muted/50" : ""
              }`}
            >
              <div className="mt-0.5">{getAlertIcon(alert.type)}</div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold">{alert.title}</h4>
                  {getPriorityBadge(alert.priority)}
                  {!alert.read && (
                    <span className="h-2 w-2 rounded-full bg-primary" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{alert.message}</p>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs text-muted-foreground">{alert.timestamp}</span>
                  {alert.action && (
                    <Button size="sm" variant="outline" asChild>
                      <Link href={alert.action.href}>{alert.action.label}</Link>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
