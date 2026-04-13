"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Hexagon, Users, Plus, ExternalLink } from "lucide-react";

const consortiums = [
  { id: "1", name: "HBCU AI Research Alliance", members: 8, focus: "Artificial Intelligence", activeProjects: 3, openForMembers: true },
  { id: "2", name: "Southeast Cybersecurity Consortium", members: 12, focus: "Cybersecurity", activeProjects: 5, openForMembers: false },
  { id: "3", name: "HBCU Health Equity Network", members: 15, focus: "Health Disparities", activeProjects: 4, openForMembers: true },
];

export default function ConsortiumPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Hexagon className="h-6 w-6 text-primary" />
            Consortiums
            <Badge variant="outline" className="text-amber-600">3 Active</Badge>
          </h1>
          <p className="text-muted-foreground">Multi-institution collaboration networks</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Start Consortium
        </Button>
      </div>

      <div className="grid gap-4">
        {consortiums.map((consortium) => (
          <Card key={consortium.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-lg">{consortium.name}</h3>
                    {consortium.openForMembers && (
                      <Badge variant="outline" className="text-green-600">Open</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">Focus: {consortium.focus}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {consortium.members} members
                    </span>
                    <span>{consortium.activeProjects} active projects</span>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  View
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
