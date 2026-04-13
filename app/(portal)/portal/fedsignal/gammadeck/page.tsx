"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Target, Sparkles, Plus, Download, Presentation } from "lucide-react";

const decks = [
  { id: "1", name: "HBCU FedSignal Overview", slides: 12, lastModified: "Feb 28, 2024" },
  { id: "2", name: "NIH SBIR Pitch Template", slides: 8, lastModified: "Mar 1, 2024" },
  { id: "3", name: "Capabilities Briefing", slides: 15, lastModified: "Feb 25, 2024" },
];

export default function GammaDeckPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Target className="h-6 w-6 text-primary" />
            Gamma Deck
            <Badge variant="secondary" className="ml-2">AI</Badge>
          </h1>
          <p className="text-muted-foreground">AI-powered presentation builder</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Deck
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-6 text-center hover:bg-muted/50 cursor-pointer border-dashed">
          <Sparkles className="mx-auto h-8 w-8 mb-2 text-primary" />
          <p className="font-medium">AI Generate</p>
          <p className="text-sm text-muted-foreground">Create from prompt</p>
        </Card>
        <Card className="p-6 text-center hover:bg-muted/50 cursor-pointer border-dashed">
          <Presentation className="mx-auto h-8 w-8 mb-2 text-primary" />
          <p className="font-medium">From Template</p>
          <p className="text-sm text-muted-foreground">Start with a preset</p>
        </Card>
        <Card className="p-6 text-center hover:bg-muted/50 cursor-pointer border-dashed">
          <Download className="mx-auto h-8 w-8 mb-2 text-primary" />
          <p className="font-medium">Import</p>
          <p className="text-sm text-muted-foreground">Upload existing deck</p>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Decks</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {decks.map((deck) => (
            <div key={deck.id} className="flex items-center justify-between rounded-lg border p-3">
              <div className="flex items-center gap-3">
                <Presentation className="h-8 w-8 text-muted-foreground" />
                <div>
                  <p className="font-medium">{deck.name}</p>
                  <p className="text-sm text-muted-foreground">{deck.slides} slides • Modified {deck.lastModified}</p>
                </div>
              </div>
              <Button variant="ghost" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
