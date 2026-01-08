import { post, get } from '@/util/request';

// 登录请求参数类型
export interface LoginParams {
  username: string; // 用户名
  password: string; // 密码
  remember?: boolean; // 记住密码（前端使用，不发送到后端）
}

// 登录响应数据类型（匹配后端返回的数据结构）
export interface LoginResponse {
  adminId: number; // 管理员ID
  username: string; // 用户名
  role: number; // 角色：1-管理员，2-后厨
  token: string; // 认证 token
}

/**
 * 管理员登录
 * @param params 登录参数
 * @returns 登录响应数据
 */
export const login = (params: LoginParams): Promise<LoginResponse> => {
  // 后端使用 @RequestParam，需要发送 form-data 格式
  const formData = new URLSearchParams();
  formData.append('username', params.username);
  formData.append('password', params.password);
  
  return post<LoginResponse>('/admin/login', formData, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
};

/**
 * 用户登出
 * @returns 登出响应
 */
export const logout = () => {
  return post('/admin/logout');
};

/**
 * 获取当前管理员信息
 * @returns 管理员信息
 */
export const getCurrentAdmin = () => {
  return get<{
    id: number;
    username: string;
    role: number;
    status: number;
    createdAt: string;
  }>('/admin/info');
};

/**
 * 修改密码
 * @param oldPassword 旧密码
 * @param newPassword 新密码
 * @returns 修改结果
 */
export const changePassword = (oldPassword: string, newPassword: string) => {
  const formData = new URLSearchParams();
  formData.append('oldPassword', oldPassword);
  formData.append('newPassword', newPassword);
  
  return post('/admin/change-password', formData, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
};

