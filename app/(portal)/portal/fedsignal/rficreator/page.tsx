"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { FileText, Sparkles, Wand2, Download } from "lucide-react";
import { useState } from "react";

export default function RFICreatorPage() {
  const [generating, setGenerating] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <FileText className="h-6 w-6 text-primary" />
          RFI Creator
          <Badge variant="secondary" className="ml-2">AI</Badge>
        </h1>
        <p className="text-muted-foreground">Generate Request for Information responses</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wand2 className="h-5 w-5" />
              RFI Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Agency / Organization</label>
              <Input placeholder="e.g., Department of Defense" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">RFI Topic</label>
              <Input placeholder="e.g., AI/ML capabilities for logistics" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Key Points to Address</label>
              <Textarea placeholder="List the specific questions or areas the RFI asks about..." className="min-h-[100px]" />
            </div>
            <Button className="w-full">
              <Sparkles className="mr-2 h-4 w-4" />
              Generate RFI Response
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your RFI Responses</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">Generated RFI responses will appear here.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
