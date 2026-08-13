import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Mail, PenLine } from "lucide-react";
import StarField from "./StarField";
import EnvelopeCard from "./EnvelopeCard";
import LetterReadModal from "./LetterReadModal";
import NewLetterForm from "./NewLetterForm";
import { useLoveLetters } from "../hooks/useLoveLetters";
import type { LoveLetterEnvelope } from "../types";

export default function LettersPage() {
  const { letters, addLetter, loading } = useLoveLetters();
  const [openIds, setOpenIds] = useState<Set<string>>(new Set());
  const [reading, setReading] = useState<LoveLetterEnvelope | null>(null);
  const [showForm, setShowForm] = useState(false);

  function toggleOpen(id: string) {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div className="relative min-h-screen">
      <StarField />

      <main className="relative py-16 px-6 max-w-5xl mx-auto">
        <a
          href="/"
          className="inline-flex items-center gap-2 text-white/50 hover:text-white text-sm mb-8 transition"
        >
          <ArrowLeft size={16} /> Về trang chính
        </a>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="section-title text-3xl sm:text-4xl md:text-5xl text-center mb-3 text-gradient flex items-center justify-center gap-3"
        >
          <Mail className="text-neon-pink" /> Hộp thư
        </motion.h1>
        <p className="text-white/50 text-center text-sm sm:text-base mb-10 max-w-xl mx-auto">
          Mỗi lá thư là một phong bì nhỏ — chạm vào con dấu để mở ra, rồi chạm
          vào tờ thư để đọc trọn vẹn.
        </p>

        <div className="flex justify-center mb-8">
          <button
            onClick={() => setShowForm((v) => !v)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 border border-white/15 hover:bg-white/15 text-sm font-semibold transition"
          >
            <PenLine size={16} className="text-neon-pink" />
            {showForm ? "Ẩn form viết thư" : "Viết thư mới"}
          </button>
        </div>

        <AnimatePresence>{showForm && <NewLetterForm onSubmit={addLetter} />}</AnimatePresence>

        {loading && (
          <p className="text-center text-white/40 text-sm py-10">Đang tải hộp thư...</p>
        )}

        {!loading && letters.length === 0 && (
          <div className="glass-card rounded-2xl py-12 text-center text-white/40 text-sm">
            Hộp thư đang trống. Viết lá thư đầu tiên đi nào 💌
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10">
          {letters.map((letter) => (
            <EnvelopeCard
              key={letter.id}
              letter={letter}
              isOpen={openIds.has(letter.id)}
              onToggleOpen={() => toggleOpen(letter.id)}
              onRead={() => setReading(letter)}
            />
          ))}
        </div>
      </main>

      <LetterReadModal letter={reading} onClose={() => setReading(null)} />
    </div>
  );
}
