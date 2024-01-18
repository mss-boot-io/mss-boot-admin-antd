// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 租户列表 租户列表 GET /admin/api/tenants */
export async function getTenants(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getTenantsParams,
  options?: { [key: string]: any },
) {
  return request<API.Page & { data?: API.Tenant[] }>('/admin/api/tenants', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 创建租户 创建租户 POST /admin/api/tenants */
export async function postTenants(body: API.Tenant, options?: { [key: string]: any }) {
  return request<API.Tenant>('/admin/api/tenants', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 获取租户 获取租户 GET /admin/api/tenants/${param0} */
export async function getTenantsId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getTenantsIdParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.Tenant>(`/admin/api/tenants/${param0}`, {
    method: 'GET',
    params: {
      ...queryParams,
    },
    ...(options || {}),
  });
}

/** 更新租户 更新租户 PUT /admin/api/tenants/${param0} */
export async function putTenantsId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.putTenantsIdParams,
  body: API.Tenant,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.Tenant>(`/admin/api/tenants/${param0}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}

/** 删除租户 删除租户 DELETE /admin/api/tenants/${param0} */
export async function deleteTenantsId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteTenantsIdParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<any>(`/admin/api/tenants/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  });
}
