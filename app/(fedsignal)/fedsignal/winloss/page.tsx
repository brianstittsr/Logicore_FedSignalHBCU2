"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, BarChart3, Target } from "lucide-react";

const proposals = [
  { id: "1", title: "NIH AI Diagnostics SBIR", agency: "NIH", value: "$1.8M", status: "won", date: "Feb 2024" },
  { id: "2", title: "DOD Cybersecurity R&D", agency: "DOD", value: "$2.4M", status: "pending", date: "Mar 2024" },
  { id: "3", title: "NSF HBCU STEM Grant", agency: "NSF", value: "$950K", status: "lost", date: "Jan 2024" },
];

export default function WinLossPage() {
  const stats = {
    submitted: 12,
    won: 5,
    lost: 4,
    pending: 3,
    winRate: 56,
    totalValue: "$12.4M",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <BarChart3 className="h-6 w-6 text-primary" />
          Win/Loss Tracker
        </h1>
        <p className="text-muted-foreground">Track proposal outcomes and analyze performance</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Submitted</p>
            <p className="text-2xl font-bold">{stats.submitted}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Won</p>
            <p className="text-2xl font-bold text-green-600">{stats.won}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Win Rate</p>
            <p className="text-2xl font-bold text-blue-600">{stats.winRate}%</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Value</p>
            <p className="text-2xl font-bold">{stats.totalValue}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Proposals</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {proposals.map((p) => (
            <div key={p.id} className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <p className="font-medium">{p.title}</p>
                <p className="text-sm text-muted-foreground">{p.agency} • {p.date}</p>
              </div>
              <div className="text-right">
                <Badge className={
                  p.status === "won" ? "bg-green-600" :
                  p.status === "lost" ? "bg-red-600" : "bg-amber-600"
                }>
                  {p.status === "won" ? <TrendingUp className="mr-1 h-3 w-3" /> :
                   p.status === "lost" ? <TrendingDown className="mr-1 h-3 w-3" /> : null}
                  {p.status.toUpperCase()}
                </Badge>
                <p className="text-sm font-medium mt-1">{p.value}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
