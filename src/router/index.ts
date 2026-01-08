import React, {
  lazy,
  Suspense,
  type ComponentType,
  type LazyExoticComponent,
} from "react";
import { useRoutes, type RouteObject } from "react-router-dom";

// 路由规则表定义
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
    component: "@/pages/layouts/BasicLayout",
    meta: {
      title: "首页",
      requiresAuth: true,
    },
    children: [
      {
        path: "",
        name: "DashboardHome",
        component: "@/pages/Dashboard/Index",
        meta: {
          title: "控制台",
          requiresAuth: true,
        },
      },
      {
        path: "/dashboard",
        name: "Dashboard",
        component: "@/pages/Dashboard/Index",
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

/**
 * 组件懒加载映射表
 * 将路由表中的 component 字段映射到具体的组件（按需导入）
 */
// 懒加载组件映射表
const componentMap: Record<
  string,
  LazyExoticComponent<ComponentType<object>>
> = {
  "@/pages/Login/Login": lazy(() => import("@/pages/Login/Login")),
  "@/pages/layouts/BasicLayout": lazy(
    () => import("@/pages/layouts/BasicLayout")
  ),
  "@/pages/Dashboard/Index": lazy(() => import("@/pages/Dashboard/Index")),
  "@/pages/Orders/Index": lazy(() => import("@/pages/Orders/Index")),
  "@/pages/Products/Index": lazy(() => import("@/pages/Products/Index")),
  "@/pages/Users/Index": lazy(() => import("@/pages/Users/Index")),
  "@/pages/Exception/NotFound": lazy(
    () => import("@/pages/Exception/NotFound")
  ),
};

/** 将规则表转换为 react-router 路由对象 */
const mapRoutesToObjects = (routes: AppRouteRecord[]): RouteObject[] =>
  routes.map((route) => {
    const Comp = componentMap[route.component];

    const elementNode = Comp
      ? React.createElement(
          Suspense,
          { fallback: null },
          React.createElement(Comp, null)
        )
      : React.createElement("div", null, `组件未找到：${route.component}`);

    return {
      path: route.path,
      element: elementNode,
      children: route.children ? mapRoutesToObjects(route.children) : undefined,
    };
  });

/** 生成给 App 使用的路由组件 */
export function AppRouter() {
  const routeObjects = mapRoutesToObjects(appRoutes);
  return useRoutes(routeObjects);
}
