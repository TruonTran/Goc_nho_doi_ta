export interface Couple {
  personA: {
    name: string;
    avatar: string;
  };
  personB: {
    name: string;
    avatar: string;
  };
  loveStartDate: string; // ISO date string, e.g. "2022-03-14T00:00:00"
  coupleTitle: string;
}

export interface TimelineMilestone {
  id: string;
  date: string; // human readable, e.g. "14/03/2022"
  title: string;
  description: string;
  image: string;
  icon?: string;
}

export interface GalleryPhoto {
  id: string;
  src: string;
  caption?: string;
  size?: "sm" | "md" | "lg";
}

export interface VideoItem {
  id: string;
  title: string;
  src: string;
  thumbnail: string;
  duration?: string;
}

export interface MemoryCard {
  id: string;
  title: string;
  description: string;
  emoji: string;
}

export interface LoveLocation {
  id: string;
  name: string;
  description: string;
  x: number; // percentage position on map (0-100)
  y: number; // percentage position on map (0-100)
  date?: string;
}

export interface LetterData {
  title: string;
  paragraphs: string[];
  signature: string;
}
