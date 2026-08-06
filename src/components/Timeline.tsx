import { useState } from "react";
import { motion } from "framer-motion";
import { timeline } from "../data/timeline";
import type { TimelineMilestone } from "../types";
import TimelineModal from "./TimelineModal";

export default function Timeline() {
  const [active, setActive] = useState<TimelineMilestone | null>(null);

  return (
    <section className="relative py-24 px-6 max-w-4xl mx-auto">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="section-title text-3xl sm:text-4xl md:text-5xl text-center mb-16 text-gradient"
      >
        Những ngày kỷ niệm
      </motion.h2>

      <div className="relative">
        <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-neon-pink/60 via-neon-violet/50 to-neon-blue/40 sm:-translate-x-1/2" />

        <div className="space-y-10 sm:space-y-16">
          {timeline.map((m, i) => {
            const isLeft = i % 2 === 0;
            return (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, x: isLeft ? -40 : 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6 }}
                className={`relative pl-12 sm:pl-0 sm:w-1/2 ${
                  isLeft ? "sm:pr-10 sm:text-right sm:ml-0" : "sm:pl-10 sm:ml-auto"
                }`}
              >
                <span className="absolute left-2.5 sm:left-auto sm:right-0 sm:translate-x-1/2 top-1.5 w-3.5 h-3.5 rounded-full bg-neon-pink shadow-glow-pink sm:static sm:top-auto"
                  style={
                    isLeft
                      ? { position: "absolute", right: "-7px", top: "6px" }
                      : { position: "absolute", left: "-7px", top: "6px" }
                  }
                />
                <button
                  onClick={() => setActive(m)}
                  className="glass-card w-full text-left rounded-2xl p-5 hover:shadow-glow-violet transition-shadow duration-300 sm:text-inherit"
                >
                  <span className="text-neon-blue text-xs uppercase tracking-widest">{m.date}</span>
                  <h3 className="font-display text-lg sm:text-xl font-semibold mt-1 mb-1.5">{m.title}</h3>
                  <p className="text-white/60 text-sm line-clamp-2">{m.description}</p>
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>

      <TimelineModal milestone={active} onClose={() => setActive(null)} />
    </section>
  );
}
