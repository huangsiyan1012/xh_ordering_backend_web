import { themeConfig } from "@/config/theme";
import { AppRouter } from "@/router";
import { ConfigProvider } from "antd";
import { Suspense } from "react";

function App() {
  return (
    <ConfigProvider theme={themeConfig}>
      <div style={{ minHeight: "100vh", backgroundColor: "#F5F5F5" }}>
        <Suspense fallback={<div>正在拼命加载中...</div>}>
          <AppRouter />
        </Suspense>
      </div>
    </ConfigProvider>
  );
}

export default App;
