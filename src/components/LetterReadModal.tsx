import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { couple } from "../data/couple";
import type { LoveLetterEnvelope, PersonKey } from "../types";

function personName(key: PersonKey) {
  return key === "A" ? couple.personA.name : couple.personB.name;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

interface Props {
  letter: LoveLetterEnvelope | null;
  onClose: () => void;
}

export default function LetterReadModal({ letter, onClose }: Props) {
  return (
    <AnimatePresence>
      {letter && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: "spring", damping: 22, stiffness: 260 }}
            onClick={(e) => e.stopPropagation()}
            className="glass-card relative w-full max-w-lg rounded-3xl p-6 sm:p-8 max-h-[85vh] overflow-y-auto"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/40 hover:bg-black/60 transition"
              aria-label="Đóng"
            >
              <X size={18} />
            </button>

            <span className="text-neon-blue text-xs uppercase tracking-widest">
              {personName(letter.author)} gửi · {formatDate(letter.createdAt)}
            </span>
            <h3 className="font-display text-2xl sm:text-3xl font-bold mt-2 mb-5 text-gradient">
              {letter.title}
            </h3>
            <p className="text-white/80 leading-relaxed text-sm sm:text-base whitespace-pre-wrap">
              {letter.content}
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
