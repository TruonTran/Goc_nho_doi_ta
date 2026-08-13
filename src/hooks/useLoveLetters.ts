import { useEffect, useState } from "react";
import { supabase, isSupabaseConfigured } from "../lib/supabase";
import type { LoveLetterEnvelope, PersonKey } from "../types";

const TABLE = "love_letters";

// Chuyển đổi giữa dạng lưu trên Supabase (snake_case) và dạng dùng trong app (camelCase)
function fromRow(row: any): LoveLetterEnvelope {
  return {
    id: row.id,
    author: row.author,
    title: row.title,
    content: row.content,
    createdAt: row.created_at,
  };
}

export function useLoveLetters() {
  const [letters, setLetters] = useState<LoveLetterEnvelope[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      console.error(
        "Chưa cấu hình Supabase (thiếu VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY)."
      );
      setLoading(false);
      return;
    }

    let isMounted = true;

    async function fetchLetters() {
      const { data, error } = await supabase
        .from(TABLE)
        .select("*")
        .order("created_at", { ascending: false });

      if (!isMounted) return;
      if (error) {
        console.error(`Không tải được dữ liệu từ bảng "${TABLE}":`, error.message);
      } else {
        setLetters((data ?? []).map(fromRow));
      }
      setLoading(false);
    }

    fetchLetters();

    const channel = supabase
      .channel(`public:${TABLE}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: TABLE },
        () => fetchLetters()
      )
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, []);

  async function addLetter(letter: {
    author: PersonKey;
    title: string;
    content: string;
  }) {
    if (!isSupabaseConfigured) return;
    const { error } = await supabase.from(TABLE).insert({
      id: `letter-${Date.now()}`,
      author: letter.author,
      title: letter.title,
      content: letter.content,
    });
    if (error) {
      console.error(`Không lưu được vào bảng "${TABLE}":`, error.message);
      throw new Error("Gửi thư thất bại. Vui lòng thử lại.");
    }
  }

  return { letters, addLetter, loading };
}
