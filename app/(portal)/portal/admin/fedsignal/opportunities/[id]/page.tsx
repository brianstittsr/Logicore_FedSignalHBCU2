"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Edit, Trash2, Save, X, ExternalLink, Calendar, DollarSign, Building, Tag, FileText } from "lucide-react";
import { FSOpportunityDoc, TagVariant } from "@/lib/fedsignal/types";

// Sample opportunity data
const sampleOpportunity: Partial<FSOpportunityDoc> & { id: string } = {
  id: "1",
  title: "NSA HBCU/MSI Cybersecurity Research Initiative — Phase II",
  agency: "NSA",
  solicitationNumber: "W52P1J-25-R-0044",
  type: "contract",
  status: "open",
  description: "The National Security Agency (NSA) is seeking proposals from HBCU/MSI institutions for Phase II of the Cybersecurity Research Initiative. This program focuses on developing advanced cyber defense capabilities, threat intelligence analysis, and secure communications protocols. Selected institutions will receive funding for research projects lasting 12-24 months.",
  amount: { min: 500000, max: 750000, type: "ceiling" },
  deadline: { seconds: 1714521600, nanoseconds: 0 } as any, // May 1, 2025
  matchScore: 94,
  tags: [
    { label: "HBCU Set-Aside", variant: "hbcu" as TagVariant },
    { label: "Cyber", variant: "cyber" as TagVariant },
    { label: "Contract", variant: "contract" as TagVariant },
  ],
  sourceUrl: "https://sam.gov/opp/W52P1J-25-R-0044/view",
  isHbcuSetAside: true,
  hbcuPreferred: true,
  domains: ["Cybersecurity", "Defense R&D"],
  trackedBy: ["tuskegee", "howard"],
  isPublished: true,
};

const tagStyles: Record<TagVariant, string> = {
  hbcu: "text-amber-800 bg-amber-50 border-amber-200",
  cyber: "text-rose-800 bg-rose-50 border-rose-200",
  contract: "text-blue-800 bg-blue-50 border-blue-200",
  grant: "text-purple-800 bg-purple-50 border-purple-200",
  ai: "text-cyan-800 bg-cyan-50 border-cyan-200",
  defense: "text-indigo-800 bg-indigo-50 border-indigo-200",
  stem: "text-amber-800 bg-amber-50 border-amber-200",
};

export default function OpportunityDetailPage() {
  const params = useParams();
  const opportunityId = params.id as string;
  
  const [isEditing, setIsEditing] = useState(false);
  const [opportunity, setOpportunity] = useState(sampleOpportunity);
  const [editedOpportunity, setEditedOpportunity] = useState(sampleOpportunity);

  const handleSave = () => {
    setOpportunity(editedOpportunity);
    setIsEditing(false);
    // TODO: Save to Firestore
  };

  const handleCancel = () => {
    setEditedOpportunity(opportunity);
    setIsEditing(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "N/A";
    const date = new Date(timestamp.seconds * 1000);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const getMatchColor = (score: number) => {
    if (score >= 90) return "text-green-700 bg-green-50 border-green-300";
    if (score >= 70) return "text-amber-700 bg-amber-50 border-amber-300";
    return "text-red-700 bg-red-50 border-red-300";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/portal/admin/fedsignal/opportunities">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Opportunities
            </Link>
          </Button>
        </div>
        <div className="flex items-center gap-2">
          {!isEditing ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(true)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button variant="destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
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

      {/* Match Score Badge */}
      <div className="flex items-center gap-4">
        <div className={`w-20 h-20 rounded-full border-4 flex items-center justify-center ${getMatchColor(opportunity.matchScore || 0)}`}>
          <span className="text-2xl font-bold">{opportunity.matchScore}</span>
        </div>
        <div>
          <h1 className="text-2xl font-bold">{isEditing ? (
            <Input 
              value={editedOpportunity.title} 
              onChange={(e) => setEditedOpportunity({...editedOpportunity, title: e.target.value})}
              className="text-2xl font-bold w-[600px]"
            />
          ) : opportunity.title}</h1>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant={opportunity.status === "open" ? "default" : "secondary"} className="capitalize">
              {opportunity.status}
            </Badge>
            {opportunity.isHbcuSetAside && (
              <Badge variant="outline" className="border-amber-300 text-amber-700 bg-amber-50">
                HBCU Set-Aside
              </Badge>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Description
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <Textarea
                  value={editedOpportunity.description}
                  onChange={(e) => setEditedOpportunity({...editedOpportunity, description: e.target.value})}
                  className="min-h-[200px]"
                />
              ) : (
                <p className="text-muted-foreground leading-relaxed">{opportunity.description}</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tag className="h-5 w-5" />
                Tags & Classifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-4">
                {opportunity.tags?.map((tag, i) => (
                  <span
                    key={i}
                    className={`px-3 py-1 rounded-full text-xs font-semibold border ${tagStyles[tag.variant]}`}
                  >
                    {tag.label}
                  </span>
                ))}
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">Domains:</span>
                  <span>{opportunity.domains?.join(", ")}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">Tracked by:</span>
                  <span className="capitalize">{opportunity.trackedBy?.join(", ")}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <Building className="h-4 w-4 mt-1 text-muted-foreground" />
                <div>
                  <div className="text-sm font-medium">Agency</div>
                  {isEditing ? (
                    <Input
                      value={editedOpportunity.agency}
                      onChange={(e) => setEditedOpportunity({...editedOpportunity, agency: e.target.value})}
                      className="mt-1"
                    />
                  ) : (
                    <div className="text-sm text-muted-foreground">{opportunity.agency}</div>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3">
                <FileText className="h-4 w-4 mt-1 text-muted-foreground" />
                <div>
                  <div className="text-sm font-medium">Solicitation Number</div>
                  <div className="text-sm text-muted-foreground font-mono">{opportunity.solicitationNumber}</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <DollarSign className="h-4 w-4 mt-1 text-muted-foreground" />
                <div>
                  <div className="text-sm font-medium">Amount</div>
                  {isEditing ? (
                    <div className="flex gap-2 mt-1">
                      <Input
                        type="number"
                        value={editedOpportunity.amount?.max || 0}
                        onChange={(e) => setEditedOpportunity({
                          ...editedOpportunity, 
                          amount: {max: parseInt(e.target.value) || 0, type: editedOpportunity.amount?.type || "ceiling"}
                        })}
                        className="w-32"
                      />
                      <select
                        value={editedOpportunity.amount?.type || "ceiling"}
                        onChange={(e) => setEditedOpportunity({
                          ...editedOpportunity, 
                          amount: {max: editedOpportunity.amount?.max || 0, type: e.target.value as any}
                        })}
                        className="border rounded px-2"
                      >
                        <option value="ceiling">Ceiling</option>
                        <option value="total">Total</option>
                        <option value="per_award">Per Award</option>
                      </select>
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground">
                      {formatCurrency(opportunity.amount?.max || 0)} {opportunity.amount?.type}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="h-4 w-4 mt-1 text-muted-foreground" />
                <div>
                  <div className="text-sm font-medium">Deadline</div>
                  {isEditing ? (
                    <Input
                      type="date"
                      value={editedOpportunity.deadline ? new Date((editedOpportunity.deadline as any).seconds * 1000).toISOString().split('T')[0] : ''}
                      onChange={(e) => setEditedOpportunity({
                        ...editedOpportunity, 
                        deadline: { seconds: new Date(e.target.value).getTime() / 1000, nanoseconds: 0 } as any
                      })}
                      className="mt-1"
                    />
                  ) : (
                    <div className="text-sm text-muted-foreground">{formatDate(opportunity.deadline)}</div>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t">
                <Button variant="outline" className="w-full" asChild>
                  <a href={opportunity.sourceUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View on SAM.gov
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created</span>
                  <span>Apr 10, 2025</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Last Updated</span>
                  <span>Apr 12, 2025</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Views</span>
                  <span>47</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
