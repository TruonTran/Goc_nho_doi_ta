import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  radius: number;
  baseAlpha: number;
  twinkleSpeed: number;
  twinklePhase: number;
  depth: number; // for parallax, 0 = far, 1 = near
  color: string;
}

const COLORS = ["#ffffff", "#e5d4ff", "#ffd6f0", "#cfe9ff"];

export default function StarField() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const scrollRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let stars: Star[] = [];
    let animationId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas!.width = width;
      canvas!.height = height;
      const count = Math.min(220, Math.floor((width * height) / 6000));
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.6 + 0.4,
        baseAlpha: Math.random() * 0.6 + 0.3,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        twinklePhase: Math.random() * Math.PI * 2,
        depth: Math.random(),
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      }));
    }

    function handleMouse(e: MouseEvent) {
      mouseRef.current = {
        x: (e.clientX / width - 0.5) * 2,
        y: (e.clientY / height - 0.5) * 2,
      };
    }

    function handleScroll() {
      scrollRef.current = window.scrollY;
    }

    let t = 0;
    function draw() {
      t += 1;
      ctx!.clearRect(0, 0, width, height);

      // soft nebula glow blobs
      const grad1 = ctx!.createRadialGradient(width * 0.2, height * 0.25, 0, width * 0.2, height * 0.25, width * 0.5);
      grad1.addColorStop(0, "rgba(180,140,255,0.12)");
      grad1.addColorStop(1, "rgba(180,140,255,0)");
      ctx!.fillStyle = grad1;
      ctx!.fillRect(0, 0, width, height);

      const grad2 = ctx!.createRadialGradient(width * 0.8, height * 0.7, 0, width * 0.8, height * 0.7, width * 0.5);
      grad2.addColorStop(0, "rgba(255,143,214,0.10)");
      grad2.addColorStop(1, "rgba(255,143,214,0)");
      ctx!.fillStyle = grad2;
      ctx!.fillRect(0, 0, width, height);

      for (const s of stars) {
        const parallaxX = mouseRef.current.x * s.depth * 14;
        const parallaxY = mouseRef.current.y * s.depth * 14 + (scrollRef.current * s.depth * 0.02) % height;
        const alpha = s.baseAlpha * (0.6 + 0.4 * Math.sin(t * s.twinkleSpeed + s.twinklePhase));
        ctx!.beginPath();
        const px = s.x + parallaxX;
        let py = (s.y + parallaxY) % height;
        if (py < 0) py += height;
        ctx!.arc(px, py, s.radius, 0, Math.PI * 2);
        ctx!.fillStyle = s.color;
        ctx!.globalAlpha = alpha;
        ctx!.fill();
      }
      ctx!.globalAlpha = 1;

      animationId = requestAnimationFrame(draw);
    }

    resize();
    draw();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handleMouse);
    window.addEventListener("scroll", handleScroll);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouse);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 pointer-events-none"
      style={{
        background:
          "radial-gradient(ellipse at top, #1a0b2e 0%, #0b0a1f 55%, #05040d 100%)",
      }}
      aria-hidden="true"
    />
  );
}
