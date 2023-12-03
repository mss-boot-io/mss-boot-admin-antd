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
