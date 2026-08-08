import { motion } from "framer-motion";
import { Heart, Sparkles } from "lucide-react";
import { couple } from "../data/couple";

interface Props {
  onStart: () => void;
}

export default function WelcomeScreen({ onStart }: Props) {
  return (
    <motion.section
      className="relative min-h-screen flex flex-col items-center justify-center px-6 text-center overflow-hidden"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className="flex items-center gap-2 text-neon-blue/80 uppercase text-xs sm:text-sm tracking-[0.3em] mb-6"
      >
        <Sparkles size={14} />
        <span>một vũ trụ riêng của đôi ta</span>
        <Sparkles size={14} />
      </motion.div>

      <div className="flex items-center justify-center gap-6 sm:gap-10 mb-8">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="animate-floaty"
        >
          <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-2 border-neon-pink/60 shadow-glow-pink">
            <img
              src={couple.personA.avatar}
              alt={couple.personA.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.6, type: "spring" }}
          className="animate-heartbeat"
        >
          <Heart
            className="w-10 h-10 sm:w-14 sm:h-14 text-neon-pink drop-shadow-[0_0_18px_rgba(255,143,214,0.85)]"
            fill="#ff8fd6"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="animate-floaty"
          style={{ animationDelay: "1s" }}
        >
          <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-2 border-neon-violet/60 shadow-glow-violet">
            <img
              src={couple.personB.avatar}
              alt={couple.personB.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
            />
          </div>
        </motion.div>
      </div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="text-4xl sm:text-6xl md:text-7xl font-display font-bold text-gradient mb-4"
      >
        {couple.coupleTitle}
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.8 }}
        className="text-white/60 max-w-md mx-auto mb-10 text-sm sm:text-base"
      >
        Chào mừng đến với một góc nhỏ giữa vũ trụ, nơi lưu giữ mọi khoảnh khắc
        của "đôi ta".
      </motion.p>

      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1, duration: 0.6 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.96 }}
        onClick={onStart}
        className="group relative px-8 py-3.5 rounded-full font-medium text-sm sm:text-base bg-gradient-to-r from-neon-pink via-neon-violet to-neon-blue shadow-glow-violet"
      >
        <span className="relative z-10">Bắt đầu hành trình ✨</span>
      </motion.button>

      {/* <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 8, 0] }}
        transition={{ delay: 1.6, duration: 2, repeat: Infinity }}
        className="absolute bottom-8 text-white/40 text-xs tracking-widest"
      >
        cuộn xuống để khám phá
      </motion.div> */}
    </motion.section>
  );
}
