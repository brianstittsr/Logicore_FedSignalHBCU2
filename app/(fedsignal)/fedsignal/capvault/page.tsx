"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Folder, FileText, Plus, Download, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const documents = [
  { id: "1", name: "NIH SBIR Capability Statement.pdf", type: "PDF", size: "2.4 MB", date: "2024-01-15" },
  { id: "2", name: "DOD Past Performance Summary.docx", type: "DOCX", size: "1.8 MB", date: "2024-02-01" },
  { id: "3", name: "Technical Approach Template.pptx", type: "PPTX", size: "4.2 MB", date: "2024-01-28" },
  { id: "4", name: "Bios - Key Personnel.pdf", type: "PDF", size: "1.1 MB", date: "2024-02-10" },
];

export default function CapVaultPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Folder className="h-6 w-6 text-primary" />
            Capability Vault
          </h1>
          <p className="text-muted-foreground">Store and manage reusable proposal assets</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Upload Document
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search documents..." className="pl-9" />
      </div>

      <div className="grid gap-4">
        {documents.map((doc) => (
          <Card key={doc.id}>
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="h-8 w-8 text-muted-foreground" />
                <div>
                  <p className="font-medium">{doc.name}</p>
                  <p className="text-sm text-muted-foreground">{doc.type} • {doc.size} • {doc.date}</p>
                </div>
              </div>
              <Button variant="ghost" size="icon">
                <Download className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
