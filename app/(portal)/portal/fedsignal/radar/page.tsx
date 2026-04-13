"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Radar, Target, TrendingUp, AlertCircle, CheckCircle } from "lucide-react";

export default function RadarPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Radar className="h-6 w-6 text-primary" />
          FedSignal Radar
        </h1>
        <p className="text-muted-foreground">Opportunity matching and tracking intelligence</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Active Matches</p>
            <p className="text-2xl font-bold">47</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">90%+ Match</p>
            <p className="text-2xl font-bold text-green-600">12</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">This Week</p>
            <p className="text-2xl font-bold text-blue-600">8</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Avg Score</p>
            <p className="text-2xl font-bold">84%</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Match Score Distribution
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { range: "95-100%", count: 3, color: "bg-green-600" },
            { range: "90-94%", count: 9, color: "bg-green-500" },
            { range: "85-89%", count: 15, color: "bg-blue-500" },
            { range: "80-84%", count: 12, color: "bg-blue-400" },
            { range: "75-79%", count: 8, color: "bg-amber-500" },
          ].map((item) => (
            <div key={item.range} className="flex items-center gap-4">
              <span className="w-16 text-sm font-medium">{item.range}</span>
              <Progress value={(item.count / 47) * 100} className={`h-3 flex-1 ${item.color}`} />
              <span className="w-8 text-sm text-muted-foreground">{item.count}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
