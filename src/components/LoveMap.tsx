import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin } from "lucide-react";
import { locations } from "../data/locations";
import type { LoveLocation } from "../types";

export default function LoveMap() {
  const [active, setActive] = useState<LoveLocation | null>(null);

  return (
    <section className="relative py-24 px-6 max-w-5xl mx-auto">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="section-title text-3xl sm:text-4xl md:text-5xl text-center mb-4 text-gradient"
      >
        Bản đồ tình yêu
      </motion.h2>
      <p className="text-center text-white/50 mb-12 text-sm sm:text-base">
        Những nơi hai ta đã cùng nhau đi qua
      </p>

      <div className="relative glass-card rounded-3xl overflow-hidden aspect-[4/3] sm:aspect-[16/9]">
        {/* decorative starry map backdrop */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 30% 30%, rgba(180,140,255,0.18), transparent 55%), radial-gradient(circle at 75% 65%, rgba(255,143,214,0.16), transparent 55%), linear-gradient(160deg, #150e2e, #0b0a1f)",
          }}
        />
        <svg
          className="absolute inset-0 w-full h-full opacity-40"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <path
            d={locations
              .map((l, i) => `${i === 0 ? "M" : "L"} ${l.x} ${l.y}`)
              .join(" ")}
            fill="none"
            stroke="url(#lineGrad)"
            strokeWidth="1.5"
            strokeDasharray="4 5"
          />
          <defs>
            <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ff8fd6" />
              <stop offset="100%" stopColor="#7dd3ff" />
            </linearGradient>
          </defs>
        </svg>

        {locations.map((loc, i) => (
          <motion.button
            key={loc.id}
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.12 }}
            whileHover={{ scale: 1.2 }}
            onClick={() => setActive(loc)}
            style={{ left: `${loc.x}%`, top: `${loc.y}%` }}
            className="absolute -translate-x-1/2 -translate-y-full group"
          >
            <MapPin
              size={28}
              className="text-neon-pink drop-shadow-[0_0_10px_rgba(255,143,214,0.8)] fill-neon-pink/30"
            />
            <span className="absolute -top-1 left-1/2 -translate-x-1/2 -translate-y-full opacity-0 group-hover:opacity-100 transition text-[11px] bg-black/70 px-2 py-1 rounded-md whitespace-nowrap">
              {loc.name}
            </span>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="glass-card rounded-2xl p-6 mt-6"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-neon-blue text-xs uppercase tracking-widest">{active.date}</span>
                <h3 className="font-display text-xl font-semibold mt-1 mb-2">{active.name}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{active.description}</p>
              </div>
              <button
                onClick={() => setActive(null)}
                className="text-white/40 hover:text-white text-sm shrink-0"
              >
                ✕
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}