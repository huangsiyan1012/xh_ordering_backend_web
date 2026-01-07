import { ConfigProvider } from "antd";
import { themeConfig } from "@/config/theme";
import Login from "@/pages/Login/Login";

function App() {
  return (
    <ConfigProvider theme={themeConfig}>
      <div style={{ minHeight: "100vh", backgroundColor: "#F5F5F5" }}>
        <Login />
      </div>
    </ConfigProvider>
  );
}

export default App;
