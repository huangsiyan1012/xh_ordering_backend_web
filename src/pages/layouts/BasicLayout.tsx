import { changePassword, getCurrentAdmin, logout } from "@/api/login";
import {
  CaretDownOutlined,
  LockOutlined,
  UserOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Breadcrumb, Dropdown, Form, Input, message, Modal } from "antd";
import { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import "./basicLayout.scss";

const navItems = [
  { path: "/dashboard", label: "首页概览", icon: "icon-shouye1" },
  { path: "/users", label: "用户管理", icon: "icon-yonghu" },
  { path: "/categories", label: "菜品分类", icon: "icon-caipinfenlei" },
  { path: "/products", label: "菜品管理", icon: "icon-caipin" },
  { path: "/orders", label: "订单管理", icon: "icon-shouye" },
  { path: "/points", label: "积分管理", icon: "icon-jifenguanli" },
];

export default function BasicLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState<string>("");
  const [changePasswordVisible, setChangePasswordVisible] = useState(false);
  const [form] = Form.useForm();

  // 面包屑数据
  const breadcrumbItems =
    location.pathname === "/dashboard"
      ? [
          {
            title: "首页",
            path: "/dashboard",
          },
        ]
      : (() => {
          const current = navItems.find(
            (item) => item.path === location.pathname
          );
          if (!current) {
            return [
              {
                title: "首页",
                path: "/dashboard",
              },
            ];
          }
          return [
            {
              title: "首页",
              path: "/dashboard",
            },
            {
              title: current.label,
            },
          ];
        })();

  // 获取当前管理员信息
  useEffect(() => {
    const loadAdminInfo = async () => {
      try {
        // 先从 localStorage 获取用户名（快速显示）
        const savedUsername = localStorage.getItem("username");
        if (savedUsername) {
          setUsername(savedUsername);
        }

        // 然后从服务器获取最新信息
        const adminInfo = await getCurrentAdmin();
        setUsername(adminInfo.username);
        localStorage.setItem("username", adminInfo.username);
      } catch (error) {
        console.error("获取管理员信息失败:", error);
        // 如果获取失败，使用 localStorage 中的用户名
        const savedUsername = localStorage.getItem("username");
        if (savedUsername) {
          setUsername(savedUsername);
        }
      }
    };

    loadAdminInfo();
  }, []);

  // 处理修改密码
  const handleChangePassword = async (values: {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => {
    if (values.newPassword !== values.confirmPassword) {
      message.error("两次输入的新密码不一致");
      return;
    }

    if (values.newPassword.length < 6) {
      message.error("新密码长度不能少于6位");
      return;
    }

    try {
      await changePassword(values.oldPassword, values.newPassword);
      message.success("密码修改成功");
      setChangePasswordVisible(false);
      form.resetFields();
    } catch (error) {
      console.error("修改密码失败:", error);
    }
  };

  // 处理退出登录
  const handleLogout = () => {
    Modal.confirm({
      title: "确认退出",
      content: "确定要退出登录吗？",
      onOk: async () => {
        try {
          await logout();
        } catch (error) {
          console.error("退出登录失败:", error);
        } finally {
          // 清除本地存储
          localStorage.removeItem("token");
          localStorage.removeItem("username");
          // 跳转到登录页
          navigate("/login", { replace: true });
        }
      },
    });
  };

  // 下拉菜单项
  const menuItems: MenuProps["items"] = [
    {
      key: "changePassword",
      label: "修改密码",
      onClick: () => setChangePasswordVisible(true),
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      label: "退出登录",
      onClick: handleLogout,
    },
  ];

  return (
    <div className="layout-shell">
      <aside className="layout-sider">
        <div className="layout-logo">
          <span className="logo-icon">LOGO</span>
          <span className="logo-text">订餐后台</span>
        </div>
        <nav className="layout-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `layout-nav-item ${isActive ? "active" : ""}`
              }
            >
              <i
                className={`nav-icon iconfont ${item.icon}`}
                aria-hidden="true"
              />
              <span className="label">{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      <section className="layout-main">
        <header className="layout-header">
          <div className="header-title">欢迎使用订餐管理后台</div>
          <div className="header-user">
            <UserOutlined className="user-icon" />
            <span className="user-name">{username || "管理员"}</span>
            <Dropdown
              menu={{ items: menuItems }}
              placement="bottomRight"
              trigger={["hover", "click"]}
              overlayClassName="user-dropdown-menu"
            >
              <CaretDownOutlined className="dropdown-icon" />
            </Dropdown>
          </div>
        </header>
        <div className="layout-breadcrumb">
          <Breadcrumb
            className="header-breadcrumb"
            items={breadcrumbItems.map((item, index) => {
              if (index === 0 && "path" in item && item.path) {
                return {
                  title: <NavLink to={item.path}>{item.title}</NavLink>,
                };
              }
              return { title: item.title };
            })}
          />
        </div>
        <div className="layout-content">
          <Outlet />
        </div>
      </section>

      {/* 修改密码弹窗 */}
      <Modal
        title="修改密码"
        open={changePasswordVisible}
        onCancel={() => {
          setChangePasswordVisible(false);
          form.resetFields();
        }}
        onOk={() => form.submit()}
        okText="确认"
        cancelText="取消"
      >
        <Form form={form} layout="vertical" onFinish={handleChangePassword}>
          <Form.Item
            name="oldPassword"
            label="旧密码"
            rules={[{ required: true, message: "请输入旧密码" }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="请输入旧密码"
            />
          </Form.Item>
          <Form.Item
            name="newPassword"
            label="新密码"
            rules={[
              { required: true, message: "请输入新密码" },
              { min: 6, message: "密码长度不能少于6位" },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="请输入新密码（至少6位）"
            />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            label="确认新密码"
            rules={[
              { required: true, message: "请确认新密码" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("两次输入的新密码不一致"));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="请再次输入新密码"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
