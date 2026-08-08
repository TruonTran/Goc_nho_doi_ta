import { useEffect, useState } from "react";
import { supabase, isSupabaseConfigured } from "../lib/supabase";

export function useLocalMedia<T extends { id: string }>(table: string) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);

  // Tải dữ liệu ban đầu + tự cập nhật realtime khi có máy khác thêm/xoá
  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    let isMounted = true;

    async function fetchItems() {
      const { data, error } = await supabase
        .from(table)
        .select("*")
        .order("created_at", { ascending: false });

      if (!isMounted) return;
      if (error) {
        console.error(`Không tải được dữ liệu từ bảng "${table}":`, error.message);
      } else {
        setItems((data ?? []) as T[]);
      }
      setLoading(false);
    }

    fetchItems();
    
    const channel = supabase
      .channel(`public:${table}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table },
        () => fetchItems()
      )
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, [table]);

  async function addItem(item: T) {
    if (!isSupabaseConfigured) {
      console.error("Chưa cấu hình Supabase (thiếu VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY).");
      return;
    }
    const { error } = await supabase.from(table).insert(item);
    if (error) {
      console.error(`Không lưu được vào bảng "${table}":`, error.message);
      throw new Error("Lưu dữ liệu thất bại. Vui lòng thử lại.");
    }
    // Không cần setItems thủ công — subscription realtime ở trên sẽ tự cập nhật
    // cho chính máy này và tất cả máy khác đang mở trang.
  }

  async function removeItem(id: string) {
    if (!isSupabaseConfigured) return;
    const { error } = await supabase.from(table).delete().eq("id", id);
    if (error) {
      console.error(`Không xoá được khỏi bảng "${table}":`, error.message);
    }
  }

  return { items, addItem, removeItem, loading };
}
