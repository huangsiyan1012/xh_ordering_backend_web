import registerImg from "@/assets/login/register.png";
import {
  EyeInvisibleOutlined,
  LockOutlined,
  MailOutlined,
} from "@ant-design/icons";
import { Button, Input, Space, Typography } from "antd";
import "./login.scss";

const { Title, Text, Link } = Typography;

export default function Login() {
  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-illustration">
          <div className="illu-panel">
            <img
              src={registerImg}
              alt="login illustration"
              className="illu-image"
            />
            <div className="illu-overlay">
              <div className="illu-text">没有账户？</div>
              <Button className="illu-btn">注册</Button>
            </div>
          </div>
        </div>

        <div className="login-form">
          <Space direction="vertical" size={12} className="login-header">
            <Title level={3} className="welcome">
              欢迎回来！
            </Title>
            <Text type="secondary">登录以继续</Text>
          </Space>

          <Space direction="vertical" size={16} className="form-body">
            <div className="form-item">
              <Text className="label">手机</Text>
              <Input
                size="large"
                placeholder="输入手机号"
                prefix={<MailOutlined />}
              />
            </div>
            <div className="form-item">
              <Space className="label-row">
                <Text className="label">密码</Text>
                <Link>忘记密码？</Link>
              </Space>
              <Input.Password
                size="large"
                placeholder="输入密码"
                iconRender={() => <EyeInvisibleOutlined />}
                prefix={<LockOutlined />}
              />
            </div>
            <Button type="primary" size="large" block className="submit-btn">
              登录
            </Button>
          </Space>
        </div>
      </div>
    </div>
  );
}
