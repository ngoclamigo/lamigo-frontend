"use client";

import { useAudioInputDevices } from "@/hooks/useAudioInputDevices";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import {
  FiBriefcase,
  FiCalendar,
  FiChevronDown,
  FiChevronUp,
  FiClock,
  FiDollarSign,
  FiLoader,
  FiMapPin,
  FiMic,
  FiMicOff,
  FiPlay,
  FiTrendingUp,
  FiUser,
  FiUsers,
} from "react-icons/fi";

// Motion components with Tailwind
const MotionBox = motion.div;

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 30,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
  hover: {
    y: -4,
    transition: {
      duration: 0.2,
      ease: "easeOut",
    },
  },
};

const stepVariants = {
  hidden: { scale: 0, rotate: -180 },
  visible: {
    scale: 1,
    rotate: 0,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 20,
    },
  },
};

const pulseVariants = {
  pulse: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

export default function RoomSetup() {
  const router = useRouter();

  const [collapsedSteps, setCollapsedSteps] = useState<Record<number, boolean>>({
    1: true,
    2: false,
    3: false,
  });

  const { devices, error, loading } = useAudioInputDevices();

  const isTestingMic = false; // Mock state for demonstration
  const micTestResult = "success"; // Mock result for demonstration

  // Mock data
  const sessionDetails = [
    {
      icon: FiUser,
      name: "Interviewer",
      topDesc: "Anne Wojcicki",
      bottomDesc: "Vista Equity Partner",
    },
    {
      icon: FiCalendar,
      name: "Session Type",
      topDesc: "PE Interview Practice",
      bottomDesc: "Case Study Focus",
    },
    {
      icon: FiClock,
      name: "Duration",
      topDesc: "45 minutes",
      bottomDesc: "With real-time feedback",
    },
    {
      icon: FiMapPin,
      name: "Focus Area",
      topDesc: "Healthcare Tech",
      bottomDesc: "Market Analysis",
    },
  ];

  const partnerInfo = {
    name: "Anne Wojcicki",
    desc: "Vista Equity Partner specializing in healthcare technology investments",
    expertise: [
      { icon: FiBriefcase, name: "PE Experience" },
      { icon: FiTrendingUp, name: "Market Analysis" },
      { icon: FiDollarSign, name: "Deal Structuring" },
      { icon: FiUsers, name: "Team Building" },
    ],
  };

  // Toggle collapse state for steps
  const toggleCollapse = (stepNumber: number) => {
    setCollapsedSteps((prev) => ({
      ...prev,
      [stepNumber]: !prev[stepNumber],
    }));
  };

  const handleStartSimulation = () => {
    console.log("Starting voice practice simulation...");
    router.push("/rooms/mlosxi2pvg42");
  };

  return (
    <div className="min-h-screen pb-[120px]">
      <div className="container mx-auto py-8">
        <MotionBox variants={containerVariants} initial="hidden" animate="visible">
          {/* Header */}
          <MotionBox className="mb-8 text-center" variants={cardVariants}>
            <h1 className="text-5xl font-bold mb-2 bg-gradient-to-r from-teal-500 to-brand-500 bg-clip-text text-transparent">
              Voice Practice Setup
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Get ready for your Vista Equity practice session
            </p>
          </MotionBox>

          <div className="flex flex-col gap-6">
            {/* Step 1: Context Verification */}
            <motion.div
              className="w-full bg-white dark:bg-gray-800 shadow-lg border-2 rounded-2xl overflow-hidden"
              variants={cardVariants}
              whileHover="hover"
            >
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center space-x-4">
                  <MotionBox
                    variants={stepVariants}
                    className="bg-brand-500 rounded-full w-12 h-12 flex items-center justify-center text-white font-bold text-lg"
                  >
                    1
                  </MotionBox>
                  <h2 className="text-xl font-bold text-brand-500">Context Verification</h2>
                </div>
                <button
                  onClick={() => toggleCollapse(1)}
                  className="text-gray-500 hover:text-gray-700"
                  aria-label="Toggle collapse"
                >
                  {collapsedSteps[1] ? <FiChevronDown /> : <FiChevronUp />}
                </button>
              </div>

              <div className={`px-6 pb-6 ${collapsedSteps[1] ? "" : "hidden"}`}>
                <p className="mb-4 text-gray-600 dark:text-gray-400">
                  I&apos;ve brought all the context from our Slack conversation. Let me confirm the
                  details for your Vista Equity practice session:
                </p>

                <div className="bg-gray-50 dark:bg-gray-700 p-5 rounded-xl mb-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <AnimatePresence>
                      {sessionDetails.map((detail, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <div className="flex items-center p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                            <div className="flex items-center justify-center bg-brand-500 rounded-lg w-10 h-10 text-white">
                              <detail.icon className="w-5 h-5" />
                            </div>
                            <div className="ml-3">
                              <p className="font-semibold">{detail.name}</p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {detail.topDesc}
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {detail.bottomDesc}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>

                <div className="bg-brand-50 border border-brand-200 rounded-lg p-4">
                  <div className="flex">
                    <div className="flex-shrink-0 text-brand-500">
                      {/* Info icon would go here */}
                    </div>
                    <div className="ml-3">
                      <h3 className="text-brand-700 font-semibold">Ready to proceed!</h3>
                      <p className="text-brand-600">
                        Everything looks accurate. Let&apos;s set up your practice environment.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Step 2: Voice Setup */}
            <motion.div
              className="w-full bg-white dark:bg-gray-800 shadow-lg border-2 rounded-2xl overflow-hidden"
              variants={cardVariants}
              whileHover="hover"
            >
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center space-x-4">
                  <MotionBox
                    variants={stepVariants}
                    className="bg-brand-500 rounded-full w-12 h-12 flex items-center justify-center text-white font-bold text-lg"
                  >
                    2
                  </MotionBox>
                  <h2 className="text-xl font-bold text-brand-500">Voice Setup & Testing</h2>
                </div>
                <button
                  onClick={() => toggleCollapse(2)}
                  className="text-gray-500 hover:text-gray-700"
                  aria-label="Toggle collapse"
                >
                  {collapsedSteps[2] ? <FiChevronDown /> : <FiChevronUp />}
                </button>
              </div>

              <div className={`px-6 pb-6 ${collapsedSteps[2] ? "" : "hidden"}`}>
                <p className="mb-4 text-gray-600 dark:text-gray-400">
                  Let&apos;s make sure your microphone is working properly for the most natural
                  conversation experience:
                </p>

                <div className="bg-gray-50 dark:bg-gray-700 p-5 rounded-xl mb-4">
                  <div className="flex flex-col gap-4">
                    <div>
                      <p className="font-medium mb-2">Choose a device for speaking</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        Don&apos;t worry if this isn&apos;t perfect - we can adjust during practice
                      </p>

                      {loading ? (
                        <div className="flex items-center gap-2 p-3 bg-white dark:bg-gray-800 rounded-lg">
                          <FiLoader className="animate-spin" />
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Loading devices...
                          </p>
                        </div>
                      ) : (
                        <select
                          className="w-full p-2 bg-white border border-gray-300 rounded-md"
                          disabled={devices.length === 0}
                          defaultValue={devices.length > 0 ? devices[0].deviceId : ""}
                        >
                          {devices.map((device) => (
                            <option key={device.deviceId} value={device.deviceId}>
                              {device.label}
                            </option>
                          ))}
                        </select>
                      )}

                      {error && <p className="text-sm text-red-500 mt-2">{error.message}</p>}
                    </div>

                    <hr className="border-gray-200 dark:border-gray-600" />

                    <div>
                      <motion.button
                        variants={pulseVariants}
                        className="w-full py-2 px-3 bg-brand-500 text-white font-medium rounded-md hover:bg-brand-600 flex items-center justify-center gap-2 text-base"
                      >
                        {isTestingMic ? "Stop Testing" : "Test Microphone"}
                        {isTestingMic ? <FiMicOff className="ml-2" /> : <FiMic className="ml-2" />}
                      </motion.button>
                    </div>
                  </div>
                </div>

                {micTestResult === "success" && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex">
                        <div className="flex-shrink-0 text-green-500">
                          {/* Success icon would go here */}
                        </div>
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
              </div>
            </motion.div>

            {/* Step 3: Meet Your Partner */}
            <motion.div
              className="w-full bg-white dark:bg-gray-800 shadow-lg border-2 rounded-2xl overflow-hidden"
              variants={cardVariants}
              whileHover="hover"
            >
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center space-x-4">
                  <MotionBox
                    variants={stepVariants}
                    className="bg-brand-500 rounded-full w-12 h-12 flex items-center justify-center text-white font-bold text-lg"
                  >
                    3
                  </MotionBox>
                  <h2 className="text-xl font-bold text-brand-500">Meet Your Practice Partner</h2>
                </div>
                <button
                  onClick={() => toggleCollapse(3)}
                  className="text-gray-500 hover:text-gray-700"
                  aria-label="Toggle collapse"
                >
                  {collapsedSteps[3] ? <FiChevronDown /> : <FiChevronUp />}
                </button>
              </div>
              <div className={`px-6 pb-6 ${collapsedSteps[3] ? "" : "hidden"}`}>
                <p className="mb-4 text-gray-600 dark:text-gray-400">
                  I&apos;ll be playing Anne Wojcicki from Vista Equity. Here&apos;s what you should
                  know about how she communicates:
                </p>

                <div className="bg-gray-50 dark:bg-gray-700 p-5 rounded-xl mb-4">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 rounded-full bg-brand-500 flex items-center justify-center text-white text-base font-bold">
                        {partnerInfo.name.charAt(0)}
                      </div>
                      <div className="ml-4">
                        <p className="text-lg font-bold">{partnerInfo.name}</p>
                        <p className="text-gray-600 dark:text-gray-400">{partnerInfo.desc}</p>
                      </div>
                    </div>
                  </motion.div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <AnimatePresence>
                      {partnerInfo.expertise.map((skill, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 + 0.3 }}
                        >
                          <div className="flex flex-col items-center p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm gap-2">
                            <div className="flex items-center justify-center bg-brand-500 rounded-full w-8 h-8 text-white">
                              <skill.icon className="w-4 h-4" />
                            </div>
                            <p className="text-sm font-medium text-center">{skill.name}</p>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <div className="flex">
                    <div className="flex-shrink-0 text-purple-500">
                      {/* Info icon would go here */}
                    </div>
                    <div className="ml-3">
                      <h3 className="text-purple-700 font-semibold">AI Coaching Enabled</h3>
                      <p className="text-purple-600">
                        I&apos;ll provide real-time coaching during the conversation - just subtle
                        hints when you need them.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </MotionBox>
      </div>

      {/* Fixed Bottom Action Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-600 p-4 z-10 shadow-lg">
        <div className="container mx-auto">
          <div className="text-center">
            <motion.button
              className="py-2 px-4 bg-brand-500 text-white font-medium rounded-xl shadow-lg hover:bg-brand-600 flex items-center justify-center mx-auto"
              onClick={handleStartSimulation}
              variants={pulseVariants}
              animate="pulse"
            >
              Start Voice Practice
              <FiPlay className="ml-2" />
            </motion.button>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Ready when you are! Click to begin your practice session.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
