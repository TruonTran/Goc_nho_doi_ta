/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        midnight: "#0b0a1f",
        "midnight-2": "#150e2e",
        violet: {
          950: "#1a0b2e",
        },
        neon: {
          pink: "#ff8fd6",
          violet: "#b48cff",
          blue: "#7dd3ff",
        },
      },
      fontFamily: {
        display: ["Playfair Display", "serif"],
        body: ["Poppins", "sans-serif"],
      },
      boxShadow: {
        "glow-pink": "0 0 25px rgba(255,143,214,0.55)",
        "glow-violet": "0 0 25px rgba(180,140,255,0.55)",
        "glow-blue": "0 0 25px rgba(125,211,255,0.45)",
      },
      keyframes: {
        twinkle: {
          "0%,100%": { opacity: 0.2, transform: "scale(0.8)" },
          "50%": { opacity: 1, transform: "scale(1.2)" },
        },
        floaty: {
          "0%,100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-14px)" },
        },
        heartbeat: {
          "0%,100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.12)" },
        },
        "gradient-x": {
          "0%,100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
      },
      animation: {
        twinkle: "twinkle 3s ease-in-out infinite",
        floaty: "floaty 6s ease-in-out infinite",
        heartbeat: "heartbeat 1.6s ease-in-out infinite",
        "gradient-x": "gradient-x 8s ease infinite",
      },
    },
  },
  plugins: [],
};
