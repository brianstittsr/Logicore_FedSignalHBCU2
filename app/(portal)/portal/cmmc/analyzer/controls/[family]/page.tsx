"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  Shield, 
  CheckCircle, 
  AlertTriangle, 
  FileText,
  ChevronRight,
  Loader2,
  BookOpen
} from "lucide-react";
import { NIST_CONTROLS, CONTROL_FAMILIES } from "@/lib/data/nist-controls";
import { NISTControl } from "@/lib/types/cmmc";

export default function ControlFamilyPage() {
  const router = useRouter();
  const params = useParams();
  const familyCode = (params.family as string).toUpperCase();
  
  const [controls, setControls] = useState<NISTControl[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Filter controls by family
    const familyControls = NIST_CONTROLS.filter(c => c.family === familyCode);
    setControls(familyControls);
    setLoading(false);
  }, [familyCode]);

  const familyName = CONTROL_FAMILIES[familyCode as keyof typeof CONTROL_FAMILIES] || familyCode;

  const getLevelBadge = (level: number) => {
    switch (level) {
      case 1:
        return <Badge className="bg-green-100 text-green-800">Level 1</Badge>;
      case 2:
        return <Badge className="bg-blue-100 text-blue-800">Level 2</Badge>;
      case 3:
        return <Badge className="bg-purple-100 text-purple-800">Level 3</Badge>;
      default:
        return <Badge variant="outline">Level {level}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-[#C8A951]" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <Button
            variant="ghost"
            onClick={() => router.push("/portal/cmmc/analyzer")}
            className="mb-2 -ml-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Analyzer
          </Button>
          <h1 className="text-3xl font-bold text-[#1e3a5f]">{familyCode} - {familyName}</h1>
          <p className="text-muted-foreground mt-1">
            {controls.length} NIST 800-171 controls in this family
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Controls
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#1e3a5f]">{controls.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              CMMC Level 1
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {controls.filter(c => c.cmmcLevel === 1).length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              CMMC Level 2
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              {controls.filter(c => c.cmmcLevel <= 2).length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              CMMC Level 3
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">
              {controls.length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controls List */}
      <Card>
        <CardHeader>
          <CardTitle>Control Details</CardTitle>
          <CardDescription>
            Detailed information for each control in the {familyCode} family
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {controls.map((control) => (
              <Card 
                key={control.id} 
                className="cursor-pointer hover:shadow-md transition-shadow border-l-4 border-l-[#C8A951]"
                onClick={() => router.push(`/portal/cmmc/analyzer/controls/${familyCode.toLowerCase()}/${control.id}`)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-sm font-semibold text-[#1e3a5f]">
                          {control.number}
                        </span>
                        {getLevelBadge(control.cmmcLevel)}
                      </div>
                      <h3 className="text-lg font-semibold">{control.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {control.description}
                      </p>
                      
                      {/* Quick Info */}
                      <div className="flex flex-wrap gap-2 mt-3">
                        <Badge variant="outline" className="text-xs">
                          <BookOpen className="h-3 w-3 mr-1" />
                          {control.commonArtifacts.length} artifacts
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          {control.testMethods.length} test methods
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          <Shield className="h-3 w-3 mr-1" />
                          {control.potentialAssessors.length} assessors
                        </Badge>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0 ml-4" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
