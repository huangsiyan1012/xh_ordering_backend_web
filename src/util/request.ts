import { message } from "antd";
import axios from "axios";
import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import type { ApiResponse } from "./types";

// 创建 axios 实例
const service: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api", // 从环境变量读取，默认后端地址
  timeout: 10000, // 请求超时时间 10秒
  headers: {
    "Content-Type": "application/json;charset=UTF-8",
  },
});

// 请求拦截器
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 在发送请求之前做些什么

    // 从 localStorage 获取 token（如果有的话）
    const token = localStorage.getItem("token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // 可以在这里添加其他请求头，比如语言、设备信息等
    // config.headers['X-Language'] = 'zh-CN';

    return config;
  },
  (error) => {
    // 对请求错误做些什么
    console.error("请求错误:", error);
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse<ApiResponse<unknown>>): AxiosResponse => {
    const res = response.data;

    // 如果返回的状态码不是 200，则视为错误
    // 根据实际后端接口规范调整
    if (res.code !== 200 && res.code !== 0) {
      // 显示错误消息
      message.error(res.message || "请求失败");

      // 特殊状态码处理
      if (res.code === 401) {
        // 未授权，清除 token 并跳转到登录页
        localStorage.removeItem("token");
        window.location.href = "/login";
      } else if (res.code === 403) {
        // 无权限
        message.error("没有权限访问");
      } else if (res.code === 500) {
        // 服务器错误
        message.error("服务器错误，请稍后重试");
      }

      return Promise.reject(new Error(res.message || "请求失败")) as never;
    }

    // 请求成功，将提取的数据放到 response.data 中，返回整个 response 对象
    (response as AxiosResponse).data = res.data;
    return response as AxiosResponse;
  },
  (error) => {
    // 对响应错误做些什么
    console.error("响应错误:", error);

    let errorMessage = "请求失败，请稍后重试";

    if (error.response) {
      // 服务器返回了错误状态码
      const { status, data } = error.response;

      switch (status) {
        case 400:
          errorMessage = data?.message || "请求参数错误";
          break;
        case 401:
          errorMessage = "未授权，请重新登录";
          localStorage.removeItem("token");
          window.location.href = "/login";
          break;
        case 403:
          errorMessage = "没有权限访问";
          break;
        case 404:
          errorMessage = "请求的资源不存在";
          break;
        case 500:
          errorMessage = "服务器错误，请稍后重试";
          break;
        case 502:
          errorMessage = "网关错误";
          break;
        case 503:
          errorMessage = "服务不可用";
          break;
        case 504:
          errorMessage = "请求超时";
          break;
        default:
          errorMessage = data?.message || `请求失败 (${status})`;
      }
    } else if (error.request) {
      // 请求已发出，但没有收到响应
      errorMessage = "网络错误，请检查网络连接";
    } else {
      // 在设置请求时触发了错误
      errorMessage = error.message || "请求配置错误";
    }

    message.error(errorMessage);
    return Promise.reject(error);
  }
);

// 导出封装的请求方法
export default service;

// 导出常用的请求方法
export const get = <T = unknown>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> => {
  return service
    .get<ApiResponse<T>>(url, config)
    .then((res) => res.data as T);
};

export const post = <T = unknown>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig
): Promise<T> => {
  return service
    .post<ApiResponse<T>>(url, data, config)
    .then((res) => res.data as T);
};

export const put = <T = unknown>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig
): Promise<T> => {
  return service
    .put<ApiResponse<T>>(url, data, config)
    .then((res) => res.data as T);
};

export const del = <T = unknown>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> => {
  return service
    .delete<ApiResponse<T>>(url, config)
    .then((res) => res.data as T);
};

export const patch = <T = unknown>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig
): Promise<T> => {
  return service
    .patch<ApiResponse<T>>(url, data, config)
    .then((res) => res.data as T);
};
