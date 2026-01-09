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

export interface CreateUserParams {
  name: string;
  phone: string;
  password: string;
  status?: number; // 1: 启用, 0: 禁用，默认为1
}

export interface UpdateUserParams {
  name?: string;
  phone?: string;
  password?: string;
  status?: number; // 1: 启用, 0: 禁用
}

/**
 * 创建用户（管理员接口）
 * POST /api/user
 */
export function createUser(
  params: CreateUserParams
): Promise<ApiResponse<User>> {
  return post<ApiResponse<User>>("/user", null, {
    params: {
      name: params.name,
      phone: params.phone,
      password: params.password,
      status: params.status ?? 1,
    },
  });
}

/**
 * 更新用户信息（管理员接口）
 * PUT /api/user/{userId}
 */
export function updateUser(
  userId: number,
  params: UpdateUserParams
): Promise<ApiResponse<User>> {
  const requestParams: Record<string, string | number> = {};
  if (params.name !== undefined) requestParams.name = params.name;
  if (params.phone !== undefined) requestParams.phone = params.phone;
  if (params.password !== undefined) requestParams.password = params.password;
  if (params.status !== undefined) requestParams.status = params.status;

  return put<ApiResponse<User>>(`/user/${userId}`, null, {
    params: requestParams,
  });
}

