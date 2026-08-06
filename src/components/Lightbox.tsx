import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { GalleryPhoto } from "../types";

interface Props {
  photos: GalleryPhoto[];
  index: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export default function Lightbox({ photos, index, onClose, onNavigate }: Props) {
  const photo = index !== null ? photos[index] : null;

  function prev() {
    if (index === null) return;
    onNavigate((index - 1 + photos.length) % photos.length);
  }
  function next() {
    if (index === null) return;
    onNavigate((index + 1) % photos.length);
  }

  return (
    <AnimatePresence>
      {photo && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 transition"
            aria-label="Đóng"
          >
            <X size={22} />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            className="absolute left-3 sm:left-8 p-2.5 rounded-full bg-white/10 hover:bg-white/20 transition"
            aria-label="Ảnh trước"
          >
            <ChevronLeft size={24} />
          </button>

          <motion.div
            key={photo.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
            className="max-w-3xl w-full"
          >
            <img
              src={photo.src}
              alt={photo.caption ?? ""}
              className="w-full max-h-[75vh] object-contain rounded-2xl shadow-glow-violet"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
            />
            {photo.caption && (
              <p className="text-center text-white/70 mt-4 text-sm sm:text-base">{photo.caption}</p>
            )}
          </motion.div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            className="absolute right-3 sm:right-8 p-2.5 rounded-full bg-white/10 hover:bg-white/20 transition"
            aria-label="Ảnh tiếp"
          >
            <ChevronRight size={24} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
