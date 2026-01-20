"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Users,
  FileText,
  Play,
  CheckSquare,
  ExternalLink,
  Video,
  Loader2,
  AlertTriangle,
  Plus,
  Trash2,
  Edit,
  Save,
  MessageSquare,
  Sparkles,
  Target,
  ListTodo,
} from "lucide-react";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc, collection, getDocs, addDoc, deleteDoc, Timestamp } from "firebase/firestore";
import { COLLECTIONS } from "@/lib/schema";
import { toast } from "sonner";

interface MeetingAttendee {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
}

interface ActionItem {
  id: string;
  text: string;
  assignee?: string;
  dueDate?: Date;
  completed: boolean;
}

interface MeetingData {
  id: string;
  title: string;
  date: Date;
  duration: number;
  type: string;
  attendees: MeetingAttendee[];
  joinUrl?: string;
  recordingUrl?: string;
  transcript?: string;
  notes?: string;
  summary?: string;
  actionItems: ActionItem[];
  keyTopics?: string[];
  opportunityId?: string;
  projectId?: string;
  createdAt: Date;
  updatedAt: Date;
}

function getMeetingTypeBadge(type: string) {
  switch (type) {
    case "discovery":
      return <Badge className="bg-blue-100 text-blue-800">Discovery</Badge>;
    case "follow-up":
      return <Badge className="bg-green-100 text-green-800">Follow-up</Badge>;
    case "internal":
      return <Badge className="bg-purple-100 text-purple-800">Internal</Badge>;
    case "project":
      return <Badge className="bg-orange-100 text-orange-800">Project</Badge>;
    case "demo":
      return <Badge className="bg-pink-100 text-pink-800">Demo</Badge>;
    default:
      return <Badge variant="secondary">{type}</Badge>;
  }
}

function formatDate(date: Date | Timestamp | null | undefined): string {
  if (!date) return "Not set";
  const d = date instanceof Timestamp ? date.toDate() : date;
  return d.toLocaleDateString("en-US", { 
    weekday: "long",
    month: "long", 
    day: "numeric", 
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function MeetingDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const meetingId = params.id as string;

  const [meeting, setMeeting] = useState<MeetingData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [editingNotes, setEditingNotes] = useState(false);
  const [notesContent, setNotesContent] = useState("");
  const [newActionItem, setNewActionItem] = useState({ text: "", assignee: "", dueDate: "" });
  const [actionDialogOpen, setActionDialogOpen] = useState(false);

  useEffect(() => {
    async function fetchMeeting() {
      if (!db || !meetingId) return;

      setIsLoading(true);
      try {
        const meetingRef = doc(db, COLLECTIONS.MEETINGS, meetingId);
        const meetingSnap = await getDoc(meetingRef);

        if (!meetingSnap.exists()) {
          // Try to find in a mock data scenario
          setMeeting({
            id: meetingId,
            title: "Sample Meeting",
            date: new Date(),
            duration: 30,
            type: "discovery",
            attendees: [
              { id: "1", name: "John Doe", email: "john@example.com" },
              { id: "2", name: "Jane Smith", email: "jane@example.com" },
            ],
            joinUrl: "#",
            notes: "",
            summary: "This is a sample meeting. The actual meeting data will be loaded from Firestore when available.",
            actionItems: [],
            keyTopics: ["Introduction", "Requirements", "Next Steps"],
            createdAt: new Date(),
            updatedAt: new Date(),
          });
          return;
        }

        const data = meetingSnap.data();
        setMeeting({
          id: meetingSnap.id,
          title: data.title || "Untitled Meeting",
          date: data.date?.toDate() || new Date(),
          duration: data.duration || 30,
          type: data.type || "meeting",
          attendees: data.attendees || [],
          joinUrl: data.joinUrl,
          recordingUrl: data.recordingUrl,
          transcript: data.transcript,
          notes: data.notes || "",
          summary: data.summary,
          actionItems: data.actionItems || [],
          keyTopics: data.keyTopics || [],
          opportunityId: data.opportunityId,
          projectId: data.projectId,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        });
        setNotesContent(data.notes || "");
      } catch (error) {
        console.error("Error fetching meeting:", error);
        toast.error("Failed to load meeting");
      } finally {
        setIsLoading(false);
      }
    }

    fetchMeeting();
  }, [meetingId]);

  const handleSaveNotes = async () => {
    if (!db || !meetingId) return;

    setIsSaving(true);
    try {
      const meetingRef = doc(db, COLLECTIONS.MEETINGS, meetingId);
      await updateDoc(meetingRef, {
        notes: notesContent,
        updatedAt: Timestamp.now(),
      });
      setMeeting(prev => prev ? { ...prev, notes: notesContent } : null);
      setEditingNotes(false);
      toast.success("Notes saved");
    } catch (error) {
      console.error("Error saving notes:", error);
      toast.error("Failed to save notes");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddActionItem = async () => {
    if (!db || !meetingId || !newActionItem.text.trim()) return;

    try {
      const newItem: ActionItem = {
        id: `action-${Date.now()}`,
        text: newActionItem.text,
        assignee: newActionItem.assignee || undefined,
        dueDate: newActionItem.dueDate ? new Date(newActionItem.dueDate) : undefined,
        completed: false,
      };

      const updatedItems = [...(meeting?.actionItems || []), newItem];
      
      const meetingRef = doc(db, COLLECTIONS.MEETINGS, meetingId);
      await updateDoc(meetingRef, {
        actionItems: updatedItems,
        updatedAt: Timestamp.now(),
      });

      setMeeting(prev => prev ? { ...prev, actionItems: updatedItems } : null);
      setNewActionItem({ text: "", assignee: "", dueDate: "" });
      setActionDialogOpen(false);
      toast.success("Action item added");
    } catch (error) {
      console.error("Error adding action item:", error);
      toast.error("Failed to add action item");
    }
  };

  const handleToggleActionItem = async (itemId: string) => {
    if (!db || !meetingId || !meeting) return;

    try {
      const updatedItems = meeting.actionItems.map(item =>
        item.id === itemId ? { ...item, completed: !item.completed } : item
      );

      const meetingRef = doc(db, COLLECTIONS.MEETINGS, meetingId);
      await updateDoc(meetingRef, {
        actionItems: updatedItems,
        updatedAt: Timestamp.now(),
      });

      setMeeting({ ...meeting, actionItems: updatedItems });
    } catch (error) {
      console.error("Error updating action item:", error);
      toast.error("Failed to update action item");
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  if (!meeting) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="py-16 text-center">
            <AlertTriangle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">Meeting Not Found</h2>
            <p className="text-muted-foreground mb-4">
              The meeting you're looking for doesn't exist or has been deleted.
            </p>
            <Button asChild>
              <Link href="/portal/meetings">Back to Meetings</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const completedActions = meeting.actionItems.filter(a => a.completed).length;

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/portal/meetings">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold">{meeting.title}</h1>
              {getMeetingTypeBadge(meeting.type)}
            </div>
            <p className="text-muted-foreground flex items-center gap-2 mt-1">
              <Calendar className="h-4 w-4" />
              {formatDate(meeting.date)}
              <span className="mx-2">•</span>
              <Clock className="h-4 w-4" />
              {meeting.duration} min
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {meeting.joinUrl && (
            <Button asChild>
              <a href={meeting.joinUrl} target="_blank" rel="noopener noreferrer">
                <Play className="h-4 w-4 mr-2" />
                Join Meeting
              </a>
            </Button>
          )}
          {meeting.recordingUrl && (
            <Button variant="outline" asChild>
              <a href={meeting.recordingUrl} target="_blank" rel="noopener noreferrer">
                <Video className="h-4 w-4 mr-2" />
                Watch Recording
              </a>
            </Button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <Users className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{meeting.attendees.length}</p>
                <p className="text-sm text-muted-foreground">Attendees</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <ListTodo className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{completedActions}/{meeting.actionItems.length}</p>
                <p className="text-sm text-muted-foreground">Action Items</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <Target className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{meeting.keyTopics?.length || 0}</p>
                <p className="text-sm text-muted-foreground">Key Topics</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <FileText className="h-8 w-8 text-orange-500" />
              <div>
                <p className="text-2xl font-bold">{meeting.transcript ? "Yes" : "No"}</p>
                <p className="text-sm text-muted-foreground">Transcript</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="transcript">Transcript</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
          <TabsTrigger value="actions">Action Items</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  AI Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                {meeting.summary ? (
                  <p className="text-muted-foreground">{meeting.summary}</p>
                ) : (
                  <p className="text-muted-foreground italic">
                    No AI summary available. Summary will be generated after the meeting is transcribed.
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Key Topics
                </CardTitle>
              </CardHeader>
              <CardContent>
                {meeting.keyTopics && meeting.keyTopics.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {meeting.keyTopics.map((topic, index) => (
                      <Badge key={index} variant="secondary">{topic}</Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground italic">No key topics identified yet.</p>
                )}
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Attendees
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4">
                  {meeting.attendees.map((attendee) => (
                    <div key={attendee.id} className="flex items-center gap-3 p-3 border rounded-lg">
                      <Avatar>
                        <AvatarImage src={attendee.avatar} />
                        <AvatarFallback>
                          {attendee.name.split(" ").map(n => n[0]).join("").toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{attendee.name}</p>
                        {attendee.email && (
                          <p className="text-sm text-muted-foreground">{attendee.email}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Transcript Tab */}
        <TabsContent value="transcript" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Meeting Transcript</CardTitle>
              <CardDescription>Full transcript of the meeting conversation</CardDescription>
            </CardHeader>
            <CardContent>
              {meeting.transcript ? (
                <div className="prose max-w-none">
                  <pre className="whitespace-pre-wrap text-sm bg-muted p-4 rounded-lg">
                    {meeting.transcript}
                  </pre>
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    No transcript available yet. Transcripts are generated automatically after meetings with recording enabled.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notes Tab */}
        <TabsContent value="notes" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Meeting Notes</CardTitle>
                <CardDescription>Your personal notes from this meeting</CardDescription>
              </div>
              {!editingNotes ? (
                <Button onClick={() => setEditingNotes(true)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Notes
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => {
                    setEditingNotes(false);
                    setNotesContent(meeting.notes || "");
                  }}>
                    Cancel
                  </Button>
                  <Button onClick={handleSaveNotes} disabled={isSaving}>
                    {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                    Save
                  </Button>
                </div>
              )}
            </CardHeader>
            <CardContent>
              {editingNotes ? (
                <Textarea
                  value={notesContent}
                  onChange={(e) => setNotesContent(e.target.value)}
                  placeholder="Add your meeting notes here..."
                  rows={12}
                  className="font-mono"
                />
              ) : meeting.notes ? (
                <div className="prose max-w-none">
                  <pre className="whitespace-pre-wrap text-sm">{meeting.notes}</pre>
                </div>
              ) : (
                <div className="text-center py-8">
                  <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-4">No notes yet</p>
                  <Button onClick={() => setEditingNotes(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Notes
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Action Items Tab */}
        <TabsContent value="actions" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Action Items</CardTitle>
                <CardDescription>Tasks and follow-ups from this meeting</CardDescription>
              </div>
              <Button onClick={() => setActionDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Action Item
              </Button>
            </CardHeader>
            <CardContent>
              {meeting.actionItems.length === 0 ? (
                <div className="text-center py-8">
                  <CheckSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-4">No action items yet</p>
                  <Button onClick={() => setActionDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add First Action Item
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {meeting.actionItems.map((item) => (
                    <div
                      key={item.id}
                      className={`flex items-start gap-4 p-4 border rounded-lg ${
                        item.completed ? "bg-muted/50" : ""
                      }`}
                    >
                      <Checkbox
                        checked={item.completed}
                        onCheckedChange={() => handleToggleActionItem(item.id)}
                      />
                      <div className="flex-1">
                        <p className={item.completed ? "line-through text-muted-foreground" : ""}>
                          {item.text}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          {item.assignee && (
                            <span className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {item.assignee}
                            </span>
                          )}
                          {item.dueDate && (
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(item.dueDate).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Action Item Dialog */}
      <Dialog open={actionDialogOpen} onOpenChange={setActionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Action Item</DialogTitle>
            <DialogDescription>Create a new task or follow-up from this meeting</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={newActionItem.text}
                onChange={(e) => setNewActionItem({ ...newActionItem, text: e.target.value })}
                placeholder="What needs to be done?"
              />
            </div>
            <div className="space-y-2">
              <Label>Assignee (optional)</Label>
              <Input
                value={newActionItem.assignee}
                onChange={(e) => setNewActionItem({ ...newActionItem, assignee: e.target.value })}
                placeholder="Who is responsible?"
              />
            </div>
            <div className="space-y-2">
              <Label>Due Date (optional)</Label>
              <Input
                type="date"
                value={newActionItem.dueDate}
                onChange={(e) => setNewActionItem({ ...newActionItem, dueDate: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setActionDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddActionItem} disabled={!newActionItem.text.trim()}>
              Add Action Item
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
