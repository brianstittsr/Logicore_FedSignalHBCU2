"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Target,
  Search,
  Filter,
  ExternalLink,
  Clock,
  DollarSign,
  Building2,
  Tag,
  Bookmark,
  Share2,
} from "lucide-react";

interface Opportunity {
  id: string;
  title: string;
  agency: string;
  matchScore: number;
  deadline: string;
  value: string;
  type: string;
  tags: string[];
  samUrl?: string;
  postedDate: string;
}

const mockOpportunities: Opportunity[] = [
  {
    id: "1",
    title: "Artificial Intelligence Research Initiative",
    agency: "Department of Defense",
    matchScore: 94,
    deadline: "2024-03-15",
    value: "$2,500,000",
    type: "SBIR Phase II",
    tags: ["AI/ML", "Defense", "High Priority"],
    postedDate: "2024-02-01",
  },
  {
    id: "2",
    title: "Health Disparities Research Program",
    agency: "National Institutes of Health",
    matchScore: 89,
    deadline: "2024-03-22",
    value: "$1,800,000",
    type: "R01 Research Grant",
    tags: ["Health", "HBCU Eligible", "Research"],
    postedDate: "2024-02-05",
  },
  {
    id: "3",
    title: "HBCU STEM Excellence Program",
    agency: "National Science Foundation",
    matchScore: 87,
    deadline: "2024-04-01",
    value: "$3,200,000",
    type: "Institutional Grant",
    tags: ["STEM", "HBCU", "Education"],
    postedDate: "2024-01-28",
  },
  {
    id: "4",
    title: "Cybersecurity Infrastructure Enhancement",
    agency: "Department of Homeland Security",
    matchScore: 82,
    deadline: "2024-03-30",
    value: "$950,000",
    type: "SBIR Phase I",
    tags: ["Cybersecurity", "Infrastructure"],
    postedDate: "2024-02-10",
  },
  {
    id: "5",
    title: "Renewable Energy Research Partnership",
    agency: "Department of Energy",
    matchScore: 78,
    deadline: "2024-04-15",
    value: "$1,200,000",
    type: "Research Grant",
    tags: ["Energy", "Sustainability", "Research"],
    postedDate: "2024-02-08",
  },
];

export default function OpportunitiesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [agencyFilter, setAgencyFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [savedOpportunities, setSavedOpportunities] = useState<string[]>(["1"]);

  const filteredOpportunities = mockOpportunities.filter((opp) => {
    const matchesSearch =
      opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.agency.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesAgency = agencyFilter === "all" || opp.agency === agencyFilter;
    const matchesType = typeFilter === "all" || opp.type === typeFilter;
    return matchesSearch && matchesAgency && matchesType;
  });

  const toggleSave = (id: string) => {
    setSavedOpportunities((prev) =>
      prev.includes(id) ? prev.filter((oid) => oid !== id) : [...prev, id]
    );
  };

  const getMatchBadgeColor = (score: number) => {
    if (score >= 90) return "bg-green-600 hover:bg-green-700";
    if (score >= 80) return "bg-blue-600 hover:bg-blue-700";
    if (score >= 70) return "bg-amber-600 hover:bg-amber-700";
    return "bg-gray-600 hover:bg-gray-700";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Target className="h-6 w-6 text-primary" />
            Opportunity Feed
          </h1>
          <p className="text-muted-foreground">
            Discover and track government funding opportunities matched to your institution
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">{filteredOpportunities.length} opportunities</Badge>
          <Badge variant="outline" className="text-green-600">
            {filteredOpportunities.filter((o) => o.matchScore >= 90).length} high match
          </Badge>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search opportunities by title, agency, or tags..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Select value={agencyFilter} onValueChange={setAgencyFilter}>
                <SelectTrigger className="w-[180px]">
                  <Building2 className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Agency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Agencies</SelectItem>
                  <SelectItem value="Department of Defense">DOD</SelectItem>
                  <SelectItem value="National Institutes of Health">NIH</SelectItem>
                  <SelectItem value="National Science Foundation">NSF</SelectItem>
                  <SelectItem value="Department of Homeland Security">DHS</SelectItem>
                  <SelectItem value="Department of Energy">DOE</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[160px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="SBIR Phase I">SBIR Phase I</SelectItem>
                  <SelectItem value="SBIR Phase II">SBIR Phase II</SelectItem>
                  <SelectItem value="R01 Research Grant">R01 Grant</SelectItem>
                  <SelectItem value="Institutional Grant">Institutional</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Opportunities List */}
      <div className="space-y-4">
        {filteredOpportunities.map((opp) => (
          <Card key={opp.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex-1 space-y-3">
                  {/* Title & Agency */}
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-medium text-muted-foreground">{opp.agency}</p>
                        <span className="text-muted-foreground">•</span>
                        <p className="text-sm text-muted-foreground">{opp.type}</p>
                      </div>
                      <h3 className="text-lg font-semibold">{opp.title}</h3>
                    </div>
                    <Badge className={getMatchBadgeColor(opp.matchScore)}>
                      {opp.matchScore}% Match
                    </Badge>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap items-center gap-2">
                    {opp.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        <Tag className="mr-1 h-3 w-3" />
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Details */}
                  <div className="flex flex-wrap items-center gap-4 text-sm">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>Deadline: {opp.deadline}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <DollarSign className="h-4 w-4" />
                      <span className="font-medium text-green-600">{opp.value}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <span>Posted: {opp.postedDate}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 lg:flex-col lg:items-end">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleSave(opp.id)}
                      className={savedOpportunities.includes(opp.id) ? "text-primary" : ""}
                    >
                      <Bookmark
                        className="h-4 w-4"
                        fill={savedOpportunities.includes(opp.id) ? "currentColor" : "none"}
                      />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/portal/admin/fedsignal/opportunities/${opp.id}`}>
                        Details
                      </Link>
                    </Button>
                    {opp.samUrl && (
                      <Button size="sm" variant="outline" asChild>
                        <a href={opp.samUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="mr-1 h-3 w-3" />
                          SAM.gov
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredOpportunities.length === 0 && (
          <Card className="p-12 text-center">
            <Target className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">No opportunities found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filters
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
