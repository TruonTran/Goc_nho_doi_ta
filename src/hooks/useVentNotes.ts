import { useEffect, useState } from "react";
import { supabase, isSupabaseConfigured } from "../lib/supabase";
import { notifyNewVentNote } from "../lib/emailNotify";
import type { HeartNote, HeartNoteComment, PersonKey } from "../types";

const TABLE = "vent_notes";

// Chuyển đổi giữa dạng lưu trên Supabase (snake_case) và dạng dùng trong app (camelCase)
function fromRow(row: any): HeartNote {
  return {
    id: row.id,
    author: row.author,
    intensity: row.intensity,
    wish: row.wish,
    content: row.content,
    createdAt: row.created_at,
    resolved: row.resolved,
    comments: row.comments ?? [],
  };
}

/**
 * Lưu "Góc tâm sự khi giận" lên Supabase thay vì localStorage, để cả 2 người
 * (2 thiết bị khác nhau) đều thấy bài viết và phản hồi của nhau ngay lập tức.
 */
export function useVentNotes() {
  const [notes, setNotes] = useState<HeartNote[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      console.error("Chưa cấu hình Supabase (thiếu VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY).");
      setLoading(false);
      return;
    }

    let isMounted = true;

    async function fetchNotes() {
      const { data, error } = await supabase
        .from(TABLE)
        .select("*")
        .order("created_at", { ascending: false });

      if (!isMounted) return;
      if (error) {
        console.error(`Không tải được dữ liệu từ bảng "${TABLE}":`, error.message);
      } else {
        setNotes((data ?? []).map(fromRow));
      }
      setLoading(false);
    }

    fetchNotes();

    const channel = supabase
      .channel(`public:${TABLE}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: TABLE },
        () => fetchNotes()
      )
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, []);

  async function addNote(note: {
    author: PersonKey;
    intensity: string;
    wish: string;
    content: string;
  }) {
    if (!isSupabaseConfigured) return;
    const { error } = await supabase.from(TABLE).insert({
      id: `note-${Date.now()}`,
      author: note.author,
      intensity: note.intensity,
      wish: note.wish,
      content: note.content,
      resolved: false,
      comments: [],
    });
    if (error) {
      console.error(`Không lưu được vào bảng "${TABLE}":`, error.message);
      throw new Error("Gửi tâm sự thất bại. Vui lòng thử lại.");
    }

    // Báo cho đối phương qua email — không chờ đợi lâu và không làm hỏng luồng
    // chính nếu gửi mail thất bại (xem ghi chú trong notifyNewVentNote).
    notifyNewVentNote(note);
  }

  async function toggleResolved(id: string) {
    if (!isSupabaseConfigured) return;
    const current = notes.find((n) => n.id === id);
    if (!current) return;
    const { error } = await supabase
      .from(TABLE)
      .update({ resolved: !current.resolved })
      .eq("id", id);
    if (error) {
      console.error(`Không cập nhật được bảng "${TABLE}":`, error.message);
    }
  }

  async function addComment(id: string, author: PersonKey, text: string) {
    if (!isSupabaseConfigured) return;
    const current = notes.find((n) => n.id === id);
    if (!current) return;

    const newComment: HeartNoteComment = {
      id: `c-${Date.now()}`,
      author,
      text,
      createdAt: new Date().toISOString(),
    };
    const updatedComments = [...current.comments, newComment];

    const { error } = await supabase
      .from(TABLE)
      .update({ comments: updatedComments })
      .eq("id", id);
    if (error) {
      console.error(`Không lưu phản hồi vào bảng "${TABLE}":`, error.message);
    }
  }

  return { notes, addNote, toggleResolved, addComment, loading };
}