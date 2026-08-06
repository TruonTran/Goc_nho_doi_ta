import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { memories } from "../data/memories";

function TiltCard({ title, description, emoji, delay }: { title: string; description: string; emoji: string; delay: number }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: py * -14, y: px * 14 });
  }

  function reset() {
    setTilt({ x: 0, y: 0 });
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      style={{
        transform: `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: "transform 0.15s ease-out",
      }}
      className="glass-card rounded-2xl p-6 hover:shadow-glow-violet"
    >
      <div className="text-3xl mb-3">{emoji}</div>
      <h3 className="font-display text-lg font-semibold mb-2">{title}</h3>
      <p className="text-white/60 text-sm leading-relaxed">{description}</p>
    </motion.div>
  );
}

export default function MemoryCards() {
  return (
    <section className="relative py-24 px-6 max-w-6xl mx-auto">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="section-title text-3xl sm:text-4xl md:text-5xl text-center mb-14 text-gradient"
      >
        Những điều đáng nhớ
      </motion.h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {memories.map((m, i) => (
          <TiltCard key={m.id} title={m.title} description={m.description} emoji={m.emoji} delay={i * 0.08} />
        ))}
      </div>
    </section>
  );
}
