import { useState } from "react";
import { motion } from "framer-motion";
import { gallery } from "../data/gallery";
import Lightbox from "./Lightbox";

const spanClass: Record<string, string> = {
  sm: "row-span-1",
  md: "row-span-2",
  lg: "row-span-3",
};

export default function Gallery() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

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
        {gallery.map((photo, i) => (
          <motion.button
            key={photo.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: (i % 8) * 0.05 }}
            whileHover={{ scale: 1.02 }}
            onClick={() => setActiveIndex(i)}
            className={`relative overflow-hidden rounded-2xl group ${spanClass[photo.size ?? "sm"]}`}
          >
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
          </motion.button>
        ))}
      </div>

      <Lightbox
        photos={gallery}
        index={activeIndex}
        onClose={() => setActiveIndex(null)}
        onNavigate={setActiveIndex}
      />
    </section>
  );
}
