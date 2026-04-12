"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save, Plus, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const opportunityTypes = ["grant", "contract", "cooperative", "rfi", "sbir"];
const amountTypes = ["ceiling", "total", "per_award"];
const domains = ["Cybersecurity", "Defense R&D", "AI / ML", "Energy / Grid", "STEM Education", "Healthcare", "Logistics"];

export default function CreateOpportunityPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    agency: "",
    solicitationNumber: "",
    type: "grant",
    description: "",
    amountMin: "",
    amountMax: "",
    amountType: "ceiling",
    deadline: "",
    sourceUrl: "",
    isHbcuSetAside: false,
    hbcuPreferred: false,
    matchScore: "75",
    selectedDomains: [] as string[],
    tags: [] as { label: string; variant: string }[],
    newTag: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // TODO: Save to Firestore
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    router.push("/portal/admin/fedsignal/opportunities");
  };

  const addTag = () => {
    if (formData.newTag.trim()) {
      setFormData({
        ...formData,
        tags: [...formData.tags, { label: formData.newTag.trim(), variant: "contract" }],
        newTag: "",
      });
    }
  };

  const removeTag = (index: number) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((_, i) => i !== index),
    });
  };

  const toggleDomain = (domain: string) => {
    setFormData({
      ...formData,
      selectedDomains: formData.selectedDomains.includes(domain)
        ? formData.selectedDomains.filter(d => d !== domain)
        : [...formData.selectedDomains, domain],
    });
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/portal/admin/fedsignal/opportunities">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Create New Opportunity</h1>
          <p className="text-sm text-muted-foreground">Add a new government funding opportunity to the FedSignal database</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Enter the core details about this opportunity</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Opportunity Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., NSA HBCU Cybersecurity Research Initiative"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="agency">Agency *</Label>
                  <Input
                    id="agency"
                    value={formData.agency}
                    onChange={(e) => setFormData({ ...formData, agency: e.target.value })}
                    placeholder="e.g., NSA"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="solicitation">Solicitation Number</Label>
                  <Input
                    id="solicitation"
                    value={formData.solicitationNumber}
                    onChange={(e) => setFormData({ ...formData, solicitationNumber: e.target.value })}
                    placeholder="e.g., W52P1J-25-R-0044"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Opportunity Type *</Label>
                  <select
                    id="type"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full border rounded-md px-3 py-2 bg-background"
                    required
                  >
                    {opportunityTypes.map(type => (
                      <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="deadline">Response Deadline *</Label>
                  <Input
                    id="deadline"
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detailed description of the opportunity..."
                  rows={4}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Funding Information</CardTitle>
            <CardDescription>Specify the award amount and structure</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amountMin">Minimum Amount</Label>
                <Input
                  id="amountMin"
                  type="number"
                  value={formData.amountMin}
                  onChange={(e) => setFormData({ ...formData, amountMin: e.target.value })}
                  placeholder="500000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="amountMax">Maximum Amount *</Label>
                <Input
                  id="amountMax"
                  type="number"
                  value={formData.amountMax}
                  onChange={(e) => setFormData({ ...formData, amountMax: e.target.value })}
                  placeholder="750000"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="amountType">Amount Type</Label>
                <select
                  id="amountType"
                  value={formData.amountType}
                  onChange={(e) => setFormData({ ...formData, amountType: e.target.value })}
                  className="w-full border rounded-md px-3 py-2 bg-background"
                >
                  {amountTypes.map(type => (
                    <option key={type} value={type}>{type.replace("_", " ").toUpperCase()}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sourceUrl">Source URL (SAM.gov)</Label>
              <Input
                id="sourceUrl"
                value={formData.sourceUrl}
                onChange={(e) => setFormData({ ...formData, sourceUrl: e.target.value })}
                placeholder="https://sam.gov/opp/..."
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>HBCU Eligibility & Matching</CardTitle>
            <CardDescription>Configure HBCU-specific settings and match scoring</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isHbcuSetAside}
                  onChange={(e) => setFormData({ ...formData, isHbcuSetAside: e.target.checked })}
                  className="rounded border-gray-300"
                />
                <span className="text-sm">HBCU Set-Aside</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.hbcuPreferred}
                  onChange={(e) => setFormData({ ...formData, hbcuPreferred: e.target.checked })}
                  className="rounded border-gray-300"
                />
                <span className="text-sm">HBCU Preferred</span>
              </label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="matchScore">Match Score (0-100)</Label>
              <Input
                id="matchScore"
                type="number"
                min="0"
                max="100"
                value={formData.matchScore}
                onChange={(e) => setFormData({ ...formData, matchScore: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Domains & Tags</CardTitle>
            <CardDescription>Categorize this opportunity for search and filtering</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Funding Domains</Label>
              <div className="flex flex-wrap gap-2">
                {domains.map(domain => (
                  <button
                    key={domain}
                    type="button"
                    onClick={() => toggleDomain(domain)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                      formData.selectedDomains.includes(domain)
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted hover:bg-muted/80"
                    }`}
                  >
                    {domain}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Tags</Label>
              <div className="flex gap-2">
                <Input
                  value={formData.newTag}
                  onChange={(e) => setFormData({ ...formData, newTag: e.target.value })}
                  placeholder="Add a tag..."
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                />
                <Button type="button" variant="outline" onClick={addTag}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.tags.map((tag, i) => (
                  <Badge key={i} variant="secondary" className="flex items-center gap-1">
                    {tag.label}
                    <button type="button" onClick={() => removeTag(i)} className="hover:text-destructive">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button variant="outline" type="button" asChild>
            <Link href="/portal/admin/fedsignal/opportunities">Cancel</Link>
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Create Opportunity
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
