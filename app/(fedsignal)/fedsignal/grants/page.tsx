"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, FileText, Calendar, DollarSign, Filter, Plus } from "lucide-react";

const grants = [
  { id: 1, title: "NSF HBCU Research Grant", agency: "National Science Foundation", amount: "$250,000", deadline: "2026-05-15", status: "Open", type: "Research" },
  { id: 2, title: "DoD STEM Education Grant", agency: "Department of Defense", amount: "$500,000", deadline: "2026-04-30", status: "Open", type: "Education" },
  { id: 3, title: "NASA Minority University Research", agency: "NASA", amount: "$750,000", deadline: "2026-06-01", status: "Draft", type: "Research" },
  { id: 4, title: "DOE Cybersecurity Workforce Grant", agency: "Department of Energy", amount: "$400,000", deadline: "2026-05-20", status: "Open", type: "Workforce" },
];

export default function GrantsPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Grant Tracker</h1>
          <p className="text-muted-foreground">Monitor grant opportunities and applications</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          New Application
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search grants..." className="pl-10" />
        </div>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          Filter
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Grants</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">12</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">8</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">$4.2M</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Grant Opportunities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {grants.map((grant) => (
              <div key={grant.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{grant.title}</span>
                    <Badge variant={grant.status === "Open" ? "default" : "secondary"}>{grant.status}</Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{grant.agency}</span>
                    <span className="flex items-center gap-1">
                      <DollarSign className="h-3 w-3" />
                      {grant.amount}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Due: {grant.deadline}
                    </span>
                  </div>
                </div>
                <Button variant="outline" size="sm">View</Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
