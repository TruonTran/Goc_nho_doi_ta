import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Wind, X } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
}

const CYCLE_SECONDS = 4;

export default function BreathModal({ open, onClose }: Props) {
  const [secondsLeft, setSecondsLeft] = useState(60);
  const [inhale, setInhale] = useState(true);

  useEffect(() => {
    if (!open) return;
    setSecondsLeft(60);
    setInhale(true);

    const interval = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(interval);
          return 0;
        }
        return s - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    if (secondsLeft % CYCLE_SECONDS === 0) setInhale((v) => !v);
    if (secondsLeft === 0) onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondsLeft]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 22, stiffness: 260 }}
            className="glass-card relative w-full max-w-sm rounded-3xl p-7 text-center"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/40 hover:bg-black/60 transition"
              aria-label="Đóng"
            >
              <X size={16} />
            </button>

            <div className="mx-auto mb-3 w-12 h-12 rounded-full bg-neon-blue/15 text-neon-blue flex items-center justify-center">
              <Wind size={22} />
            </div>
            <h3 className="font-display text-xl mb-2 text-gradient">Hạ nhiệt cảm xúc</h3>
            <p className="text-white/60 text-xs leading-relaxed mb-6">
              Trước khi viết những dòng tâm sự, hãy hít thở sâu theo nhịp bên dưới để giữ bình tĩnh nhé.
            </p>

            <div className="flex justify-center py-4">
              <motion.div
                animate={{ scale: inhale ? 1.25 : 0.85 }}
                transition={{ duration: CYCLE_SECONDS, ease: "easeInOut" }}
                className="w-28 h-28 rounded-full bg-neon-blue/10 border-2 border-neon-blue/60 flex items-center justify-center shadow-glow-blue"
              >
                <span className="text-xs font-semibold text-neon-blue">
                  {inhale ? "Hít vào..." : "Thở ra..."}
                </span>
              </motion.div>
            </div>

            <p className="text-xs font-semibold text-neon-blue mb-4">Còn lại: {secondsLeft}s</p>

            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-neon-blue/15 hover:bg-neon-blue/25 text-neon-blue text-xs font-semibold transition"
            >
              Đã bình tĩnh hơn rồi
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
