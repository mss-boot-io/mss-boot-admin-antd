// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** lark回调 lark回调 GET /admin/api/lark/callback */
export async function getLarkCallback(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getLarkCallbackParams,
  options?: { [key: string]: any },
) {
  return request<API.OauthToken>('/admin/api/lark/callback', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
