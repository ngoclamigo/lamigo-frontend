"use client";

import {
  BarVisualizer,
  DisconnectButton,
  RoomAudioRenderer,
  RoomContext,
  VideoTrack,
  VoiceAssistantControlBar,
  useVoiceAssistant,
} from "@livekit/components-react";
import { Room, RoomEvent } from "livekit-client";
import { MessagesSquare, Phone } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import type { ConnectionDetails } from "~/app/api/connection-details/route";
import { NoAgentNotification } from "~/components/NoAgentNotification";
import { RecommendationView } from "~/components/RecommendationView";
import { TranscriptionView } from "~/components/TranscriptionView";
import useCombinedTranscriptions from "~/hooks/useCombinedTranscriptions";
import { getScenario } from "~/lib/api";
import { Scenario } from "~/types/scenario";

export default function ScenarioPracticePage({ params }: { params: { scenario_id: string } }) {
  const [room] = useState(new Room());
  const router = useRouter();
  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchScenarios = async () => {
      setIsLoading(true);
      setIsError(false);
      try {
        const data = await getScenario(params.scenario_id);
        setScenario(data.data);
      } catch (error) {
        console.error("Failed to fetch scenarios:", error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchScenarios();
  }, [params.scenario_id]);

  const onConnectButtonClicked = useCallback(async () => {
    // Generate room connection details, including:
    //   - A random Room name
    //   - A random Participant name
    //   - An Access Token to permit the participant to join the room
    //   - The URL of the LiveKit server to connect to
    //
    // In real-world application, you would likely allow the user to specify their
    // own participant name, and possibly to choose from existing rooms to join.

    const url = new URL(
      process.env.NEXT_PUBLIC_CONN_DETAILS_ENDPOINT ?? "/api/connection-details",
      window.location.origin
    );
    const response = await fetch(url.toString());
    const connectionDetailsData: ConnectionDetails = await response.json();

    await room.connect(connectionDetailsData.serverUrl, connectionDetailsData.participantToken);
    await room.localParticipant.setMicrophoneEnabled(true);
  }, [room]);

  useEffect(() => {
    room.on(RoomEvent.MediaDevicesError, onDeviceFailure);

    return () => {
      room.off(RoomEvent.MediaDevicesError, onDeviceFailure);
    };
  }, [room]);

  const [isOpen, setIsOpen] = useState(false);

  return (
    <main className="container mx-auto h-full">
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
              onClick={() => router.push(`/scenarios/${encodeURIComponent(params.scenario_id)}`)}
              className="px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors"
            >
              Back to Scenarios
            </button>
          </div>
        </div>
      ) : scenario ? (
        <RoomContext.Provider value={room}>
          <div className="flex items-stretch gap-4 h-full">
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
                </div>
              </div>

              <div className="flex-1 flex flex-col gap-3 p-4 bg-white overflow-auto">
                <div className="text-sm text-gray-700 leading-relaxed">
                  {scenario.scenarios[0].call_type}
                </div>

                <div className="flex items-center gap-2 text-yellow-600">
                  <span className="flex-shrink-0 inline-flex items-center justify-center w-6 h-6 rounded-full bg-yellow-100">
                    <span className="text-xs">😐</span>
                  </span>
                  <span className="text-sm font-medium">{scenario.scenarios[0].intent}</span>
                </div>

                {scenario.scenarios[0].objections.length > 0 && (
                  <div className="mt-1">
                    <p className="text-gray-600 font-medium text-xs uppercase tracking-wide mb-2">
                      Potential Objectives
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {scenario.scenarios[0].objections.map((objection, index) => (
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
                          {objection}
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
                background:
                  "linear-gradient(0deg,rgba(182, 202, 255, 1) 50%, rgba(153, 246, 228, 1) 100%)",
              }}
            >
              <SimpleVoiceAssistant
                onConnectButtonClicked={onConnectButtonClicked}
                onDisconnectButtonClicked={() =>
                  router.push(`/scenarios/${encodeURIComponent(params.scenario_id)}/summary`)
                }
              />
              <div className="absolute top-4 right-4">
                <button
                  className="p-2 bg-white rounded-full shadow-md"
                  onClick={() => setIsOpen((prev) => !prev)}
                >
                  <MessagesSquare />
                </button>
              </div>
            </div>
            {isOpen && (
              <div className="w-[300px] rounded-xl shadow-lg bg-white">
                <RecommendationView />
              </div>
            )}
          </div>
        </RoomContext.Provider>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <p className="text-lg text-gray-600 dark:text-gray-400">No scenario found</p>
          <button
            onClick={() => router.push(`/scenarios/${encodeURIComponent(params.scenario_id)}`)}
            className="mt-4 px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors"
          >
            Back to Scenarios
          </button>
        </div>
      )}
    </main>
  );
}

function SimpleVoiceAssistant(props: {
  onConnectButtonClicked: () => void;
  onDisconnectButtonClicked?: () => void;
}) {
  const { state: agentState } = useVoiceAssistant();

  return (
    <>
      <AnimatePresence mode="wait">
        {agentState === "disconnected" ? (
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
              onClick={() => props.onConnectButtonClicked()}
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
            <AgentVisualizer />
            <TranscriptionView />
            <div className="w-full">
              <ControlBar
                onConnectButtonClicked={props.onConnectButtonClicked}
                onDisconnectButtonClicked={props.onDisconnectButtonClicked}
              />
            </div>
            <RoomAudioRenderer />
            <NoAgentNotification state={agentState} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function AgentVisualizer() {
  const { state: agentState, videoTrack, audioTrack } = useVoiceAssistant();

  if (videoTrack) {
    return (
      <div className="h-[512px] w-[512px] rounded-lg overflow-hidden">
        <VideoTrack trackRef={videoTrack} />
      </div>
    );
  }
  return (
    <div className="h-[300px] w-full">
      <BarVisualizer
        state={agentState}
        barCount={5}
        trackRef={audioTrack}
        className="agent-visualizer"
        options={{ minHeight: 24 }}
      />
    </div>
  );
}

function ControlBar(props: {
  onConnectButtonClicked: () => void;
  onDisconnectButtonClicked?: () => void;
}) {
  const { state: agentState } = useVoiceAssistant();
  const combinedTranscriptions = useCombinedTranscriptions();

  const handleDisconnect = () => {
    sessionStorage.setItem("transcriptions", JSON.stringify(combinedTranscriptions));
    props.onDisconnectButtonClicked?.();
  };

  return (
    <div className="relative h-[60px]">
      <AnimatePresence>
        {agentState === "disconnected" && (
          <motion.button
            initial={{ opacity: 0, top: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, top: "-10px" }}
            transition={{ duration: 1, ease: [0.09, 1.04, 0.245, 1.055] }}
            className="uppercase absolute left-1/2 -translate-x-1/2 px-4 py-2 bg-white text-black rounded-md"
            onClick={() => props.onConnectButtonClicked()}
          >
            Start a conversation
          </motion.button>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {agentState !== "disconnected" && agentState !== "connecting" && (
          <motion.div
            initial={{ opacity: 0, top: "10px" }}
            animate={{ opacity: 1, top: 0 }}
            exit={{ opacity: 0, top: "-10px" }}
            transition={{ duration: 0.4, ease: [0.09, 1.04, 0.245, 1.055] }}
            className="flex h-10 absolute left-1/2 -translate-x-1/2  justify-center"
          >
            <VoiceAssistantControlBar controls={{ leave: false }} />
            <DisconnectButton onClick={handleDisconnect}>
              <Phone />
            </DisconnectButton>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function onDeviceFailure(error: Error) {
  console.error(error);
  alert(
    "Error acquiring camera or microphone permissions. Please make sure you grant the necessary permissions in your browser and reload the tab"
  );
}
