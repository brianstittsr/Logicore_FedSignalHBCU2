"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Plus, Search, ExternalLink } from "lucide-react";

interface UniversityRow {
  id: string;
  name: string;
  acronym: string;
  state: string;
  type: string;
  research: string;
  enrollment: number;
  govConScore: number;
  fy25Funding: number;
  primaryColor: string;
  isActive: boolean;
}

const sampleUniversities: UniversityRow[] = [
  { id: "tuskegee", name: "Tuskegee University", acronym: "TU", state: "AL", type: "HBCU", research: "R2", enrollment: 2800, govConScore: 76, fy25Funding: 2100000, primaryColor: "#7A0019", isActive: true },
  { id: "howard", name: "Howard University", acronym: "HU", state: "DC", type: "HBCU", research: "R1", enrollment: 9600, govConScore: 89, fy25Funding: 8500000, primaryColor: "#003A63", isActive: true },
  { id: "famu", name: "Florida A&M University", acronym: "FAMU", state: "FL", type: "HBCU", research: "R2", enrollment: 9400, govConScore: 82, fy25Funding: 4200000, primaryColor: "#b45309", isActive: true },
  { id: "aamu", name: "Alabama A&M University", acronym: "AAMU", state: "AL", type: "HBCU", research: "R2", enrollment: 6100, govConScore: 68, fy25Funding: 1800000, primaryColor: "#1e3a8a", isActive: true },
  { id: "ncat", name: "NC A&T State University", acronym: "NCAT", state: "NC", type: "HBCU", research: "R2", enrollment: 13200, govConScore: 85, fy25Funding: 5600000, primaryColor: "#1e3a8a", isActive: true },
  { id: "morehouse", name: "Morehouse College", acronym: "MC", state: "GA", type: "HBCU", research: "R3", enrollment: 2200, govConScore: 71, fy25Funding: 950000, primaryColor: "#1c1917", isActive: true },
];

function formatCurrency(value: number): string {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
  return `$${value}`;
}

function getScoreColor(score: number): string {
  if (score >= 80) return "text-green-700 bg-green-50";
  if (score >= 65) return "text-amber-700 bg-amber-50";
  return "text-red-700 bg-red-50";
}

export default function FSUniversitiesAdminPage() {
  const [search, setSearch] = useState("");
  const filtered = sampleUniversities.filter(
    (u) => u.name.toLowerCase().includes(search.toLowerCase()) || u.acronym.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/portal/admin/fedsignal">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Universities / HBCUs</h1>
          <p className="text-sm text-muted-foreground">Manage registered institutions and their GovCon profiles</p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search universities..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add University
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/40">
                  <th className="text-left px-4 py-3 font-medium">University</th>
                  <th className="text-left px-4 py-3 font-medium">State</th>
                  <th className="text-left px-4 py-3 font-medium">Research</th>
                  <th className="text-right px-4 py-3 font-medium">Enrollment</th>
                  <th className="text-center px-4 py-3 font-medium">GovCon Score</th>
                  <th className="text-right px-4 py-3 font-medium">FY25 Funding</th>
                  <th className="text-center px-4 py-3 font-medium">Status</th>
                  <th className="text-right px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((uni) => (
                  <tr key={uni.id} className="border-b hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-md flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                          style={{ backgroundColor: uni.primaryColor }}
                        >
                          {uni.acronym.slice(0, 2)}
                        </div>
                        <div>
                          <div className="font-medium">{uni.name}</div>
                          <div className="text-xs text-muted-foreground">{uni.acronym} · {uni.type}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{uni.state}</td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className="text-[10px]">{uni.research}</Badge>
                    </td>
                    <td className="px-4 py-3 text-right font-mono">{uni.enrollment.toLocaleString()}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${getScoreColor(uni.govConScore)}`}>
                        {uni.govConScore}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-mono">{formatCurrency(uni.fy25Funding)}</td>
                    <td className="px-4 py-3 text-center">
                      <Badge variant={uni.isActive ? "default" : "secondary"} className="text-[10px]">
                        {uni.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button variant="ghost" size="sm">Edit</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
