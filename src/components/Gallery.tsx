import { useState } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { gallery } from "../data/gallery";
import Lightbox from "./Lightbox";
import UploadTile from "./UploadTile";
import { useLocalMedia } from "../hooks/useLocalMedia";
import { isCloudinaryConfigured, uploadToCloudinary } from "../lib/cloudinary";
import type { GalleryPhoto } from "../types";

const spanClass: Record<string, string> = {
  sm: "row-span-1",
  md: "row-span-2",
  lg: "row-span-3",
};

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

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 [grid-auto-rows:110px]">
        {isCloudinaryConfigured && !photoUploadFailed && (
          <UploadTile
            accept="image/*"
            label="Thêm ảnh"
            className="row-span-1"
            onUpload={handleUpload}
            onError={() => setPhotoUploadFailed(true)}
          />
        )}

        {allPhotos.map((photo, i) => {
          const isUploaded = photo.id.startsWith("u-");
          return (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: (i % 8) * 0.05 }}
              whileHover={{ scale: 1.02 }}
              className={`relative overflow-hidden rounded-2xl group ${spanClass[photo.size ?? "sm"]}`}
            >
              <button onClick={() => setActiveIndex(i)} className="w-full h-full">
                <img
                  src={photo.src}
                  alt={photo.caption ?? ""}
                  className="w-full h-full object-cover transition duration-500 group-hover:scale-110 group-hover:blur-[1px]"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.background =
                      "linear-gradient(135deg,#b48cff40,#ff8fd640)";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition duration-300 flex items-end p-3">
                  {photo.caption && (
                    <span className="text-white text-xs sm:text-sm">{photo.caption}</span>
                  )}
                </div>
              </button>

              {isUploaded && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeItem(photo.id);
                  }}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 hover:bg-black/80 opacity-0 group-hover:opacity-100 transition"
                  aria-label="Xoá ảnh"
                >
                  <X size={14} />
                </button>
              )}
            </motion.div>
          );
        })}
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