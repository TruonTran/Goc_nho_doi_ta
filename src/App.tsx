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
import FanMenu from "./components/FanMenu";
import {
  Clock,
  Image,
  Film,
  Heart,
  Mail,
  MapPin,
  MessageCircleHeart,
  HandHeart,
  Sparkles,
} from "lucide-react";

const SECTIONS = [
  { id: "counter", label: "Đếm thời gian", icon: Clock },
  { id: "vent", label: "Tâm sự", icon: MessageCircleHeart },
  { id: "wheel", label: "Làm hòa", icon: HandHeart },
  // { id: "timeline", label: "Timeline" },
  // { id: "gallery", label: "Ảnh", icon: Image },
  // { id: "videos", label: "Video", icon: Film },
  // { id: "memories", label: "Đáng nhớ", icon: Heart },
  // { id: "letter", label: "Thư tình", icon: Mail },
  // { id: "map", label: "Bản đồ", icon: MapPin },
  // { id: "ending", label: "Kết thúc", icon: Sparkles },
  // ví dụ link qua trang khác:
  { id: "letters-page", label: "Hộp thư", href: "/letters", icon: Mail },
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
            <FanMenu items={SECTIONS} radius={220} arcFrom={-10} arcTo={110} />

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
