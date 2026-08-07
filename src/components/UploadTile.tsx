import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Loader2, Plus, AlertCircle } from "lucide-react";
import { isCloudinaryConfigured } from "../lib/cloudinary";

interface Props {
  accept: string;
  label: string;
  className?: string;
  onUpload: (file: File, onProgress: (percent: number) => void) => Promise<void>;
}

export default function UploadTile({ accept, label, className = "", onUpload }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File | undefined) {
    if (!file || !isCloudinaryConfigured) return;
    setError(null);
    setProgress(0);
    try {
      await onUpload(file, setProgress);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload thất bại.");
    } finally {
      setProgress(null);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  const busy = progress !== null;
  const disabled = busy || !isCloudinaryConfigured;

  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      onClick={() => !disabled && inputRef.current?.click()}
      disabled={disabled}
      title={!isCloudinaryConfigured ? "Chưa cấu hình Cloudinary — xem file .env.example" : undefined}
      className={`glass-card relative overflow-hidden rounded-2xl border-2 border-dashed border-white/15 transition flex flex-col items-center justify-center gap-2 text-white/70 ${
        isCloudinaryConfigured ? "hover:border-neon-pink/50 hover:text-white" : "opacity-40 cursor-not-allowed"
      } ${className}`}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      {busy ? (
        <>
          <Loader2 size={26} className="animate-spin text-neon-pink" />
          <span className="text-xs sm:text-sm">Đang tải lên… {progress}%</span>
        </>
      ) : error ? (
        <>
          <AlertCircle size={24} className="text-red-400" />
          <span className="text-[11px] sm:text-xs text-red-300 text-center px-3">{error}</span>
        </>
      ) : (
        <>
          <span className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center group-hover:scale-110 transition">
            <Plus size={22} />
          </span>
          <span className="text-xs sm:text-sm text-center px-2">{label}</span>
          {!isCloudinaryConfigured && (
            <span className="text-[10px] text-white/40 text-center px-3">
              (chưa cấu hình Cloudinary — xem file .env.example)
            </span>
          )}
        </>
      )}
    </motion.button>
  );
}