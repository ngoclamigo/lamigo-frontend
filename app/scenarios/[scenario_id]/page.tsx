"use client";

import {
  AlarmClock,
  BriefcaseBusiness,
  Building2,
  Factory,
  FolderKanban,
  Headset,
  MapPin,
  TableProperties,
} from "lucide-react";
import { motion } from "motion/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FiChevronDown, FiChevronUp, FiMic, FiMicOff, FiPlay } from "react-icons/fi";
import { useMediaDevices } from "~/hooks/use-media-devices";
import { getScenario } from "~/network/scenarios";
import type { Scenario } from "~/types/scenario";
import { getCallTypeLabel, getIntentTypeLabel, getObjectionTypeLabel } from "~/utils/label";

export default function ScenarioPage() {
  const params = useParams();
  const scenario_id = params.scenario_id as string;
  const router = useRouter();

  const [collapsedSteps, setCollapsedSteps] = useState<Record<number, boolean>>({
    1: true,
    2: false,
    3: false,
  });

  const { devices, activeDeviceId, setActiveDeviceId } = useMediaDevices({
    kind: "audioinput",
  });

  const isTestingMic = false; // Mock state for demonstration
  const micTestResult = "success"; // Mock result for demonstration

  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchScenarios = async () => {
      setIsLoading(true);
      setIsError(false);
      try {
        const data = await getScenario(scenario_id);
        setScenario(data.data);
      } catch (error) {
        console.error("Failed to fetch scenarios:", error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchScenarios();
  }, [scenario_id]);

  const toggleCollapse = (stepNumber: number) => {
    setCollapsedSteps((prev) => ({
      ...prev,
      [stepNumber]: !prev[stepNumber],
    }));
  };

  const handleStartSimulation = () => {
    router.push(`/scenarios/${params.scenario_id}/practice`);
  };

  return (
    <div className="min-h-screen pb-[120px]">
      <div className="container mx-auto py-8">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="w-16 h-16 border-4 border-gray-300 border-t-primary rounded-full animate-spin mb-4"></div>
            <p className="text-lg text-gray-600 dark:text-gray-400">Loading scenario details...</p>
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-100 dark:bg-red-900/30 p-6 rounded-lg max-w-md shadow-md"
            >
              <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-3">
                Error Loading Scenario
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                We couldn&apos;t load the scenario details. Please try again later.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push("/scenarios")}
                className="px-4 py-2 bg-gradient-to-r from-ring to-primary text-white rounded-lg hover:shadow-lg transition-all"
              >
                Back to Scenarios
              </motion.button>
            </motion.div>
          </div>
        ) : scenario ? (
          <div>
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8 text-center"
            >
              <h1 className="text-5xl font-bold mb-2 bg-gradient-to-r from-ring to-primary bg-clip-text text-transparent">
                Practice Scenario
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                Get ready to practice your sales skills with a real-world scenario!
              </p>
            </motion.div>

            <div className="flex flex-col gap-6">
              {/* Step 1: Context Verification */}
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="w-full bg-white dark:bg-gray-800 shadow-md border rounded-lg overflow-hidden"
              >
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center space-x-4">
                    <div className="bg-gradient-to-br from-ring to-primary rounded-lg w-12 h-12 flex items-center justify-center text-white font-bold text-lg shadow-md">
                      1
                    </div>
                    <h2 className="text-xl font-bold text-primary">Context Verification</h2>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => toggleCollapse(1)}
                    className="text-gray-500 hover:text-gray-700"
                    aria-label="Toggle collapse"
                  >
                    {collapsedSteps[1] ? <FiChevronDown /> : <FiChevronUp />}
                  </motion.button>
                </div>

                <motion.div
                  animate={{
                    height: collapsedSteps[1] ? "auto" : 0,
                    opacity: collapsedSteps[1] ? 1 : 0,
                  }}
                  className={`px-6 pb-6 overflow-hidden`}
                >
                  <p className="mb-4 text-gray-600 dark:text-gray-400">
                    Let me confirm the details for your practice session:
                  </p>

                  <div className="bg-gray-50 dark:bg-gray-700 p-5 rounded-lg mb-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        {
                          icon: Headset,
                          name: "Call Type",
                          topDesc: getCallTypeLabel(scenario.scenarios.call_type) || "N/A",
                        },
                        {
                          icon: FolderKanban,
                          name: "Intent",
                          topDesc: getIntentTypeLabel(scenario.scenarios.intent) || "N/A",
                        },
                        {
                          icon: TableProperties,
                          name: "Objections",
                          topDesc:
                            scenario.scenarios.objections
                              .map((o) => getObjectionTypeLabel(o))
                              .join(", ") || "N/A",
                        },
                        {
                          icon: AlarmClock,
                          name: "Time Limit",
                          topDesc: `${Number(scenario.scenarios.time_limit) / 60} minutes` || "N/A",
                        },
                      ].map((detail, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 * index }}
                        >
                          <div className="flex items-center p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-center bg-gradient-to-br from-ring to-primary rounded-lg w-10 h-10 text-white">
                              <detail.icon className="w-5 h-5" />
                            </div>
                            <div className="ml-3">
                              <p className="font-semibold">{detail.name}</p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {detail.topDesc}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-muted to-accent border border-accent rounded-lg p-4 shadow-sm">
                    <div className="flex">
                      <div className="ml-3">
                        <h3 className="text-primary font-semibold">Ready to proceed!</h3>
                        <p className="text-primary">
                          Everything looks accurate. Let&apos;s set up your practice environment.
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>

              {/* Step 2: Voice Setup */}
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="w-full bg-white dark:bg-gray-800 shadow-md border rounded-lg overflow-hidden"
              >
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center space-x-4">
                    <div className="bg-gradient-to-br from-ring to-primary rounded-lg w-12 h-12 flex items-center justify-center text-white font-bold text-lg shadow-md">
                      2
                    </div>
                    <h2 className="text-xl font-bold text-primary">Voice Setup & Testing</h2>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => toggleCollapse(2)}
                    className="text-gray-500 hover:text-gray-700"
                    aria-label="Toggle collapse"
                  >
                    {collapsedSteps[2] ? <FiChevronDown /> : <FiChevronUp />}
                  </motion.button>
                </div>

                <motion.div
                  animate={{
                    height: collapsedSteps[2] ? "auto" : 0,
                    opacity: collapsedSteps[2] ? 1 : 0,
                  }}
                  className={`px-6 pb-6 overflow-hidden`}
                >
                  <p className="mb-4 text-gray-600 dark:text-gray-400">
                    Let&apos;s make sure your microphone is working properly for the most natural
                    conversation experience:
                  </p>

                  <div className="bg-gray-50 dark:bg-gray-700 p-5 rounded-lg mb-4">
                    <div className="flex flex-col gap-4">
                      <div>
                        <p className="font-medium mb-2">Choose a device for speaking</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                          Don&apos;t worry if this isn&apos;t perfect - we can adjust during
                          practice
                        </p>

                        <select
                          className="w-full p-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                          disabled={devices.length === 0}
                          value={activeDeviceId}
                          onChange={(e) => setActiveDeviceId(e.target.value)}
                        >
                          {devices.map((device) => (
                            <option key={device.deviceId} value={device.deviceId}>
                              {device.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <hr className="border-gray-200 dark:border-gray-600" />

                      <div>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="w-full py-2 px-3 bg-gradient-to-r from-ring to-primary text-white font-medium rounded-lg hover:shadow-lg flex items-center justify-center gap-2 text-base transition-all"
                        >
                          {isTestingMic ? "Stop Testing" : "Test Microphone"}
                          {isTestingMic ? (
                            <FiMicOff className="ml-2" />
                          ) : (
                            <FiMic className="ml-2" />
                          )}
                        </motion.button>
                      </div>
                    </div>
                  </div>

                  {micTestResult === "success" && (
                    <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}>
                      <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-lg p-4 shadow-sm">
                        <div className="flex">
                          <div className="ml-3">
                            <h3 className="text-green-700 font-semibold">Microphone Ready!</h3>
                            <p className="text-green-600">
                              Your microphone is working perfectly. Ready for the next step.
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              </motion.div>

              {/* Step 3: Meet Your Partner */}
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="w-full bg-white dark:bg-gray-800 shadow-md border rounded-lg overflow-hidden"
              >
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center space-x-4">
                    <div className="bg-gradient-to-br from-ring to-primary rounded-lg w-12 h-12 flex items-center justify-center text-white font-bold text-lg shadow-md">
                      3
                    </div>
                    <h2 className="text-xl font-bold text-primary">Meet Your Practice Partner</h2>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => toggleCollapse(3)}
                    className="text-gray-500 hover:text-gray-700"
                    aria-label="Toggle collapse"
                  >
                    {collapsedSteps[3] ? <FiChevronDown /> : <FiChevronUp />}
                  </motion.button>
                </div>
                <motion.div
                  animate={{
                    height: collapsedSteps[3] ? "auto" : 0,
                    opacity: collapsedSteps[3] ? 1 : 0,
                  }}
                  className={`px-6 pb-6 overflow-hidden`}
                >
                  <p className="mb-4 text-gray-600 dark:text-gray-400">
                    {`I'll be playing ${scenario.persona.buyer_identity.name}. Here's what you should know about how I communicate:`}
                  </p>

                  <div className="bg-gray-50 dark:bg-gray-700 p-5 rounded-lg mb-4">
                    <div>
                      <div className="flex items-center mb-4">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-ring to-primary flex items-center justify-center text-white text-base font-bold shadow-sm">
                          {scenario.persona.buyer_identity.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="ml-4">
                          <p className="text-lg font-bold">{scenario.persona.buyer_identity.name}</p>
                          <p className="text-gray-600 dark:text-gray-400">
                            {scenario.persona.buyer_identity.title}, {scenario.persona.buyer_identity.company}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        {
                          icon: BriefcaseBusiness,
                          title: "Job Title",
                          desc: scenario.persona.buyer_identity.title,
                        },
                        {
                          icon: Building2,
                          title: "Company",
                          desc: scenario.persona.buyer_identity.company,
                        },
                        {
                          icon: Factory,
                          title: "Industry",
                          desc: "N/A",
                        },
                        {
                          icon: MapPin,
                          title: "Location",
                          desc: "N/A",
                        },
                      ].map((item, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 * index }}
                        >
                          <div className="flex items-center p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow gap-3">
                            <div className="flex items-center justify-center bg-gradient-to-br from-ring to-primary rounded-lg w-8 h-8 text-white">
                              <item.icon className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="font-medium">{item.title}</p>
                              <p className="text-sm text-gray-600">{item.desc}</p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-4 shadow-sm">
                    <div className="flex">
                      <div className="ml-3">
                        <h3 className="text-purple-700 font-semibold">AI Coaching Enabled</h3>
                        <p className="text-purple-600">
                          I&apos;ll provide real-time coaching during the conversation - just subtle
                          hints when you need them.
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <p className="text-lg text-gray-600 dark:text-gray-400">No scenario found</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push("/scenarios")}
              className="mt-4 px-4 py-2 bg-gradient-to-r from-ring to-primary text-white rounded-lg hover:shadow-lg transition-all"
            >
              Back to Scenarios
            </motion.button>
          </div>
        )}
      </div>

      {/* Fixed Bottom Action Button - only show when scenario is loaded */}
      {scenario && !isLoading && !isError && (
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, type: "spring" }}
          className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-600 p-4 z-10 shadow-lg"
        >
          <div className="container mx-auto">
            <div className="text-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="py-3 px-6 bg-gradient-to-r from-ring to-primary text-white font-medium rounded-lg shadow-md hover:shadow-xl flex items-center justify-center mx-auto"
                onClick={handleStartSimulation}
              >
                Start Voice Practice
                <FiPlay className="ml-2" />
              </motion.button>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Ready when you are! Click to begin your practice session.
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
