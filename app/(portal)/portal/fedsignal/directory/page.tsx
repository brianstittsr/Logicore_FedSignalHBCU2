"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GraduationCap, Search, MapPin, Users, Mail, ExternalLink, Building2, Filter } from "lucide-react";
import Link from "next/link";

interface HBCU {
  id: string;
  name: string;
  location: string;
  enrollment: number;
  established: number;
  type: "Public" | "Private";
  focus: string[];
  score: number;
  lookingForPartners: boolean;
}

const hbcuDirectory: HBCU[] = [
  { id: "1", name: "Howard University", location: "Washington, DC", enrollment: 10000, established: 1867, type: "Private", focus: ["STEM", "Law", "Medicine"], score: 94, lookingForPartners: true },
  { id: "2", name: "Tuskegee University", location: "Tuskegee, AL", enrollment: 3000, established: 1881, type: "Private", focus: ["Aviation", "STEM", "Agriculture"], score: 87, lookingForPartners: true },
  { id: "3", name: "NC A&T State University", location: "Greensboro, NC", enrollment: 13000, established: 1891, type: "Public", focus: ["Engineering", "Agriculture"], score: 91, lookingForPartners: true },
  { id: "4", name: "Florida A&M University", location: "Tallahassee, FL", enrollment: 10000, established: 1887, type: "Public", focus: ["Pharmacy", "Engineering", "Business"], score: 85, lookingForPartners: false },
  { id: "5", name: "Morehouse College", location: "Atlanta, GA", enrollment: 2200, established: 1867, type: "Private", focus: ["Liberal Arts", "Business"], score: 79, lookingForPartners: true },
  { id: "6", name: "Spelman College", location: "Atlanta, GA", enrollment: 2100, established: 1881, type: "Private", focus: ["STEM", "Arts"], score: 82, lookingForPartners: false },
];

export default function DirectoryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");

  const filteredHBCUs = hbcuDirectory.filter((hbcu) => {
    const matchesSearch =
      hbcu.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hbcu.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hbcu.focus.some((f) => f.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType = filterType === "all" || hbcu.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-primary" />
            HBCU Network
          </h1>
          <p className="text-muted-foreground">Connect with partnering institutions</p>
        </div>
        <Badge variant="secondary">{hbcuDirectory.length} institutions</Badge>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name, location, or focus area..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setFilterType("all")} className={filterType === "all" ? "bg-muted" : ""}>All</Button>
              <Button variant="outline" size="sm" onClick={() => setFilterType("Public")} className={filterType === "Public" ? "bg-muted" : ""}>Public</Button>
              <Button variant="outline" size="sm" onClick={() => setFilterType("Private")} className={filterType === "Private" ? "bg-muted" : ""}>Private</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Directory Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredHBCUs.map((hbcu) => (
          <Card key={hbcu.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-lg">{hbcu.name}</h3>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                    <MapPin className="h-3 w-3" />
                    {hbcu.location}
                  </div>
                </div>
                <Badge variant={hbcu.type === "Public" ? "default" : "secondary"}>{hbcu.type}</Badge>
              </div>

              <div className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  {hbcu.enrollment.toLocaleString()}
                </span>
                <span className="text-muted-foreground">Est. {hbcu.established}</span>
              </div>

              <div className="flex flex-wrap gap-1">
                {hbcu.focus.map((f) => (
                  <Badge key={f} variant="outline" className="text-xs">{f}</Badge>
                ))}
              </div>

              <div className="flex items-center justify-between pt-2 border-t">
                <Badge className={hbcu.score >= 90 ? "bg-green-600" : hbcu.score >= 80 ? "bg-blue-600" : "bg-amber-600"}>
                  Score: {hbcu.score}
                </Badge>
                {hbcu.lookingForPartners && (
                  <Badge variant="outline" className="text-green-600 border-green-200">
                    Seeking Partners
                  </Badge>
                )}
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Mail className="mr-2 h-3 w-3" />
                  Contact
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <ExternalLink className="mr-2 h-3 w-3" />
                  Profile
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
