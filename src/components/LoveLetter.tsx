import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { letter } from "../data/letter";

function TypedParagraph({ text, active, onDone }: { text: string; active: boolean; onDone: () => void }) {
  const [shown, setShown] = useState("");

  useEffect(() => {
    if (!active) return;
    let i = 0;
    const interval = setInterval(() => {
      i += 1;
      setShown(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(interval);
        onDone();
      }
    }, 18);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  return (
    <p className="text-white/80 leading-relaxed text-sm sm:text-base mb-4 min-h-[1.5em]">
      {shown}
      {active && shown.length < text.length && <span className="animate-pulse">▍</span>}
    </p>
  );
}

export default function LoveLetter() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const inView = useInView(containerRef, { once: true, margin: "-100px" });
  const [activeIndex, setActiveIndex] = useState(-1);

  useEffect(() => {
    if (inView) setActiveIndex(0);
  }, [inView]);

  return (
    <section ref={containerRef} className="relative py-24 px-6 max-w-2xl mx-auto">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="section-title text-3xl sm:text-4xl md:text-5xl text-center mb-12 text-gradient"
      >
        Lá thư tình
      </motion.h2>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="glass-card rounded-3xl p-7 sm:p-10 shadow-glow-violet"
      >
        <h3 className="font-display text-xl sm:text-2xl mb-6 text-gradient">{letter.title}</h3>
        {letter.paragraphs.map((p, i) => (
          <TypedParagraph
            key={i}
            text={p}
            active={activeIndex === i}
            onDone={() => setActiveIndex((cur) => (cur === i ? i + 1 : cur))}
          />
        ))}
        {activeIndex >= letter.paragraphs.length && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-right text-neon-pink font-display italic mt-6"
          >
            — {letter.signature}
          </motion.p>
        )}
      </motion.div>
    </section>
  );
}
