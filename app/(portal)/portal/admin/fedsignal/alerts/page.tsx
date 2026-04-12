"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Plus, Search } from "lucide-react";

interface AlertRow {
  id: string;
  icon: string;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  type: string;
  color: string;
  universityId?: string;
  isGlobal: boolean;
  createdAt: string;
}

const sampleAlerts: AlertRow[] = [
  { id: "1", icon: "⚡", title: "3 Priority Deadlines", description: "NSA Cyber RFP closes in 14 days. Proposal not started.", priority: "high", type: "deadline", color: "red", isGlobal: false, universityId: "tuskegee", createdAt: "2025-04-10" },
  { id: "2", icon: "📈", title: "DoD AI Funding +61%", description: "AI research spend surging. 8 new opportunities this week.", priority: "medium", type: "intelligence", color: "green", isGlobal: true, createdAt: "2025-04-10" },
  { id: "3", icon: "🤝", title: "SAIC Seeking HBCU Partner", description: "Cyber research program. Tuskegee is a 92% match.", priority: "medium", type: "partnership", color: "amber", isGlobal: false, universityId: "tuskegee", createdAt: "2025-04-09" },
  { id: "4", icon: "🏆", title: "Funding Gap: $275M vs Peers", description: "Howard received $320M NSF. Tuskegee received $45M.", priority: "low", type: "intelligence", color: "radar", isGlobal: false, universityId: "tuskegee", createdAt: "2025-04-08" },
  { id: "5", icon: "📋", title: "SAM.gov Registration Expiring", description: "Tuskegee SAM.gov registration expires in 30 days. Renew now.", priority: "high", type: "deadline", color: "red", isGlobal: false, universityId: "tuskegee", createdAt: "2025-04-07" },
  { id: "6", icon: "🎓", title: "New HBCU Consortium Opportunity", description: "ONR seeking 3+ HBCU consortium for $3.5M cyber BAA.", priority: "medium", type: "opportunity", color: "radar", isGlobal: true, createdAt: "2025-04-06" },
];

function getPriorityColor(priority: string): "destructive" | "default" | "secondary" {
  switch (priority) {
    case "high": return "destructive";
    case "medium": return "default";
    default: return "secondary";
  }
}

export default function FSAlertsAdminPage() {
  const [search, setSearch] = useState("");
  const filtered = sampleAlerts.filter(
    (a) => a.title.toLowerCase().includes(search.toLowerCase()) || a.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/portal/admin/fedsignal">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Strategic Alerts</h1>
          <p className="text-sm text-muted-foreground">Manage alerts for university dashboards</p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search alerts..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Alert
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/40">
                  <th className="text-center px-3 py-3 font-medium w-12"></th>
                  <th className="text-left px-4 py-3 font-medium">Alert</th>
                  <th className="text-center px-4 py-3 font-medium">Priority</th>
                  <th className="text-left px-4 py-3 font-medium">Type</th>
                  <th className="text-center px-4 py-3 font-medium">Scope</th>
                  <th className="text-left px-4 py-3 font-medium">Created</th>
                  <th className="text-right px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((alert) => (
                  <tr key={alert.id} className="border-b hover:bg-muted/20 transition-colors">
                    <td className="px-3 py-3 text-center text-lg">{alert.icon}</td>
                    <td className="px-4 py-3">
                      <div className="font-medium">{alert.title}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{alert.description}</div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Badge variant={getPriorityColor(alert.priority)} className="text-[10px] capitalize">
                        {alert.priority}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 capitalize text-muted-foreground">{alert.type}</td>
                    <td className="px-4 py-3 text-center">
                      <Badge variant={alert.isGlobal ? "default" : "outline"} className="text-[10px]">
                        {alert.isGlobal ? "Global" : alert.universityId}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {new Date(alert.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button variant="ghost" size="sm">Edit</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
