"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Rocket, Target, Calendar, ExternalLink } from "lucide-react";

const sbirOpportunities = [
  { id: "1", agency: "DOD", topic: "AI for Logistics", phase: "Phase I", deadline: "Apr 15", value: "$300K", match: 92 },
  { id: "2", agency: "NIH", topic: "Digital Health Diagnostics", phase: "Phase II", deadline: "Mar 30", value: "$1.5M", match: 88 },
  { id: "3", agency: "NSF", topic: "Quantum Computing Research", phase: "Phase I", deadline: "May 1", value: "$275K", match: 75 },
  { id: "4", agency: "DOE", topic: "Clean Energy Storage", phase: "Phase II", deadline: "Apr 22", value: "$1.2M", match: 82 },
];

export default function SBIRPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Rocket className="h-6 w-6 text-primary" />
          SBIR/STTR Match
        </h1>
        <p className="text-muted-foreground">Find and track SBIR/STTR opportunities</p>
      </div>

      <div className="grid gap-4">
        {sbirOpportunities.map((opp) => (
          <Card key={opp.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge>{opp.agency}</Badge>
                    <Badge variant="outline">{opp.phase}</Badge>
                  </div>
                  <h3 className="font-semibold">{opp.topic}</h3>
                  <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Due: {opp.deadline}
                    </span>
                    <span className="font-medium text-green-600">{opp.value}</span>
                  </div>
                </div>
                <div className="text-right">
                  <Badge className={opp.match >= 90 ? "bg-green-600" : opp.match >= 80 ? "bg-blue-600" : "bg-amber-600"}>
                    {opp.match}% Match
                  </Badge>
                  <Button variant="ghost" size="sm" className="block mt-2">
                    <ExternalLink className="mr-1 h-3 w-3" />
                    View
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
