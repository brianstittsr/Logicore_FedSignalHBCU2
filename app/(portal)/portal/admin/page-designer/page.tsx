"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Wand2, MessageSquare, Layout, Palette, Send, Copy, Check, ChevronDown, ChevronRight, Sparkles, AlertTriangle, CheckCircle, Info, Star, Zap, Eye, Accessibility, Shield } from "lucide-react";

interface PageSection { id: string; name: string; type: string; description: string; }
interface Page { id: string; name: string; path: string; sections: PageSection[]; }
interface ChatMessage { id: string; role: "user" | "assistant"; content: string; timestamp: Date; }
interface Template { id: string; name: string; category: string; description: string; thumbnail: string; tags: string[]; }
interface UXReview { overallScore: number; recommendations: { id: string; category: string; severity: "high" | "medium" | "low"; title: string; description: string; suggestion: string; }[]; accessibilityIssues: { id: string; element: string; issue: string; wcagLevel: string; fix: string; }[]; brandConsistency: { score: number; issues: string[]; }; }

const PAGES: Page[] = [
  { id: "home", name: "Home Page", path: "/", sections: [
    { id: "hero", name: "Hero Section", type: "hero", description: "Main banner with CTA" },
    { id: "features", name: "Features", type: "features", description: "Key features grid" },
    { id: "testimonials", name: "Testimonials", type: "testimonials", description: "Customer reviews" },
    { id: "cta", name: "Call to Action", type: "cta", description: "Bottom CTA section" },
  ]},
  { id: "about", name: "About Page", path: "/about", sections: [
    { id: "intro", name: "Introduction", type: "text", description: "Company introduction" },
    { id: "team", name: "Team", type: "team", description: "Team members grid" },
    { id: "values", name: "Values", type: "values", description: "Company values" },
  ]},
  { id: "services", name: "Services Page", path: "/services", sections: [
    { id: "overview", name: "Services Overview", type: "grid", description: "Services grid" },
    { id: "pricing", name: "Pricing", type: "pricing", description: "Pricing tables" },
    { id: "faq", name: "FAQ", type: "faq", description: "Frequently asked questions" },
  ]},
];

const TEMPLATES: Template[] = [
  { id: "modern-hero", name: "Modern Hero", category: "hero", description: "Clean, modern hero section", thumbnail: "/templates/modern-hero.png", tags: ["modern", "gradient", "responsive"] },
  { id: "feature-grid", name: "Feature Grid", category: "features", description: "3-column feature grid", thumbnail: "/templates/feature-grid.png", tags: ["grid", "icons", "responsive"] },
  { id: "testimonial-carousel", name: "Testimonial Carousel", category: "testimonials", description: "Animated testimonial carousel", thumbnail: "/templates/testimonial-carousel.png", tags: ["carousel", "animation", "social-proof"] },
  { id: "pricing-table", name: "Pricing Table", category: "pricing", description: "Comparison pricing table", thumbnail: "/templates/pricing-table.png", tags: ["pricing", "comparison", "cta"] },
];

const MOCK_UX_REVIEW: UXReview = {
  overallScore: 78,
  recommendations: [
    { id: "rec-1", category: "Performance", severity: "high", title: "Optimize Hero Image", description: "The hero image is 2.4MB.", suggestion: "Compress and use WebP format." },
    { id: "rec-2", category: "Usability", severity: "medium", title: "Improve CTA Visibility", description: "Low contrast CTA button.", suggestion: "Increase contrast ratio to 4.5:1." },
    { id: "rec-3", category: "SEO", severity: "low", title: "Add Meta Description", description: "Missing meta description.", suggestion: "Add 150-160 character description." },
  ],
  accessibilityIssues: [
    { id: "a11y-1", element: "Hero Image", issue: "Missing alt text", wcagLevel: "A", fix: "Add descriptive alt text." },
    { id: "a11y-2", element: "Navigation Links", issue: "Insufficient color contrast", wcagLevel: "AA", fix: "Increase text contrast ratio." },
  ],
  brandConsistency: { score: 85, issues: ["Secondary button color differs from brand guidelines", "Font weight on headings inconsistent"] },
};

const BEST_PRACTICES = [
  { category: "Performance", items: ["Optimize images using WebP", "Lazy load below-the-fold content", "Minimize JavaScript bundle", "Use CDN for static assets"] },
  { category: "Accessibility", items: ["Ensure 4.5:1 contrast ratio", "Add alt text to images", "Use semantic HTML", "Support keyboard navigation"] },
  { category: "SEO", items: ["Use descriptive page titles", "Add meta descriptions", "Implement structured data", "Optimize heading hierarchy"] },
];

export default function AIPageDesignerPage() {
  const [selectedPage, setSelectedPage] = useState<Page>(PAGES[0]);
  const [selectedSection, setSelectedSection] = useState<PageSection | null>(null);
  const [activeTab, setActiveTab] = useState("chat");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([{ id: "welcome", role: "assistant", content: "Hello! I'm your AI Page Designer assistant. What would you like to work on today?", timestamp: new Date() }]);
  const [chatInput, setChatInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [templateFilter, setTemplateFilter] = useState<string>("all");
  const [showWizard, setShowWizard] = useState(false);
  const [wizardStep, setWizardStep] = useState(0);
  const [expandedBestPractices, setExpandedBestPractices] = useState<string[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [chatMessages]);

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;
    const userMessage: ChatMessage = { id: msg-+Date.now(), role: "user", content: chatInput, timestamp: new Date() };
    setChatMessages((prev) => [...prev, userMessage]);
    setChatInput("");
    setIsTyping(true);
    setTimeout(() => {
      const aiResponse: ChatMessage = { id: msg-+(Date.now() + 1), role: "assistant", content: generateAIResponse(chatInput), timestamp: new Date() };
      setChatMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = (input: string): string => {
    const lowerInput = input.toLowerCase();
    if (lowerInput.includes("hero")) return "I can help you design a compelling hero section!\n\n1. Use a strong headline\n2. Add a clear CTA\n3. Include social proof";
    if (lowerInput.includes("color") || lowerInput.includes("palette")) return "For your brand colors, I recommend:\n\n- Primary: #2563EB (Blue)\n- Secondary: #10B981 (Green)\n- Accent: #F59E0B (Amber)";
    if (lowerInput.includes("improve") || lowerInput.includes("optimize")) return "Top improvements:\n\n1. Performance: Compress images\n2. Accessibility: Add alt texts\n3. Conversion: Make CTA prominent";
    return "I can help with:\n\n- Layout suggestions\n- Content recommendations\n- Visual design\n- UX improvements";
  };

  const handleCopy = (text: string, id: string) => { navigator.clipboard.writeText(text); setCopiedId(id); setTimeout(() => setCopiedId(null), 2000); };
  const toggleBestPractice = (category: string) => { setExpandedBestPractices((prev) => prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]); };
  const filteredTemplates = templateFilter === "all" ? TEMPLATES : TEMPLATES.filter((t) => t.category === templateFilter);
  const getSeverityColor = (severity: string) => { switch (severity) { case "high": return "text-red-500 bg-red-50"; case "medium": return "text-yellow-500 bg-yellow-50"; case "low": return "text-blue-500 bg-blue-50"; default: return "text-gray-500 bg-gray-50"; } };
  const getScoreColor = (score: number) => { if (score >= 80) return "text-green-500"; if (score >= 60) return "text-yellow-500"; return "text-red-500"; };
  const wizardSteps = [{ title: "Page Type", description: "Select page type" }, { title: "Layout", description: "Choose layout" }, { title: "Sections", description: "Add sections" }, { title: "Content", description: "Add content" }, { title: "Styling", description: "Customize" }, { title: "SEO", description: "Optimize" }, { title: "Review", description: "Publish" }];

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
      <div className="w-64 border-r bg-gray-50 p-4 overflow-y-auto">
        <div className="mb-4">
          <h3 className="font-semibold text-sm text-gray-500 uppercase tracking-wide mb-2">Pages</h3>
          <Select value={selectedPage.id} onValueChange={(value) => { const page = PAGES.find((p) => p.id === value); if (page) { setSelectedPage(page); setSelectedSection(null); } }}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{PAGES.map((page) => (<SelectItem key={page.id} value={page.id}>{page.name}</SelectItem>))}</SelectContent>
          </Select>
        </div>
        <div>
          <h3 className="font-semibold text-sm text-gray-500 uppercase tracking-wide mb-2">Sections</h3>
          <div className="space-y-1">
            {selectedPage.sections.map((section) => (
              <button key={section.id} onClick={() => setSelectedSection(section)} className={w-full text-left px-3 py-2 rounded-md text-sm transition-colors +(selectedSection?.id === section.id ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100")}>
                <div className="font-medium">{section.name}</div>
                <div className="text-xs text-gray-500">{section.type}</div>
              </button>
            ))}
          </div>
        </div>
        <div className="mt-6 pt-6 border-t">
          <Dialog open={showWizard} onOpenChange={setShowWizard}>
            <DialogTrigger asChild><Button className="w-full" variant="outline"><Wand2 className="w-4 h-4 mr-2" />Design Wizard</Button></DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader><DialogTitle>Page Design Wizard</DialogTitle><DialogDescription>Follow these steps to create a new page design</DialogDescription></DialogHeader>
              <div className="flex items-center justify-between mb-6">
                {wizardSteps.map((step, index) => (<div key={index} className="flex items-center"><div className={w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium +(index < wizardStep ? "bg-green-500 text-white" : index === wizardStep ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-500")}>{index < wizardStep ? <Check className="w-4 h-4" /> : index + 1}</div>{index < wizardSteps.length - 1 && <div className={w-8 h-0.5 +(index < wizardStep ? "bg-green-500" : "bg-gray-200")} />}</div>))}
              </div>
              <div className="min-h-[200px] p-4 bg-gray-50 rounded-lg"><h4 className="font-semibold mb-2">{wizardSteps[wizardStep].title}</h4><p className="text-gray-600 text-sm">{wizardSteps[wizardStep].description}</p><div className="mt-4 p-8 border-2 border-dashed border-gray-300 rounded-lg text-center text-gray-400">Step {wizardStep + 1} content</div></div>
              <DialogFooter><Button variant="outline" onClick={() => setWizardStep(Math.max(0, wizardStep - 1))} disabled={wizardStep === 0}>Previous</Button><Button onClick={() => { if (wizardStep < wizardSteps.length - 1) { setWizardStep(wizardStep + 1); } else { setShowWizard(false); setWizardStep(0); } }}>{wizardStep === wizardSteps.length - 1 ? "Finish" : "Next"}</Button></DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="border-b bg-white p-4">
          <div className="flex items-center justify-between">
            <div><h1 className="text-xl font-semibold flex items-center gap-2"><Sparkles className="w-5 h-5 text-blue-500" />AI Page Designer</h1><p className="text-sm text-gray-500">{selectedPage.name} {selectedSection && > +selectedSection.name}</p></div>
            <div className="flex items-center gap-2"><Button variant="outline" size="sm"><Eye className="w-4 h-4 mr-2" />Preview</Button><Button size="sm">Save Changes</Button></div>
          </div>
        </div>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
          <div className="border-b bg-white px-4">
            <TabsList>
              <TabsTrigger value="chat" className="flex items-center gap-2"><MessageSquare className="w-4 h-4" />AI Chat</TabsTrigger>
              <TabsTrigger value="templates" className="flex items-center gap-2"><Layout className="w-4 h-4" />Templates</TabsTrigger>
              <TabsTrigger value="ux-review" className="flex items-center gap-2"><Palette className="w-4 h-4" />UX Review</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="chat" className="flex-1 flex flex-col overflow-hidden m-0">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {chatMessages.map((message) => (<div key={message.id} className={lex +(message.role === "user" ? "justify-end" : "justify-start")}><div className={max-w-[80%] rounded-lg p-4 +(message.role === "user" ? "bg-blue-500 text-white" : "bg-gray-100")}><div className="whitespace-pre-wrap">{message.content}</div>{message.role === "assistant" && (<button onClick={() => handleCopy(message.content, message.id)} className="mt-2 text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1">{copiedId === message.id ? <><Check className="w-3 h-3" />Copied</> : <><Copy className="w-3 h-3" />Copy</>}</button>)}</div></div>))}
              {isTyping && (<div className="flex justify-start"><div className="bg-gray-100 rounded-lg p-4"><div className="flex space-x-2"><div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" /><div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" /><div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" /></div></div></div>)}
              <div ref={chatEndRef} />
            </div>
            <div className="border-t bg-gray-50 p-2"><div className="flex gap-2 overflow-x-auto pb-2"><Button variant="outline" size="sm" onClick={() => setChatInput("Suggest improvements")}><Zap className="w-3 h-3 mr-1" />Suggest</Button><Button variant="outline" size="sm" onClick={() => setChatInput("Generate a hero section")}><Layout className="w-3 h-3 mr-1" />Hero</Button><Button variant="outline" size="sm" onClick={() => setChatInput("Recommend a color palette")}><Palette className="w-3 h-3 mr-1" />Colors</Button><Button variant="outline" size="sm" onClick={() => setChatInput("Optimize for mobile")}><Sparkles className="w-3 h-3 mr-1" />Mobile</Button></div></div>
            <div className="border-t bg-white p-4"><div className="flex gap-2"><input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSendMessage()} placeholder="Ask AI to help design your page..." className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" /><Button onClick={handleSendMessage} disabled={!chatInput.trim()}><Send className="w-4 h-4" /></Button></div></div>
          </TabsContent>
          <TabsContent value="templates" className="flex-1 overflow-y-auto m-0 p-4">
            <div className="mb-4"><Select value={templateFilter} onValueChange={setTemplateFilter}><SelectTrigger className="w-48"><SelectValue placeholder="Filter" /></SelectTrigger><SelectContent><SelectItem value="all">All</SelectItem><SelectItem value="hero">Hero</SelectItem><SelectItem value="features">Features</SelectItem><SelectItem value="testimonials">Testimonials</SelectItem><SelectItem value="pricing">Pricing</SelectItem></SelectContent></Select></div>
            <div className="grid grid-cols-2 gap-4 mb-8">{filteredTemplates.map((template) => (<Card key={template.id} className="cursor-pointer hover:shadow-md transition-shadow"><div className="aspect-video bg-gray-200 rounded-t-lg flex items-center justify-center"><Layout className="w-12 h-12 text-gray-400" /></div><CardContent className="p-4"><h4 className="font-semibold">{template.name}</h4><p className="text-sm text-gray-500 mb-2">{template.description}</p><div className="flex flex-wrap gap-1">{template.tags.map((tag) => (<Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>))}</div></CardContent></Card>))}</div>
            <div className="border-t pt-6"><h3 className="font-semibold mb-4 flex items-center gap-2"><Star className="w-5 h-5 text-yellow-500" />Best Practices</h3><div className="space-y-2">{BEST_PRACTICES.map((practice) => (<Collapsible key={practice.category} open={expandedBestPractices.includes(practice.category)} onOpenChange={() => toggleBestPractice(practice.category)}><CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-gray-50 rounded-lg hover:bg-gray-100"><span className="font-medium">{practice.category}</span>{expandedBestPractices.includes(practice.category) ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}</CollapsibleTrigger><CollapsibleContent className="p-3 space-y-2">{practice.items.map((item, index) => (<div key={index} className="flex items-start gap-2 text-sm"><CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" /><span>{item}</span></div>))}</CollapsibleContent></Collapsible>))}</div></div>
          </TabsContent>
          <TabsContent value="ux-review" className="flex-1 overflow-y-auto m-0 p-4">
            <Card className="mb-6"><CardHeader><CardTitle className="flex items-center justify-between"><span>Overall UX Score</span><span className={	ext-4xl font-bold +getScoreColor(MOCK_UX_REVIEW.overallScore)}>{MOCK_UX_REVIEW.overallScore}</span></CardTitle><CardDescription>Based on performance, accessibility, and best practices</CardDescription></CardHeader></Card>
            <div className="mb-6"><h3 className="font-semibold mb-4 flex items-center gap-2"><Zap className="w-5 h-5 text-blue-500" />Recommendations</h3><div className="space-y-3">{MOCK_UX_REVIEW.recommendations.map((rec) => (<Card key={rec.id}><CardContent className="p-4"><div className="flex items-start gap-3"><div className={p-2 rounded-lg +getSeverityColor(rec.severity)}>{rec.severity === "high" ? <AlertTriangle className="w-4 h-4" /> : rec.severity === "medium" ? <Info className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}</div><div className="flex-1"><div className="flex items-center gap-2 mb-1"><h4 className="font-semibold">{rec.title}</h4><Badge variant="outline" className="text-xs">{rec.category}</Badge></div><p className="text-sm text-gray-600 mb-2">{rec.description}</p><p className="text-sm text-blue-600"><strong>Suggestion:</strong> {rec.suggestion}</p></div></div></CardContent></Card>))}</div></div>
            <div className="mb-6"><h3 className="font-semibold mb-4 flex items-center gap-2"><Accessibility className="w-5 h-5 text-purple-500" />Accessibility Issues</h3><div className="space-y-3">{MOCK_UX_REVIEW.accessibilityIssues.map((issue) => (<Card key={issue.id}><CardContent className="p-4"><div className="flex items-center gap-2 mb-1"><h4 className="font-semibold">{issue.element}</h4><Badge variant="outline" className="text-xs">WCAG {issue.wcagLevel}</Badge></div><p className="text-sm text-gray-600 mb-2">{issue.issue}</p><p className="text-sm text-green-600"><strong>Fix:</strong> {issue.fix}</p></CardContent></Card>))}</div></div>
            <div><h3 className="font-semibold mb-4 flex items-center gap-2"><Shield className="w-5 h-5 text-green-500" />Brand Consistency</h3><Card><CardContent className="p-4"><div className="flex items-center justify-between mb-4"><span className="text-gray-600">Consistency Score</span><span className={	ext-2xl font-bold +getScoreColor(MOCK_UX_REVIEW.brandConsistency.score)}>{MOCK_UX_REVIEW.brandConsistency.score}%</span></div>{MOCK_UX_REVIEW.brandConsistency.issues.length > 0 && (<div><h5 className="text-sm font-medium mb-2">Issues Found:</h5><ul className="space-y-1">{MOCK_UX_REVIEW.brandConsistency.issues.map((issue, index) => (<li key={index} className="text-sm text-gray-600 flex items-start gap-2"><AlertTriangle className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />{issue}</li>))}</ul></div>)}</CardContent></Card></div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
