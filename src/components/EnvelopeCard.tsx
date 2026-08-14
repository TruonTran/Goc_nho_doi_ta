import { motion } from "framer-motion";
import { Heart, X } from "lucide-react";
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
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-full max-w-[210px] aspect-[3/2]">
        {/* Vỏ phong thư (thân + nắp) — bọc trong 1 lớp bo góc + overflow-hidden
            chung để nắp (hình tam giác vẽ bằng clip-path, góc vuông) luôn bị
            cắt gọn khớp với đường bo tròn của thân, không bị lòi góc nhọn ra
            ngoài như trước. Tờ thư nằm NGOÀI lớp này vì nó cần thò lên trên
            khi mở. */}
        <div className="absolute inset-0 rounded-2xl overflow-hidden border border-white/15 shadow-glow-pink">
          {/* Thân phong thư — một khối gradient duy nhất, không tách 2 màu rời rạc */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#8b5cf6] via-[#c026d3] to-[#ff8fd6]">
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/25 to-transparent" />
          </div>

          {/* Nắp phong thư — hiệu ứng mờ dần + nhích lên khi mở (không dùng lật
              3D vì clip-path + rotateX gần 180° gây méo phối cảnh, dễ vỡ hình). */}
          <motion.div
            className="absolute inset-x-0 top-0 h-1/2 z-30 pointer-events-none"
            style={{
              clipPath: "polygon(0 0, 100% 0, 50% 100%)",
              background: "linear-gradient(160deg,#6d28d9,#a21caf)",
            }}
            initial={false}
            animate={{ opacity: isOpen ? 0 : 1, y: isOpen ? -10 : 0 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
          />
        </div>

        {/* Bọc ngoài KHÔNG animate — chỉ lo việc căn giữa theo chiều ngang.
            Để Framer Motion tự quản lý transform (y/opacity/rotate) ở lớp
            trong mà không đè mất `-translate-x-1/2` của lớp ngoài. */}
        <div className="absolute left-1/2 top-3 -translate-x-1/2 w-[84%] z-20">
          <motion.button
            type="button"
            onClick={onRead}
            disabled={!isOpen}
            initial={false}
            animate={{
              y: isOpen ? -46 : 14,
              opacity: isOpen ? 1 : 0,
              rotate: isOpen ? -1.5 : 0,
            }}
            transition={{ type: "spring", stiffness: 220, damping: 22 }}
            className="w-full rounded-md rounded-t-lg text-left cursor-pointer shadow-lg block"
            style={{
              background: "repeating-linear-gradient(#fff 0px, #fff 21px, #fbe9f3 22px)",
            }}
          >
            <div className="p-3">
              <p className="text-[11px] font-display font-semibold text-midnight-2 truncate">
                {letter.title}
              </p>
              <p className="text-[10px] text-midnight-2/70 line-clamp-2 mt-1 leading-snug">
                {letter.content}
              </p>
              {isOpen && (
                <span className="mt-1.5 inline-block text-[10px] font-bold text-fuchsia-600">
                  Chạm để đọc →
                </span>
              )}
            </div>
          </motion.button>
        </div>

        {/* Con dấu sáp — cũng là nút bấm mở khi phong thư còn đóng */}
        {!isOpen && (
          <button
            type="button"
            onClick={onToggleOpen}
            aria-label="Mở phong thư"
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-40 group"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-neon-pink to-neon-violet shadow-glow-pink ring-2 ring-white/20 transition-transform group-hover:scale-110">
              <Heart size={18} className="text-white" fill="currentColor" />
            </span>
          </button>
        )}
      </div>

      {/* Nút đóng lại nằm trong luồng layout bình thường — không đè lên tên/ngày bên dưới */}
      {isOpen && (
        <button
          type="button"
          onClick={onToggleOpen}
          aria-label="Đóng phong thư"
          className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-semibold text-white/50 hover:text-white hover:bg-white/10 hover:border-white/20 transition"
        >
          <X size={11} /> Đóng thư
        </button>
      )}

      <div className="text-center mt-1">
        <p className="text-xs font-semibold text-white/80">{personName(letter.author)} gửi</p>
        <p className="text-[10px] text-white/35">{formatDate(letter.createdAt)}</p>
      </div>
    </div>
  );
}