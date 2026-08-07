import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { gallery } from "../data/gallery";
import Lightbox from "./Lightbox";
import UploadTile from "./UploadTile";
import { useLocalMedia } from "../hooks/useLocalMedia";
import { isCloudinaryConfigured, uploadToCloudinary } from "../lib/cloudinary";
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
  const { ref, handleMouseMove, handleMouseLeave } = useTilt<HTMLDivElement>(7);

  return (
    <motion.div
      initial={{ opacity: 0, y: 36, scale: 0.9, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay: (index % 10) * 0.05, ease: [0.16, 1, 0.3, 1] }}
      className="mb-4 sm:mb-5 break-inside-avoid"
    >
      {/* Lớp ngoài: trôi bồng bềnh liên tục, tạo cảm giác lơ lửng */}
      <div
        className="float-idle"
        style={{
          animationDelay: `${(index % 6) * 0.35}s`,
          animationDuration: `${5.5 + (index % 4) * 0.6}s`,
        }}
      >
        {/* Lớp trong: nghiêng theo con trỏ + glow mềm */}
        <div
          ref={ref}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="tilt-card glow-soft group relative overflow-hidden rounded-3xl"
        >
          <button onClick={onOpen} className="relative block w-full">
            <motion.img
              layoutId={`photo-${photo.id}`}
              src={photo.src}
              alt={photo.caption ?? ""}
              className="w-full h-auto object-cover rounded-3xl transition duration-700 group-hover:brightness-[1.08]"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.background =
                  "linear-gradient(135deg,#b48cff40,#ff8fd640)";
              }}
            />

            {/* Ánh sáng theo con trỏ */}
            <div
              className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{
                background:
                  "radial-gradient(220px circle at var(--glow-x,50%) var(--glow-y,50%), rgba(255,255,255,0.25), transparent 65%)",
              }}
            />

            {/* Quét sáng shimmer */}
            <div className="shimmer-overlay rounded-3xl" />

            <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-black/75 via-black/5 to-transparent opacity-0 group-hover:opacity-100 transition duration-400 flex items-end p-4">
              {photo.caption && (
                <span className="text-white text-xs sm:text-sm translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
                  {photo.caption}
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
              aria-label="Xoá ảnh"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function Gallery() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [photoUploadFailed, setPhotoUploadFailed] = useState(false);
  const { items: uploaded, addItem, removeItem } = useLocalMedia<GalleryPhoto>("uploaded-gallery-photos");

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
    <section className="relative py-24 px-6 max-w-6xl mx-auto">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="section-title text-3xl sm:text-4xl md:text-5xl text-center mb-14 text-gradient"
      >
        Thư viện ảnh
      </motion.h2>

      <div
        className="columns-2 sm:columns-3 md:columns-4 lg:columns-4 gap-4 sm:gap-5"
        style={{ perspective: 1400 }}
      >
        {isCloudinaryConfigured && !photoUploadFailed && (
          <div className="mb-4 sm:mb-5 break-inside-avoid">
            <UploadTile
              accept="image/*"
              label="Thêm ảnh"
              className="h-40 w-full"
              onUpload={handleUpload}
              onError={() => setPhotoUploadFailed(true)}
            />
          </div>
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