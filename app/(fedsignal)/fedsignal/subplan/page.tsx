"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Building2, ExternalLink, Target } from "lucide-react";

const subOpportunities = [
  { id: "1", prime: "Boeing Defense", title: "Satellite Systems", naics: "541715", value: "$50M+", deadline: "Apr 15", match: 85 },
  { id: "2", prime: "Lockheed Martin", title: "Cybersecurity R&D", naics: "541512", value: "$25M", deadline: "Mar 30", match: 92 },
  { id: "3", prime: "Northrop Grumman", title: "AI/ML Integration", naics: "541511", value: "$18M", deadline: "Apr 22", match: 88 },
];

export default function SubPlanPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Target className="h-6 w-6 text-primary" />
          Sub Plan Finder
        </h1>
        <p className="text-muted-foreground">Discover subcontracting opportunities with primes</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search by prime contractor, NAICS, or capability..." className="pl-9" />
      </div>

      <div className="grid gap-4">
        {subOpportunities.map((sub) => (
          <Card key={sub.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{sub.prime}</span>
                  </div>
                  <h3 className="font-semibold mt-1">{sub.title}</h3>
                  <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
                    <span>NAICS: {sub.naics}</span>
                    <span>Value: {sub.value}</span>
                    <span>Due: {sub.deadline}</span>
                  </div>
                </div>
                <div className="text-right">
                  <Badge className={sub.match >= 90 ? "bg-green-600" : "bg-blue-600"}>{sub.match}% Match</Badge>
                  <Button variant="ghost" size="sm" className="block mt-2">
                    <ExternalLink className="mr-1 h-3 w-3" />
                    Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
