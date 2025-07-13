"use client";

import { MessagesSquare, Phone } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { RecommendationView } from "~/components/RecommendationView";
import { CALL_STATUS, useVapi } from "~/hooks/use-vapi";
import { cn } from "~/lib/utils";
import { getScenario } from "~/network/scenarios";
import { MessageTypeEnum, TranscriptMessageTypeEnum } from "~/types/conversation.type";
import { Scenario } from "~/types/scenario";
import {
  getCallTypeLabel,
  getIntentTypeLabel,
  getObjectionTypeLabel,
  getPersonaArchetypeLabel,
  getSpecialtyTypeLabel,
} from "~/utils/label";

export default function ScenarioPracticePage() {
  const params = useParams();
  const scenario_id = params.scenario_id as string;
  const router = useRouter();
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

  // const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {isLoading ? (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="w-16 h-16 border-4 border-gray-300 border-t-brand-500 rounded-full animate-spin mb-4"></div>
          <p className="text-lg text-gray-600 dark:text-gray-400">Loading scenario details...</p>
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <div className="bg-red-100 dark:bg-red-900/30 p-6 rounded-xl max-w-md">
            <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-3">
              Error Loading Scenario
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              We couldn&apos;t load the scenario details. Please try again later.
            </p>
            <button
              onClick={() => router.push(`/scenarios/${encodeURIComponent(scenario_id)}`)}
              className="px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors"
            >
              Back to Scenarios
            </button>
          </div>
        </div>
      ) : scenario ? (
        <div className="flex items-stretch gap-4 h-[calc(100vh-112px)]">
          <div className="flex flex-col w-[280px] rounded-xl shadow-lg overflow-hidden border border-gray-100">
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="object-cover w-full aspect-square bg-gradient-to-r from-blue-50 to-indigo-100"
                src={`https://api.dicebear.com/9.x/initials/svg?seed=${scenario.persona.name}`}
                alt={`Avatar for ${scenario.persona.name}`}
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                <h2 className="text-xl font-bold text-white">{scenario.persona.name}</h2>
                <p className="text-sm text-gray-300">
                  {scenario.persona.job_title || "N/A"} - {scenario.persona.company || "N/A"}
                </p>
              </div>
            </div>

            <div className="flex-1 flex flex-col gap-3 p-4 bg-white overflow-auto">
              {scenario.scenarios.persona.length > 0 && (
                <div className="mt-1">
                  <p className="text-gray-600 font-medium text-xs uppercase tracking-wide mb-2">
                    Persona Archetypes
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {scenario.scenarios.persona.map((persona, index) => (
                      <span
                        key={index}
                        className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full ${
                          index % 3 === 0
                            ? "bg-blue-50 text-blue-700"
                            : index % 3 === 1
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-purple-50 text-purple-700"
                        }`}
                      >
                        {getPersonaArchetypeLabel(persona)}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {scenario.scenarios.specialty && (
                <div className="mt-1">
                  <p className="text-gray-600 font-medium text-xs uppercase tracking-wide mb-2">
                    Specialty
                  </p>
                  <span className="inline-block text-xs font-medium px-2.5 py-1 rounded-full bg-blue-50 text-blue-700">
                    {getSpecialtyTypeLabel(scenario.scenarios.specialty)}
                  </span>
                </div>
              )}

              {scenario.scenarios.objections.length > 0 && (
                <div className="mt-1">
                  <p className="text-gray-600 font-medium text-xs uppercase tracking-wide mb-2">
                    Potential Objectives
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {scenario.scenarios.objections.map((objection, index) => (
                      <span
                        key={index}
                        className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full ${
                          index % 3 === 0
                            ? "bg-blue-50 text-blue-700"
                            : index % 3 === 1
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-purple-50 text-purple-700"
                        }`}
                      >
                        {getObjectionTypeLabel(objection)}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          <div
            className="relative flex-1 rounded-xl shadow-lg"
            style={{
              background: "linear-gradient(0deg,var(--brand-200) 50%, var(--brand-100) 100%)",
              // "linear-gradient(0deg,rgba(182, 202, 255, 1) 50%, rgba(153, 246, 228, 1) 100%)",
            }}
          >
            <SimpleVoiceAssistant
              assistantId={scenario.agents[0]?.platform_agent_id || ""}
              onDisconnectButtonClicked={() =>
                router.push(`/scenarios/${encodeURIComponent(scenario_id)}/summary`)
              }
            />
            {/* <div className="absolute top-4 right-4">
              <button
                className="p-2 bg-white rounded-full shadow-md"
                onClick={() => setIsOpen((prev) => !prev)}
              >
                <MessagesSquare />
              </button>
            </div> */}
          </div>
          {/* {isOpen && (
            <div className="w-[300px] rounded-xl shadow-lg bg-white">
              <RecommendationView />
            </div>
          )} */}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <p className="text-lg text-gray-600 dark:text-gray-400">No scenario found</p>
          <button
            onClick={() => router.push(`/scenarios/${encodeURIComponent(scenario_id)}`)}
            className="mt-4 px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors"
          >
            Back to Scenarios
          </button>
        </div>
      )}
    </>
  );
}

function SimpleVoiceAssistant(props: {
  assistantId: string;
  onDisconnectButtonClicked?: () => void;
}) {
  const { callStatus, start, stop, messages, activeTranscript, audioLevel } = useVapi();

  const handleStart = () => {
    start(props.assistantId);
  };

  const handleStop = () => {
    const transcriptions: any[] = [];
    messages.forEach((m) => {
      if (
        m.type === MessageTypeEnum.TRANSCRIPT &&
        m.transcriptType === TranscriptMessageTypeEnum.FINAL
      ) {
        transcriptions.push({
          role: m.role,
          text: m.transcript,
        });
      }
    });
    sessionStorage.setItem("transcriptions", JSON.stringify(transcriptions));
    stop();
    props.onDisconnectButtonClicked?.();
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {!props.assistantId ? (
          <motion.div
            key="no-assistant"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.09, 1.04, 0.245, 1.055] }}
            className="flex flex-col items-center justify-center gap-2 h-full"
          >
            <p className="text-lg">No agent available in this scenario</p>
            <p>Please check back later or contact support</p>
          </motion.div>
        ) : callStatus === CALL_STATUS.INACTIVE ? (
          <motion.div
            key="disconnected"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.09, 1.04, 0.245, 1.055] }}
            className="flex items-center justify-center gap-2 h-full"
          >
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="uppercase px-4 py-2 bg-white text-black rounded-lg shadow-md"
              onClick={handleStart}
            >
              Start a call
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            key="connected"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: [0.09, 1.04, 0.245, 1.055] }}
            className="flex flex-col items-center justify-center gap-4 h-full"
          >
            <AgentVisualizer audioLevel={audioLevel} callStatus={callStatus} />
            <TranscriptionView />
            <div className="w-full">
              <ControlBar
                callStatus={callStatus}
                onStartCall={handleStart}
                onStopCall={handleStop}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function TranscriptionView() {
  const { activeTranscript } = useVapi();

  if (!activeTranscript) return null;

  return (
    <motion.div
      className="relative w-[768px] max-w-3xl mx-auto px-6 py-4 bg-white/20 rounded-xl shadow-xl backdrop-blur-xl text-black self-start fit-content"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.6, duration: 0.4 }}
    >
      {activeTranscript.transcript}
    </motion.div>
  );
}

function AgentVisualizer({
  audioLevel,
  callStatus,
}: {
  audioLevel: number;
  callStatus: CALL_STATUS;
}) {
  return (
    <div className="h-[300px] w-full flex items-center justify-center">
      <div className="flex items-center gap-4 h-full">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className={cn(
              "rounded-full transition-all duration-200",
              callStatus === CALL_STATUS.LOADING && i !== 2 ? "bg-white/50" : "bg-white"
            )}
            style={{
              width: "48px",
              height:
                callStatus === CALL_STATUS.ACTIVE
                  ? `${Math.max(64, audioLevel * 100 + Math.random() * 32)}px`
                  : "64px",
            }}
          />
        ))}
      </div>
    </div>
  );
}

function ControlBar(props: {
  callStatus: CALL_STATUS;
  onStartCall: () => void;
  onStopCall: () => void;
}) {
  return (
    <div className="relative h-[60px]">
      <AnimatePresence>
        {props.callStatus === CALL_STATUS.INACTIVE && (
          <motion.button
            initial={{ opacity: 0, top: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, top: "-10px" }}
            transition={{ duration: 1, ease: [0.09, 1.04, 0.245, 1.055] }}
            className="uppercase absolute left-1/2 -translate-x-1/2 px-4 py-2 bg-white text-black rounded-md"
            onClick={props.onStartCall}
          >
            Start a conversation
          </motion.button>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {props.callStatus !== CALL_STATUS.INACTIVE && (
          <motion.div
            initial={{ opacity: 0, top: "10px" }}
            animate={{ opacity: 1, top: 0 }}
            exit={{ opacity: 0, top: "-10px" }}
            transition={{ duration: 0.4, ease: [0.09, 1.04, 0.245, 1.055] }}
            className="flex h-10 absolute left-1/2 -translate-x-1/2 justify-center gap-2"
          >
            <button
              onClick={props.onStopCall}
              className="flex items-center justify-center w-10 h-10 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
            >
              <Phone className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
