"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Edit, Trash2, Save, X, Bell, Send, Eye } from "lucide-react";

// Sample alert data
const sampleAlert = {
  id: "1",
  icon: "⚡",
  title: "3 Priority Deadlines",
  description: "NSA Cyber RFP closes in 14 days. Proposal not started. Review team assignments and submit before deadline.",
  priority: "high" as const,
  type: "deadline" as const,
  color: "red" as const,
  actionUrl: "/fedsignal/opportunities",
  actionText: "View Opportunities",
  universityId: "tuskegee",
  isGlobal: false,
  readBy: ["user1", "user2"],
  createdAt: "2025-04-10T10:00:00Z",
  expiresAt: "2025-05-01T00:00:00Z",
};

const priorityOptions = [
  { value: "high", label: "High", color: "bg-red-100 text-red-800 border-red-200" },
  { value: "medium", label: "Medium", color: "bg-amber-100 text-amber-800 border-amber-200" },
  { value: "low", label: "Low", color: "bg-blue-100 text-blue-800 border-blue-200" },
];

const typeOptions = ["deadline", "opportunity", "intelligence", "partnership"];
const colorOptions = ["green", "amber", "red", "radar"];
const iconOptions = ["⚡", "📈", "🤝", "🏆", "📋", "🎓", "🔔", "📊"];

export default function AlertDetailPage() {
  const params = useParams();
  const alertId = params.id as string;
  
  const [isEditing, setIsEditing] = useState(false);
  const [alertData, setAlertData] = useState(sampleAlert);
  const [editedAlert, setEditedAlert] = useState(sampleAlert);

  const handleSave = () => {
    setAlertData(editedAlert);
    setIsEditing(false);
    // TODO: Save to Firestore
  };

  const handleCancel = () => {
    setEditedAlert(alertData);
    setIsEditing(false);
  };

  const handleSendNotification = () => {
    // TODO: Send email/push notification
    window.alert("Notification sent to users!");
  };

  const getPriorityStyle = (priority: string) => {
    return priorityOptions.find(p => p.value === priority)?.color || "";
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/portal/admin/fedsignal/alerts">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Alerts
          </Link>
        </Button>
        <div className="flex items-center gap-2">
          {!isEditing ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(true)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button variant="default" onClick={handleSendNotification}>
                <Send className="h-4 w-4 mr-2" />
                Send Notification
              </Button>
              <Button variant="destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={handleCancel}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Alert Preview */}
      <Card className={`border-l-4 ${alertData.color === "red" ? "border-l-red-500" : alertData.color === "amber" ? "border-l-amber-500" : alertData.color === "green" ? "border-l-green-500" : "border-l-blue-500"}`}>
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center text-2xl">
              {isEditing ? (
                <select
                  value={editedAlert.icon}
                  onChange={(e) => setEditedAlert({...editedAlert, icon: e.target.value})}
                  className="bg-transparent text-center w-full cursor-pointer"
                >
                  {iconOptions.map(icon => (
                    <option key={icon} value={icon}>{icon}</option>
                  ))}
                </select>
              ) : alertData.icon}
            </div>
            <div className="flex-1">
              {isEditing ? (
                <Input
                  value={editedAlert.title}
                  onChange={(e) => setEditedAlert({...editedAlert, title: e.target.value})}
                  className="text-xl font-bold mb-2"
                />
              ) : (
                <h1 className="text-xl font-bold">{alertData.title}</h1>
              )}
              {isEditing ? (
                <Textarea
                  value={editedAlert.description}
                  onChange={(e) => setEditedAlert({...editedAlert, description: e.target.value})}
                  className="text-muted-foreground"
                  rows={3}
                />
              ) : (
                <p className="text-muted-foreground mt-1">{alertData.description}</p>
              )}
              <div className="flex items-center gap-3 mt-4">
                <Badge className={getPriorityStyle(alertData.priority)}>
                  {alertData.priority.toUpperCase()}
                </Badge>
                <Badge variant="outline" className="capitalize">
                  {alertData.type}
                </Badge>
                {alertData.isGlobal ? (
                  <Badge variant="secondary">Global</Badge>
                ) : (
                  <Badge variant="outline">{alertData.universityId}</Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configuration */}
        <Card>
          <CardHeader>
            <CardTitle>Configuration</CardTitle>
            <CardDescription>Configure alert settings and targeting</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isEditing ? (
              <>
                <div className="space-y-2">
                  <Label>Priority</Label>
                  <select
                    value={editedAlert.priority}
                    onChange={(e) => setEditedAlert({...editedAlert, priority: e.target.value as any})}
                    className="w-full border rounded-md px-3 py-2 bg-background"
                  >
                    {priorityOptions.map(p => (
                      <option key={p.value} value={p.value}>{p.label}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label>Alert Type</Label>
                  <select
                    value={editedAlert.type}
                    onChange={(e) => setEditedAlert({...editedAlert, type: e.target.value as any})}
                    className="w-full border rounded-md px-3 py-2 bg-background"
                  >
                    {typeOptions.map(t => (
                      <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label>Color Theme</Label>
                  <select
                    value={editedAlert.color}
                    onChange={(e) => setEditedAlert({...editedAlert, color: e.target.value as any})}
                    className="w-full border rounded-md px-3 py-2 bg-background"
                  >
                    {colorOptions.map(c => (
                      <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    checked={editedAlert.isGlobal}
                    onChange={(e) => setEditedAlert({...editedAlert, isGlobal: e.target.checked})}
                    className="rounded"
                  />
                  <Label className="cursor-pointer">Global Alert (all universities)</Label>
                </div>

                {!editedAlert.isGlobal && (
                  <div className="space-y-2">
                    <Label>Target University</Label>
                    <select
                      value={editedAlert.universityId}
                      onChange={(e) => setEditedAlert({...editedAlert, universityId: e.target.value})}
                      className="w-full border rounded-md px-3 py-2 bg-background"
                    >
                      <option value="tuskegee">Tuskegee University</option>
                      <option value="howard">Howard University</option>
                      <option value="famu">Florida A&M University</option>
                      <option value="aamu">Alabama A&M University</option>
                      <option value="ncat">NC A&T State University</option>
                      <option value="morehouse">Morehouse College</option>
                    </select>
                  </div>
                )}
              </>
            ) : (
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Priority</span>
                  <span className="font-medium capitalize">{alertData.priority}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Type</span>
                  <span className="font-medium capitalize">{alertData.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Color</span>
                  <span className="font-medium capitalize">{alertData.color}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Scope</span>
                  <span className="font-medium">{alertData.isGlobal ? "Global" : alertData.universityId}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Action & Scheduling */}
        <Card>
          <CardHeader>
            <CardTitle>Action & Scheduling</CardTitle>
            <CardDescription>Configure call-to-action and expiration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isEditing ? (
              <>
                <div className="space-y-2">
                  <Label>Action Text</Label>
                  <Input
                    value={editedAlert.actionText || ""}
                    onChange={(e) => setEditedAlert({...editedAlert, actionText: e.target.value})}
                    placeholder="e.g., View Opportunities"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Action URL</Label>
                  <Input
                    value={editedAlert.actionUrl || ""}
                    onChange={(e) => setEditedAlert({...editedAlert, actionUrl: e.target.value})}
                    placeholder="/fedsignal/opportunities"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Expiration Date</Label>
                  <Input
                    type="date"
                    value={editedAlert.expiresAt ? new Date(editedAlert.expiresAt).toISOString().split('T')[0] : ''}
                    onChange={(e) => setEditedAlert({...editedAlert, expiresAt: new Date(e.target.value).toISOString()})}
                  />
                </div>
              </>
            ) : (
              <div className="space-y-3">
                {alertData.actionText && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Action</span>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={alertData.actionUrl || "#"}>{alertData.actionText}</Link>
                    </Button>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created</span>
                  <span>{new Date(alertData.createdAt).toLocaleDateString()}</span>
                </div>
                {alertData.expiresAt && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Expires</span>
                    <span>{new Date(alertData.expiresAt).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Engagement Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Engagement
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold">{alertData.readBy.length}</div>
              <div className="text-sm text-muted-foreground">Users Read</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold">12</div>
              <div className="text-sm text-muted-foreground">Total Recipients</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold">{Math.round((alertData.readBy.length / 12) * 100)}%</div>
              <div className="text-sm text-muted-foreground">Read Rate</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
