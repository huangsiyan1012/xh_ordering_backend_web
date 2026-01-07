import { ConfigProvider } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { themeConfig } from "@/config/theme";

function App() {
  return (
    <ConfigProvider theme={themeConfig}>
      <div>
        <QuestionCircleOutlined />
        <Button type="primary">Primary Button</Button>
      </div>
    </ConfigProvider>
  );
}

export default App;
