import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// 初始化样式一般放在最前面
import "reset-css";
// 全局样式
import "@/assets/style/global.scss";

import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
