import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Heart, X } from "lucide-react";
import { gallery } from "../data/gallery";
import Lightbox from "./Lightbox";
import UploadTile from "./UploadTile";
import { useLocalMedia } from "../hooks/useLocalMedia";
import { isCloudinaryConfigured, uploadToCloudinary } from "../lib/cloudinary";
import { isSupabaseConfigured } from "../lib/supabase";
import type { GalleryPhoto } from "../types";

/** Nghiêng nhẹ thẻ ảnh theo con trỏ để tạo chiều sâu, không gây re-render. */
function useTilt<T extends HTMLElement>(strength = 7) {
  const ref = useRef<T>(null);

  function handleMouseMove(e: React.MouseEvent<T>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(1000px) rotateX(${(-py * strength).toFixed(2)}deg) rotateY(${(
      px * strength
    ).toFixed(2)}deg) scale3d(1.03,1.03,1.03)`;
    el.style.setProperty("--glow-x", `${(px + 0.5) * 100}%`);
    el.style.setProperty("--glow-y", `${(py + 0.5) * 100}%`);
  }

  function handleMouseLeave() {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)";
  }

  return { ref, handleMouseMove, handleMouseLeave };
}

function PhotoCard({
  photo,
  index,
  isUploaded,
  onOpen,
  onRemove,
}: {
  photo: GalleryPhoto;
  index: number;
  isUploaded: boolean;
  onOpen: () => void;
  onRemove: () => void;
}) {
  const { ref, handleMouseMove, handleMouseLeave } = useTilt<HTMLDivElement>(6);
  const tiltAngle = (index % 2 === 0 ? -1 : 1) * (1.5 + (index % 3));

  return (
    <motion.div
      initial={{ opacity: 0, y: 36, scale: 0.9, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay: (index % 10) * 0.05, ease: [0.16, 1, 0.3, 1] }}
      className="group/tile"
    >
      {/* Lớp ngoài: trôi bồng bềnh liên tục + nghiêng nhẹ như polaroid rải trên bàn */}
      <div
        className="float-idle transition-transform duration-500 group-hover/tile:[transform:rotate(0deg)]"
        style={{
          animationDelay: `${(index % 6) * 0.35}s`,
          animationDuration: `${5.5 + (index % 4) * 0.6}s`,
          transform: `rotate(${tiltAngle}deg)`,
        }}
      >
        {/* Viền gradient hồng-tím mềm bao quanh, như khung ảnh tình yêu */}
        <div className="glow-soft rounded-[26px] p-[3px] bg-gradient-to-br from-neon-pink/70 via-neon-violet/50 to-neon-blue/60">
          {/* Lớp trong: nghiêng theo con trỏ + glow mềm */}
          <div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="tilt-card group relative aspect-[4/5] overflow-hidden rounded-[23px] bg-midnight-2"
          >
            <button onClick={onOpen} className="relative block h-full w-full">
              <motion.img
                layoutId={`photo-${photo.id}`}
                src={photo.src}
                alt={photo.caption ?? ""}
                className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.06] group-hover:brightness-[1.08]"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.background =
                    "linear-gradient(135deg,#b48cff40,#ff8fd640)";
                }}
              />

              {/* Ánh sáng theo con trỏ */}
              <div
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{
                  background:
                    "radial-gradient(220px circle at var(--glow-x,50%) var(--glow-y,50%), rgba(255,255,255,0.25), transparent 65%)",
                }}
              />

              {/* Quét sáng shimmer */}
              <div className="shimmer-overlay" />

              {/* Viền tối nhẹ để ảnh nổi bật, luôn hiện để card trông đều & sang hơn */}
              <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]" />

              {/* Trái tim nhỏ ở góc, luôn nhấp nháy dịu dàng */}
              <div className="absolute left-2.5 top-2.5 flex h-7 w-7 animate-heartbeat items-center justify-center rounded-full bg-black/40 backdrop-blur-sm">
                <Heart size={13} className="fill-neon-pink text-neon-pink" />
              </div>

              <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/85 via-black/10 to-transparent p-3.5 opacity-0 transition duration-400 group-hover:opacity-100 sm:p-4">
                <span className="flex items-center gap-1.5 font-display text-xs italic text-white translate-y-1 transition-transform duration-300 group-hover:translate-y-0 sm:text-sm">
                  <Heart size={12} className="shrink-0 fill-neon-pink text-neon-pink" />
                  {photo.caption || "Khoảnh khắc của chúng mình"}
                </span>
              </div>
            </button>

            {isUploaded && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove();
                }}
                className="absolute right-2 top-2 z-10 rounded-full bg-black/60 p-1.5 opacity-0 transition hover:bg-neon-pink/80 group-hover:opacity-100"
                aria-label="Xoá ảnh"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Gallery() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [photoUploadFailed, setPhotoUploadFailed] = useState(false);
  const { items: uploaded, addItem, removeItem } = useLocalMedia<GalleryPhoto>("gallery_photos");

  const allPhotos: GalleryPhoto[] = [...uploaded, ...gallery];

  async function handleUpload(file: File, onProgress: (p: number) => void) {
    const result = await uploadToCloudinary(file, "image", onProgress);
    addItem({
      id: `u-${result.publicId}`,
      src: result.secureUrl,
      caption: "",
      size: "md",
    });
  }

  return (
    <section className="relative overflow-hidden py-24 px-6 max-w-6xl mx-auto">
      {/* Ánh sáng nền dịu + trái tim lơ lửng cho không khí lãng mạn */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/4 top-10 h-72 w-72 rounded-full bg-neon-pink/10 blur-[100px]" />
        <div className="absolute right-1/4 bottom-10 h-72 w-72 rounded-full bg-neon-violet/10 blur-[100px]" />
        {[
          { top: "12%", left: "6%", size: 16, delay: "0s", dur: "7s" },
          { top: "70%", left: "10%", size: 12, delay: "1.2s", dur: "8s" },
          { top: "20%", left: "92%", size: 14, delay: "0.6s", dur: "6.5s" },
          { top: "78%", left: "90%", size: 18, delay: "1.8s", dur: "7.5s" },
        ].map((h, i) => (
          <Heart
            key={i}
            size={h.size}
            className="absolute animate-floaty fill-neon-pink/20 text-neon-pink/20"
            style={{ top: h.top, left: h.left, animationDelay: h.delay, animationDuration: h.dur }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="mb-4 flex items-center justify-center gap-3"
      >
        <span className="h-px w-10 bg-gradient-to-r from-transparent to-neon-pink/60 sm:w-16" />
        <Heart size={18} className="fill-neon-pink text-neon-pink" />
        <span className="h-px w-10 bg-gradient-to-l from-transparent to-neon-pink/60 sm:w-16" />
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.1 }}
        className="section-title text-3xl sm:text-4xl md:text-5xl text-center mb-3 text-gradient"
      >
        Thư viện ảnh
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="mx-auto mb-14 max-w-md text-center text-sm text-white/50"
      >
        Mỗi tấm ảnh là một khoảnh khắc chúng mình đã cùng nhau lưu giữ
      </motion.p>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4">
        {isCloudinaryConfigured && isSupabaseConfigured && !photoUploadFailed && (
          <UploadTile
            accept="image/*"
            label="Thêm ảnh"
            className="aspect-[4/5] w-full rounded-[26px]"
            onUpload={handleUpload}
            onError={() => setPhotoUploadFailed(true)}
          />
        )}

        {allPhotos.map((photo, i) => (
          <PhotoCard
            key={photo.id}
            photo={photo}
            index={i}
            isUploaded={photo.id.startsWith("u-")}
            onOpen={() => setActiveIndex(i)}
            onRemove={() => removeItem(photo.id)}
          />
        ))}
      </div>

      <Lightbox
        photos={allPhotos}
        index={activeIndex}
        onClose={() => setActiveIndex(null)}
        onNavigate={setActiveIndex}
      />
    </section>
  );
}