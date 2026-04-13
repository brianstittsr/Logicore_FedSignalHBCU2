"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Handshake, Building2, Star, ExternalLink, Search } from "lucide-react";

const contractors = [
  { id: "1", name: "Strategic Solutions Inc", specialty: "IT Consulting", location: "Washington, DC", rating: 4.8, contracts: 23, hbcuPartner: true },
  { id: "2", name: "Aerospace Dynamics", specialty: "Defense R&D", location: "Huntsville, AL", rating: 4.9, contracts: 45, hbcuPartner: true },
  { id: "3", name: "HealthTech Partners", specialty: "Health IT", location: "Atlanta, GA", rating: 4.6, contracts: 12, hbcuPartner: false },
  { id: "4", name: "Green Energy Solutions", specialty: "Renewable Energy", location: "Raleigh, NC", rating: 4.7, contracts: 18, hbcuPartner: true },
];

export default function MarketplacePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Handshake className="h-6 w-6 text-primary" />
          Contractor Marketplace
        </h1>
        <p className="text-muted-foreground">Find and connect with government contractors</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {contractors.map((contractor) => (
          <Card key={contractor.id}>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold">{contractor.name}</h3>
                  <p className="text-sm text-muted-foreground">{contractor.specialty}</p>
                </div>
                {contractor.hbcuPartner && (
                  <Badge variant="outline" className="text-green-600 border-green-200">HBCU Partner</Badge>
                )}
              </div>

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Building2 className="h-4 w-4" />
                  {contractor.location}
                </span>
                <span className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-amber-500" />
                  {contractor.rating}
                </span>
                <span>{contractor.contracts} contracts</span>
              </div>

              <Button variant="outline" size="sm" className="w-full">
                <ExternalLink className="mr-2 h-4 w-4" />
                View Profile
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
