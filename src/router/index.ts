// 路由规则表定义
// 仅作为集中管理路由信息的配置表，真正的 Router 可在 App 中根据此表生成

export interface RouteMeta {
  /** 菜单 / 页面标题 */
  title: string;
  /** 是否需要登录鉴权 */
  requiresAuth?: boolean;
  /** 是否在菜单中隐藏（例如登录页） */
  hidden?: boolean;
}

export interface AppRouteRecord {
  /** 路由路径 */
  path: string;
  /** 路由名称（唯一） */
  name: string;
  /** 对应页面组件（按需引入路径，实际使用时再 lazy import） */
  component: string;
  /** 元信息 */
  meta: RouteMeta;
  /** 子路由 */
  children?: AppRouteRecord[];
}

/**
 * 应用路由规则表
 * 后续新增页面时，只需要在这里追加配置即可
 */
export const appRoutes: AppRouteRecord[] = [
  {
    path: "/login",
    name: "Login",
    component: "@/pages/Login/Login",
    meta: {
      title: "登录",
      requiresAuth: false,
      hidden: true,
    },
  },
  {
    path: "/",
    name: "Root",
    component: "@/layouts/BasicLayout", // 预留布局组件路径，可后续创建
    meta: {
      title: "首页",
      requiresAuth: true,
    },
    children: [
      {
        path: "/dashboard",
        name: "Dashboard",
        component: "@/pages/Dashboard/Index", // 预留首页路径
        meta: {
          title: "控制台",
          requiresAuth: true,
        },
      },
      {
        path: "/orders",
        name: "Orders",
        component: "@/pages/Orders/Index",
        meta: {
          title: "订单管理",
          requiresAuth: true,
        },
      },
      {
        path: "/products",
        name: "Products",
        component: "@/pages/Products/Index",
        meta: {
          title: "菜品管理",
          requiresAuth: true,
        },
      },
      {
        path: "/users",
        name: "Users",
        component: "@/pages/Users/Index",
        meta: {
          title: "用户管理",
          requiresAuth: true,
        },
      },
    ],
  },
  {
    path: "*",
    name: "NotFound",
    component: "@/pages/Exception/NotFound",
    meta: {
      title: "页面不存在",
      hidden: true,
    },
  },
];
