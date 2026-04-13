"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, User, Mail, Phone, Building2, Plus, Edit } from "lucide-react";

const leadershipTeam = [
  { id: "1", name: "Dr. Charlotte Morris", role: "President", department: "Office of the President", email: "cmorris@tuskegee.edu", phone: "(334) 727-8011", primary: true },
  { id: "2", name: "Dr. William Campbell", role: "VP Research", department: "Research & Innovation", email: "wcampbell@tuskegee.edu", phone: "(334) 727-8012", primary: true },
  { id: "3", name: "Dr. Angela Foster", role: "Dean, Engineering", department: "College of Engineering", email: "afoster@tuskegee.edu", phone: "(334) 727-8456", primary: false },
  { id: "4", name: "Dr. Marcus Wright", role: "Director, Sponsored Programs", department: "Research Administration", email: "mwright@tuskegee.edu", phone: "(334) 727-8923", primary: true },
];

export default function LeadershipPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <User className="h-6 w-6 text-primary" />
            Leadership
          </h1>
          <p className="text-muted-foreground">Manage institutional leadership contacts for proposals</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Leader
        </Button>
      </div>

      <div className="grid gap-4">
        {leadershipTeam.map((leader) => (
          <Card key={leader.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <User className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-lg">{leader.name}</h3>
                      {leader.primary && <Badge>Primary Contact</Badge>}
                    </div>
                    <p className="text-sm text-muted-foreground">{leader.role}</p>
                    <p className="text-sm text-muted-foreground">{leader.department}</p>
                    <div className="mt-2 flex items-center gap-4 text-sm">
                      <span className="flex items-center gap-1">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        {leader.email}
                      </span>
                      <span className="flex items-center gap-1">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        {leader.phone}
                      </span>
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="icon">
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
