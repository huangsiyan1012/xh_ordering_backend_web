import registerImg from "@/assets/login/register.png";
import {
  EyeInvisibleOutlined,
  LockOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button, Checkbox, Input, Space, Typography } from "antd";
import "./login.scss";

const { Text, Link } = Typography;

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
          <div className="login-header">
            <div className="logo-circle">
              <div className="logo-content">
                <div className="logo-text-top">ONE</div>
                <div className="logo-divider">&</div>
                <div className="logo-text-bottom">TOO</div>
              </div>
            </div>
            <div className="brand-name">ONE&TOO烘焙坊</div>
          </div>

          <Space direction="vertical" size={24} className="form-body">
            <div className="form-item">
              <Text className="label">手机</Text>
              <Input
                size="large"
                placeholder="请输入手机号"
                prefix={<UserOutlined className="input-icon" />}
                className="custom-input"
              />
            </div>
            <div className="form-item">
              <Text className="label">密码</Text>
              <Input.Password
                size="large"
                placeholder="请输入密码"
                iconRender={() => (
                  <EyeInvisibleOutlined className="input-icon" />
                )}
                prefix={<LockOutlined className="input-icon" />}
                className="custom-input"
              />
            </div>
            <div className="form-options">
              <Checkbox className="remember-checkbox">
                <Text className="remember-text">记住密码</Text>
              </Checkbox>
              <Link className="forgot-link">忘记密码？</Link>
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
