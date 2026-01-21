"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Wand2, MessageSquare, Layout, Palette, Send, Copy, Check, ChevronDown, ChevronRight, 
  Sparkles, AlertTriangle, CheckCircle, Info, Star, Zap, Eye, Accessibility, Shield,
  Plus, Trash2, GripVertical, Link, CreditCard, ExternalLink, FileText, Globe,
  Smartphone, Monitor, Tablet, Save, Undo, Redo, Settings, Image, Type, Square,
  MousePointer, Calendar, Users, Home, Building, Phone, Mail, MapPin, Search,
  ShoppingCart, DollarSign, Rocket, Target, Award, TrendingUp, BarChart
} from "lucide-react";

// Types
interface PageSection {
  id: string;
  name: string;
  type: string;
  description: string;
}

interface Page {
  id: string;
  name: string;
  path: string;
  category: string;
  sections: PageSection[];
  isLandingPage?: boolean;
  customSlug?: string;
}

interface PageElement {
  id: string;
  type: "heading" | "text" | "image" | "button" | "form" | "video" | "divider" | "spacer" | "card" | "grid";
  content: any;
  styles: Record<string, string>;
}

interface ButtonConfig {
  id: string;
  text: string;
  type: "link" | "page" | "stripe" | "external";
  destination: string;
  stripeProductId?: string;
  stripePriceId?: string;
  variant: "default" | "outline" | "secondary" | "destructive" | "ghost";
  size: "sm" | "default" | "lg";
}

interface LandingPageConfig {
  id: string;
  name: string;
  slug: string;
  eventName?: string;
  eventDate?: string;
  published: boolean;
  elements: PageElement[];
  buttons: ButtonConfig[];
  seoTitle: string;
  seoDescription: string;
  ogImage?: string;
}

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

// All application pages organized by category
const ALL_PAGES: Page[] = [
  // Marketing Pages
  { id: "home", name: "Home Page", path: "/", category: "Marketing", sections: [
    { id: "hero", name: "Hero Section", type: "hero", description: "Main banner with CTA" },
    { id: "features", name: "Features", type: "features", description: "Key features grid" },
    { id: "testimonials", name: "Testimonials", type: "testimonials", description: "Customer reviews" },
    { id: "cta", name: "Call to Action", type: "cta", description: "Bottom CTA section" },
  ]},
  { id: "about", name: "About", path: "/about", category: "Marketing", sections: [
    { id: "intro", name: "Introduction", type: "text", description: "Company introduction" },
    { id: "mission", name: "Mission & Vision", type: "cards", description: "Mission and vision cards" },
    { id: "story", name: "Our Story", type: "text", description: "Company history" },
    { id: "values", name: "Values", type: "grid", description: "Company values" },
    { id: "team", name: "Leadership Team", type: "team", description: "Team members" },
  ]},
  { id: "leadership", name: "Leadership", path: "/leadership", category: "Marketing", sections: [
    { id: "hero", name: "Hero", type: "hero", description: "Leadership hero" },
    { id: "team-grid", name: "Team Grid", type: "team", description: "Leadership team cards" },
    { id: "cta", name: "CTA", type: "cta", description: "Contact CTA" },
  ]},
  { id: "contact", name: "Contact", path: "/contact", category: "Marketing", sections: [
    { id: "hero", name: "Hero", type: "hero", description: "Contact hero" },
    { id: "form", name: "Contact Form", type: "form", description: "Contact form" },
    { id: "info", name: "Contact Info", type: "info", description: "Address, phone, email" },
  ]},
  { id: "affiliates", name: "Affiliates", path: "/affiliates", category: "Marketing", sections: [
    { id: "hero", name: "Hero", type: "hero", description: "Affiliate program hero" },
    { id: "benefits", name: "Benefits", type: "features", description: "Affiliate benefits" },
    { id: "how-it-works", name: "How It Works", type: "steps", description: "Process steps" },
    { id: "cta", name: "Join CTA", type: "cta", description: "Sign up CTA" },
  ]},
  { id: "company", name: "Company", path: "/company", category: "Marketing", sections: [
    { id: "overview", name: "Overview", type: "text", description: "Company overview" },
    { id: "stats", name: "Statistics", type: "stats", description: "Company stats" },
  ]},
  { id: "oem", name: "OEM Services", path: "/oem", category: "Marketing", sections: [
    { id: "hero", name: "Hero", type: "hero", description: "OEM services hero" },
    { id: "services", name: "Services", type: "grid", description: "OEM service offerings" },
  ]},
  { id: "v-edge", name: "V-Edge", path: "/v-edge", category: "Marketing", sections: [
    { id: "hero", name: "Hero", type: "hero", description: "V-Edge hero" },
    { id: "features", name: "Features", type: "features", description: "V-Edge features" },
  ]},
  { id: "antifragile", name: "Antifragile", path: "/antifragile", category: "Marketing", sections: [
    { id: "hero", name: "Hero", type: "hero", description: "Antifragile hero" },
    { id: "content", name: "Content", type: "text", description: "Main content" },
  ]},
  { id: "accessibility", name: "Accessibility", path: "/accessibility", category: "Marketing", sections: [
    { id: "content", name: "Content", type: "text", description: "Accessibility statement" },
  ]},
  
  // Portal Pages
  { id: "portal-dashboard", name: "Portal Dashboard", path: "/portal", category: "Portal", sections: [
    { id: "welcome", name: "Welcome", type: "hero", description: "Welcome section" },
    { id: "quick-actions", name: "Quick Actions", type: "grid", description: "Quick action cards" },
    { id: "stats", name: "Statistics", type: "stats", description: "User stats" },
  ]},
  { id: "profile", name: "Profile", path: "/portal/profile", category: "Portal", sections: [
    { id: "avatar", name: "Avatar", type: "image", description: "Profile picture" },
    { id: "info", name: "Personal Info", type: "form", description: "User information" },
  ]},
  { id: "settings", name: "Settings", path: "/portal/settings", category: "Portal", sections: [
    { id: "account", name: "Account", type: "form", description: "Account settings" },
    { id: "notifications", name: "Notifications", type: "form", description: "Notification preferences" },
  ]},
  { id: "team-members", name: "Team Members", path: "/portal/team-members", category: "Portal", sections: [
    { id: "list", name: "Member List", type: "table", description: "Team member table" },
  ]},
  { id: "networking", name: "Networking", path: "/portal/networking", category: "Portal", sections: [
    { id: "overview", name: "Overview", type: "stats", description: "Networking stats" },
    { id: "connections", name: "Connections", type: "grid", description: "Connection cards" },
  ]},
  { id: "calendar", name: "Calendar", path: "/portal/calendar", category: "Portal", sections: [
    { id: "calendar", name: "Calendar View", type: "calendar", description: "Event calendar" },
  ]},
  { id: "projects", name: "Projects", path: "/portal/projects", category: "Portal", sections: [
    { id: "list", name: "Project List", type: "grid", description: "Project cards" },
  ]},
  { id: "opportunities", name: "Opportunities", path: "/portal/opportunities", category: "Portal", sections: [
    { id: "list", name: "Opportunity List", type: "table", description: "Opportunities table" },
  ]},
  { id: "referrals", name: "Referrals", path: "/portal/referrals", category: "Portal", sections: [
    { id: "stats", name: "Referral Stats", type: "stats", description: "Referral statistics" },
    { id: "list", name: "Referral List", type: "table", description: "Referrals table" },
  ]},
  { id: "deals", name: "Deals", path: "/portal/deals", category: "Portal", sections: [
    { id: "pipeline", name: "Pipeline", type: "kanban", description: "Deal pipeline" },
  ]},
  { id: "customers", name: "Customers", path: "/portal/customers", category: "Portal", sections: [
    { id: "list", name: "Customer List", type: "table", description: "Customer table" },
  ]},
  { id: "documents", name: "Documents", path: "/portal/documents", category: "Portal", sections: [
    { id: "list", name: "Document List", type: "grid", description: "Document cards" },
  ]},
  { id: "tasks", name: "Tasks", path: "/portal/tasks", category: "Portal", sections: [
    { id: "list", name: "Task List", type: "table", description: "Task table" },
  ]},
  
  // Admin Pages
  { id: "admin-team", name: "Team Management", path: "/portal/admin/team-members", category: "Admin", sections: [
    { id: "list", name: "Team List", type: "table", description: "Team member management" },
  ]},
  { id: "admin-images", name: "Image Manager", path: "/portal/admin/images", category: "Admin", sections: [
    { id: "gallery", name: "Image Gallery", type: "gallery", description: "Image library" },
  ]},
  { id: "admin-events", name: "Events", path: "/portal/admin/events", category: "Admin", sections: [
    { id: "list", name: "Event List", type: "table", description: "Event management" },
  ]},
  { id: "admin-hero", name: "Hero Manager", path: "/portal/admin/hero", category: "Admin", sections: [
    { id: "editor", name: "Hero Editor", type: "editor", description: "Hero section editor" },
  ]},
  { id: "admin-popup", name: "Popup Manager", path: "/portal/admin/popup", category: "Admin", sections: [
    { id: "editor", name: "Popup Editor", type: "editor", description: "Popup editor" },
  ]},
  { id: "admin-marketing", name: "Marketing Hub", path: "/portal/admin/marketing-hub", category: "Admin", sections: [
    { id: "campaigns", name: "Campaigns", type: "grid", description: "Marketing campaigns" },
  ]},
  { id: "admin-partners", name: "Strategic Partners", path: "/portal/admin/strategic-partners", category: "Admin", sections: [
    { id: "list", name: "Partner List", type: "table", description: "Partner management" },
  ]},
  { id: "admin-academy", name: "Academy", path: "/portal/admin/academy", category: "Admin", sections: [
    { id: "courses", name: "Courses", type: "grid", description: "Course management" },
  ]},
  
  // Auth Pages
  { id: "sign-in", name: "Sign In", path: "/sign-in", category: "Auth", sections: [
    { id: "form", name: "Login Form", type: "form", description: "Sign in form" },
  ]},
  { id: "sign-up", name: "Sign Up", path: "/sign-up", category: "Auth", sections: [
    { id: "form", name: "Registration Form", type: "form", description: "Sign up form" },
  ]},
  { id: "forgot-password", name: "Forgot Password", path: "/forgot-password", category: "Auth", sections: [
    { id: "form", name: "Reset Form", type: "form", description: "Password reset form" },
  ]},
  
  // Legal Pages
  { id: "privacy", name: "Privacy Policy", path: "/privacy", category: "Legal", sections: [
    { id: "content", name: "Content", type: "text", description: "Privacy policy content" },
  ]},
  { id: "terms", name: "Terms of Service", path: "/terms", category: "Legal", sections: [
    { id: "content", name: "Content", type: "text", description: "Terms content" },
  ]},
];

const PAGE_CATEGORIES = ["All", "Marketing", "Portal", "Admin", "Auth", "Legal", "Landing Pages"];

const ELEMENT_TYPES = [
  { id: "heading", name: "Heading", icon: Type, description: "H1-H6 headings" },
  { id: "text", name: "Text Block", icon: FileText, description: "Paragraph text" },
  { id: "image", name: "Image", icon: Image, description: "Image with alt text" },
  { id: "button", name: "Button", icon: MousePointer, description: "CTA button" },
  { id: "form", name: "Form", icon: Square, description: "Contact/signup form" },
  { id: "video", name: "Video", icon: Monitor, description: "Embedded video" },
  { id: "divider", name: "Divider", icon: GripVertical, description: "Section divider" },
  { id: "spacer", name: "Spacer", icon: Square, description: "Vertical spacing" },
  { id: "card", name: "Card", icon: Square, description: "Content card" },
  { id: "grid", name: "Grid", icon: Layout, description: "Multi-column grid" },
];

const BUTTON_TYPES = [
  { id: "link", name: "External Link", icon: ExternalLink, description: "Link to external URL" },
  { id: "page", name: "Internal Page", icon: Link, description: "Link to app page" },
  { id: "stripe", name: "Stripe Checkout", icon: CreditCard, description: "Stripe payment button" },
];

export default function AIPageDesignerPage() {
  // State
  const [selectedPage, setSelectedPage] = useState<Page>(ALL_PAGES[0]);
  const [selectedSection, setSelectedSection] = useState<PageSection | null>(null);
  const [activeTab, setActiveTab] = useState("design");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [previewMode, setPreviewMode] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [showLandingPageDialog, setShowLandingPageDialog] = useState(false);
  const [showButtonDialog, setShowButtonDialog] = useState(false);
  const [showPreviewDialog, setShowPreviewDialog] = useState(false);
  
  // Landing page state
  const [landingPages, setLandingPages] = useState<LandingPageConfig[]>([]);
  const [currentLandingPage, setCurrentLandingPage] = useState<LandingPageConfig | null>(null);
  const [landingPageForm, setLandingPageForm] = useState({
    name: "",
    slug: "",
    eventName: "",
    eventDate: "",
    seoTitle: "",
    seoDescription: "",
  });
  
  // Button configuration state
  const [buttonConfig, setButtonConfig] = useState<ButtonConfig>({
    id: "",
    text: "Click Here",
    type: "link",
    destination: "",
    variant: "default",
    size: "default",
  });
  
  // Page elements for design
  const [pageElements, setPageElements] = useState<PageElement[]>([]);

  // Design Wizard state
  const [showWizard, setShowWizard] = useState(false);
  const [wizardStep, setWizardStep] = useState(0);
  const [wizardData, setWizardData] = useState({
    pageType: "landing",
    pageName: "",
    pageSlug: "",
    layout: "single-column",
    sections: [] as string[],
    heroTitle: "",
    heroSubtitle: "",
    primaryColor: "#2563EB",
    secondaryColor: "#10B981",
    seoTitle: "",
    seoDescription: "",
  });
  
  // Chat state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { id: "welcome", role: "assistant", content: "Hello! I am your AI Page Designer. I can help you:\n\n- Design and edit any page in the application\n- Create landing pages for events with custom URLs\n- Add buttons that link to pages or Stripe checkout\n- Preview designs before publishing\n\nWhat would you like to work on?", timestamp: new Date() }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  // Filter pages
  const filteredPages = ALL_PAGES.filter(page => {
    const matchesCategory = categoryFilter === "All" || page.category === categoryFilter;
    const matchesSearch = page.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         page.path.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Handlers
  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;
    const userMessage: ChatMessage = { id: "msg-" + Date.now(), role: "user", content: chatInput, timestamp: new Date() };
    setChatMessages(prev => [...prev, userMessage]);
    setChatInput("");
    setIsTyping(true);
    
    setTimeout(() => {
      const response = generateAIResponse(chatInput);
      setChatMessages(prev => [...prev, { id: "msg-" + (Date.now() + 1), role: "assistant", content: response, timestamp: new Date() }]);
      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = (input: string): string => {
    const lower = input.toLowerCase();
    if (lower.includes("landing page") || lower.includes("event page")) {
      return "To create a landing page:\n\n1. Click 'New Landing Page' button\n2. Enter the page name and custom URL slug\n3. Add event details if applicable\n4. Design your page using the drag-and-drop editor\n5. Add buttons for CTAs or Stripe checkout\n6. Preview and publish!\n\nWould you like me to help you get started?";
    }
    if (lower.includes("button") || lower.includes("stripe") || lower.includes("checkout")) {
      return "I can help you add buttons! You have three options:\n\n1. **External Link** - Opens a URL in new tab\n2. **Internal Page** - Navigate to another app page\n3. **Stripe Checkout** - Process payments\n\nFor Stripe, you will need your Product ID and Price ID from your Stripe dashboard. Click 'Add Button' to configure.";
    }
    if (lower.includes("preview")) {
      return "Click the 'Preview' button to see how your page will look before publishing. You can preview in:\n\n- Desktop (1920px)\n- Tablet (768px)\n- Mobile (375px)\n\nThe preview shows exactly how users will see your page.";
    }
    if (lower.includes("edit") || lower.includes("modify")) {
      return "To edit a page:\n\n1. Select the page from the sidebar\n2. Click on any section to edit it\n3. Use the design tab to add/remove elements\n4. Preview your changes\n5. Save when ready\n\nAll " + ALL_PAGES.length + " pages in the application are available for editing.";
    }
    return "I can help you with:\n\n- **Page Design** - Edit any of the " + ALL_PAGES.length + " pages\n- **Landing Pages** - Create event/campaign pages\n- **Buttons** - Add CTAs with links or Stripe checkout\n- **Preview** - See designs before publishing\n\nWhat would you like to do?";
  };

  const createLandingPage = () => {
    if (!landingPageForm.name || !landingPageForm.slug) return;
    
    const newPage: LandingPageConfig = {
      id: "lp-" + Date.now(),
      name: landingPageForm.name,
      slug: landingPageForm.slug,
      eventName: landingPageForm.eventName,
      eventDate: landingPageForm.eventDate,
      published: false,
      elements: [],
      buttons: [],
      seoTitle: landingPageForm.seoTitle || landingPageForm.name,
      seoDescription: landingPageForm.seoDescription,
    };
    
    setLandingPages(prev => [...prev, newPage]);
    setCurrentLandingPage(newPage);
    setShowLandingPageDialog(false);
    setLandingPageForm({ name: "", slug: "", eventName: "", eventDate: "", seoTitle: "", seoDescription: "" });
  };

  const addButton = () => {
    if (!buttonConfig.text) return;
    const newButton: ButtonConfig = { ...buttonConfig, id: "btn-" + Date.now() };
    if (currentLandingPage) {
      setCurrentLandingPage(prev => prev ? { ...prev, buttons: [...prev.buttons, newButton] } : null);
    }
    setShowButtonDialog(false);
    setButtonConfig({ id: "", text: "Click Here", type: "link", destination: "", variant: "default", size: "default" });
  };

  const getDeviceWidth = () => {
    switch (previewDevice) {
      case "mobile": return "375px";
      case "tablet": return "768px";
      default: return "100%";
    }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
      {/* Left Sidebar - Page Selection */}
      <div className="w-72 border-r bg-gray-50 flex flex-col">
        <div className="p-4 border-b">
          <h3 className="font-semibold text-sm text-gray-500 uppercase tracking-wide mb-3">Pages</h3>
          <div className="space-y-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search pages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PAGE_CATEGORIES.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            {filteredPages.map(page => (
              <button
                key={page.id}
                onClick={() => { setSelectedPage(page); setSelectedSection(null); }}
                className={"w-full text-left px-3 py-2 rounded-md text-sm transition-colors " + 
                  (selectedPage.id === page.id ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100")}
              >
                <div className="font-medium">{page.name}</div>
                <div className="text-xs text-gray-500">{page.path}</div>
              </button>
            ))}
            
            {/* Landing Pages Section */}
            {(categoryFilter === "All" || categoryFilter === "Landing Pages") && landingPages.length > 0 && (
              <>
                <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase">Landing Pages</div>
                {landingPages.map(lp => (
                  <button
                    key={lp.id}
                    onClick={() => setCurrentLandingPage(lp)}
                    className={"w-full text-left px-3 py-2 rounded-md text-sm transition-colors " +
                      (currentLandingPage?.id === lp.id ? "bg-purple-100 text-purple-700" : "hover:bg-gray-100")}
                  >
                    <div className="font-medium flex items-center gap-2">
                      <Rocket className="w-3 h-3" />
                      {lp.name}
                    </div>
                    <div className="text-xs text-gray-500">/{lp.slug}</div>
                  </button>
                ))}
              </>
            )}
          </div>
        </ScrollArea>
        
        <div className="p-4 border-t space-y-2">
          <Button className="w-full" variant="outline" onClick={() => setShowLandingPageDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Landing Page
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="border-b bg-white p-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-500" />
                AI Page Designer
              </h1>
              <p className="text-sm text-gray-500">
                {currentLandingPage ? currentLandingPage.name + " (Landing Page)" : selectedPage.name}
                {selectedSection && " > " + selectedSection.name}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center border rounded-md">
                <Button variant={previewDevice === "desktop" ? "secondary" : "ghost"} size="icon" onClick={() => setPreviewDevice("desktop")}>
                  <Monitor className="w-4 h-4" />
                </Button>
                <Button variant={previewDevice === "tablet" ? "secondary" : "ghost"} size="icon" onClick={() => setPreviewDevice("tablet")}>
                  <Tablet className="w-4 h-4" />
                </Button>
                <Button variant={previewDevice === "mobile" ? "secondary" : "ghost"} size="icon" onClick={() => setPreviewDevice("mobile")}>
                  <Smartphone className="w-4 h-4" />
                </Button>
              </div>
              <Button variant="outline" size="sm" onClick={() => setShowPreviewDialog(true)}>
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
              <Button size="sm">
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
          <div className="border-b bg-white px-4">
            <TabsList>
              <TabsTrigger value="design" className="flex items-center gap-2">
                <Layout className="w-4 h-4" />
                Design
              </TabsTrigger>
              <TabsTrigger value="elements" className="flex items-center gap-2">
                <Square className="w-4 h-4" />
                Elements
              </TabsTrigger>
              <TabsTrigger value="buttons" className="flex items-center gap-2">
                <MousePointer className="w-4 h-4" />
                Buttons
              </TabsTrigger>
              <TabsTrigger value="chat" className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                AI Chat
              </TabsTrigger>
              <TabsTrigger value="seo" className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                SEO
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Design Tab */}
          <TabsContent value="design" className="flex-1 overflow-auto m-0 p-4">
            <div className="max-w-4xl mx-auto">
              <Card className="mb-4">
                <CardHeader>
                  <CardTitle>Page Sections</CardTitle>
                  <CardDescription>Click on a section to edit its content and styling</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {selectedPage.sections.map(section => (
                      <div
                        key={section.id}
                        onClick={() => setSelectedSection(section)}
                        className={"p-4 border rounded-lg cursor-pointer transition-all " +
                          (selectedSection?.id === section.id ? "border-blue-500 bg-blue-50" : "hover:border-gray-300")}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">{section.name}</h4>
                            <p className="text-sm text-gray-500">{section.description}</p>
                          </div>
                          <Badge variant="outline">{section.type}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              {selectedSection && (
                <Card>
                  <CardHeader>
                    <CardTitle>Edit: {selectedSection.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <Label>Section Title</Label>
                        <Input placeholder="Enter section title..." />
                      </div>
                      <div>
                        <Label>Content</Label>
                        <Textarea placeholder="Enter section content..." rows={4} />
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" onClick={() => setShowButtonDialog(true)}>
                          <Plus className="w-4 h-4 mr-2" />
                          Add Button
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Elements Tab */}
          <TabsContent value="elements" className="flex-1 overflow-auto m-0 p-4">
            <div className="max-w-4xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle>Page Elements</CardTitle>
                  <CardDescription>Drag elements to add them to your page</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {ELEMENT_TYPES.map(el => (
                      <div
                        key={el.id}
                        className="p-4 border rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all text-center"
                      >
                        <el.icon className="w-8 h-8 mx-auto mb-2 text-gray-600" />
                        <div className="font-medium text-sm">{el.name}</div>
                        <div className="text-xs text-gray-500">{el.description}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Buttons Tab */}
          <TabsContent value="buttons" className="flex-1 overflow-auto m-0 p-4">
            <div className="max-w-4xl mx-auto">
              <Card className="mb-4">
                <CardHeader>
                  <CardTitle>Button Types</CardTitle>
                  <CardDescription>Add interactive buttons to your page</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    {BUTTON_TYPES.map(bt => (
                      <div
                        key={bt.id}
                        onClick={() => { setButtonConfig(prev => ({ ...prev, type: bt.id as any })); setShowButtonDialog(true); }}
                        className="p-4 border rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all text-center"
                      >
                        <bt.icon className="w-8 h-8 mx-auto mb-2 text-gray-600" />
                        <div className="font-medium">{bt.name}</div>
                        <div className="text-xs text-gray-500">{bt.description}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              {currentLandingPage && currentLandingPage.buttons.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Configured Buttons</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {currentLandingPage.buttons.map(btn => (
                        <div key={btn.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">{btn.text}</div>
                            <div className="text-sm text-gray-500">
                              {btn.type === "stripe" ? "Stripe Checkout" : btn.destination}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{btn.type}</Badge>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* AI Chat Tab */}
          <TabsContent value="chat" className="flex-1 flex flex-col overflow-hidden m-0">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {chatMessages.map(msg => (
                <div key={msg.id} className={"flex " + (msg.role === "user" ? "justify-end" : "justify-start")}>
                  <div className={"max-w-[80%] rounded-lg p-4 " + (msg.role === "user" ? "bg-blue-500 text-white" : "bg-gray-100")}>
                    <div className="whitespace-pre-wrap">{msg.content}</div>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-lg p-4">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
            <div className="border-t bg-white p-4">
              <div className="flex gap-2">
                <Input
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="Ask AI for help designing your page..."
                  className="flex-1"
                />
                <Button onClick={handleSendMessage} disabled={!chatInput.trim()}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* SEO Tab */}
          <TabsContent value="seo" className="flex-1 overflow-auto m-0 p-4">
            <div className="max-w-2xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle>SEO Settings</CardTitle>
                  <CardDescription>Optimize your page for search engines</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Page Title</Label>
                    <Input placeholder="Enter SEO title (50-60 characters)" />
                  </div>
                  <div>
                    <Label>Meta Description</Label>
                    <Textarea placeholder="Enter meta description (150-160 characters)" rows={3} />
                  </div>
                  <div>
                    <Label>URL Slug</Label>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">yourdomain.com/</span>
                      <Input placeholder="page-url" className="flex-1" />
                    </div>
                  </div>
                  <div>
                    <Label>Open Graph Image</Label>
                    <div className="border-2 border-dashed rounded-lg p-8 text-center">
                      <Image className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500">Click to upload OG image (1200x630px)</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Landing Page Dialog */}
      <Dialog open={showLandingPageDialog} onOpenChange={setShowLandingPageDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Create Landing Page</DialogTitle>
            <DialogDescription>Create a new landing page for events or campaigns</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Page Name *</Label>
              <Input
                value={landingPageForm.name}
                onChange={(e) => setLandingPageForm(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Summer Conference 2024"
              />
            </div>
            <div>
              <Label>URL Slug *</Label>
              <div className="flex items-center gap-2">
                <span className="text-gray-500 text-sm">/landing/</span>
                <Input
                  value={landingPageForm.slug}
                  onChange={(e) => setLandingPageForm(prev => ({ ...prev, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-") }))}
                  placeholder="summer-conference-2024"
                  className="flex-1"
                />
              </div>
            </div>
            <div>
              <Label>Event Name (optional)</Label>
              <Input
                value={landingPageForm.eventName}
                onChange={(e) => setLandingPageForm(prev => ({ ...prev, eventName: e.target.value }))}
                placeholder="e.g., Annual Manufacturing Summit"
              />
            </div>
            <div>
              <Label>Event Date (optional)</Label>
              <Input
                type="date"
                value={landingPageForm.eventDate}
                onChange={(e) => setLandingPageForm(prev => ({ ...prev, eventDate: e.target.value }))}
              />
            </div>
            <div>
              <Label>SEO Title</Label>
              <Input
                value={landingPageForm.seoTitle}
                onChange={(e) => setLandingPageForm(prev => ({ ...prev, seoTitle: e.target.value }))}
                placeholder="Page title for search engines"
              />
            </div>
            <div>
              <Label>SEO Description</Label>
              <Textarea
                value={landingPageForm.seoDescription}
                onChange={(e) => setLandingPageForm(prev => ({ ...prev, seoDescription: e.target.value }))}
                placeholder="Brief description for search results"
                rows={2}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowLandingPageDialog(false)}>Cancel</Button>
            <Button onClick={createLandingPage} disabled={!landingPageForm.name || !landingPageForm.slug}>
              Create Landing Page
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Button Configuration Dialog */}
      <Dialog open={showButtonDialog} onOpenChange={setShowButtonDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Configure Button</DialogTitle>
            <DialogDescription>Set up your button action and styling</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Button Text *</Label>
              <Input
                value={buttonConfig.text}
                onChange={(e) => setButtonConfig(prev => ({ ...prev, text: e.target.value }))}
                placeholder="e.g., Register Now"
              />
            </div>
            <div>
              <Label>Button Type</Label>
              <Select value={buttonConfig.type} onValueChange={(v: any) => setButtonConfig(prev => ({ ...prev, type: v }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="link">External Link</SelectItem>
                  <SelectItem value="page">Internal Page</SelectItem>
                  <SelectItem value="stripe">Stripe Checkout</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {buttonConfig.type === "link" && (
              <div>
                <Label>URL</Label>
                <Input
                  value={buttonConfig.destination}
                  onChange={(e) => setButtonConfig(prev => ({ ...prev, destination: e.target.value }))}
                  placeholder="https://example.com"
                />
              </div>
            )}
            
            {buttonConfig.type === "page" && (
              <div>
                <Label>Select Page</Label>
                <Select value={buttonConfig.destination} onValueChange={(v) => setButtonConfig(prev => ({ ...prev, destination: v }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a page" />
                  </SelectTrigger>
                  <SelectContent>
                    {ALL_PAGES.map(p => (
                      <SelectItem key={p.id} value={p.path}>{p.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            
            {buttonConfig.type === "stripe" && (
              <>
                <div>
                  <Label>Stripe Product ID</Label>
                  <Input
                    value={buttonConfig.stripeProductId || ""}
                    onChange={(e) => setButtonConfig(prev => ({ ...prev, stripeProductId: e.target.value }))}
                    placeholder="prod_xxxxx"
                  />
                </div>
                <div>
                  <Label>Stripe Price ID</Label>
                  <Input
                    value={buttonConfig.stripePriceId || ""}
                    onChange={(e) => setButtonConfig(prev => ({ ...prev, stripePriceId: e.target.value }))}
                    placeholder="price_xxxxx"
                  />
                </div>
              </>
            )}
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Style</Label>
                <Select value={buttonConfig.variant} onValueChange={(v: any) => setButtonConfig(prev => ({ ...prev, variant: v }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Primary</SelectItem>
                    <SelectItem value="secondary">Secondary</SelectItem>
                    <SelectItem value="outline">Outline</SelectItem>
                    <SelectItem value="ghost">Ghost</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Size</Label>
                <Select value={buttonConfig.size} onValueChange={(v: any) => setButtonConfig(prev => ({ ...prev, size: v }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sm">Small</SelectItem>
                    <SelectItem value="default">Medium</SelectItem>
                    <SelectItem value="lg">Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label>Preview</Label>
              <div className="p-4 border rounded-lg bg-gray-50">
                <Button variant={buttonConfig.variant as any} size={buttonConfig.size as any}>
                  {buttonConfig.text || "Button"}
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowButtonDialog(false)}>Cancel</Button>
            <Button onClick={addButton}>Add Button</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={showPreviewDialog} onOpenChange={setShowPreviewDialog}>
        <DialogContent className="max-w-6xl h-[90vh]">
          <DialogHeader>
            <DialogTitle>Page Preview</DialogTitle>
            <DialogDescription>
              Preview how your page will look on different devices
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 flex flex-col">
            <div className="flex justify-center gap-2 mb-4">
              <Button variant={previewDevice === "desktop" ? "default" : "outline"} size="sm" onClick={() => setPreviewDevice("desktop")}>
                <Monitor className="w-4 h-4 mr-2" />Desktop
              </Button>
              <Button variant={previewDevice === "tablet" ? "default" : "outline"} size="sm" onClick={() => setPreviewDevice("tablet")}>
                <Tablet className="w-4 h-4 mr-2" />Tablet
              </Button>
              <Button variant={previewDevice === "mobile" ? "default" : "outline"} size="sm" onClick={() => setPreviewDevice("mobile")}>
                <Smartphone className="w-4 h-4 mr-2" />Mobile
              </Button>
            </div>
            <div className="flex-1 bg-gray-100 rounded-lg overflow-auto flex justify-center p-4">
              <div 
                className="bg-white shadow-lg rounded-lg overflow-hidden transition-all"
                style={{ width: getDeviceWidth(), minHeight: "500px" }}
              >
                <div className="p-8 text-center">
                  <h2 className="text-2xl font-bold mb-4">{currentLandingPage?.name || selectedPage.name}</h2>
                  <p className="text-gray-500 mb-8">Preview content will appear here</p>
                  {currentLandingPage?.buttons.map(btn => (
                    <Button key={btn.id} variant={btn.variant as any} size={btn.size as any} className="m-2">
                      {btn.type === "stripe" && <CreditCard className="w-4 h-4 mr-2" />}
                      {btn.text}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
