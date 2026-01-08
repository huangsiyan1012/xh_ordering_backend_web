/**
 * API 相关类型定义
 */

// 通用 API 响应结构
export interface ApiResponse<T = unknown> {
  code: number;
  message: string;
  data: T;
  timestamp?: number;
}

// 分页请求参数
export interface PageParams {
  page: number;
  pageSize: number;
  [key: string]: unknown;
}

// 分页响应数据
export interface PageResponse<T = unknown> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
}

// 请求配置扩展
export interface RequestConfig {
  showLoading?: boolean; // 是否显示加载提示
  showError?: boolean; // 是否显示错误提示
  [key: string]: unknown;
}
