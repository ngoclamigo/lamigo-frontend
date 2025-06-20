"use client";

import { motion } from "framer-motion";

export default function DemoPage() {
  // Dynamic data variables
  const userData = {
    name: "Sarah",
    company: "Vista Equity Partners",
    meetingTime: "Tomorrow 2:00 PM",
    readinessScore: 85,
    improvement: "+35% vs Last Practice",
  };

  const talkingPoints = [
    {
      title: "ESG Fund Angle",
      description: "Perfect timing with your $2B sustainability fund launch",
    },
    {
      title: "Competitive Edge",
      description: "3x more mid-market tech deals than Bloomberg",
    },
    {
      title: "Proof Point",
      description: "KKR saved 15 hours/week on initial screening",
    },
  ];

  const performanceMetrics = [
    {
      category: "Product Knowledge & Application",
      score: 91,
      feedback: "Excellent grasp of Capital IQ Pro's PE-specific features",
      insight: "Perfectly connected mid-market tech screening to their pain point",
      color: "emerald",
    },
    {
      category: "Communication & Confidence",
      score: 87,
      feedback: "Strong professional tone, used PE industry language naturally",
      insight: "Anne noted your confidence when handling Bloomberg comparison",
      color: "emerald",
    },
    {
      category: "Discovery & Active Listening",
      score: 74,
      feedback: "Good at identifying pain points, could dig deeper on ROI timing",
      insight: "Missed opportunity to ask about current deal pipeline volume",
      color: "yellow",
    },
    {
      category: "Objection Handling & Follow-up",
      score: 68,
      feedback: "Solid responses but could be more proactive with next steps",
      insight: "When Anne pushed on ROI proof, pivot to KKR case study faster",
      color: "red",
    },
  ];

  const sessionData = {
    duration: "14:32",
    practicePartner: "Vista Equity",
    scenario: "AI Anne",
    keyInsight:
      "Your ESG positioning was significantly stronger than last practice. Anne responded positively when you connected their sustainability fund to your analytics capabilities. This approach will work well with other ESG-focused investors too - consider using it for your KKR meeting next week.",
    callStatus: "Your call is in 45 minutes. What would you like to do next?",
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      style={{ background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)" }}
    >
      <div className="max-w-4xl mx-auto bg-white min-h-screen">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative text-center bg-gradient-to-br from-emerald-50 to-emerald-100 text-emerald-900 px-8 py-10 overflow-hidden"
        >
          <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-[radial-gradient(circle,rgba(16,185,129,0.1)_2px,transparent_2px)] bg-[30px_30px] animate-[spin_20s_linear_infinite]"></div>
          <div className="relative z-10">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="inline-flex items-center gap-2 bg-emerald-500 text-white px-4 py-2 rounded-full text-sm font-semibold mb-4"
            >
              🎯 Session Complete
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-3xl font-bold mb-2"
            >
              You&apos;re Ready, {userData.name}!
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="text-lg text-emerald-800 mb-8"
            >
              {userData.company} • {userData.meetingTime}
            </motion.p>
            <div className="mt-2">
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, delay: 1.0, type: "spring", stiffness: 100 }}
                className="relative w-32 h-32 mx-auto mb-4 rounded-full bg-[conic-gradient(#047857_0deg_306deg,#e5e7eb_306deg_360deg)] flex items-center justify-center shadow-[0_12px_40px_rgba(4,120,87,0.3),0_4px_16px_rgba(0,0,0,0.1)] border-4 border-white"
              >
                <div className="absolute w-20 h-20 bg-white rounded-full shadow-md"></div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 1.2 }}
                  className="relative text-2xl font-bold text-emerald-700"
                >
                  {userData.readinessScore}%
                </motion.div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.4 }}
                className="font-semibold text-emerald-800"
              >
                Ready for {userData.company}
              </motion.div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.6 }}
          className="bg-gradient-to-br from-blue-100 to-blue-200 border-b border-gray-200 p-8"
        >
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.8 }}
            className="text-xl font-bold text-blue-900 text-center mb-4"
          >
            💪 Your Winning Talking Points
          </motion.h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {talkingPoints.map((point, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, delay: 2.0 + index * 0.2 }}
                whileHover={{
                  scale: 1.05,
                  y: -8,
                  transition: { duration: 0.2 },
                }}
                className="bg-white p-5 rounded-xl shadow border-l-4 border-emerald-500 cursor-pointer"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    duration: 0.4,
                    delay: 2.2 + index * 0.2,
                    type: "spring",
                    stiffness: 200,
                  }}
                  className="w-6 h-6 bg-emerald-500 text-white rounded-full flex items-center justify-center text-xs font-bold mb-2"
                >
                  {index + 1}
                </motion.div>
                <div className="font-semibold text-gray-900 mb-1">{point.title}</div>
                <div className="text-sm text-gray-500">&quot;{point.description}&quot;</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 2.8 }}
          className="p-8"
        >
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 3.0 }}
            className="flex items-center justify-between mb-6"
          >
            <h2 className="text-xl font-bold text-gray-900">📊 Performance Breakdown</h2>
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 3.2, type: "spring", stiffness: 150 }}
              className="bg-emerald-100 text-emerald-600 px-3 py-1 rounded-full text-sm font-semibold"
            >
              {userData.improvement}
            </motion.div>
          </motion.div>
          <div className="grid gap-4">
            {performanceMetrics.map((metric, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -30, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ duration: 0.6, delay: 3.4 + index * 0.15 }}
                whileHover={{
                  scale: 1.02,
                  y: -4,
                  transition: { duration: 0.2 },
                }}
                className={`bg-gradient-to-br from-${metric.color}-50 to-${metric.color}-100 p-5 rounded-xl border-l-4 border-${metric.color}-500 hover:shadow-md transition-transform cursor-pointer`}
              >
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 3.6 + index * 0.15 }}
                  className="flex justify-between items-center mb-2"
                >
                  <div className="font-semibold text-gray-800">{metric.category}</div>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      duration: 0.5,
                      delay: 3.8 + index * 0.15,
                      type: "spring",
                      stiffness: 120,
                    }}
                    className={`text-xl font-bold text-${metric.color}-${metric.color === "red" ? "500" : metric.color === "yellow" ? "500" : "600"}`}
                  >
                    {metric.score}/100
                  </motion.div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: 4.0 + index * 0.15 }}
                  className="text-sm text-gray-600 mb-2"
                >
                  {metric.feedback}
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 4.2 + index * 0.15 }}
                  className="text-sm italic text-gray-400 bg-white/60 p-2 rounded"
                >
                  {metric.color === "emerald" ? "💡" : "⚠️"} &quot;{metric.insight}&quot;
                </motion.div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 5.0 }}
          className="p-8 bg-gradient-to-br from-yellow-100 to-yellow-200"
        >
          <motion.h3
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 5.2 }}
            className="text-lg font-bold text-orange-900 mb-4 flex items-center gap-2"
          >
            💡 Key Insight from This Session
          </motion.h3>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 5.4 }}
            className="bg-white/70 p-5 rounded-xl border-l-4 border-yellow-500 text-orange-900 leading-relaxed"
          >
            {sessionData.keyInsight}
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 5.6 }}
          className="p-8 bg-slate-50 text-center"
        >
          <motion.h3
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 5.8 }}
            className="text-lg font-semibold text-gray-800 mb-6"
          >
            {sessionData.callStatus}
          </motion.h3>
          <div className="flex flex-wrap justify-center gap-4">
            <motion.a
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 6.0 }}
              whileHover={{
                scale: 1.05,
                y: -2,
                transition: { duration: 0.2 },
              }}
              whileTap={{ scale: 0.95 }}
              href="#"
              className="px-6 py-4 rounded-xl font-semibold text-white bg-gradient-to-br from-blue-500 to-blue-600 hover:shadow-lg transition cursor-pointer"
            >
              ❤️ I&apos;M READY FOR THE CALL
            </motion.a>
            <motion.a
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 6.2 }}
              whileHover={{
                scale: 1.05,
                y: -2,
                transition: { duration: 0.2 },
              }}
              whileTap={{ scale: 0.95 }}
              href="#"
              className="px-6 py-4 rounded-xl font-semibold text-gray-800 border-2 border-gray-200 bg-white hover:shadow-lg transition cursor-pointer"
            >
              🎭 ONE MORE FULL PRACTICE
            </motion.a>
            <motion.a
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 6.4 }}
              whileHover={{
                scale: 1.05,
                y: -2,
                transition: { duration: 0.2 },
              }}
              whileTap={{ scale: 0.95 }}
              href="#"
              className="px-6 py-4 rounded-xl font-semibold text-gray-800 border-2 border-gray-200 bg-white hover:shadow-lg transition cursor-pointer"
            >
              💬 ASK ABOUT MY FEEDBACK
            </motion.a>
          </div>
        </motion.div>

        <div className="flex flex-col sm:flex-row justify-around text-center bg-slate-100 border-t border-slate-200 px-8 py-6 gap-4">
          <div className="flex-1">
            <span className="block text-lg font-bold text-gray-900">{sessionData.duration}</span>
            <span className="text-xs text-slate-500 uppercase tracking-wide">Duration</span>
          </div>
          <div className="flex-1">
            <span className="block text-lg font-bold text-gray-900">
              {sessionData.practicePartner}
            </span>
            <span className="text-xs text-slate-500 uppercase tracking-wide">Practice Partner</span>
          </div>
          <div className="flex-1">
            <span className="block text-lg font-bold text-gray-900">{sessionData.scenario}</span>
            <span className="text-xs text-slate-500 uppercase tracking-wide">Scenario</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
