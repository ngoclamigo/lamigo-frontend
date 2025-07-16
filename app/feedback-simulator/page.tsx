"use client";

import { Copy } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Textarea } from "~/components/ui/textarea";
import { getScenario, getScenarios } from "~/network/scenarios";
import { FeedbackResponse } from "~/types/learning-outcomes";
import { Scenario } from "~/types/scenario";
import {
  getCallTypeLabel,
  getIntentTypeLabel,
  getLeadStageCategoryLabel,
  getObjectionTypeLabel,
  getSpecialtyTypeLabel,
} from "~/utils/label";

type ScriptQuality = "bad" | "medium" | "good";

export default function FeedbackSimulatorPage() {
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
  const [selectedQuality, setSelectedQuality] = useState<ScriptQuality>("medium");
  const [generatedScript, setGeneratedScript] = useState<string>("");
  const [transcript, setTranscript] = useState<string>("");
  const [feedback, setFeedback] = useState<FeedbackResponse | null>(null);
  const [loading, setLoading] = useState({
    scenarios: false,
    scenario: false,
    script: false,
    feedback: false,
  });

  // Mock learner profile - in real app this would come from user context
  const learnerProfile = {
    role: "Sales Rep",
    industry_focus: "Technology",
    experience_level: "Mid-level",
    historical_performance: {
      avg_core_scores: [75, 80, 70, 65], // [product, communication, discovery, objection]
      improvement_areas: ["objection_handling", "discovery"],
    },
  };

  useEffect(() => {
    fetchScenarios();
  }, []);

  const fetchScenarios = async () => {
    try {
      setLoading((prev) => ({ ...prev, scenarios: true }));
      const response = await getScenarios();
      setScenarios(response.data);
    } catch {
      toast.error("Failed to fetch scenarios");
    } finally {
      setLoading((prev) => ({ ...prev, scenarios: false }));
    }
  };

  const handleScenarioSelect = async (scenarioId: string) => {
    try {
      setLoading((prev) => ({ ...prev, scenario: true }));
      const response = await getScenario(scenarioId);
      setSelectedScenario(response.data);
      setGeneratedScript("");
      setTranscript("");
      setFeedback(null);
    } catch {
      toast.error("Failed to fetch scenario details");
    } finally {
      setLoading((prev) => ({ ...prev, scenario: false }));
    }
  };

  const generateScript = async () => {
    if (!selectedScenario) return;

    setLoading((prev) => ({ ...prev, script: true }));

    try {
      const response = await fetch("/api/ai/generate-script", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          scenario: selectedScenario.scenarios,
          quality: selectedQuality,
          learner_profile: learnerProfile,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate script");
      }

      const data = await response.json();
      setGeneratedScript(data.script);
      setTranscript(data.script); // Auto-populate transcript with generated script
    } catch {
      toast.error("Failed to generate script");
    } finally {
      setLoading((prev) => ({ ...prev, script: false }));
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedScript);
      toast.success("Script copied to clipboard!");
    } catch {
      toast.error("Failed to copy script");
    }
  };

  const getFeedback = async () => {
    if (!transcript || !selectedScenario) return;

    try {
      setLoading((prev) => ({ ...prev, feedback: true }));

      const response = await fetch("/api/ai/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          transcript,
          learner_profile: learnerProfile,
          scenario_context: selectedScenario.scenarios,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get feedback");
      }

      const data = await response.json();
      setFeedback(data.data);
    } catch {
      toast.error("Failed to get feedback");
    } finally {
      setLoading((prev) => ({ ...prev, feedback: false }));
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Feedback Simulator</h1>
        <p className="text-muted-foreground">
          Practice your sales calls with AI-generated scenarios and get personalized feedback
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          {/* Scenario Selection */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Select Practice Scenario</CardTitle>
              <CardDescription>Choose a scenario to practice with</CardDescription>
            </CardHeader>
            <CardContent>
              {loading.scenarios ? (
                <div className="flex items-center justify-center h-32">
                  <p className="text-muted-foreground">Loading scenarios...</p>
                </div>
              ) : (
                <Select onValueChange={handleScenarioSelect}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a scenario" />
                  </SelectTrigger>
                  <SelectContent>
                    {scenarios.map((scenario) => (
                      <SelectItem key={scenario.id} value={scenario.id}>
                        {getCallTypeLabel(scenario.scenarios.call_type)} - {scenario.persona.buyer_identity.name} -{" "}
                        {scenario.persona.buyer_identity.company}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </CardContent>
          </Card>

          {/* Scenario Details */}
          {selectedScenario && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Scenario Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="font-medium mb-2">Description:</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedScenario.scenarios.description}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">
                    {getLeadStageCategoryLabel(selectedScenario.scenarios.category)}
                  </Badge>
                  <Badge variant="outline">
                    {getCallTypeLabel(selectedScenario.scenarios.call_type)}
                  </Badge>
                  <Badge variant="outline">
                    {getIntentTypeLabel(selectedScenario.scenarios.intent)}
                  </Badge>
                  <Badge variant="outline">
                    {getSpecialtyTypeLabel(selectedScenario.scenarios.specialty)}
                  </Badge>
                </div>
                <div>
                  <p className="font-medium mb-2">Objections:</p>
                  <ul className="text-sm space-y-1">
                    {selectedScenario.scenarios.objections.map((obj, index) => (
                      <li key={index} className="flex items-start">
                        <span className="mr-2">•</span>
                        {getObjectionTypeLabel(obj)}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Script Generation */}
          {selectedScenario && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Mock Conversation Generator</CardTitle>
                <CardDescription>
                  Generate realistic client-learner conversation scripts using AI
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <Select
                    value={selectedQuality}
                    onValueChange={(value: ScriptQuality) => setSelectedQuality(value)}
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bad">Bad Example</SelectItem>
                      <SelectItem value="medium">Medium Example</SelectItem>
                      <SelectItem value="good">Good Example</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button onClick={generateScript} disabled={loading.script}>
                    {loading.script ? "Generating Conversation..." : "Generate Mock Conversation"}
                  </Button>
                </div>

                {!loading.script && generatedScript && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">Generated Conversation Script:</p>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={copyToClipboard}>
                          <Copy className="h-4 w-4 mr-2" />
                          Copy
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setTranscript(generatedScript)}
                        >
                          Use for Practice
                        </Button>
                      </div>
                    </div>
                    <div className="p-4 bg-muted rounded-lg max-h-64 overflow-y-auto custom-scrollbar">
                      <pre className="text-sm whitespace-pre-wrap font-mono">{generatedScript}</pre>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Voice Recording/Transcript */}
          {selectedScenario && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Practice Session</CardTitle>
                {/* <CardDescription>Paste your transcript</CardDescription> */}
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Paste your transcript here:
                  </label>
                  <Textarea
                    value={transcript}
                    onChange={(e) => setTranscript(e.target.value)}
                    placeholder="Learner: Hi, this is John from ABC Company. I'm calling about our product.\nClient: What product? I'm busy."
                    className="custom-scrollbar"
                    rows={20}
                  />
                </div>

                <Button
                  onClick={getFeedback}
                  disabled={!transcript || loading.feedback}
                  className="w-full"
                >
                  {loading.feedback ? "Analyzing..." : "Get AI Feedback"}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        <div>
          {/* Feedback Results */}
          {!loading.feedback && feedback && (
            <div className="space-y-6">
              {/* Performance Scores Overview */}
              <Card>
                <CardHeader>
                  <CardTitle>Performance Overview</CardTitle>
                  <CardDescription>Overall readiness and performance metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {feedback.readiness_calculation.final_score || 0}
                      </div>
                      <p className="text-sm text-blue-700">Overall Score</p>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">
                        {feedback.readiness_calculation.status}
                      </div>
                      <p className="text-sm text-purple-700">
                        {feedback.readiness_calculation.confidence_level} Confidence
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Winning Talking Points */}
              {feedback.ui_sections?.winning_talking_points &&
                feedback.ui_sections.winning_talking_points.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Winning Talking Points</CardTitle>
                      <CardDescription>Effective moments from your conversation</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {feedback.ui_sections.winning_talking_points.map((point, index) => (
                          <div key={index} className="border-l-4 border-green-500 pl-4 py-2">
                            {/* <h4 className="font-medium text-green-800 mb-1">{point.point}</h4> */}
                            <p className="text-green-600 mb-2">{point.context}</p>
                            <p className="text-sm text-muted-foreground">
                              <span className="font-medium">Why effective:</span>{" "}
                              {point.why_effective}
                            </p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

              {/* Performance Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle>Performance Breakdown</CardTitle>
                  <CardDescription>
                    Detailed analysis of your performance by category
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {feedback.ui_sections?.performance_breakdown?.map((item, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium capitalize">{item.category}</h4>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">{item.score}/100</span>
                            <Badge
                              variant={
                                item.trend === "up"
                                  ? "default"
                                  : item.trend === "down"
                                    ? "destructive"
                                    : "secondary"
                              }
                            >
                              {item.trend}
                            </Badge>
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${item.score}%` }}
                          ></div>
                        </div>
                        <p className="text-sm text-muted-foreground">{item.feedback}</p>
                      </div>
                    )) || (
                      <p className="text-sm text-muted-foreground">
                        No performance breakdown available
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Key Insight */}
              {feedback.ui_sections?.key_insight && (
                <Card>
                  <CardHeader>
                    <CardTitle>Key Insight</CardTitle>
                    <CardDescription>Primary findings and recommendations</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <h4 className="font-medium text-blue-800 mb-2">Primary Finding:</h4>
                        <p className="text-sm text-blue-700">
                          {feedback.ui_sections.key_insight.primary_finding}
                        </p>
                      </div>

                      <div className="p-4 bg-orange-50 rounded-lg">
                        <h4 className="font-medium text-orange-800 mb-2">Improvement Area:</h4>
                        <p className="text-sm text-orange-700">
                          {feedback.ui_sections.key_insight.improvement_area}
                        </p>
                      </div>

                      <div className="p-4 bg-green-50 rounded-lg">
                        <h4 className="font-medium text-green-800 mb-2">Next Session Focus:</h4>
                        <p className="text-sm text-green-700">
                          {feedback.ui_sections.key_insight.next_session_focus}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
