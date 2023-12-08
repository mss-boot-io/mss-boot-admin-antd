// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 获取登录用户信息 获取登录用户信息 GET /admin/api/user/userInfo */
export async function getUserUserInfo(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getUserUserInfoParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.User>('/admin/api/user/userInfo', {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 用户列表 用户列表 GET /admin/api/users */
export async function getUsers(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getUsersParams,
  options?: { [key: string]: any },
) {
  return request<API.Page & { data?: API.User[] }>('/admin/api/users', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 创建用户 创建用户 POST /admin/api/users */
export async function postUsers(body: API.User, options?: { [key: string]: any }) {
  return request<any>('/admin/api/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 获取用户 获取用户 GET /admin/api/users/${param0} */
export async function getUsersId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getUsersIdParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.User>(`/admin/api/users/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 更新用户 更新用户 PUT /admin/api/users/${param0} */
export async function putUsersId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.putUsersIdParams,
  body: API.User,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<any>(`/admin/api/users/${param0}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}

/** 删除用户 删除用户 DELETE /admin/api/users/${param0} */
export async function deleteUsersId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteUsersIdParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<any>(`/admin/api/users/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  });
}
