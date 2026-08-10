import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, X } from "lucide-react";
import { videos } from "../data/videos";
import type { VideoItem } from "../types";
import UploadTile from "./UploadTile";
import { useLocalMedia } from "../hooks/useLocalMedia";
import { getCloudinaryVideoThumbnail, isCloudinaryConfigured, uploadToCloudinary } from "../lib/cloudinary";
import { isSupabaseConfigured } from "../lib/supabase";

// Cloudinary chặn cứng file > 100MB ở tầng account (không né được dù chia chunk).
// Báo lỗi ngay khi chọn file thay vì để người dùng chờ upload rồi mới biết fail.
const MAX_VIDEO_SIZE_MB = 95;

function fileNameToTitle(name: string) {
  return name.replace(/\.[^/.]+$/, "").replace(/[_-]+/g, " ").trim();
}

/** Nghiêng thẻ video theo vị trí con trỏ để tạo hiệu ứng 3D, không gây re-render. */
function useTilt<T extends HTMLElement>(strength = 8) {
  const ref = useRef<T>(null);

  function handleMouseMove(e: React.MouseEvent<T>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(1000px) rotateX(${(-py * strength).toFixed(2)}deg) rotateY(${(
      px * strength
    ).toFixed(2)}deg) translateY(-6px)`;
    el.style.setProperty("--glow-x", `${(px + 0.5) * 100}%`);
    el.style.setProperty("--glow-y", `${(py + 0.5) * 100}%`);
  }

  function handleMouseLeave() {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)";
  }

  return { ref, handleMouseMove, handleMouseLeave };
}

function VideoCard({
  video,
  index,
  isUploaded,
  onOpen,
  onRemove,
}: {
  video: VideoItem;
  index: number;
  isUploaded: boolean;
  onOpen: () => void;
  onRemove: () => void;
}) {
  const { ref, handleMouseMove, handleMouseLeave } = useTilt<HTMLDivElement>(7);

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 26, scale: 0.92, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="tilt-card glow-border glass-card relative rounded-2xl overflow-hidden text-left group"
    >
      <button onClick={onOpen} className="block w-full text-left">
        <div className="relative h-44 w-full bg-gradient-to-br from-neon-violet/30 to-neon-pink/20 overflow-hidden">
          <motion.img
            layoutId={`video-thumb-${video.id}`}
            src={video.thumbnail}
            alt={video.title}
            className="w-full h-full object-cover transition duration-500 group-hover:scale-110"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = "none";
            }}
          />

          {/* Ánh sáng theo con trỏ */}
          <div
            className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              background:
                "radial-gradient(200px circle at var(--glow-x,50%) var(--glow-y,50%), rgba(255,255,255,0.22), transparent 60%)",
            }}
          />

          <div className="shimmer-overlay" />

          <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/45 transition">
            <span className="pulse-ring w-14 h-14 rounded-full bg-white/20 backdrop-blur flex items-center justify-center shadow-glow-pink group-hover:scale-125 transition-transform duration-300">
              <Play size={22} fill="white" className="translate-x-[1px]" />
            </span>
          </div>

          {video.duration && (
            <span className="absolute bottom-2 right-2 text-[11px] bg-black/60 px-2 py-0.5 rounded-full">
              {video.duration}
            </span>
          )}
        </div>
      </button>

      {isUploaded && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="absolute top-2 right-2 z-10 p-1.5 rounded-full bg-black/60 hover:bg-black/80 opacity-0 group-hover:opacity-100 transition"
          aria-label="Xoá video"
        >
          <X size={14} />
        </button>
      )}
    </motion.div>
  );
}

export default function VideoGallery() {
  const [active, setActive] = useState<VideoItem | null>(null);
  const { items: uploaded, addItem, removeItem } = useLocalMedia<VideoItem>("gallery_videos");

  const allVideos: VideoItem[] = [...uploaded, ...videos];

  async function handleUpload(file: File, onProgress: (p: number) => void) {
    const result = await uploadToCloudinary(file, "video", onProgress);
    addItem({
      id: `u-${result.publicId}`,
      title: fileNameToTitle(file.name),
      src: result.secureUrl,
      thumbnail: getCloudinaryVideoThumbnail(result.secureUrl),
    });
  }

  return (
    <section className="relative py-24 px-6 max-w-6xl mx-auto">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="section-title text-3xl sm:text-4xl md:text-5xl text-center mb-14 text-gradient"
      >
        Thư viện video
      </motion.h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6" style={{ perspective: 1400 }}>
        {isCloudinaryConfigured && isSupabaseConfigured && (
          <UploadTile
            accept="video/*"
            label="Thêm video"
            className="h-44"
            onUpload={handleUpload}
            maxSizeMB={MAX_VIDEO_SIZE_MB}
          />
        )}

        {allVideos.map((v, i) => (
          <VideoCard
            key={v.id}
            video={v}
            index={i}
            isUploaded={v.id.startsWith("u-")}
            onOpen={() => setActive(v)}
            onRemove={() => removeItem(v.id)}
          />
        ))}
      </div>

      <AnimatePresence>
        {active && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActive(null)}
          >
            {/* Nền glow mờ theo thumbnail video */}
            <motion.div
              className="absolute inset-0 -z-10 scale-110"
              style={{
                backgroundImage: `url(${active.thumbnail})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                filter: "blur(70px) saturate(1.5)",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
            />

            <motion.div
              layoutId={`video-thumb-${active.id}`}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-3xl rounded-2xl overflow-hidden bg-black shadow-glow-violet"
            >
              <button
                onClick={() => setActive(null)}
                className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 hover:rotate-90 transition-all duration-300"
                aria-label="Đóng"
              >
                <X size={20} />
              </button>
              <motion.video
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.35 }}
                src={active.src}
                controls
                autoPlay
                className="w-full max-h-[75vh] bg-black"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}