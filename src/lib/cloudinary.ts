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

const CHUNK_SIZE = 20 * 1024 * 1024; // 20MB / phần
const CHUNKED_UPLOAD_THRESHOLD = 40 * 1024 * 1024; // > 40MB thì upload theo từng phần

interface XhrUploadOptions {
  url: string;
  formData: FormData;
  headers?: Record<string, string>;
  onProgress?: (loaded: number, total: number) => void;
}

function xhrUpload({ url, formData, headers, onProgress }: XhrUploadOptions): Promise<any> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", url);

    if (headers) {
      for (const [key, value] of Object.entries(headers)) {
        xhr.setRequestHeader(key, value);
      }
    }

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && onProgress) {
        onProgress(event.loaded, event.total);
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          resolve(JSON.parse(xhr.responseText));
        } catch {
          reject(new Error("Không đọc được phản hồi từ Cloudinary."));
        }
      } else {
        console.error("Cloudinary upload error:", xhr.status, xhr.responseText);
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

function toUploadResult(data: any, resourceType: CloudinaryResourceType): CloudinaryUploadResult {
  return {
    secureUrl: data.secure_url,
    publicId: data.public_id,
    resourceType,
    format: data.format,
    duration: data.duration,
  };
}

export async function uploadToCloudinary(
  file: File,
  resourceType: CloudinaryResourceType,
  onProgress?: (percent: number) => void
): Promise<CloudinaryUploadResult> {
  if (!isCloudinaryConfigured) {
    throw new Error(
      "Chưa cấu hình Cloudinary. Hãy tạo file .env với VITE_CLOUDINARY_CLOUD_NAME và VITE_CLOUDINARY_UPLOAD_PRESET."
    );
  }

  const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${resourceType}/upload`;

  if (file.size <= CHUNKED_UPLOAD_THRESHOLD) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET as string);

    const data = await xhrUpload({
      url,
      formData,
      onProgress: (loaded, total) => onProgress?.(Math.round((loaded / total) * 100)),
    });
    return toUploadResult(data, resourceType);
  }

  const uploadId = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const total = file.size;
  let start = 0;
  let lastData: any = null;

  while (start < total) {
    const end = Math.min(start + CHUNK_SIZE, total);
    const chunk = file.slice(start, end);
    const chunkStart = start;

    const formData = new FormData();
    formData.append("file", chunk, file.name);
    formData.append("upload_preset", UPLOAD_PRESET as string);

    try {
      lastData = await xhrUpload({
        url,
        formData,
        headers: {
          "X-Unique-Upload-Id": uploadId,
          "Content-Range": `bytes ${start}-${end - 1}/${total}`,
        },
        onProgress: (loaded) => {
          if (onProgress) {
            const overall = Math.round(((chunkStart + loaded) / total) * 100);
            onProgress(Math.min(overall, 99));
          }
        },
      });
    } catch (err) {
      throw new Error(
        err instanceof Error
          ? `Tải video thất bại ở phần ${Math.round((chunkStart / total) * 100)}%: ${err.message}`
          : "Tải video thất bại giữa chừng, vui lòng thử lại."
      );
    }

    start = end;
  }

  onProgress?.(100);
  return toUploadResult(lastData, resourceType);
}

export function getCloudinaryVideoThumbnail(secureUrl: string): string {
  return secureUrl.replace(/\.(mp4|mov|webm|mkv)$/i, ".jpg");
}