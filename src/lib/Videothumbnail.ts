/**
 * Chụp 1 khung hình từ file video ngay trên trình duyệt (không cần server) để dùng
 * làm thumbnail. Cần vì video upload qua Supabase Storage không có sẵn tính năng tự
 * sinh thumbnail như Cloudinary.
 *
 * Trả về null nếu trình duyệt không đọc/giải mã được video (thumbnail lúc đó sẽ rơi
 * về nền gradient mặc định đã có sẵn trong VideoCard).
 */
export function generateVideoThumbnail(file: File): Promise<File | null> {
  return new Promise((resolve) => {
    let settled = false;
    const finish = (result: File | null) => {
      if (settled) return;
      settled = true;
      URL.revokeObjectURL(objectUrl);
      resolve(result);
    };

    const objectUrl = URL.createObjectURL(file);
    const videoEl = document.createElement("video");
    videoEl.preload = "metadata";
    videoEl.muted = true;
    videoEl.playsInline = true;
    videoEl.src = objectUrl;

    // Đề phòng video lỗi/không giải mã được, tránh treo mãi.
    const timeout = setTimeout(() => finish(null), 8000);

    videoEl.onloadeddata = () => {
      try {
        videoEl.currentTime = Math.min(1, (videoEl.duration || 1) * 0.1);
      } catch {
        finish(null);
      }
    };

    videoEl.onseeked = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = videoEl.videoWidth || 320;
        canvas.height = videoEl.videoHeight || 180;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          finish(null);
          return;
        }
        ctx.drawImage(videoEl, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(
          (blob) => {
            clearTimeout(timeout);
            if (!blob) {
              finish(null);
              return;
            }
            finish(new File([blob], "thumbnail.jpg", { type: "image/jpeg" }));
          },
          "image/jpeg",
          0.8
        );
      } catch {
        finish(null);
      }
    };

    videoEl.onerror = () => finish(null);
  });
}