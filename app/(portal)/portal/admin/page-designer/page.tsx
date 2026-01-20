"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Paintbrush,
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Save,
  Loader2,
  Layout,
  Type,
  Image as ImageIcon,
  Link as LinkIcon,
  FileText,
  Settings,
  GripVertical,
  ArrowUp,
  ArrowDown,
  Copy,
  ExternalLink,
} from "lucide-react";
import { useUserProfile } from "@/contexts/user-profile-context";
import { db } from "@/lib/firebase";
import { collection, getDocs, doc, setDoc, deleteDoc, Timestamp } from "firebase/firestore";
import { COLLECTIONS } from "@/lib/schema";
import { toast } from "sonner";

interface PageSection {
  id: string;
  type: "hero" | "content" | "cta" | "features" | "testimonials" | "faq" | "custom";
  title: string;
  content: string;
  settings: Record<string, any>;
  order: number;
  isVisible: boolean;
}

interface PageConfig {
  id: string;
  slug: string;
  title: string;
  description: string;
  sections: PageSection[];
  isPublished: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

const sectionTypes = [
  { value: "hero", label: "Hero Section", icon: Layout },
  { value: "content", label: "Content Block", icon: FileText },
  { value: "cta", label: "Call to Action", icon: LinkIcon },
  { value: "features", label: "Features Grid", icon: Settings },
  { value: "testimonials", label: "Testimonials", icon: Type },
  { value: "faq", label: "FAQ Section", icon: FileText },
  { value: "custom", label: "Custom HTML", icon: Paintbrush },
];

export default function PageDesignerPage() {
  const { profile } = useUserProfile();
  const [pages, setPages] = useState<PageConfig[]>([]);
  const [selectedPage, setSelectedPage] = useState<PageConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<PageSection | null>(null);

  const isAdmin = profile.role === "admin" || profile.role === "superadmin";

  // Fetch pages from Firestore
  useEffect(() => {
    const fetchPages = async () => {
      if (!db) return;
      setIsLoading(true);
      try {
        const pagesRef = collection(db, "page_designs");
        const snapshot = await getDocs(pagesRef);
        const pagesData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as PageConfig[];
        setPages(pagesData);
      } catch (error) {
        console.error("Error fetching pages:", error);
        toast.error("Failed to load pages");
      } finally {
        setIsLoading(false);
      }
    };
    fetchPages();
  }, []);

  const handleSavePage = async () => {
    if (!selectedPage || !db) return;
    setIsSaving(true);
    try {
      const pageRef = doc(db, "page_designs", selectedPage.id);
      await setDoc(pageRef, {
        ...selectedPage,
        updatedAt: Timestamp.now(),
      });
      toast.success("Page saved successfully");
      // Update local state
      setPages(prev => prev.map(p => p.id === selectedPage.id ? selectedPage : p));
    } catch (error) {
      console.error("Error saving page:", error);
      toast.error("Failed to save page");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreatePage = async () => {
    if (!db) return;
    const newPage: PageConfig = {
      id: `page-${Date.now()}`,
      slug: "new-page",
      title: "New Page",
      description: "",
      sections: [],
      isPublished: false,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };
    try {
      const pageRef = doc(db, "page_designs", newPage.id);
      await setDoc(pageRef, newPage);
      setPages(prev => [...prev, newPage]);
      setSelectedPage(newPage);
      toast.success("Page created");
    } catch (error) {
      console.error("Error creating page:", error);
      toast.error("Failed to create page");
    }
  };

  const handleDeletePage = async (pageId: string) => {
    if (!db || !confirm("Are you sure you want to delete this page?")) return;
    try {
      await deleteDoc(doc(db, "page_designs", pageId));
      setPages(prev => prev.filter(p => p.id !== pageId));
      if (selectedPage?.id === pageId) setSelectedPage(null);
      toast.success("Page deleted");
    } catch (error) {
      console.error("Error deleting page:", error);
      toast.error("Failed to delete page");
    }
  };

  const addSection = (type: PageSection["type"]) => {
    if (!selectedPage) return;
    const newSection: PageSection = {
      id: `section-${Date.now()}`,
      type,
      title: `New ${type} section`,
      content: "",
      settings: {},
      order: selectedPage.sections.length,
      isVisible: true,
    };
    setSelectedPage({
      ...selectedPage,
      sections: [...selectedPage.sections, newSection],
    });
  };

  const updateSection = (sectionId: string, updates: Partial<PageSection>) => {
    if (!selectedPage) return;
    setSelectedPage({
      ...selectedPage,
      sections: selectedPage.sections.map(s =>
        s.id === sectionId ? { ...s, ...updates } : s
      ),
    });
  };

  const deleteSection = (sectionId: string) => {
    if (!selectedPage) return;
    setSelectedPage({
      ...selectedPage,
      sections: selectedPage.sections.filter(s => s.id !== sectionId),
    });
  };

  const moveSection = (sectionId: string, direction: "up" | "down") => {
    if (!selectedPage) return;
    const sections = [...selectedPage.sections];
    const index = sections.findIndex(s => s.id === sectionId);
    if (direction === "up" && index > 0) {
      [sections[index], sections[index - 1]] = [sections[index - 1], sections[index]];
    } else if (direction === "down" && index < sections.length - 1) {
      [sections[index], sections[index + 1]] = [sections[index + 1], sections[index]];
    }
    setSelectedPage({ ...selectedPage, sections });
  };

  if (!isAdmin) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="py-16 text-center">
            <Paintbrush className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
            <p className="text-muted-foreground">
              You need admin privileges to access the Page Designer.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Paintbrush className="h-8 w-8" />
            Page Designer
          </h1>
          <p className="text-muted-foreground mt-1">
            Create and customize landing pages for your platform
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleCreatePage}>
            <Plus className="h-4 w-4 mr-2" />
            New Page
          </Button>
          {selectedPage && (
            <Button onClick={handleSavePage} disabled={isSaving}>
              {isSaving ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Save Page
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Pages List */}
        <div className="col-span-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Pages</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : pages.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No pages yet. Create your first page!
                </p>
              ) : (
                pages.map(page => (
                  <div
                    key={page.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedPage?.id === page.id
                        ? "border-primary bg-primary/5"
                        : "hover:bg-muted/50"
                    }`}
                    onClick={() => setSelectedPage(page)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{page.title}</p>
                        <p className="text-xs text-muted-foreground">/{page.slug}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        {page.isPublished ? (
                          <Badge variant="default" className="text-xs">Live</Badge>
                        ) : (
                          <Badge variant="secondary" className="text-xs">Draft</Badge>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeletePage(page.id);
                          }}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Page Editor */}
        <div className="col-span-9">
          {selectedPage ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="space-y-2 flex-1 mr-4">
                    <Input
                      value={selectedPage.title}
                      onChange={(e) => setSelectedPage({ ...selectedPage, title: e.target.value })}
                      className="text-xl font-bold"
                      placeholder="Page Title"
                    />
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">/</span>
                      <Input
                        value={selectedPage.slug}
                        onChange={(e) => setSelectedPage({ ...selectedPage, slug: e.target.value })}
                        className="w-48"
                        placeholder="page-slug"
                      />
                      <div className="flex items-center gap-2 ml-4">
                        <Switch
                          checked={selectedPage.isPublished}
                          onCheckedChange={(checked) =>
                            setSelectedPage({ ...selectedPage, isPublished: checked })
                          }
                        />
                        <Label>Published</Label>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  value={selectedPage.description}
                  onChange={(e) => setSelectedPage({ ...selectedPage, description: e.target.value })}
                  placeholder="Page description (for SEO)"
                  rows={2}
                />

                {/* Sections */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Sections</h3>
                    <Select onValueChange={(value) => addSection(value as PageSection["type"])}>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Add section..." />
                      </SelectTrigger>
                      <SelectContent>
                        {sectionTypes.map(type => (
                          <SelectItem key={type.value} value={type.value}>
                            <div className="flex items-center gap-2">
                              <type.icon className="h-4 w-4" />
                              {type.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedPage.sections.length === 0 ? (
                    <div className="border-2 border-dashed rounded-lg p-8 text-center">
                      <Layout className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                      <p className="text-muted-foreground">
                        No sections yet. Add a section to start building your page.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {selectedPage.sections.map((section, index) => (
                        <div
                          key={section.id}
                          className="border rounded-lg p-4 bg-muted/20"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                              <Badge variant="outline">{section.type}</Badge>
                              <Input
                                value={section.title}
                                onChange={(e) => updateSection(section.id, { title: e.target.value })}
                                className="w-64"
                              />
                            </div>
                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => moveSection(section.id, "up")}
                                disabled={index === 0}
                              >
                                <ArrowUp className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => moveSection(section.id, "down")}
                                disabled={index === selectedPage.sections.length - 1}
                              >
                                <ArrowDown className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => updateSection(section.id, { isVisible: !section.isVisible })}
                              >
                                {section.isVisible ? (
                                  <Eye className="h-4 w-4" />
                                ) : (
                                  <EyeOff className="h-4 w-4" />
                                )}
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => deleteSection(section.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <Textarea
                            value={section.content}
                            onChange={(e) => updateSection(section.id, { content: e.target.value })}
                            placeholder="Section content..."
                            className="mt-3"
                            rows={3}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="py-16 text-center">
                <Layout className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h2 className="text-xl font-semibold mb-2">Select a Page</h2>
                <p className="text-muted-foreground">
                  Choose a page from the list or create a new one to start editing.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
