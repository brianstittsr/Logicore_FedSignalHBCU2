"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Plus, Sparkles, Handshake } from "lucide-react";

export default function TeamingPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Handshake className="h-6 w-6 text-primary" />
            Teaming Generator
          </h1>
          <p className="text-muted-foreground">AI-powered teaming partner recommendations</p>
        </div>
        <Button>
          <Sparkles className="mr-2 h-4 w-4" />
          Generate Team
        </Button>
      </div>

      <Card className="p-8 text-center">
        <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">Build Your Dream Team</h3>
        <p className="text-muted-foreground mb-4">
          Enter an opportunity and let AI suggest the optimal teaming partners
          based on capabilities, past performance, and complementary strengths.
        </p>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Start New Team
        </Button>
      </Card>
    </div>
  );
}
