"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Award, Building2, Target, BarChart3 } from "lucide-react";

const hbcuRankings = [
  { rank: 1, name: "Howard University", score: 94, funding: "$45.2M", change: "+2" },
  { rank: 2, name: "NC A&T State University", score: 91, funding: "$38.7M", change: "+1" },
  { rank: 3, name: "Tuskegee University", score: 87, funding: "$32.1M", change: "+3" },
  { rank: 4, name: "Florida A&M University", score: 85, funding: "$28.9M", change: "-1" },
  { rank: 5, name: "Alabama A&M University", score: 82, funding: "$24.5M", change: "+2" },
  { rank: 6, name: "Morehouse College", score: 79, funding: "$19.3M", change: "-" },
];

const scoreCategories = [
  { name: "Research Capacity", weight: 30, yourScore: 92, avgScore: 78 },
  { name: "Past Performance", weight: 25, yourScore: 78, avgScore: 72 },
  { name: "Teaming Network", weight: 20, yourScore: 85, avgScore: 70 },
  { name: "Compliance & Admin", weight: 15, yourScore: 95, avgScore: 82 },
  { name: "Strategic Positioning", weight: 10, yourScore: 88, avgScore: 75 },
];

export default function ScoreboardPage() {
  const yourRank = hbcuRankings.find((h) => h.name === "Tuskegee University")?.rank || 3;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <TrendingUp className="h-6 w-6 text-primary" />
          HBCU Scoreboard
        </h1>
        <p className="text-muted-foreground">GovCon readiness rankings and competitive analysis</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Your Rank</p>
                <p className="text-3xl font-bold">#{yourRank}</p>
              </div>
              <Award className="h-10 w-10 text-amber-500 opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Your Score</p>
                <p className="text-3xl font-bold text-primary">87</p>
              </div>
              <Target className="h-10 w-10 text-primary opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">YTD Funding</p>
                <p className="text-3xl font-bold text-green-600">$32.1M</p>
              </div>
              <BarChart3 className="h-10 w-10 text-green-500 opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              HBCU Rankings
            </CardTitle>
            <CardDescription>Based on GovCon readiness score</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {hbcuRankings.map((hbcu) => (
              <div
                key={hbcu.name}
                className={`flex items-center justify-between rounded-lg border p-3 ${
                  hbcu.name === "Tuskegee University" ? "bg-muted/50 border-primary" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold w-8">#{hbcu.rank}</span>
                  <div>
                    <p className="font-medium">{hbcu.name}</p>
                    <p className="text-xs text-muted-foreground">{hbcu.funding} secured</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge className={hbcu.score >= 90 ? "bg-green-600" : hbcu.score >= 80 ? "bg-blue-600" : "bg-amber-600"}>
                    {hbcu.score}
                  </Badge>
                  <p className="text-xs text-green-600 mt-1">{hbcu.change}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Score Breakdown
            </CardTitle>
            <CardDescription>How your score is calculated</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {scoreCategories.map((cat) => (
              <div key={cat.name} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{cat.name}</span>
                  <span className="text-muted-foreground">Weight: {cat.weight}%</span>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs w-16">Your Score</span>
                    <Progress value={cat.yourScore} className="h-2 flex-1" />
                    <span className="text-xs font-medium w-8">{cat.yourScore}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs w-16 text-muted-foreground">HBCU Avg</span>
                    <Progress value={cat.avgScore} className="h-1.5 flex-1 bg-gray-200" />
                    <span className="text-xs text-muted-foreground w-8">{cat.avgScore}</span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
