import { useEffect, useState } from "react";

/**
 * Lưu danh sách ảnh/video được người dùng upload (qua Cloudinary) vào localStorage
 * của trình duyệt, để chúng vẫn hiển thị lại mỗi khi mở lại trang trên máy này.
 */
export function useLocalMedia<T extends { id: string }>(storageKey: string) {
  const [items, setItems] = useState<T[]>(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      return raw ? (JSON.parse(raw) as T[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(items));
    } catch {
      // localStorage đầy hoặc bị chặn — bỏ qua, không làm crash app
    }
  }, [storageKey, items]);

  function addItem(item: T) {
    setItems((prev) => [item, ...prev]);
  }

  function removeItem(id: string) {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  return { items, addItem, removeItem };
}
