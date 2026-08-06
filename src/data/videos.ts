import type { VideoItem } from "../types";

// 👉 Đặt file video trong /public/videos/ và ảnh thumbnail trong /public/images/videos/
export const videos: VideoItem[] = [
  {
    id: "v1",
    title: "Lần đầu gặp nhau",
    src: "/videos/video-1.mp4",
    thumbnail: "/images/timeline/lan_hai.jpg",
  },
  {
    id: "v2",
    title: "Một ngày bình thường bên nhau",
    src: "/videos/video-2.mp4",
    thumbnail: "/images/timeline/lan_hai.jpg",
  },
  {
    id: "v3",
    title: "Một ngày bình thường bên nhau",
    src: "/videos/video-3.mp4",
    thumbnail: "/images/timeline/lan_hai.jpg",
  },
  {
    id: "v4",
    title: "Một ngày bình thường bên nhau",
    src: "/videos/video-4.mp4",
    thumbnail: "/images/timeline/lan_hai.jpg",
  }
];
