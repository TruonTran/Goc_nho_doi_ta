import { useState } from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";
import { couple } from "../data/couple";
import { useLocalStorage } from "../hooks/useLocalStorage";
import type { PersonKey } from "../types";

function personName(key: PersonKey) {
  return key === "A" ? couple.personA.name : couple.personB.name;
}

interface Props {
  onSubmit: (letter: { author: PersonKey; title: string; content: string }) => Promise<void>;
}

export default function NewLetterForm({ onSubmit }: Props) {
  // "Đang đóng vai A hay B trên máy này" — giống VentCorner, chỉ là lựa chọn
  // riêng của thiết bị nên lưu ở localStorage, không cần đồng bộ.
  const [role, setRole] = useLocalStorage<PersonKey>("letter-role", "A");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    setSending(true);
    setError(null);
    try {
      await onSubmit({ author: role, title: title.trim(), content: content.trim() });
      setTitle("");
      setContent("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Có lỗi xảy ra, thử lại nhé.");
    } finally {
      setSending(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -16, height: 0 }}
      animate={{ opacity: 1, y: 0, height: "auto" }}
      exit={{ opacity: 0, y: -16, height: 0 }}
      transition={{ duration: 0.35 }}
      className="glass-card rounded-3xl p-6 sm:p-8 shadow-glow-violet mb-10 overflow-hidden"
    >
      <div className="flex justify-center mb-6">
        <div className="glass-card inline-flex items-center gap-1 rounded-full p-1 text-xs font-semibold">
          <span className="pl-3 pr-1 text-white/40">Người viết</span>
          {(["A", "B"] as PersonKey[]).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setRole(key)}
              className={`px-4 py-1.5 rounded-full transition-all ${
                role === key
                  ? "bg-gradient-to-r from-neon-pink to-neon-violet text-white shadow-glow-pink"
                  : "text-white/60 hover:text-white"
              }`}
            >
              {personName(key)}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          <span className="block text-xs font-semibold text-white/60 mb-1.5">Tiêu đề lá thư</span>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="Gửi người thương..."
            className="w-full text-sm rounded-xl bg-white/5 border border-white/10 p-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-neon-pink"
          />
        </label>

        <label className="block">
          <span className="block text-xs font-semibold text-white/60 mb-1.5">Nội dung</span>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={6}
            required
            placeholder="Viết những điều muốn nói..."
            className="w-full text-sm rounded-2xl bg-white/5 border border-white/10 p-4 text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-neon-pink resize-none"
          />
        </label>

        {error && <p className="text-xs text-red-400">{error}</p>}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={sending}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-neon-pink to-neon-violet text-white text-xs font-bold shadow-glow-pink hover:opacity-90 transition disabled:opacity-50"
          >
            <Send size={14} /> {sending ? "Đang gửi..." : "Bỏ vào hộp thư"}
          </button>
        </div>
      </form>
    </motion.div>
  );
}
