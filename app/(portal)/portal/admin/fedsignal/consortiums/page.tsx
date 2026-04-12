"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus } from "lucide-react";

interface ConsortiumRow {
  id: string;
  name: string;
  leadUniversity: string;
  members: string[];
  targetOpportunity: string;
  targetAmount: string;
  status: "forming" | "active" | "completed";
  proposalDue: string;
}

const sampleConsortiums: ConsortiumRow[] = [
  {
    id: "1",
    name: "HBCU Cyber Defense Alliance",
    leadUniversity: "Tuskegee University",
    members: ["Tuskegee", "Howard", "FAMU", "Morgan State"],
    targetOpportunity: "ONR Cyber BAA",
    targetAmount: "$3.5M",
    status: "active",
    proposalDue: "Apr 30, 2025",
  },
  {
    id: "2",
    name: "STEM Education Consortium",
    leadUniversity: "Howard University",
    members: ["Howard", "NC A&T", "FAMU"],
    targetOpportunity: "NSF STEM Initiative",
    targetAmount: "$2.1M",
    status: "forming",
    proposalDue: "May 15, 2025",
  },
  {
    id: "3",
    name: "AI/ML Research Network",
    leadUniversity: "NC A&T State University",
    members: ["NC A&T", "Howard", "Tuskegee", "Morehouse", "AAMU"],
    targetOpportunity: "AFRL AI Partnership",
    targetAmount: "$4.2M",
    status: "forming",
    proposalDue: "Jun 1, 2025",
  },
];

function getStatusColor(status: string): "default" | "secondary" | "outline" {
  switch (status) {
    case "active": return "default";
    case "forming": return "secondary";
    case "completed": return "outline";
    default: return "secondary";
  }
}

export default function FSConsortiumsAdminPage() {
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
          <h1 className="text-2xl font-bold">Consortiums</h1>
          <p className="text-sm text-muted-foreground">Manage multi-university partnerships and collaborative proposals</p>
        </div>
        <div className="ml-auto">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Consortium
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sampleConsortiums.map((consortium) => (
          <Card key={consortium.id} className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-semibold text-base">{consortium.name}</h3>
                <Badge variant={getStatusColor(consortium.status)} className="text-[10px] capitalize">
                  {consortium.status}
                </Badge>
              </div>
              <div className="text-sm text-muted-foreground mb-2">Led by {consortium.leadUniversity}</div>
              <div className="flex gap-1 flex-wrap mb-3">
                {consortium.members.map((m) => (
                  <span key={m} className="text-[11px] px-2 py-0.5 bg-muted rounded-full text-muted-foreground">{m}</span>
                ))}
              </div>
              <div className="border-t pt-3 mt-3 space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Target</span>
                  <span className="font-medium">{consortium.targetOpportunity}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Amount</span>
                  <span className="font-mono font-semibold">{consortium.targetAmount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Proposal Due</span>
                  <span>{consortium.proposalDue}</span>
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full mt-4">
                Manage Consortium
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
