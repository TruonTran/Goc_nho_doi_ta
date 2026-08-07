import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, X } from "lucide-react";
import { videos } from "../data/videos";
import type { VideoItem } from "../types";
import UploadTile from "./UploadTile";
import { useLocalMedia } from "../hooks/useLocalMedia";
import { getCloudinaryVideoThumbnail, isCloudinaryConfigured, uploadToCloudinary } from "../lib/cloudinary";

function fileNameToTitle(name: string) {
  return name.replace(/\.[^/.]+$/, "").replace(/[_-]+/g, " ").trim();
}

export default function VideoGallery() {
  const [active, setActive] = useState<VideoItem | null>(null);
  const [videoUploadFailed, setVideoUploadFailed] = useState(false);
  const { items: uploaded, addItem, removeItem } = useLocalMedia<VideoItem>("uploaded-gallery-videos");

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

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {isCloudinaryConfigured && !videoUploadFailed && (
          <UploadTile
            accept="video/*"
            label="Thêm video"
            className="h-44"
            onUpload={handleUpload}
            onError={() => setVideoUploadFailed(true)}
          />
        )}

        {allVideos.map((v, i) => {
          const isUploaded = v.id.startsWith("u-");
          return (
            <motion.div
              key={v.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              whileHover={{ y: -6 }}
              className="glass-card relative rounded-2xl overflow-hidden text-left group"
            >
              <button onClick={() => setActive(v)} className="block w-full text-left">
                <div className="relative h-44 w-full bg-gradient-to-br from-neon-violet/30 to-neon-pink/20">
                  <img
                    src={v.thumbnail}
                    alt={v.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display = "none";
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition">
                    <span className="w-14 h-14 rounded-full bg-white/20 backdrop-blur flex items-center justify-center shadow-glow-pink group-hover:scale-110 transition">
                      <Play size={22} fill="white" />
                    </span>
                  </div>
                  {v.duration && (
                    <span className="absolute bottom-2 right-2 text-[11px] bg-black/60 px-2 py-0.5 rounded-full">
                      {v.duration}
                    </span>
                  )}
                </div>
                {/* <div className="p-4">
                  <h3 className="font-medium text-sm sm:text-base">{v.title}</h3>
                </div> */}
              </button>

              {isUploaded && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeItem(v.id);
                  }}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 hover:bg-black/80 opacity-0 group-hover:opacity-100 transition"
                  aria-label="Xoá video"
                >
                  <X size={14} />
                </button>
              )}
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence>
        {active && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActive(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-3xl rounded-2xl overflow-hidden bg-black"
            >
              <button
                onClick={() => setActive(null)}
                className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20"
                aria-label="Đóng"
              >
                <X size={20} />
              </button>
              <video src={active.src} controls autoPlay className="w-full max-h-[75vh] bg-black" />
              {/* <div className="p-4 bg-midnight-2">
                <p className="text-sm sm:text-base">{active.title}</p>
              </div> */}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}