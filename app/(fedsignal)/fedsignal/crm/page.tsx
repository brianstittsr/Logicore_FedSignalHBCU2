"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Search, Plus, Mail, Phone, Building2, Star, Briefcase, Calendar } from "lucide-react";

interface Contact {
  id: string;
  name: string;
  role: string;
  organization: string;
  email: string;
  phone?: string;
  type: "contracting" | "university" | "teaming" | "cotr";
  lastContact: string;
  priority: "high" | "medium" | "low";
}

const contacts: Contact[] = [
  { id: "1", name: "Dr. Patricia Williams", role: "Program Officer", organization: "NIH NIMHD", email: "patricia.williams@nih.gov", type: "contracting", lastContact: "2 weeks ago", priority: "high" },
  { id: "2", name: "Marcus Johnson", role: "VP Research", organization: "Howard University", email: "mjohnson@howard.edu", phone: "(202) 555-0123", type: "university", lastContact: "1 month ago", priority: "high" },
  { id: "3", name: "Sarah Chen", role: "Contracts Specialist", organization: "DOD SBIR", email: "sarah.chen@sbir.mil", type: "contracting", lastContact: "3 days ago", priority: "medium" },
  { id: "4", name: "Dr. Robert Taylor", role: "Research Director", organization: "NC A&T State", email: "rtaylor@ncat.edu", phone: "(336) 555-0456", type: "teaming", lastContact: "1 week ago", priority: "medium" },
  { id: "5", name: "Jennifer Martinez", role: "COTR", organization: "Army Research Lab", email: "j.martinez@arl.army.mil", type: "cotr", lastContact: "Yesterday", priority: "high" },
];

const getTypeIcon = (type: string) => {
  switch (type) {
    case "contracting": return <Briefcase className="h-4 w-4" />;
    case "university": return <Building2 className="h-4 w-4" />;
    case "teaming": return <Users className="h-4 w-4" />;
    case "cotr": return <Star className="h-4 w-4" />;
    default: return <Users className="h-4 w-4" />;
  }
};

const getPriorityBadge = (priority: string) => {
  switch (priority) {
    case "high": return <Badge variant="destructive">High</Badge>;
    case "medium": return <Badge variant="secondary">Medium</Badge>;
    default: return <Badge variant="outline">Low</Badge>;
  }
};

export default function CRMPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const filteredContacts = contacts.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.organization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === "all" || c.type === activeTab;
    return matchesSearch && matchesTab;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Users className="h-6 w-6 text-primary" />
            CRM & Contacts
            <Badge variant="outline" className="text-amber-600">PRO</Badge>
          </h1>
          <p className="text-muted-foreground">Manage your government contracting relationships</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Contact
        </Button>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search contacts..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="contracting">Contracting</TabsTrigger>
          <TabsTrigger value="university">Universities</TabsTrigger>
          <TabsTrigger value="teaming">Teaming</TabsTrigger>
          <TabsTrigger value="cotr">COTRs</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-4">
          <div className="grid gap-4">
            {filteredContacts.map((contact) => (
              <Card key={contact.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        {getTypeIcon(contact.type)}
                      </div>
                      <div>
                        <h3 className="font-semibold">{contact.name}</h3>
                        <p className="text-sm text-muted-foreground">{contact.role} at {contact.organization}</p>
                        <div className="mt-2 flex items-center gap-3 text-sm">
                          <span className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {contact.email}
                          </span>
                          {contact.phone && (
                            <span className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {contact.phone}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right space-y-2">
                      {getPriorityBadge(contact.priority)}
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {contact.lastContact}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
