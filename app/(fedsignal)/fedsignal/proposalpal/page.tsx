"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { FileText, Sparkles, Wand2, Save, Download, History, CheckCircle } from "lucide-react";
import { useState } from "react";

export default function ProposalPalPage() {
  const [prompt, setPrompt] = useState("");
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setGenerated(true);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" />
            Proposal Pal
            <Badge variant="secondary" className="ml-2">AI</Badge>
          </h1>
          <p className="text-muted-foreground">AI-powered proposal writing assistant</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <History className="mr-2 h-4 w-4" />
            History
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Input Panel */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wand2 className="h-5 w-5" />
              Generate Proposal Section
            </CardTitle>
            <CardDescription>Describe what you need and let AI craft the content</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Proposal Section</label>
              <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                <option>Executive Summary</option>
                <option>Technical Approach</option>
                <option>Management Plan</option>
                <option>Past Performance</option>
                <option>Personnel Qualifications</option>
                <option>Budget Narrative</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Solicitation Details</label>
              <Input placeholder="Enter solicitation number or title..." />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Your Prompt</label>
              <Textarea
                placeholder="Describe what you want the AI to write. Include key points, requirements, and any specific details..."
                className="min-h-[120px]"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
            </div>
            <Button 
              onClick={handleGenerate} 
              disabled={!prompt || generating}
              className="w-full"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              {generating ? "Generating..." : "Generate Content"}
            </Button>
          </CardContent>
        </Card>

        {/* Tips Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Writing Tips</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
              <p>Be specific about your institution's unique capabilities</p>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
              <p>Reference relevant past performance projects</p>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
              <p>Address all evaluation criteria explicitly</p>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
              <p>Use clear, jargon-free language</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Generated Content */}
      {generated && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-amber-500" />
                Generated Content
              </CardTitle>
              <CardDescription>Review and edit before saving</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
              <Button size="sm">
                <Save className="mr-2 h-4 w-4" />
                Save
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Textarea
              className="min-h-[300px] font-mono text-sm"
              defaultValue={`EXECUTIVE SUMMARY

Tuskegee University proposes to develop an innovative AI-powered diagnostic system for rural healthcare delivery, leveraging our 140-year legacy of serving underserved communities and our recognized excellence in biomedical engineering research.

Our institution brings unique capabilities to this Department of Health and Human Services initiative:

• Proven track record in healthcare technology research ($12M in related NIH funding over 5 years)
• Strong partnerships with regional medical centers and community health organizations
• Dedicated research facilities including the Center for Biomedical Engineering
• Experienced interdisciplinary team spanning computer science, engineering, and public health

The proposed 24-month program will deliver:
1. Validated AI diagnostic algorithms for three critical rural health conditions
2. Field-tested mobile platform suitable for low-connectivity environments
3. Training curriculum for rural healthcare providers
4. Sustainability plan for post-grant commercialization

We request $1,850,000 to execute this transformative research that aligns with HHS priorities for health equity and rural healthcare access.`}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
