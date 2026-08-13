import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface FanMenuItem {
  id: string;
  label: string;
  icon?: LucideIcon;
  /** Nếu có href -> điều hướng / mở link. Nếu không -> cuộn tới phần tử id trong trang. */
  href?: string;
  /** Mở href ở tab mới (dùng cho link ngoài trang) */
  external?: boolean;
}

interface Props {
  items: FanMenuItem[];
  /** Góc bắt đầu/kết thúc (độ), bị kẹp trong [0, 90]. 0 = ngang sang phải, 90 = thẳng lên. */
  arcFrom?: number;
  arcTo?: number;
  /** Bán kính (px) trên desktop. Trên màn hình nhỏ sẽ tự co lại. */
  radius?: number;
}

const BUTTON_SIZE = 44; // px, phải khớp với style width/height bên dưới

export default function FanMenu({
  items,
  arcFrom = 0,
  arcTo = 90,
  radius = 190,
}: Props) {
  const [open, setOpen] = useState(false);
  const [viewport, setViewport] = useState({ w: 1024, h: 768 });
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onResize() {
      setViewport({ w: window.innerWidth, h: window.innerHeight });
    }
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onEsc);
    };
  }, []);

  function handleSelect(item: FanMenuItem) {
    if (!item.href) {
      document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth" });
    }
    setOpen(false);
  }

  const safeArcFrom = Math.min(90, Math.max(0, arcFrom));
  const safeArcTo = Math.min(90, Math.max(0, arcTo));

  // Bán kính thực tế: co lại trên màn hình nhỏ, và luôn đủ xa nhau để không chồng chéo
  const isSmallScreen = viewport.w < 640;
  const arcSpanRad = ((safeArcTo - safeArcFrom) * Math.PI) / 180;
  const minRadiusForSpacing =
    items.length > 1 && arcSpanRad > 0
      ? ((items.length - 1) * (BUTTON_SIZE + 14)) / arcSpanRad
      : 0;
  const maxRadiusByViewport = Math.max(
    120,
    Math.min(viewport.w, viewport.h) - 160
  );
  const effectiveRadius = Math.min(
    isSmallScreen ? Math.min(radius, 140) : radius,
    Math.max(minRadiusForSpacing, isSmallScreen ? 120 : 150),
    maxRadiusByViewport
  );

  function polarOffset(index: number, total: number) {
    const t = total === 1 ? 0.5 : index / (total - 1);
    const angleDeg = safeArcFrom + t * (safeArcTo - safeArcFrom);
    const angleRad = (angleDeg * Math.PI) / 180;
    return {
      x: effectiveRadius * Math.cos(angleRad),
      y: -effectiveRadius * Math.sin(angleRad), // âm để xoè lên trên
    };
  }

  return (
    <div
      ref={wrapRef}
      className="fixed left-4 sm:left-6 bottom-5 sm:bottom-8 z-40"
    >
      {/* Các nút con xoè theo hình cánh quạt lên trên-phải từ góc trái */}
      <AnimatePresence>
        {open &&
          items.map((item, i) => {
            const { x, y } = polarOffset(i, items.length);
            const Icon = item.icon;
            const content = (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: 0, y: 0, scale: 0.3 }}
                animate={{ opacity: 1, x, y, scale: 1 }}
                exit={{ opacity: 0, x: 0, y: 0, scale: 0.3 }}
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 22,
                  delay: i * 0.03,
                }}
                className="absolute left-0 bottom-0 flex items-center justify-start gap-2"
              >
                <button
                  onClick={() => handleSelect(item)}
                  title={item.label}
                  aria-label={item.label}
                  style={{ width: BUTTON_SIZE, height: BUTTON_SIZE }}
                  className="flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-neon-violet to-neon-pink text-white shadow-glow-pink transition-transform hover:scale-110"
                >
                  {Icon ? <Icon size={18} /> : <span className="h-2 w-2 rounded-full bg-white" />}
                </button>
                {/* <span className="whitespace-nowrap rounded-full bg-midnight-2/90 border border-white/10 px-2.5 py-1 text-[11px] sm:text-xs text-white/80 shadow-glow-violet backdrop-blur-sm">
                  {item.label}
                </span> */}
              </motion.div>
            );

            return item.href ? (
              <a
                key={item.id}
                href={item.href}
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noopener noreferrer" : undefined}
                onClick={() => setOpen(false)}
                className="contents"
              >
                {content}
              </a>
            ) : (
              content
            );
          })}
      </AnimatePresence>

      {/* Nút trung tâm để mở/đóng cánh quạt */}
      <motion.button
        onClick={() => setOpen((v) => !v)}
        whileTap={{ scale: 0.9 }}
        animate={{ rotate: open ? 45 : 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        aria-expanded={open}
        aria-label="Mở menu"
        className="relative flex h-12 w-12 items-center justify-center rounded-full bg-white/10 border border-white/20 text-white shadow-glow-blue backdrop-blur-md hover:shadow-glow-pink"
      >
        <Sparkles size={20} className={open ? "text-neon-pink" : "text-neon-blue"} />
        {!open && <span className="absolute inset-0 rounded-full pulse-ring" />}
      </motion.button>
    </div>
  );
}