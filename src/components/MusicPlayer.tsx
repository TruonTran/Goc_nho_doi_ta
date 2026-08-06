import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Music2, Pause, Play } from "lucide-react";

const TRACK = {
  title: "Our Song - Nhạc nền kỷ niệm",
  src: "/audio/background-music.mp3",
};

export default function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);

  function toggle() {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.play().catch(() => {});
      setPlaying(true);
    }
  }

  return (
    <div className="fixed bottom-5 right-5 z-40">
      <audio ref={audioRef} src={TRACK.src} loop preload="none" />
      <motion.button
        onClick={toggle}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="glass-card flex items-center gap-2.5 rounded-full pl-3 pr-4 py-2.5 shadow-glow-violet"
      >
        <span
          className={`w-9 h-9 rounded-full flex items-center justify-center bg-gradient-to-br from-neon-pink to-neon-violet ${
            playing ? "animate-heartbeat" : ""
          }`}
        >
          {playing ? <Pause size={16} /> : <Play size={16} />}
        </span>
        <div className="text-left hidden sm:block max-w-[140px]">
          <div className="flex items-center gap-1 text-[10px] text-white/50 uppercase tracking-widest">
            <Music2 size={10} />
            <span>{playing ? "Đang phát" : "Nhạc nền"}</span>
          </div>
          <div className="text-xs truncate">{TRACK.title}</div>
        </div>
      </motion.button>
    </div>
  );
}
