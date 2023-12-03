// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 获取菜单权限 获取菜单权限 GET /admin/api/menu/authorize/${param0} */
export async function getMenuAuthorizeId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getMenuAuthorizeIdParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<string[]>(`/admin/api/menu/authorize/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 更新菜单权限 更新菜单权限 PUT /admin/api/menu/authorize/${param0} */
export async function putMenuAuthorizeId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.putMenuAuthorizeIdParams,
  body: API.UpdateAuthorizeRequest,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<any>(`/admin/api/menu/authorize/${param0}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}

/** 获取菜单树 获取菜单树 GET /admin/api/menu/tree */
export async function getMenuTree(options?: { [key: string]: any }) {
  return request<(API.MenuSingle & { children?: API.MenuSingle[] })[]>('/admin/api/menu/tree', {
    method: 'GET',
    ...(options || {}),
  });
}
