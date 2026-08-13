import emailjs from "@emailjs/browser";
import { couple } from "../data/couple";
import type { PersonKey } from "../types";

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID as string | undefined;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID as string | undefined;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY as string | undefined;

// Email nhận thông báo của từng người — người A viết thì gửi cho email B, và ngược lại.
const NOTIFY_EMAIL_A = import.meta.env.VITE_NOTIFY_EMAIL_A as string | undefined;
const NOTIFY_EMAIL_B = import.meta.env.VITE_NOTIFY_EMAIL_B as string | undefined;

// Link dẫn về web trong email — điền domain thật của bạn vào .env (VITE_SITE_URL),
// nếu để trống thì email vẫn gửi được, chỉ là nút "Vào xem ngay" sẽ trỏ về "#".
const SITE_URL = (import.meta.env.VITE_SITE_URL as string | undefined) || "#";

export const isEmailNotifyConfigured = Boolean(SERVICE_ID && TEMPLATE_ID && PUBLIC_KEY);

function personName(key: PersonKey) {
  return key === "A" ? couple.personA.name : couple.personB.name;
}

// Người viết là A thì báo cho email của B, và ngược lại.
function recipientFor(author: PersonKey): string | undefined {
  return author === "A" ? NOTIFY_EMAIL_B : NOTIFY_EMAIL_A;
}

/**
 * Gửi email báo cho đối phương biết vừa có 1 "tâm thư" mới trong Góc tâm sự.
 * Hàm này CHỦ ĐỘNG NUỐT LỖI (không throw) — nếu gửi mail thất bại (chưa cấu hình,
 * hết quota, sai key...) thì chỉ log ra console, không được làm hỏng luồng gửi
 * tâm sự chính (lưu vào Supabase vẫn phải thành công bình thường).
 */
export async function notifyNewVentNote(note: {
  author: PersonKey;
  intensity: string;
  wish: string;
  content: string;
}) {
  if (!isEmailNotifyConfigured) return;

  const toEmail = recipientFor(note.author);
  if (!toEmail) return;

  const preview =
    note.content.length > 200 ? `${note.content.slice(0, 200)}…` : note.content;

  try {
    await emailjs.send(
      SERVICE_ID as string,
      TEMPLATE_ID as string,
      {
        to_email: toEmail,
        from_name: personName(note.author),
        intensity: note.intensity,
        wish: note.wish,
        message: preview,
        site_url: SITE_URL,
      },
      { publicKey: PUBLIC_KEY as string }
    );
  } catch (err) {
    console.error("Gửi email thông báo tâm thư thất bại:", err);
  }
}