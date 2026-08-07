import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import StarField from "./components/StarField";
import WelcomeScreen from "./components/WelcomeScreen";
import LoveCounter from "./components/LoveCounter";
import Timeline from "./components/Timeline";
import Gallery from "./components/Gallery";
import VideoGallery from "./components/VideoGallery";
import MemoryCards from "./components/MemoryCards";
import LoveLetter from "./components/LoveLetter";
import LoveMap from "./components/LoveMap";
import VentCorner from "./components/VentCorner";
import PeaceWheel from "./components/PeaceWheel";
import MusicPlayer from "./components/MusicPlayer";
import Ending from "./components/Ending";
import SectionNav from "./components/SectionNav";
import SplashCursor from "./components/SplashCursor";

const SECTIONS = [
  { id: "counter", label: "Đếm thời gian" },
  { id: "timeline", label: "Timeline" },
  { id: "gallery", label: "Ảnh" },
  { id: "videos", label: "Video" },
  { id: "memories", label: "Đáng nhớ" },
  { id: "letter", label: "Thư tình" },
  { id: "map", label: "Bản đồ" },
  { id: "vent", label: "Tâm sự" },
  { id: "wheel", label: "Làm hòa" },
  { id: "ending", label: "Kết thúc" },
];

export default function App() {
  const [started, setStarted] = useState(false);

  return (
    <div className="relative min-h-screen">
      <StarField />

      <SplashCursor
        DENSITY_DISSIPATION={3.5}
        VELOCITY_DISSIPATION={2}
        PRESSURE={0.1}
        CURL={3}
        SPLAT_RADIUS={0.2}
        SPLAT_FORCE={6000}
        COLOR_UPDATE_SPEED={10}
        SHADING
        RAINBOW_MODE={false}
        COLOR="#A855F7"
      />

      <AnimatePresence mode="wait">
        {!started ? (
          <WelcomeScreen key="welcome" onStart={() => setStarted(true)} />
        ) : (
          <motion.main
            key="journey"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9 }}
          >
            <SectionNav sections={SECTIONS} />

            <div id="counter">
              <LoveCounter />
            </div>
            <div id="timeline">
              <Timeline />
            </div>
            <div id="gallery">
              <Gallery />
            </div>
            <div id="videos">
              <VideoGallery />
            </div>
            <div id="memories">
              <MemoryCards />
            </div>
            <div id="letter">
              <LoveLetter />
            </div>
            <div id="map">
              <LoveMap />
            </div>
            <div id="vent">
              <VentCorner />
            </div>
            <div id="wheel">
              <PeaceWheel />
            </div>
            <div id="ending">
              <Ending />
            </div>

            <MusicPlayer />
          </motion.main>
        )}
      </AnimatePresence>
    </div>
  );
}
