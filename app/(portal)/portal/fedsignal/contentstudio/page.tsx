"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, FileText, Plus, Wand2 } from "lucide-react";

const contentIdeas = [
  { id: "1", title: "NIH SBIR Success Story", type: "Blog Post", status: "Draft" },
  { id: "2", title: "HBCU Partnership Highlight", type: "LinkedIn", status: "Published" },
  { id: "3", title: "Research Excellence Report", type: "Whitepaper", status: "In Review" },
];

export default function ContentStudioPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            Content Studio
            <Badge variant="secondary" className="ml-2">AI</Badge>
          </h1>
          <p className="text-muted-foreground">AI-powered content generation for marketing</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Content
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-6 text-center hover:bg-muted/50 cursor-pointer">
          <Wand2 className="mx-auto h-8 w-8 mb-2 text-primary" />
          <p className="font-medium">Blog Post</p>
          <p className="text-sm text-muted-foreground">Generate article from topic</p>
        </Card>
        <Card className="p-6 text-center hover:bg-muted/50 cursor-pointer">
          <Sparkles className="mx-auto h-8 w-8 mb-2 text-primary" />
          <p className="font-medium">LinkedIn Post</p>
          <p className="text-sm text-muted-foreground">Create social content</p>
        </Card>
        <Card className="p-6 text-center hover:bg-muted/50 cursor-pointer">
          <FileText className="mx-auto h-8 w-8 mb-2 text-primary" />
          <p className="font-medium">Press Release</p>
          <p className="text-sm text-muted-foreground">Announce funding wins</p>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Content</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {contentIdeas.map((content) => (
            <div key={content.id} className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <p className="font-medium">{content.title}</p>
                <p className="text-sm text-muted-foreground">{content.type}</p>
              </div>
              <Badge variant={content.status === "Published" ? "default" : "secondary"}>{content.status}</Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
