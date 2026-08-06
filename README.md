# 💜 WeB dành cho Chị — Website kỷ niệm tình yêu

Website kỷ niệm tình yêu lấy cảm hứng vũ trụ, xây bằng **React + TypeScript + Vite + Tailwind CSS + Framer Motion**.

## Cài đặt & chạy thử

```bash
npm install
npm run dev
```

Mở trình duyệt tại địa chỉ hiển thị trong terminal (thường là `http://localhost:5173`).

## Build production

```bash
npm run build
npm run preview
```

Kết quả build nằm trong thư mục `dist/`, có thể deploy lên Vercel, Netlify, GitHub Pages...

## 📁 Cấu trúc dữ liệu — chỉnh sửa nội dung ở đây, KHÔNG cần sửa code

Tất cả nội dung của website được tách riêng trong `src/data/`, chỉ cần sửa các file này để cá nhân hoá:

| File | Nội dung |
|---|---|
| `src/data/couple.ts` | Tên hai người, ảnh đại diện, ngày bắt đầu yêu |
| `src/data/timeline.ts` | Các cột mốc kỷ niệm |
| `src/data/gallery.ts` | Ảnh trong thư viện |
| `src/data/videos.ts` | Video kỷ niệm |
| `src/data/memories.ts` | Những điều đáng nhớ (thẻ 3D) |
| `src/data/locations.ts` | Địa điểm trên bản đồ tình yêu |
| `src/data/letter.ts` | Nội dung lá thư tình |

## 🖼️ Thêm ảnh / video / nhạc của hai bạn

Đặt file vào thư mục `public/` theo cấu trúc:

```
public/
  images/
    avatar-a.jpg          (ảnh đại diện người A)
    avatar-b.jpg          (ảnh đại diện người B)
    timeline-1.jpg ... 5  (ảnh timeline)
    gallery/
      photo-1.jpg ...     (ảnh thư viện)
    videos/
      thumb-1.jpg ...     (ảnh thumbnail cho video)
  videos/
    video-1.mp4 ...       (video kỷ niệm)
  audio/
    background-music.mp3 (nhạc nền)
```

Nếu chưa có ảnh, giao diện vẫn hoạt động bình thường (ảnh lỗi sẽ tự ẩn/thay bằng nền gradient), bạn có thể thêm dần sau.

## ✨ Các phần chính

1. Màn hình chào — avatar, tên, trái tim phát sáng, nút "Bắt đầu hành trình"
2. Bộ đếm thời gian yêu nhau — realtime, cập nhật từng giây
3. Timeline kỷ niệm — modal chi tiết khi bấm vào từng mốc
4. Thư viện ảnh — masonry, lightbox toàn màn hình
5. Thư viện video — player inline
6. Những điều đáng nhớ — thẻ hover 3D tilt
7. Lá thư tình — hiệu ứng đánh máy khi cuộn tới
8. Bản đồ tình yêu — marker + mô tả địa điểm
9. Nhạc nền — nút bật/tắt, không tự phát
10. Kết thúc hành trình — lời cảm ơn + hiệu ứng hạt sáng bay lên

## 🎨 Công nghệ

- React 18 + TypeScript + Vite
- Tailwind CSS (tuỳ biến theme: tím, xanh đêm, hồng pastel, glow neon)
- Framer Motion cho toàn bộ animation & parallax
- Canvas 2D cho nền sao động (StarField)
- lucide-react cho icon hiện đại

## 📱 Responsive

Toàn bộ layout dùng Tailwind responsive breakpoints (`sm`, `md`, `lg`), đã tối ưu cho điện thoại, tablet và desktop.
