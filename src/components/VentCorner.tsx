import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Feather,
  HeartCrack,
  MessageCircleHeart,
  Send,
  Wind,
  CheckCircle2,
  Archive,
} from "lucide-react";
import { couple } from "../data/couple";
import { intensityOptions, wishOptions } from "../data/vent";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useVentNotes } from "../hooks/useVentNotes";
import type { PersonKey } from "../types";
import BreathModal from "./BreathModal";

function personName(key: PersonKey) {
  return key === "A" ? couple.personA.name : couple.personB.name;
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function VentCorner() {
  // "Đang đóng vai A hay B trên máy này" — chỉ là lựa chọn riêng của thiết bị,
  // không cần đồng bộ, nên vẫn giữ trong localStorage.
  const [role, setRole] = useLocalStorage<PersonKey>("vent-role", "A");

  // Danh sách tâm sự — lấy/lưu qua Supabase để đồng bộ giữa các thiết bị.
  const { notes, addNote, toggleResolved, addComment } = useVentNotes();

  const [showBreath, setShowBreath] = useState(false);

  const [intensity, setIntensity] = useState(intensityOptions[0]);
  const [wish, setWish] = useState(wishOptions[0]);
  const [content, setContent] = useState("");
  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({});

  const stats = useMemo(() => {
    const resolved = notes.filter((n) => n.resolved).length;
    const pending = notes.length - resolved;
    let peacefulDays = "—";
    if (notes.length > 0) {
      const latest = notes.reduce(
        (max, n) => (n.createdAt > max ? n.createdAt : max),
        notes[0].createdAt,
      );
      const diffMs = Date.now() - new Date(latest).getTime();
      peacefulDays = String(
        Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24))),
      );
    }
    return { total: notes.length, resolved, pending, peacefulDays };
  }, [notes]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;

    await addNote({
      author: role,
      intensity,
      wish,
      content: content.trim(),
    });
    setContent("");
  }

  async function submitReply(id: string) {
    const text = (replyDrafts[id] || "").trim();
    if (!text) return;
    await addComment(id, role, text);
    setReplyDrafts((prev) => ({ ...prev, [id]: "" }));
  }

  return (
    <section className="relative py-24 px-6 max-w-4xl mx-auto">
      <BreathModal open={showBreath} onClose={() => setShowBreath(false)} />

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="section-title text-3xl sm:text-4xl md:text-5xl text-center mb-3 text-gradient"
      >
        Góc tâm sự khi giận
      </motion.h2>
      <p className="text-white/50 text-center text-sm sm:text-base mb-10 max-w-xl mx-auto">
        Khi dỗi nhau, hãy chọn viết ra thay vì im lặng hoặc nói những lời làm
        tổn thương nhau.
      </p>

      {/* Role switcher */}
      <div className="flex justify-center mb-10">
        <div className="glass-card inline-flex items-center gap-1 rounded-full p-1 text-xs font-semibold">
          <span className="pl-3 pr-1 text-white/40">Đang là</span>
          {(["A", "B"] as PersonKey[]).map((key) => (
            <button
              key={key}
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

      {/* Note form */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="glass-card rounded-3xl p-6 sm:p-8 shadow-glow-violet mb-10"
      >
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-5">
          <h3 className="font-display text-lg sm:text-xl flex items-center gap-2">
            <Feather size={18} className="text-neon-pink" /> Viết lời bộc bạch
          </h3>
          <button
            type="button"
            onClick={() => setShowBreath(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-neon-blue/15 hover:bg-neon-blue/25 text-neon-blue text-xs font-semibold transition"
          >
            <Wind size={14} /> 60s hít thở hạ nhiệt trước khi viết
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="block">
              <span className="block text-xs font-semibold text-white/60 mb-1.5">
                Mức độ giận / buồn
              </span>
              <select
                value={intensity}
                onChange={(e) => setIntensity(e.target.value)}
                className="w-full text-xs rounded-xl bg-white/5 border border-white/10 p-3 text-white focus:outline-none focus:ring-1 focus:ring-neon-pink"
              >
                {intensityOptions.map((opt) => (
                  <option key={opt} value={opt} className="bg-midnight-2">
                    {opt}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="block text-xs font-semibold text-white/60 mb-1.5">
                Mong muốn lúc này
              </span>
              <select
                value={wish}
                onChange={(e) => setWish(e.target.value)}
                className="w-full text-xs rounded-xl bg-white/5 border border-white/10 p-3 text-white focus:outline-none focus:ring-1 focus:ring-neon-pink"
              >
                {wishOptions.map((opt) => (
                  <option key={opt} value={opt} className="bg-midnight-2">
                    {opt}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="block">
            <span className="block text-xs font-semibold text-white/60 mb-1.5">
              Nội dung tâm sự (điều muốn đối phương hiểu)
            </span>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              required
              placeholder="Ví dụ: Lúc nãy khi nghe câu đó, mình cảm thấy không được tôn trọng. Mình biết bạn bận nhưng chỉ mong nhận được một tin nhắn thôi..."
              className="w-full text-sm rounded-2xl bg-white/5 border border-white/10 p-4 text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-neon-pink resize-none"
            />
          </label>

          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-neon-pink to-neon-violet text-white text-xs font-bold shadow-glow-pink hover:opacity-90 transition"
            >
              <Send size={14} /> Gửi tâm sự
            </button>
          </div>
        </form>
      </motion.div>

      {/* Notes list */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-lg flex items-center gap-2">
          <Archive size={18} className="text-neon-pink" /> Hộp lời bộc bạch
        </h3>
        <span className="text-xs text-white/40">{notes.length} bức thư</span>
      </div>

      <div className="space-y-4">
        {notes.length === 0 && (
          <div className="glass-card rounded-2xl py-8 text-center text-white/40 text-xs">
            Chưa có bức thư nào. Khi có điều không vui, hãy chọn viết ra nhé 💕
          </div>
        )}

        {notes.map((note) => (
          <motion.div
            key={note.id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className={`glass-card rounded-2xl p-5 space-y-3 ${
              note.resolved ? "border border-emerald-400/30" : ""
            }`}
          >
            <div className="flex items-center justify-between flex-wrap gap-2 border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-neon-violet/15 text-neon-violet">
                  {personName(note.author)} gửi
                </span>
                <span className="text-[11px] text-white/35">
                  {formatTime(note.createdAt)}
                </span>
              </div>

              {note.resolved ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-400/15 text-emerald-300">
                  <CheckCircle2 size={12} /> Đã làm hòa
                </span>
              ) : (
                <button
                  onClick={() => toggleResolved(note.id)}
                  className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-neon-pink/15 text-neon-pink hover:bg-neon-pink/25 transition"
                >
                  Đánh dấu đã hiểu nhau
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-2 text-[11px]">
              <span className="px-2.5 py-1 rounded-lg bg-white/5 text-white/70">
                Mức độ: {note.intensity}
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-white/5 text-white/70">
                Mong muốn: {note.wish}
              </span>
            </div>

            <p className="text-sm text-white/80 leading-relaxed bg-black/20 p-3.5 rounded-xl border border-white/5">
              {note.content}
            </p>

            <div className="space-y-2 pt-1">
              {note.comments.map((c) => (
                <div
                  key={c.id}
                  className="pl-3 border-l-2 border-neon-pink/40 text-xs"
                >
                  <span className="font-semibold text-white/80">
                    {personName(c.author)}:{" "}
                  </span>
                  <span className="text-white/60">{c.text}</span>
                  <span className="block text-[10px] text-white/30">
                    {formatTime(c.createdAt)}
                  </span>
                </div>
              ))}

              <div className="flex gap-2 pt-1">
                <input
                  type="text"
                  value={replyDrafts[note.id] || ""}
                  onChange={(e) =>
                    setReplyDrafts((prev) => ({
                      ...prev,
                      [note.id]: e.target.value,
                    }))
                  }
                  onKeyDown={(e) => e.key === "Enter" && submitReply(note.id)}
                  placeholder={`Nhắn lời phản hồi với tư cách ${personName(role)}...`}
                  className="flex-1 text-xs px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-neon-pink"
                />
                <button
                  onClick={() => submitReply(note.id)}
                  className="px-3.5 py-2 rounded-xl bg-neon-violet/20 hover:bg-neon-violet/30 text-neon-violet text-xs font-bold transition flex items-center gap-1.5"
                >
                  <MessageCircleHeart size={14} /> Phản hồi
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="flex justify-center mt-8 text-white/20">
        <HeartCrack size={18} />
      </div>
    </section>
  );
}
