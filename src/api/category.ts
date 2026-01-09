import { get, post, put, del } from "@/util/request";
import type { ApiResponse, PageResponse } from "@/util/types";

export interface Category {
  id: number;
  name: string;
  sort: number;
  status: number; // 1: 上架, 0: 下架
}

export interface CategoryListParams {
  page?: number;
  pageSize?: number;
  name?: string;
}

export interface CreateCategoryParams {
  name: string;
  sort?: number;
  status?: number; // 1: 上架, 0: 下架，默认为1
}

export interface UpdateCategoryParams {
  name?: string;
  sort?: number;
  status?: number; // 1: 上架, 0: 下架
}

/**
 * 获取分类列表（管理员接口，支持分页和搜索）
 * GET /api/category/admin/list-page
 */
export function getCategoryList(
  params?: CategoryListParams
): Promise<PageResponse<Category>> {
  return get<PageResponse<Category>>("/category/admin/list-page", { params });
}

/**
 * 创建分类（管理员接口）
 * POST /api/category/admin/create
 */
export function createCategory(
  params: CreateCategoryParams
): Promise<ApiResponse<Category>> {
  return post<ApiResponse<Category>>("/category/admin/create", {
    name: params.name,
    sort: params.sort ?? 0,
    status: params.status ?? 1,
  });
}

/**
 * 更新分类信息（管理员接口）
 * PUT /api/category/admin/update
 */
export function updateCategory(
  categoryId: number,
  params: UpdateCategoryParams
): Promise<ApiResponse<void>> {
  return put<ApiResponse<void>>("/category/admin/update", {
    id: categoryId,
    name: params.name,
    sort: params.sort,
    status: params.status,
  });
}

/**
 * 更新分类状态（上架/下架）
 * PUT /api/category/admin/{id}/status
 */
export function updateCategoryStatus(
  categoryId: number,
  status: number
): Promise<ApiResponse<void>> {
  return put<ApiResponse<void>>(`/category/admin/${categoryId}/status`, null, {
    params: { status },
  });
}

/**
 * 删除分类
 * DELETE /api/category/admin/{id}
 */
export function deleteCategory(
  categoryId: number
): Promise<ApiResponse<void>> {
  return del<ApiResponse<void>>(`/category/admin/${categoryId}`);
}

/**
 * 获取所有分类（用于下拉菜单）
 * GET /api/category/admin/list
 */
export function getAllCategories(): Promise<Category[]> {
  return get<Category[]>("/category/admin/list").then((data) => {
    // 确保返回的是数组
    return Array.isArray(data) ? data : [];
  });
}


