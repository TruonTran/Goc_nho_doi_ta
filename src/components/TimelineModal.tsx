import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import type { TimelineMilestone } from "../types";

interface Props {
  milestone: TimelineMilestone | null;
  onClose: () => void;
}

export default function TimelineModal({ milestone, onClose }: Props) {
  return (
    <AnimatePresence>
      {milestone && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 22, stiffness: 260 }}
            onClick={(e) => e.stopPropagation()}
            className="glass-card relative w-full max-w-lg rounded-3xl overflow-hidden"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/40 hover:bg-black/60 transition"
              aria-label="Đóng"
            >
              <X size={18} />
            </button>
            <div className="h-56 sm:h-64 w-full overflow-hidden bg-gradient-to-br from-neon-violet/30 to-neon-pink/20">
              <img
                src={milestone.image}
                alt={milestone.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
            <div className="p-6 sm:p-8">
              <span className="text-neon-blue text-xs uppercase tracking-widest">{milestone.date}</span>
              <h3 className="font-display text-2xl sm:text-3xl font-bold mt-2 mb-3 text-gradient">
                {milestone.title}
              </h3>
              <p className="text-white/70 leading-relaxed text-sm sm:text-base">{milestone.description}</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
