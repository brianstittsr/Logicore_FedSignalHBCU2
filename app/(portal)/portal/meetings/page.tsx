"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus,
  Video,
  Calendar,
  Clock,
  Users,
  FileText,
  Play,
  CheckSquare,
  ExternalLink,
  Loader2,
  CalendarPlus,
} from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where, orderBy, Timestamp } from "firebase/firestore";
import { COLLECTIONS } from "@/lib/schema";

interface MeetingData {
  id: string;
  title: string;
  date: Date;
  duration: number;
  type: string;
  attendees: { id?: string; name: string; email?: string }[];
  joinUrl?: string;
  transcript?: string;
  notes?: string;
  actionItems?: { id: string; text: string; completed: boolean }[];
  description?: string;
}

interface AttendeeDisplay {
  name: string;
  initials: string;
}

function getMeetingTypeBadge(type: string) {
  const types: Record<string, { label: string; className: string }> = {
    discovery: { label: "Discovery", className: "bg-blue-100 text-blue-800" },
    "follow-up": { label: "Follow-up", className: "bg-purple-100 text-purple-800" },
    project: { label: "Project", className: "bg-green-100 text-green-800" },
    internal: { label: "Internal", className: "bg-gray-100 text-gray-800" },
    demo: { label: "Demo", className: "bg-pink-100 text-pink-800" },
    "one-to-one": { label: "1-to-1", className: "bg-amber-100 text-amber-800" },
    other: { label: "Other", className: "bg-gray-100 text-gray-800" },
  };
  const config = types[type] || { label: type, className: "bg-gray-100 text-gray-800" };
  return <Badge className={config.className}>{config.label}</Badge>;
}

function formatDate(date: Date) {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (date.toDateString() === today.toDateString()) {
    return "Today";
  } else if (date.toDateString() === tomorrow.toDateString()) {
    return "Tomorrow";
  }
  return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

function formatTime(date: Date) {
  return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

function formatDuration(minutes: number) {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours} hour${hours > 1 ? "s" : ""}`;
}

function getInitials(name: string): string {
  return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
}

export default function MeetingsPage() {
  const [upcomingMeetings, setUpcomingMeetings] = useState<MeetingData[]>([]);
  const [pastMeetings, setPastMeetings] = useState<MeetingData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchMeetings() {
      if (!db) return;
      
      setIsLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, COLLECTIONS.MEETINGS));
        const now = new Date();
        const upcoming: MeetingData[] = [];
        const past: MeetingData[] = [];

        querySnapshot.forEach((docSnap) => {
          const data = docSnap.data();
          const meetingDate = data.date?.toDate() || new Date();
          
          const meeting: MeetingData = {
            id: docSnap.id,
            title: data.title || "Untitled Meeting",
            date: meetingDate,
            duration: data.duration || 30,
            type: data.type || "meeting",
            attendees: data.attendees || [],
            joinUrl: data.joinUrl,
            transcript: data.transcript,
            notes: data.notes,
            actionItems: data.actionItems || [],
            description: data.description,
          };

          if (meetingDate >= now) {
            upcoming.push(meeting);
          } else {
            past.push(meeting);
          }
        });

        // Sort upcoming by date ascending, past by date descending
        upcoming.sort((a, b) => a.date.getTime() - b.date.getTime());
        past.sort((a, b) => b.date.getTime() - a.date.getTime());

        setUpcomingMeetings(upcoming);
        setPastMeetings(past);
      } catch (error) {
        console.error("Error fetching meetings:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchMeetings();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Meetings</h1>
          <p className="text-muted-foreground">
            Schedule meetings and access AI-extracted insights
          </p>
        </div>
        <Button asChild>
          <Link href="/portal/meetings/new">
            <Plus className="mr-2 h-4 w-4" />
            Schedule Meeting
          </Link>
        </Button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="upcoming">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past Meetings</TabsTrigger>
        </TabsList>

        {/* Upcoming Meetings */}
        <TabsContent value="upcoming" className="space-y-4 mt-6">
          {upcomingMeetings.length === 0 ? (
            <Card>
              <CardContent className="py-16 text-center">
                <CalendarPlus className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Upcoming Meetings</h3>
                <p className="text-muted-foreground mb-4">Schedule a meeting to get started</p>
                <Button asChild>
                  <Link href="/portal/meetings/new">
                    <Plus className="mr-2 h-4 w-4" />
                    Schedule Meeting
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            upcomingMeetings.map((meeting) => (
              <Card key={meeting.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-secondary/20 flex items-center justify-center shrink-0">
                        <Video className="h-6 w-6 text-secondary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{meeting.title}</h3>
                        <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {formatDate(meeting.date)}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {formatTime(meeting.date)} ({formatDuration(meeting.duration)})
                          </div>
                        </div>
                        {meeting.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {meeting.description}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {getMeetingTypeBadge(meeting.type)}
                      {meeting.joinUrl && (
                        <Button asChild>
                          <a href={meeting.joinUrl} target="_blank" rel="noopener noreferrer">
                            <Play className="mr-2 h-4 w-4" />
                            Join
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Attendees */}
                  <div className="mt-4 pt-4 border-t flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Attendees:</span>
                      <div className="flex -space-x-2">
                        {meeting.attendees.map((attendee, i) => (
                          <Avatar key={i} className="h-6 w-6 border-2 border-background">
                            <AvatarFallback className="bg-primary/10 text-primary text-xs">
                              {getInitials(attendee.name)}
                            </AvatarFallback>
                          </Avatar>
                        ))}
                      </div>
                      {meeting.attendees.length === 0 && (
                        <span className="text-sm text-muted-foreground">No attendees</span>
                      )}
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/portal/meetings/${meeting.id}`}>
                        <ExternalLink className="mr-2 h-4 w-4" />
                        View Details
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        {/* Past Meetings */}
        <TabsContent value="past" className="space-y-4 mt-6">
          {pastMeetings.length === 0 ? (
            <Card>
              <CardContent className="py-16 text-center">
                <Video className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Past Meetings</h3>
                <p className="text-muted-foreground">Your completed meetings will appear here</p>
              </CardContent>
            </Card>
          ) : (
            pastMeetings.map((meeting) => (
              <Card key={meeting.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center shrink-0">
                        <Video className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{meeting.title}</h3>
                        <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {meeting.date.toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {formatTime(meeting.date)} ({formatDuration(meeting.duration)})
                          </div>
                        </div>
                      </div>
                    </div>

                    {getMeetingTypeBadge(meeting.type)}
                  </div>

                  {/* Meeting Intelligence */}
                  <div className="mt-4 pt-4 border-t">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {meeting.transcript && (
                        <Button variant="outline" size="sm" className="justify-start" asChild>
                          <Link href={`/portal/meetings/${meeting.id}?tab=transcript`}>
                            <FileText className="mr-2 h-4 w-4" />
                            Transcript
                          </Link>
                        </Button>
                      )}
                      {meeting.notes && (
                        <Button variant="outline" size="sm" className="justify-start" asChild>
                          <Link href={`/portal/meetings/${meeting.id}?tab=notes`}>
                            <FileText className="mr-2 h-4 w-4" />
                            Notes
                          </Link>
                        </Button>
                      )}
                      {meeting.actionItems && meeting.actionItems.length > 0 && (
                        <Button variant="outline" size="sm" className="justify-start" asChild>
                          <Link href={`/portal/meetings/${meeting.id}?tab=actions`}>
                            <CheckSquare className="mr-2 h-4 w-4" />
                            {meeting.actionItems.length} Action Items
                          </Link>
                        </Button>
                      )}
                      <Button variant="outline" size="sm" className="justify-start" asChild>
                        <Link href={`/portal/meetings/${meeting.id}`}>
                          <ExternalLink className="mr-2 h-4 w-4" />
                          View Details
                        </Link>
                      </Button>
                    </div>
                  </div>

                  {/* Attendees */}
                  <div className="mt-4 flex items-center gap-2">
                    <div className="flex -space-x-2">
                      {meeting.attendees.map((attendee, i) => (
                        <Avatar key={i} className="h-6 w-6 border-2 border-background">
                          <AvatarFallback className="bg-primary/10 text-primary text-xs">
                            {getInitials(attendee.name)}
                          </AvatarFallback>
                        </Avatar>
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {meeting.attendees.length} attendee{meeting.attendees.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
