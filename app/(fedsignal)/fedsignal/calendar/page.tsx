"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Plus, ChevronLeft, ChevronRight } from "lucide-react";

const events = [
  { id: "1", title: "NIH SBIR Deadline", date: "Mar 15", type: "deadline", color: "red" },
  { id: "2", title: "LinkedIn Post: AI Research", date: "Mar 18", type: "social", color: "blue" },
  { id: "3", title: "Howard U Partnership Call", date: "Mar 20", type: "meeting", color: "green" },
  { id: "4", title: "DOD Industry Day", date: "Mar 25", type: "event", color: "purple" },
];

export default function CalendarPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <CalendarIcon className="h-6 w-6 text-primary" />
            Content Calendar
          </h1>
          <p className="text-muted-foreground">Schedule and manage content & deadlines</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Event
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>March 2024</CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {events.map((event) => (
            <div key={event.id} className="flex items-center gap-4 rounded-lg border p-3">
              <div className={`h-10 w-10 rounded-lg flex items-center justify-center text-white ${
                event.color === "red" ? "bg-red-500" :
                event.color === "blue" ? "bg-blue-500" :
                event.color === "green" ? "bg-green-500" : "bg-purple-500"
              }`}>
                <span className="text-xs font-bold">{event.date.split(" ")[0]}</span>
              </div>
              <div className="flex-1">
                <p className="font-medium">{event.title}</p>
                <p className="text-sm text-muted-foreground">{event.date}</p>
              </div>
              <Badge variant="outline">{event.type}</Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
