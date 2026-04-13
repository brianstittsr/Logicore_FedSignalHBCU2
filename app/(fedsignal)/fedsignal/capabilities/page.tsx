"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Zap, Plus, Target, TrendingUp, Users, Award } from "lucide-react";

interface Capability {
  id: string;
  name: string;
  category: string;
  strength: number;
  projects: number;
  funding: string;
  tags: string[];
}

const capabilities: Capability[] = [
  { id: "1", name: "Artificial Intelligence & Machine Learning", category: "Technology", strength: 92, projects: 8, funding: "$4.2M", tags: ["Deep Learning", "NLP", "Computer Vision"] },
  { id: "2", name: "Biomedical Research", category: "Health", strength: 88, projects: 12, funding: "$6.8M", tags: ["Clinical Trials", "Genomics", "Health Disparities"] },
  { id: "3", name: "Cybersecurity Infrastructure", category: "Security", strength: 85, projects: 6, funding: "$3.1M", tags: ["Network Security", "Threat Detection"] },
  { id: "4", name: "Renewable Energy Systems", category: "Energy", strength: 78, projects: 5, funding: "$2.4M", tags: ["Solar", "Grid Modernization"] },
  { id: "5", name: "Advanced Materials", category: "Engineering", strength: 76, projects: 4, funding: "$1.9M", tags: ["Nanomaterials", "Composites"] },
  { id: "6", name: "Data Science & Analytics", category: "Technology", strength: 90, projects: 10, funding: "$3.7M", tags: ["Big Data", "Predictive Analytics"] },
];

const naicsCodes = [
  { code: "541511", title: "Custom Computer Programming Services", relevance: 95 },
  { code: "541712", title: "R&D in Physical Sciences", relevance: 92 },
  { code: "541720", title: "R&D in Social Sciences", relevance: 88 },
  { code: "622110", title: "General Medical & Surgical Hospitals", relevance: 85 },
  { code: "611310", title: "Universities", relevance: 100 },
];

export default function CapabilitiesPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Zap className="h-6 w-6 text-primary" />
            Capability Graph
          </h1>
          <p className="text-muted-foreground">Visualize and manage your institution's core competencies</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Capability
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Core Capabilities
            </CardTitle>
            <CardDescription>Areas of excellence and expertise</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {capabilities.map((cap) => (
              <div key={cap.id} className="rounded-lg border p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold">{cap.name}</h4>
                    <p className="text-sm text-muted-foreground">{cap.category}</p>
                  </div>
                  <Badge className={cap.strength >= 90 ? "bg-green-600" : cap.strength >= 80 ? "bg-blue-600" : "bg-amber-600"}>
                    {cap.strength}/100
                  </Badge>
                </div>
                <Progress value={cap.strength} className="h-2" />
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <TrendingUp className="h-4 w-4" />
                    {cap.projects} projects
                  </span>
                  <span className="flex items-center gap-1">
                    <Award className="h-4 w-4" />
                    {cap.funding} secured
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {cap.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              NAICS Codes
            </CardTitle>
            <CardDescription>Industry classification relevance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {naicsCodes.map((naics) => (
              <div key={naics.code} className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="font-medium">{naics.code}</p>
                  <p className="text-xs text-muted-foreground line-clamp-1">{naics.title}</p>
                </div>
                <Badge variant={naics.relevance >= 90 ? "default" : "secondary"}>{naics.relevance}%</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
