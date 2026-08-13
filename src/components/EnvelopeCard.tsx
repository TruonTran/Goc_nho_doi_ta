import { motion } from "framer-motion";
import { Heart } from "lucide-react";
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
  });
}

interface Props {
  letter: LoveLetterEnvelope;
  isOpen: boolean;
  onToggleOpen: () => void;
  onRead: () => void;
}

export default function EnvelopeCard({ letter, isOpen, onToggleOpen, onRead }: Props) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-full max-w-[220px] aspect-[4/3]" style={{ perspective: 900 }}>
        {/* Thân phong thư */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-neon-violet/90 to-neon-pink/70 shadow-glow-violet" />

        {/* Lớp túi trước — che nửa dưới của thư khi còn nằm trong phong bì */}
        <div className="absolute inset-x-0 bottom-0 h-2/3 rounded-b-2xl bg-gradient-to-br from-[#241142] to-[#3a1f63] z-10" />

        {/* Tờ thư — nhô lên khi phong thư đã mở */}
        <motion.button
          type="button"
          onClick={onRead}
          disabled={!isOpen}
          initial={false}
          animate={{
            y: isOpen ? -34 : 10,
            opacity: isOpen ? 1 : 0,
          }}
          transition={{ type: "spring", stiffness: 220, damping: 22 }}
          className="absolute left-1/2 top-2 -translate-x-1/2 w-[86%] rounded-lg bg-gradient-to-b from-white to-pink-50 text-midnight-2 shadow-lg p-3 text-left z-20 cursor-pointer"
        >
          <p className="text-[11px] font-display font-semibold truncate">{letter.title}</p>
          <p className="text-[10px] text-midnight-2/70 line-clamp-2 mt-1 leading-snug">
            {letter.content}
          </p>
          {isOpen && (
            <span className="mt-1.5 inline-block text-[10px] font-bold text-neon-pink">
              Chạm để đọc trọn vẹn →
            </span>
          )}
        </motion.button>

        {/* Nắp phong thư — lật lên khi mở */}
        <motion.div
          className="absolute inset-x-0 top-0 h-1/2 z-30"
          style={{
            clipPath: "polygon(0 0, 100% 0, 50% 100%)",
            background: "linear-gradient(160deg,#3a1f63,#241142)",
            transformOrigin: "top center",
            transformStyle: "preserve-3d",
          }}
          animate={{ rotateX: isOpen ? -175 : 0 }}
          transition={{ duration: 0.55, ease: "easeInOut" }}
        />

        {/* Con dấu / nút bấm để mở khi phong thư còn đóng */}
        {!isOpen && (
          <button
            type="button"
            onClick={onToggleOpen}
            aria-label="Mở phong thư"
            className="absolute inset-0 z-40 flex items-center justify-center group"
          >
            <span className="h-11 w-11 rounded-full bg-gradient-to-br from-neon-pink to-neon-violet shadow-glow-pink flex items-center justify-center transition-transform group-hover:scale-110">
              <Heart size={18} className="text-white" />
            </span>
          </button>
        )}

        {/* Bấm ra để đóng lại phong thư đã mở (không che nút "đọc trọn vẹn") */}
        {isOpen && (
          <button
            type="button"
            onClick={onToggleOpen}
            aria-label="Đóng phong thư"
            className="absolute -bottom-2 left-1/2 -translate-x-1/2 z-40 text-[10px] text-white/40 hover:text-white/70 transition"
          >
            Đóng lại
          </button>
        )}
      </div>

      <div className="text-center">
        <p className="text-xs font-semibold text-white/80">{personName(letter.author)} gửi</p>
        <p className="text-[10px] text-white/35">{formatDate(letter.createdAt)}</p>
      </div>
    </div>
  );
}
