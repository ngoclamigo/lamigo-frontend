import { motion } from "motion/react";
import useCombinedTranscriptions from "~/hooks/useCombinedTranscriptions";

export function TranscriptionView() {
  const combinedTranscriptions = useCombinedTranscriptions();

  if (
    !combinedTranscriptions ||
    combinedTranscriptions.length === 0 ||
    combinedTranscriptions[combinedTranscriptions.length - 1].text.length === 0
  ) {
    return null;
  }

  return (
    <motion.div
      className="relative w-[768px] max-w-3xl mx-auto px-6 py-4 bg-white/20 rounded-xl shadow-xl backdrop-blur-xl text-black self-start fit-content"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.6, duration: 0.4 }}
    >
      {combinedTranscriptions[combinedTranscriptions.length - 1].text}
    </motion.div>
  );
}
