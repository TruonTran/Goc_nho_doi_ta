import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import LettersPage from "./components/LettersPage";
import "./index.css";

// Trang riêng "/letters" (Hộp thư nhiều lá thư) — không dùng thư viện router,
// chỉ cần đọc pathname lúc tải trang vì đây là 1 trang hoàn toàn tách biệt,
// được vào bằng link <a href="/letters"> (load lại trang) từ FanMenu.
const isLettersPage = window.location.pathname.startsWith("/letters");

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {isLettersPage ? <LettersPage /> : <App />}
  </React.StrictMode>
);
