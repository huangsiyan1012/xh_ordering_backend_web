import { get, post, put, del } from "@/util/request";
import type { ApiResponse, PageResponse } from "@/util/types";

export interface User {
  id: number;
  name: string;
  phone: string;
  avatar?: string;
  status: number; // 1: 启用, 0: 禁用
  createdAt: string;
  points?: number;
}

export interface UserListParams {
  page?: number;
  pageSize?: number;
  name?: string;
  phone?: string;
}

/**
 * 获取用户列表（管理员接口）
 * GET /api/user/list
 */
export function getUserList(
  params?: UserListParams
): Promise<PageResponse<User>> {
  return get<PageResponse<User>>("/user/list", { params });
}

/**
 * 根据ID获取用户信息
 * GET /api/user/info/{userId}
 */
export function getUserInfo(userId: number): Promise<ApiResponse<User>> {
  return get<ApiResponse<User>>(`/user/info/${userId}`);
}

/**
 * 更新用户状态（启用/禁用）
 * PUT /api/user/{userId}/status
 */
export function updateUserStatus(
  userId: number,
  status: number
): Promise<ApiResponse<void>> {
  return put<ApiResponse<void>>(`/user/${userId}/status`, null, {
    params: { status },
  });
}

/**
 * 删除用户
 * DELETE /api/user/{userId}
 */
export function deleteUser(userId: number): Promise<ApiResponse<void>> {
  return del<ApiResponse<void>>(`/user/${userId}`);
}

