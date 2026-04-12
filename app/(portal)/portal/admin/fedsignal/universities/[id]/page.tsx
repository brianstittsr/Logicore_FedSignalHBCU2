"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Edit, Trash2, Save, X, GraduationCap, Users, TrendingUp, Award, Building } from "lucide-react";

const sampleUniversity = {
  id: "tuskegee",
  name: "Tuskegee University",
  acronym: "TU",
  slug: "tuskegee",
  state: "AL",
  type: "hbcu",
  control: "private",
  level: "4yr",
  enrollment: 2800,
  research: "R2",
  website: "https://www.tuskegee.edu",
  colors: { primary: "#7A0019", secondary: "#9a6b00" },
  fedFunding: { fy25: 2100000, fy24: 1850000, fy23: 1600000 },
  winRate: 34,
  capabilities: ["Cybersecurity", "Aerospace Engineering", "Biomedical Research", "Agricultural Science"],
  govConScore: 76,
  scoreBreakdown: {
    pastPerformance: 82,
    facultyExpertise: 68,
    agencyRelationships: 74,
    samGovCompliance: 61,
  },
  isActive: true,
};

const scoreCategories = [
  { key: "pastPerformance", label: "Past Performance", weight: 30 },
  { key: "facultyExpertise", label: "Faculty Expertise Coverage", weight: 25 },
  { key: "agencyRelationships", label: "Agency Relationships", weight: 25 },
  { key: "samGovCompliance", label: "SAM.gov Compliance", weight: 20 },
];

export default function UniversityDetailPage() {
  const params = useParams();
  const universityId = params.id as string;
  
  const [isEditing, setIsEditing] = useState(false);
  const [university, setUniversity] = useState(sampleUniversity);
  const [editedUniversity, setEditedUniversity] = useState(sampleUniversity);

  const handleSave = () => {
    setUniversity(editedUniversity);
    setIsEditing(false);
    // TODO: Save to Firestore
  };

  const handleCancel = () => {
    setEditedUniversity(university);
    setIsEditing(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-amber-500";
    return "bg-red-500";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/portal/admin/fedsignal/universities">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Universities
          </Link>
        </Button>
        <div className="flex items-center gap-2">
          {!isEditing ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(true)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button variant="destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Deactivate
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={handleCancel}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Profile Header */}
      <div className="flex items-start gap-6">
        <div
          className="w-24 h-24 rounded-xl flex items-center justify-center text-white text-3xl font-bold shadow-lg"
          style={{ backgroundColor: university.colors.primary }}
        >
          {university.acronym}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            {isEditing ? (
              <Input
                value={editedUniversity.name}
                onChange={(e) => setEditedUniversity({...editedUniversity, name: e.target.value})}
                className="text-2xl font-bold w-96"
              />
            ) : (
              <h1 className="text-2xl font-bold">{university.name}</h1>
            )}
            <Badge variant={university.isActive ? "default" : "secondary"}>
              {university.isActive ? "Active" : "Inactive"}
            </Badge>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Building className="h-4 w-4" />
              {university.state}
            </span>
            <span className="capitalize">{university.type}</span>
            <span className="uppercase">{university.research}</span>
            <span className="capitalize">{university.control} · {university.level}</span>
            <a href={university.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
              Website →
            </a>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* GovCon Score */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                GovCon Readiness Score
              </CardTitle>
              <CardDescription>Overall assessment of government contracting readiness</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-6 mb-6">
                <div className={`w-28 h-28 rounded-full flex items-center justify-center border-4 ${getScoreColor(university.govConScore).replace("bg-", "border-")}`}>
                  <div className="text-center">
                    <div className="text-3xl font-bold">{university.govConScore}</div>
                    <div className="text-xs text-muted-foreground">/ 100</div>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="text-lg font-medium mb-1">
                    {university.govConScore >= 80 ? "Excellent" : university.govConScore >= 60 ? "Good" : "Needs Improvement"}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Above average. SAM.gov registration gap limiting 6 opportunities.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {scoreCategories.map((category) => {
                  const score = (university.scoreBreakdown as any)[category.key];
                  return (
                    <div key={category.key}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">{category.label}</span>
                        <span className={`text-sm font-bold ${score >= 80 ? "text-green-600" : score >= 60 ? "text-amber-600" : "text-red-600"}`}>
                          {score}/100
                        </span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${getScoreColor(score)}`}
                          style={{ width: `${score}%` }}
                        />
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">Weight: {category.weight}%</div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Capabilities */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                Research Capabilities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {university.capabilities.map((capability) => (
                  <Badge key={capability} variant="secondary" className="text-sm py-1 px-3">
                    {capability}
                  </Badge>
                ))}
                {isEditing && (
                  <Button variant="outline" size="sm">
                    + Add Capability
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Stats */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                  <Users className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{university.enrollment.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">Students</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{university.winRate}%</div>
                  <div className="text-xs text-muted-foreground">Win Rate</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Funding History */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Federal Funding History</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">FY2025</span>
                <span className="font-bold text-green-600">{formatCurrency(university.fedFunding.fy25)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">FY2024</span>
                <span className="font-bold">{formatCurrency(university.fedFunding.fy24)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">FY2023</span>
                <span className="font-bold">{formatCurrency(university.fedFunding.fy23)}</span>
              </div>
              <div className="pt-2 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">3-Year Total</span>
                  <span className="font-bold text-lg">
                    {formatCurrency(university.fedFunding.fy25 + university.fedFunding.fy24 + university.fedFunding.fy23)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Colors */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Brand Colors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Primary</div>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-12 h-12 rounded-lg border shadow-sm"
                      style={{ backgroundColor: university.colors.primary }}
                    />
                    {isEditing ? (
                      <Input
                        value={editedUniversity.colors.primary}
                        onChange={(e) => setEditedUniversity({
                          ...editedUniversity,
                          colors: {...editedUniversity.colors, primary: e.target.value}
                        })}
                        className="w-28 font-mono text-xs"
                      />
                    ) : (
                      <code className="text-xs font-mono">{university.colors.primary}</code>
                    )}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Secondary</div>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-12 h-12 rounded-lg border shadow-sm"
                      style={{ backgroundColor: university.colors.secondary }}
                    />
                    {isEditing ? (
                      <Input
                        value={editedUniversity.colors.secondary}
                        onChange={(e) => setEditedUniversity({
                          ...editedUniversity,
                          colors: {...editedUniversity.colors, secondary: e.target.value}
                        })}
                        className="w-28 font-mono text-xs"
                      />
                    ) : (
                      <code className="text-xs font-mono">{university.colors.secondary}</code>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
