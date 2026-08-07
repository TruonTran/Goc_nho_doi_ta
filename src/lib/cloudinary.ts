// 👉 Cấu hình Cloudinary: tạo file .env (copy từ .env.example) và điền 2 giá trị bên dưới
const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string | undefined;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as string | undefined;

export const isCloudinaryConfigured = Boolean(CLOUD_NAME && UPLOAD_PRESET);

export type CloudinaryResourceType = "image" | "video";

export interface CloudinaryUploadResult {
  secureUrl: string;
  publicId: string;
  resourceType: CloudinaryResourceType;
  format: string;
  duration?: number;
}

/**
 * Upload 1 file thẳng lên Cloudinary (unsigned upload) từ trình duyệt.
 * onProgress trả về % (0-100) để hiển thị thanh tiến trình.
 */
export function uploadToCloudinary(
  file: File,
  resourceType: CloudinaryResourceType,
  onProgress?: (percent: number) => void
): Promise<CloudinaryUploadResult> {
  return new Promise((resolve, reject) => {
    if (!isCloudinaryConfigured) {
      reject(
        new Error(
          "Chưa cấu hình Cloudinary. Hãy tạo file .env với VITE_CLOUDINARY_CLOUD_NAME và VITE_CLOUDINARY_UPLOAD_PRESET."
        )
      );
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET as string);

    const xhr = new XMLHttpRequest();
    xhr.open(
      "POST",
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${resourceType}/upload`
    );

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && onProgress) {
        onProgress(Math.round((event.loaded / event.total) * 100));
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const data = JSON.parse(xhr.responseText);
          resolve({
            secureUrl: data.secure_url,
            publicId: data.public_id,
            resourceType,
            format: data.format,
            duration: data.duration,
          });
        } catch {
          reject(new Error("Không đọc được phản hồi từ Cloudinary."));
        }
      } else {
        try {
          const err = JSON.parse(xhr.responseText);
          reject(new Error(err?.error?.message || "Upload thất bại."));
        } catch {
          reject(new Error("Upload thất bại."));
        }
      }
    };

    xhr.onerror = () => reject(new Error("Lỗi mạng khi upload."));
    xhr.send(formData);
  });
}

/**
 * Với video, Cloudinary có thể tự sinh 1 ảnh thumbnail bằng cách đổi đuôi file sang .jpg
 * trên chính URL video đó.
 */
export function getCloudinaryVideoThumbnail(secureUrl: string): string {
  return secureUrl.replace(/\.(mp4|mov|webm|mkv)$/i, ".jpg");
}
