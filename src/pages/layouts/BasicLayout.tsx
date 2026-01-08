import { NavLink, Outlet } from "react-router-dom";
import "./basicLayout.scss";

const navItems = [
  { path: "/dashboard", label: "首页概览" },
  { path: "/orders", label: "订单管理" },
  { path: "/products", label: "菜品管理" },
  { path: "/users", label: "用户管理" },
];

export default function BasicLayout() {
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
              <span className="nav-icon">•</span>
              <span className="label">{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      <section className="layout-main">
        <header className="layout-header">
          <div className="header-title">欢迎使用订餐管理后台</div>
          <div className="header-user">管理员</div>
        </header>
        <div className="layout-content">
          <Outlet />
        </div>
      </section>
    </div>
  );
}
