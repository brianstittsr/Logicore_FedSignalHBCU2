"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail, Plus, Send, Users } from "lucide-react";

const newsletters = [
  { id: "1", name: "Weekly Opportunity Digest", subscribers: 245, lastSent: "Mar 1, 2024", status: "Active" },
  { id: "2", name: "HBCU Success Stories", subscribers: 189, lastSent: "Feb 28, 2024", status: "Active" },
  { id: "3", name: "Monthly Funding Report", subscribers: 312, lastSent: "Mar 1, 2024", status: "Active" },
];

export default function NewsletterPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Mail className="h-6 w-6 text-primary" />
            Newsletter Builder
            <Badge variant="outline" className="text-amber-600">PRO</Badge>
          </h1>
          <p className="text-muted-foreground">Create and manage email newsletters</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Newsletter
        </Button>
      </div>

      <div className="grid gap-4">
        {newsletters.map((newsletter) => (
          <Card key={newsletter.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">{newsletter.name}</h3>
                  <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {newsletter.subscribers} subscribers
                    </span>
                    <span>Last sent: {newsletter.lastSent}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-green-600">{newsletter.status}</Badge>
                  <Button size="sm">
                    <Send className="mr-2 h-4 w-4" />
                    Send
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
