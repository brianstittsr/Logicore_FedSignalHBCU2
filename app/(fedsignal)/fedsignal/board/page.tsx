"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Download, Share2, TrendingUp, Users, Target, DollarSign } from "lucide-react";

export default function BoardReportPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Board Report</h1>
          <p className="text-muted-foreground">Executive summary for leadership review</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Share2 className="h-4 w-4" />
            Share
          </Button>
          <Button className="gap-2">
            <Download className="h-4 w-4" />
            Export PDF
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Target className="h-4 w-4" />
              Opportunities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">47</div>
            <p className="text-xs text-muted-foreground">+12 this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Pipeline Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">$8.4M</div>
            <p className="text-xs text-muted-foreground">+23% from last quarter</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Users className="h-4 w-4" />
              Active Partners
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">18</div>
            <p className="text-xs text-muted-foreground">3 new this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Win Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">34%</div>
            <p className="text-xs text-muted-foreground">+5% improvement</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="summary" className="w-full">
        <TabsList>
          <TabsTrigger value="summary">Executive Summary</TabsTrigger>
          <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>
        <TabsContent value="summary" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Q2 2026 Executive Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-semibold">Key Highlights</h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>FedSignal platform onboarded 3 new HBCU institutions</li>
                  <li>Pipeline value increased by 23% to $8.4M</li>
                  <li>Win rate improved to 34% with 2 major contract awards</li>
                  <li>Strategic partnership established with 2 prime contractors</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">Upcoming Priorities</h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Submit 5 SBIR Phase I proposals by end of quarter</li>
                  <li>Expand teaming partnerships with 3 additional contractors</li>
                  <li>Launch AI-powered proposal assistance feature</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="pipeline">
          <Card>
            <CardHeader>
              <CardTitle>Active Pipeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: "Cybersecurity Training Contract", value: "$1.2M", stage: "Proposal", probability: "60%" },
                  { name: "Logistics Support Services", value: "$850K", stage: "Teaming", probability: "40%" },
                  { name: "Data Analytics Platform", value: "$2.1M", stage: "Capture", probability: "25%" },
                ].map((deal, i) => (
                  <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">{deal.name}</p>
                      <p className="text-sm text-muted-foreground">Stage: {deal.stage}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{deal.value}</p>
                      <Badge variant="outline">{deal.probability}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="performance">
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-muted-foreground">Proposals Submitted</p>
                  <p className="text-2xl font-bold">24</p>
                  <p className="text-xs text-green-600">↑ 20% vs last quarter</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-muted-foreground">Awards Won</p>
                  <p className="text-2xl font-bold">8</p>
                  <p className="text-xs text-green-600">↑ 33% vs last quarter</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-muted-foreground">Avg. Proposal Value</p>
                  <p className="text-2xl font-bold">$425K</p>
                  <p className="text-xs text-green-600">↑ 15% vs last quarter</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-muted-foreground">Response Time</p>
                  <p className="text-2xl font-bold">4.2 days</p>
                  <p className="text-xs text-red-600">↓ 8% vs last quarter</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
