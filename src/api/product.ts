import { get, post, put, del } from "@/util/request";
import type { ApiResponse, PageResponse } from "@/util/types";

export interface Product {
  id: number;
  categoryId: number;
  categoryName?: string; // 分类名称（从后端返回）
  name: string;
  pointCost: number;
  image?: string;
  description?: string;
  status: number; // 1: 上架, 0: 下架
  createdAt: string;
}

export interface ProductListParams {
  page?: number;
  pageSize?: number;
  name?: string;
  categoryId?: number;
}

export interface CreateProductParams {
  categoryId: number;
  name: string;
  pointCost: number;
  image?: string;
  description?: string;
  status?: number; // 1: 上架, 0: 下架，默认为1
}

export interface UpdateProductParams {
  categoryId?: number;
  name?: string;
  pointCost?: number;
  image?: string;
  description?: string;
  status?: number; // 1: 上架, 0: 下架
}

/**
 * 获取菜品列表（管理员接口，支持分页和搜索）
 * GET /api/product/admin/list-page
 */
export function getProductList(
  params?: ProductListParams
): Promise<PageResponse<Product>> {
  return get<PageResponse<Product>>("/product/admin/list-page", { params });
}

/**
 * 根据ID获取菜品信息
 * GET /api/product/{id}
 */
export function getProductInfo(productId: number): Promise<ApiResponse<Product>> {
  return get<ApiResponse<Product>>(`/product/${productId}`);
}

/**
 * 创建菜品（管理员接口）
 * POST /api/product/admin/create
 */
export function createProduct(
  params: CreateProductParams
): Promise<ApiResponse<Product>> {
  return post<ApiResponse<Product>>("/product/admin/create", {
    categoryId: params.categoryId,
    name: params.name,
    pointCost: params.pointCost,
    image: params.image,
    description: params.description,
    status: params.status ?? 1,
  });
}

/**
 * 更新菜品信息（管理员接口）
 * PUT /api/product/admin/update
 */
export function updateProduct(
  productId: number,
  params: UpdateProductParams
): Promise<ApiResponse<void>> {
  return put<ApiResponse<void>>("/product/admin/update", {
    id: productId,
    categoryId: params.categoryId,
    name: params.name,
    pointCost: params.pointCost,
    image: params.image,
    description: params.description,
    status: params.status,
  });
}

/**
 * 更新菜品状态（上架/下架）
 * PUT /api/product/admin/{id}/status
 */
export function updateProductStatus(
  productId: number,
  status: number
): Promise<ApiResponse<void>> {
  return put<ApiResponse<void>>(`/product/admin/${productId}/status`, null, {
    params: { status },
  });
}

/**
 * 删除菜品
 * DELETE /api/product/admin/{id}
 */
export function deleteProduct(
  productId: number
): Promise<ApiResponse<void>> {
  return del<ApiResponse<void>>(`/product/admin/${productId}`);
}

