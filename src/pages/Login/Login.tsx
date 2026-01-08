import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import registerImg from "@/assets/login/register.png";
import {
  EyeInvisibleOutlined,
  LockOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button, Checkbox, Input, Space, Typography, message } from "antd";
import { login, type LoginParams } from "@/api/login";
import "./login.scss";

const { Text, Link } = Typography;

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [remember, setRemember] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  // 组件挂载时，检查是否有记住的用户名
  useEffect(() => {
    const rememberedUsername = localStorage.getItem("rememberUsername");
    if (rememberedUsername) {
      setUsername(rememberedUsername);
      setRemember(true);
    }
  }, []);

  // 处理登录
  const handleLogin = async () => {
    // 表单验证
    if (!username.trim()) {
      message.warning("请输入用户名");
      return;
    }

    if (username.trim().length < 3) {
      message.warning("用户名长度不能少于3位");
      return;
    }

    if (!password.trim()) {
      message.warning("请输入密码");
      return;
    }

    if (password.length < 6) {
      message.warning("密码长度不能少于6位");
      return;
    }

    setLoading(true);

    try {
      const params: LoginParams = {
        username: username.trim(),
        password: password.trim(),
        remember,
      };

      const result = await login(params);

      // 登录成功，保存 token 和用户名
      localStorage.setItem("token", result.token);
      localStorage.setItem("username", result.username);

      // 如果选择记住密码，保存用户名到 localStorage
      if (remember) {
        localStorage.setItem("rememberUsername", username);
      } else {
        localStorage.removeItem("rememberUsername");
      }

      message.success("登录成功");
      
      // 跳转到首页
      navigate("/", { replace: true });
    } catch (error) {
      // 错误已在拦截器中处理，这里可以做一些额外处理
      console.error("登录失败:", error);
    } finally {
      setLoading(false);
    }
  };

  // 处理回车键登录
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

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
              <Text className="label">账号</Text>
              <Input
                size="large"
                placeholder="请输入用户名"
                prefix={<UserOutlined className="input-icon" />}
                className="custom-input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyPress={handleKeyPress}
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
              />
            </div>
            <div className="form-options">
              <Checkbox
                className="remember-checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              >
                <Text className="remember-text">记住密码</Text>
              </Checkbox>
              <Link className="forgot-link">忘记密码？</Link>
            </div>
            <Button
              type="primary"
              size="large"
              block
              className="submit-btn"
              loading={loading}
              onClick={handleLogin}
            >
              登录
            </Button>
          </Space>
        </div>
      </div>
    </div>
  );
}
