import { motion } from "framer-motion";
import { useLoveDuration } from "../hooks/useLoveDuration";
import { couple } from "../data/couple";

const UNITS: { key: keyof ReturnType<typeof useLoveDuration>; label: string }[] = [
  { key: "years", label: "Năm" },
  { key: "months", label: "Tháng" },
  { key: "days", label: "Ngày" },
  { key: "hours", label: "Giờ" },
  { key: "minutes", label: "Phút" },
  { key: "seconds", label: "Giây" },
];

export default function LoveCounter() {
  const duration = useLoveDuration(couple.loveStartDate);

  return (
    <section className="relative py-24 px-6 flex flex-col items-center text-center">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="section-title text-3xl sm:text-4xl md:text-5xl mb-3 text-gradient"
      >
        Chúng ta đã yêu nhau được
      </motion.h2>
      <p className="text-white/50 mb-12 text-sm sm:text-base">
        Kể từ {new Date(couple.loveStartDate).toLocaleDateString("vi-VN")} đến bây giờ
      </p>

      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 sm:gap-4 max-w-4xl w-full">
        {UNITS.map((unit, i) => (
          <motion.div
            key={unit.key}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="glass-card rounded-2xl py-5 px-2 sm:py-7"
          >
            <motion.span
              key={duration[unit.key]}
              initial={{ opacity: 0.3, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="block font-display text-2xl sm:text-4xl font-bold text-gradient tabular-nums"
            >
              {String(duration[unit.key]).padStart(2, "0")}
            </motion.span>
            <span className="block mt-1 text-[10px] sm:text-xs uppercase tracking-widest text-white/50">
              {unit.label}
            </span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
