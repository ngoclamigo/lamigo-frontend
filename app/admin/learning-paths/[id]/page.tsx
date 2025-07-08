/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ArrowLeft, Edit2, FileText, Save, Trash2, Wand2, X } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { ScrollArea } from "~/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Textarea } from "~/components/ui/textarea";
import { getDocuments } from "~/network/documents";
import { createActivities, generateActivities, getLearningPaths } from "~/network/learning-paths";
import { Document } from "~/types/document";
import { Activity, LearningPath, QuizConfig, SlideConfig } from "~/types/learning-path";
import { systemPrompt as _systemPrompt, userPrompt as _userPrompt } from "~/utils/prompt";

/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable @typescript-eslint/no-explicit-any */

export default function LearningPathDetailPage() {
  const params = useParams();
  const router = useRouter();
  const pathId = params.id as string;

  const [learningPath, setLearningPath] = useState<LearningPath | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDocumentUrl, setSelectedDocumentUrl] = useState<string>("");
  const [generatedActivities, setGeneratedActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [creating, setCreating] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const [systemPrompt, setSystemPrompt] = useState(_systemPrompt);
  const [userPrompt, setUserPrompt] = useState(_userPrompt);

  useEffect(() => {
    if (pathId) {
      loadLearningPath();
      loadDocuments();
    }
  }, [pathId]);

  const loadLearningPath = async () => {
    try {
      const paths = await getLearningPaths();
      const path = paths.find((p: LearningPath) => p.id === pathId);
      if (path) {
        setLearningPath(path);
      }
    } catch (error) {
      console.error("Failed to load learning path:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadDocuments = async () => {
    try {
      const docs = await getDocuments();
      setDocuments(docs);
    } catch (error) {
      console.error("Failed to load documents:", error);
    }
  };

  const handleGenerateActivities = async () => {
    if (!selectedDocumentUrl || generating) return;

    setGenerating(true);
    try {
      const activities = await generateActivities(pathId, { document_url: selectedDocumentUrl });
      setGeneratedActivities(activities);
    } catch (error) {
      console.error("Failed to generate activities:", error);
    } finally {
      setGenerating(false);
    }
  };

  const handleCreateActivities = async () => {
    if (generatedActivities.length === 0 || creating) return;

    setCreating(true);
    try {
      await createActivities(pathId, generatedActivities);
      setGeneratedActivities([]);
      setSelectedDocumentUrl("");
      await loadLearningPath(); // Reload to get updated activities
    } catch (error) {
      console.error("Failed to create activities:", error);
    } finally {
      setCreating(false);
    }
  };

  const handleEditActivity = (activity: Activity) => {
    setEditingActivity(activity);
    setEditDialogOpen(true);
  };

  const handleSaveActivityEdit = () => {
    if (!editingActivity) return;

    const updatedActivities = generatedActivities.map((activity) =>
      activity.id === editingActivity.id ? editingActivity : activity
    );
    setGeneratedActivities(updatedActivities);
    setEditDialogOpen(false);
    setEditingActivity(null);
  };

  const handleDeleteActivity = (activityId: string) => {
    const updatedActivities = generatedActivities.filter((activity) => activity.id !== activityId);
    setGeneratedActivities(updatedActivities);
  };

  const updateEditingActivity = (field: string, value: any) => {
    if (!editingActivity) return;
    setEditingActivity({
      ...editingActivity,
      [field]: value,
    });
  };

  const updateEditingActivityConfig = (field: string, value: any) => {
    if (!editingActivity) return;
    setEditingActivity({
      ...editingActivity,
      config: {
        ...editingActivity.config,
        [field]: value,
      },
    });
  };

  const renderActivityConfig = (activity: Activity) => {
    switch (activity.type) {
      case "slide":
        return (
          <div className="space-y-3">
            <div>
              <Label>Content</Label>
              <Textarea
                value={(activity.config as SlideConfig).content || ""}
                onChange={(e) => updateEditingActivityConfig("content", e.target.value)}
                placeholder="Slide content"
                rows={4}
                className="custom-scrollbar"
              />
            </div>
            <div>
              <Label>Narration (Optional)</Label>
              <Textarea
                value={(activity.config as SlideConfig).narration || ""}
                onChange={(e) => updateEditingActivityConfig("narration", e.target.value)}
                placeholder="Audio narration script"
                rows={4}
                className="custom-scrollbar"
              />
            </div>
          </div>
        );
      case "quiz":
        return (
          <div className="space-y-3">
            <div>
              <Label>Question</Label>
              <Textarea
                value={(activity.config as QuizConfig).question || ""}
                onChange={(e) => updateEditingActivityConfig("question", e.target.value)}
                placeholder="Quiz question"
                rows={2}
              />
            </div>
            <div>
              <Label>Options (one per line)</Label>
              <Textarea
                value={(activity.config as QuizConfig).options?.join("\n") || ""}
                onChange={(e) => updateEditingActivityConfig("options", e.target.value.split("\n"))}
                placeholder="Option 1\nOption 2\nOption 3\nOption 4"
                rows={4}
              />
            </div>
            <div>
              <Label>Correct Answer (0-based index)</Label>
              <Input
                type="number"
                value={(activity.config as QuizConfig).correct_answer || 0}
                onChange={(e) =>
                  updateEditingActivityConfig("correct_answer", parseInt(e.target.value))
                }
                min={0}
              />
            </div>
            <div>
              <Label>Explanation (Optional)</Label>
              <Textarea
                value={(activity.config as QuizConfig).explanation || ""}
                onChange={(e) => updateEditingActivityConfig("explanation", e.target.value)}
                placeholder="Explanation for the correct answer"
                rows={2}
              />
            </div>
          </div>
        );
      default:
        return <div>Editing not supported for this activity type</div>;
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  if (!learningPath) {
    return <div className="text-center py-8">Learning path not found</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" onClick={() => router.back()} className="pl-0">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Learning Paths
        </Button>
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">{learningPath.title}</h1>
        <p className="text-muted-foreground text-lg">{learningPath.description}</p>
      </div>

      {/* Document Selection & Activity Generation */}
      <Card className="border-2 border-dashed border-muted hover:border-primary/20 transition-colors">
        <CardHeader>
          <CardTitle className="flex items-center text-xl">
            <Wand2 className="w-5 h-5 mr-2 text-primary" />
            Generate Activities from Document
          </CardTitle>
          <CardDescription>
            Select a document to automatically generate learning activities
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="document-select">Select Document</Label>
            <Select value={selectedDocumentUrl} onValueChange={setSelectedDocumentUrl}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a document..." />
              </SelectTrigger>
              <SelectContent>
                {documents.map((doc) => (
                  <SelectItem key={doc.id} value={doc.url}>
                    <div className="flex items-center">
                      <FileText className="w-4 h-4 mr-2" />
                      {doc.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>System Prompt</Label>
            <Textarea
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              placeholder="Enter system prompt for activity generation"
              rows={5}
              className="custom-scrollbar"
              disabled={!selectedDocumentUrl || generating}
            />
          </div>
          <div>
            <Label>User Prompt</Label>
            <Textarea
              value={userPrompt}
              onChange={(e) => setUserPrompt(e.target.value)}
              placeholder="Enter user prompt for activity generation"
              rows={20}
              className="custom-scrollbar"
              disabled={!selectedDocumentUrl || generating}
            />
          </div>
          <Button
            onClick={handleGenerateActivities}
            disabled={!selectedDocumentUrl || generating}
            className="w-full sm:w-auto"
          >
            <Wand2 className="w-4 h-4 mr-2" />
            {generating ? "Generating..." : "Generate Activities"}
          </Button>
        </CardContent>
      </Card>

      {/* Generated Activities Preview */}
      {generatedActivities.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Generated Activities Preview</CardTitle>
            <CardDescription>
              Review and edit the generated activities before creating them
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              {generatedActivities.map((activity) => (
                <Card key={activity.id} className="border">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{activity.title}</CardTitle>
                        <CardDescription>{activity.description}</CardDescription>
                      </div>
                      <div className="flex space-x-2">
                        <Badge variant="outline">{activity.type}</Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditActivity(activity)}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteActivity(activity.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setGeneratedActivities([])}>
                Cancel
              </Button>
              <Button onClick={handleCreateActivities} disabled={creating}>
                <Save className="w-4 h-4 mr-2" />
                {creating ? "Creating..." : "Create Activities"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Existing Activities */}
      <Card>
        <CardHeader>
          <CardTitle>Existing Activities</CardTitle>
          <CardDescription>Current activities in this learning path</CardDescription>
        </CardHeader>
        <CardContent>
          {learningPath.activities && learningPath.activities.length > 0 ? (
            <div className="grid gap-4">
              {learningPath.activities.map((activity) => (
                <Card key={activity.id} className="border">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{activity.title}</CardTitle>
                        <CardDescription>{activity.description}</CardDescription>
                      </div>
                      <Badge variant="secondary">{activity.type}</Badge>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No activities yet. Generate some from a document above.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Activity Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl p-0">
          <DialogHeader className="p-4">
            <DialogTitle>Edit Activity</DialogTitle>
            <DialogDescription>Modify the activity details and configuration</DialogDescription>
          </DialogHeader>

          <ScrollArea className="max-h-[70vh]">
            {editingActivity && (
              <div className="space-y-4 px-4">
                <div>
                  <Label>Title</Label>
                  <Input
                    value={editingActivity.title}
                    onChange={(e) => updateEditingActivity("title", e.target.value)}
                    placeholder="Activity title"
                  />
                </div>

                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={editingActivity.description}
                    onChange={(e) => updateEditingActivity("description", e.target.value)}
                    placeholder="Activity description"
                    rows={4}
                    className="custom-scrollbar"
                  />
                </div>

                <div>
                  <Label>Type</Label>
                  <Select
                    value={editingActivity.type}
                    onValueChange={(value) => updateEditingActivity("type", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="slide">Slide</SelectItem>
                      <SelectItem value="quiz">Quiz</SelectItem>
                      <SelectItem value="flashcard">Flashcard</SelectItem>
                      <SelectItem value="embed">Embed</SelectItem>
                      <SelectItem value="fill_blanks">Fill Blanks</SelectItem>
                      <SelectItem value="matching">Matching</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Configuration</Label>
                  {renderActivityConfig(editingActivity)}
                </div>
              </div>
            )}
          </ScrollArea>

          <DialogFooter className="p-4">
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleSaveActivityEdit}>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
