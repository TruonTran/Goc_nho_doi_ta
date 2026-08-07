import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Gift, Sparkles } from "lucide-react";
import { wheelChallenges } from "../data/vent";

export default function PeaceWheel() {
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [displayed, setDisplayed] = useState<string | null>(null);
  const timeoutRef = useRef<number | null>(null);

  function spin() {
    if (spinning) return;
    setSpinning(true);
    setResult(null);

    let ticks = 0;
    const totalTicks = 18;

    function tick() {
      const random = wheelChallenges[Math.floor(Math.random() * wheelChallenges.length)];
      setDisplayed(random);
      ticks += 1;

      if (ticks < totalTicks) {
        const delay = 60 + ticks * 14; // ease out
        timeoutRef.current = window.setTimeout(tick, delay);
      } else {
        setResult(random);
        setSpinning(false);
      }
    }

    tick();
  }

  return (
    <section className="relative py-24 px-6 max-w-3xl mx-auto text-center">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="section-title text-3xl sm:text-4xl md:text-5xl mb-3 text-gradient"
      >
        Vòng quay làm hòa
      </motion.h2>
      <p className="text-white/50 text-sm sm:text-base mb-12 max-w-xl mx-auto">
        Không biết làm sao để mở lời? Hãy quay ngẫu nhiên một thử thách ngọt ngào!
      </p>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="relative mx-auto mb-10 w-64 h-64 sm:w-72 sm:h-72"
      >
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-neon-pink text-2xl z-10">▼</div>

        <motion.div
          animate={spinning ? { rotate: 360 } : { rotate: 0 }}
          transition={spinning ? { duration: 1.2, repeat: Infinity, ease: "linear" } : { duration: 0.4 }}
          className="w-full h-full rounded-full border-4 border-neon-violet/50 bg-gradient-to-tr from-neon-violet/20 via-neon-pink/10 to-neon-blue/20 shadow-glow-violet flex items-center justify-center p-8"
        >
          <div className="space-y-3">
            <Gift
              size={36}
              className={`mx-auto text-neon-pink ${spinning ? "" : "animate-heartbeat"}`}
            />
            <p className="text-xs sm:text-sm font-semibold text-white/80 leading-relaxed">
              {displayed ?? "Bấm nút bên dưới để quay thử thách!"}
            </p>
          </div>
        </motion.div>
      </motion.div>

      <button
        onClick={spin}
        disabled={spinning}
        className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-neon-pink to-neon-violet text-white text-sm font-bold shadow-glow-pink hover:opacity-90 transition disabled:opacity-60"
      >
        <Sparkles size={16} /> {spinning ? "Đang quay..." : "Quay ngẫu nhiên"}
      </button>

      <AnimatePresence>
        {result && !spinning && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.5 }}
            className="glass-card mt-8 mx-auto max-w-md rounded-2xl p-5 text-sm text-white/80"
          >
            <span className="text-neon-blue text-xs uppercase tracking-widest block mb-1.5">Thử thách của bạn</span>
            {result}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
