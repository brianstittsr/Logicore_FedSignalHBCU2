"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Plus, Search } from "lucide-react";

interface ContactRow {
  id: string;
  name: string;
  title: string;
  organization: string;
  type: "prime" | "agency" | "hbcu" | "small_business";
  email: string;
  universityId: string;
}

const sampleContacts: ContactRow[] = [
  { id: "1", name: "Dr. James Wilson", title: "Director of Research", organization: "Tuskegee University", type: "hbcu", email: "jwilson@tuskegee.edu", universityId: "tuskegee" },
  { id: "2", name: "Sarah Chen", title: "HBCU Program Manager", organization: "SAIC", type: "prime", email: "sarah.chen@saic.com", universityId: "tuskegee" },
  { id: "3", name: "Mark Johnson", title: "Contracting Officer", organization: "NSA", type: "agency", email: "mjohnson@nsa.gov", universityId: "tuskegee" },
  { id: "4", name: "Dr. Angela Davis", title: "VP Research", organization: "Howard University", type: "hbcu", email: "adavis@howard.edu", universityId: "howard" },
  { id: "5", name: "Robert Kim", title: "BD Director", organization: "Leidos", type: "prime", email: "rkim@leidos.com", universityId: "famu" },
];

const typeColors: Record<string, string> = {
  prime: "bg-blue-50 text-blue-700 border-blue-200",
  agency: "bg-purple-50 text-purple-700 border-purple-200",
  hbcu: "bg-amber-50 text-amber-700 border-amber-200",
  small_business: "bg-green-50 text-green-700 border-green-200",
};

export default function FSContactsAdminPage() {
  const [search, setSearch] = useState("");
  const filtered = sampleContacts.filter(
    (c) => c.name.toLowerCase().includes(search.toLowerCase()) || c.organization.toLowerCase().includes(search.toLowerCase())
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
          <h1 className="text-2xl font-bold">Contacts & CRM</h1>
          <p className="text-sm text-muted-foreground">Manage prime contractors, agency contacts, and partner relationships</p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search contacts..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Contact
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/40">
                  <th className="text-left px-4 py-3 font-medium">Name</th>
                  <th className="text-left px-4 py-3 font-medium">Organization</th>
                  <th className="text-center px-4 py-3 font-medium">Type</th>
                  <th className="text-left px-4 py-3 font-medium">Email</th>
                  <th className="text-left px-4 py-3 font-medium">University</th>
                  <th className="text-right px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((contact) => (
                  <tr key={contact.id} className="border-b hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-medium">{contact.name}</div>
                      <div className="text-xs text-muted-foreground">{contact.title}</div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{contact.organization}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex text-[10px] font-semibold px-2 py-0.5 rounded border capitalize ${typeColors[contact.type]}`}>
                        {contact.type.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground font-mono text-xs">{contact.email}</td>
                    <td className="px-4 py-3 capitalize text-muted-foreground">{contact.universityId}</td>
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
