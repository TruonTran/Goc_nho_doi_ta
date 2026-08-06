import { useMemo } from "react";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";

export default function Ending() {
  const particles = useMemo(
    () =>
      Array.from({ length: 28 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 5,
        duration: 4 + Math.random() * 4,
        size: 3 + Math.random() * 5,
        color: ["#ff8fd6", "#b48cff", "#7dd3ff", "#ffffff"][i % 4],
      })),
    []
  );

  return (
    <section className="relative py-32 px-6 flex flex-col items-center justify-center text-center overflow-hidden min-h-[70vh]">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((p) => (
          <motion.span
            key={p.id}
            className="absolute bottom-0 rounded-full"
            style={{
              left: `${p.left}%`,
              width: p.size,
              height: p.size,
              backgroundColor: p.color,
              boxShadow: `0 0 8px ${p.color}`,
            }}
            initial={{ y: 0, opacity: 0 }}
            animate={{ y: -600, opacity: [0, 1, 0] }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              ease: "easeOut",
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.6 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, type: "spring" }}
        className="relative z-10"
      >
        <Heart
          size={56}
          className="mx-auto mb-6 text-neon-pink drop-shadow-[0_0_25px_rgba(255,143,214,0.9)] animate-heartbeat"
          fill="#ff8fd6"
        />
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.15 }}
        className="relative z-10 font-display text-3xl sm:text-5xl font-bold text-gradient mb-5 max-w-2xl"
      >
        Cảm ơn vì đã xuất hiện và đến bên cạnh Cua.
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.3 }}
        className="relative z-10 text-white/60 max-w-md text-sm sm:text-base"
      >
        Hành trình đôi ta vẫn sẽ còn tiếp diễn, và Cua mong có thể cùng bé viết lên những chương mới cho tương lai chúng ta.
      </motion.p>
    </section>
  );
}
