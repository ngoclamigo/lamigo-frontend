"use client";

import { motion } from "framer-motion";

const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.5,
    },
  },
};

const slideIn = {
  hidden: { x: -50, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 12,
    },
  },
};

const statsVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 15,
    },
  },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

const pulseAnimation = {
  scale: [1, 1.05, 1],
  transition: {
    duration: 2,
    repeat: Infinity,
    repeatType: "reverse" as const,
  },
};

export default function RoomSummaryPage() {
  return (
    <motion.div
      className="container mx-auto p-8 bg-gradient-to-b from-brand-50 to-white rounded-xl shadow-xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
    >
      <div className="grid grid-cols-2 gap-6 grid-rows-[auto_1fr_auto]">
        {/* 1. Congrats + Stats */}
        <motion.div
          className="col-span-2"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 0.6 }}
        >
          <div className="h-full rounded-lg border shadow-sm hover:shadow-md transition-shadow duration-300 bg-white">
            <div className="flex flex-col items-center p-4 border-b bg-gradient-to-r from-brand-50 to-green-50 rounded-t-lg">
              <motion.h2
                className="text-2xl font-bold text-brand-800"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                Excellent Practice Session!
              </motion.h2>
              <motion.p
                className="text-gray-600"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                You&apos;re ready to nail your Vista Equity call, Sarah
              </motion.p>
            </div>
            <div className="p-4">
              <motion.div
                className="flex gap-4 justify-center"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.span
                  className="px-3 py-1 text-lg bg-green-100 text-green-800 rounded-md hover:bg-green-200 transition-colors duration-300"
                  variants={statsVariants}
                  whileHover={{ scale: 1.05 }}
                >
                  ⏱️ 12 minutes
                </motion.span>
                <motion.span
                  className="px-3 py-1 text-lg bg-green-100 text-green-800 rounded-md hover:bg-green-200 transition-colors duration-300"
                  variants={statsVariants}
                  whileHover={{ scale: 1.05 }}
                >
                  📈 40% improvement
                </motion.span>
                <motion.span
                  className="px-3 py-1 text-lg bg-green-100 text-green-800 rounded-md hover:bg-green-200 transition-colors duration-300"
                  variants={statsVariants}
                  whileHover={{ scale: 1.05 }}
                >
                  ✅ 4/4 key messages
                </motion.span>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* 2. Session Performance */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={slideIn}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="h-full rounded-lg border shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="p-4 border-b bg-gradient-to-r from-brand-50 to-indigo-50 rounded-t-lg">
              <motion.h2
                className="text-2xl font-bold text-brand-700"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                📊 Session Performance
              </motion.h2>
              <motion.p
                className="text-gray-600"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                How you performed vs. your last practice
              </motion.p>
            </div>
            <div className="p-4">
              <motion.div
                className="flex flex-col gap-3 items-start"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {[
                  ["ESG Positioning", "Excellent", "+30%"],
                  ["Competitive Differentiation", "Strong", "+25%"],
                  ["Objection Handling", "Outstanding", "+45%"],
                  ["Confidence Level", "Very High", null],
                ].map(([label, value, rate], index) => (
                  <motion.div
                    key={label}
                    className="w-full flex border-b pb-3"
                    variants={fadeIn}
                    transition={{ duration: 0.3, delay: 0.1 * index }}
                    whileHover={{ backgroundColor: "rgba(0,0,0,0.02)" }}
                  >
                    <p className="flex-1">{label}</p>
                    <div className="flex">
                      <p className="text-green-600 font-medium text-sm">{value}</p>
                      {rate && (
                        <motion.span
                          className="ml-2 px-2 py-0.5 text-xs bg-green-100 text-green-800 rounded-md"
                          whileHover={{ scale: 1.1 }}
                        >
                          {rate}
                        </motion.span>
                      )}
                    </div>
                  </motion.div>
                ))}
                <motion.div
                  className="w-full mt-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                >
                  <div className="flex justify-between mb-2">
                    <span>Overall Readiness</span>
                    <span>85% Ready to Close</span>
                  </div>
                  <motion.div
                    className="w-full bg-gray-200 rounded-full h-2.5"
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 0.8 }}
                  >
                    <motion.div
                      className="bg-green-600 h-2.5 rounded-full"
                      style={{ width: "85%" }}
                      initial={{ width: "0%" }}
                      animate={{ width: "85%" }}
                      transition={{ duration: 1, delay: 0.5 }}
                    ></motion.div>
                  </motion.div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* 3. Winning Talking Points */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={slideIn}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="h-full rounded-lg border shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="p-4 border-b">
              <motion.h2
                className="text-2xl font-bold"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                🏆 Winning Talking Points
              </motion.h2>
              <motion.p
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                Use these in your actual Vista call
              </motion.p>
            </div>
            <div className="p-4">
              <motion.div
                className="flex flex-col gap-3"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {[
                  [
                    1,
                    "ESG Fund Opening",
                    "I've been flowing over $2B sustainability fund launch - Our ESG analytics could be perfect for portfolio evaluation.",
                  ],
                  [
                    2,
                    "Workflow Integration",
                    "Unlike Bloomberg's general market data, we provide operational analytics specifically for PE workflow.",
                  ],
                  [
                    3,
                    "Healthcare Context",
                    "For healthcare deals like your InTouch Health acquisition, we offer clinical workflow analytics.",
                  ],
                  [
                    4,
                    "ROI Positioning",
                    "ROI typically covers annual cost within the first deal - we've seen this with similar PE firms.",
                  ],
                ].map(([num, title, quote], index) => (
                  <motion.div
                    key={num}
                    className={`flex gap-3 items-start ${index < 3 ? "border-b pb-3" : ""}`}
                    variants={fadeIn}
                    transition={{ duration: 0.3, delay: 0.15 * index }}
                    whileHover={{ x: 5 }}
                  >
                    <motion.div
                      className="flex-shrink-0 w-8 h-8 rounded-full bg-brand-600 text-white flex items-center justify-center"
                      whileHover={{ scale: 1.1, backgroundColor: "#3b82f6" }}
                    >
                      {num}
                    </motion.div>
                    <div>
                      <p className="font-medium">{title}</p>
                      <p className="text-gray-600 text-sm">&quot;{quote}&quot;</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* 4. Call to Action */}
        <motion.div
          className="col-span-2"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
        >
          <div className="h-full rounded-lg border shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex flex-col items-center justify-center p-4 border-b bg-gradient-to-r from-brand-50 to-purple-50 rounded-t-lg">
              <motion.h2
                className="text-2xl font-bold text-brand-800"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.5 }}
              >
                You&apos;re Ready for Vista Equity
              </motion.h2>
              <motion.p
                className="text-gray-600"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
              >
                Your call is in 45 minutes. What would you like to do next?
              </motion.p>
            </div>
            <div className="p-4">
              <motion.div
                className="flex justify-center gap-4"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.button
                  className="px-4 py-2 bg-green-600 text-white font-medium rounded-md hover:bg-green-700"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  animate={pulseAnimation}
                >
                  ✅ I&apos;m ready for the call
                </motion.button>
                <motion.button
                  className="px-4 py-2 bg-white text-brand-600 font-medium border border-brand-600 rounded-md hover:bg-brand-50"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  🔁 One more quick practice
                </motion.button>
                <motion.button
                  className="px-4 py-2 text-gray-700 font-medium rounded-md hover:bg-gray-100"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  ⬅️ Back to Slack
                </motion.button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
