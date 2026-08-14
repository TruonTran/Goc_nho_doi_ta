import { AnimatePresence, motion } from "framer-motion";
import { X, Heart } from "lucide-react";
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
    hour: "2-digit",
    minute: "2-digit",
  });
}

interface Props {
  letter: LoveLetterEnvelope | null;
  onClose: () => void;
}

export default function LetterReadModal({ letter, onClose }: Props) {
  return (
    <AnimatePresence>
      {letter && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          {/* Viền sọc đỏ-trắng-xanh kiểu phong bì thư máy bay (airmail) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 24, rotate: -1 }}
            animate={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 24 }}
            transition={{ type: "spring", damping: 22, stiffness: 240 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-xl rounded-md p-[9px] shadow-2xl"
            style={{
              background:
                "repeating-linear-gradient(135deg, #c0392b 0px, #c0392b 14px, #f4ecd8 14px 28px, #1d4ed8 28px 42px, #f4ecd8 42px 56px)",
            }}
          >
            {/* Tờ giấy thư — nền màu giấy cũ + kẻ dòng ngang mờ như giấy viết tay */}
            <div
              className="relative rounded-[2px] p-6 sm:p-9 max-h-[80vh] overflow-y-auto"
              style={{
                backgroundColor: "#f6ecd9",
                backgroundImage:
                  "repeating-linear-gradient(transparent, transparent 27px, rgba(120,90,55,0.16) 28px)",
                color: "#332415",
              }}
            >
              <button
                onClick={onClose}
                className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-black/10 hover:bg-black/20 transition"
                aria-label="Đóng"
                style={{ color: "#332415" }}
              >
                <X size={16} />
              </button>

              {/* Con tem trang trí góc phải */}
              <div
                className="absolute top-5 right-14 hidden sm:flex h-14 w-11 rotate-3 items-center justify-center border border-dashed"
                style={{ borderColor: "#a08a63", backgroundColor: "#efe2c4" }}
              >
                <Heart size={18} style={{ color: "#c0392b" }} fill="#c0392b" />
              </div>

              <h3
                className="font-display font-black uppercase text-center text-2xl sm:text-3xl mb-1 tracking-wide"
                style={{ color: "#2b1d10" }}
              >
                {letter.title}
              </h3>
              <div
                className="w-24 h-[3px] mx-auto mb-5"
                style={{ backgroundColor: "#c0392b" }}
              />

              <p
                className="italic text-xs sm:text-sm mb-6"
                style={{ color: "#6b5539" }}
              >
                Thư của {personName(letter.author)} · gửi ngày {formatDate(letter.createdAt)}
              </p>

              <p
                className="font-display leading-[28px] text-sm sm:text-base whitespace-pre-wrap"
                style={{ color: "#332415" }}
              >
                {letter.content}
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}