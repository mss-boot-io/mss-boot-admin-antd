// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 创建/更新 创建/更新 POST /admin/api/language-defines */
export async function postLanguageDefines(
  body: API.LanguageDefine,
  options?: { [key: string]: any },
) {
  return request<any>('/admin/api/language-defines', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 删除 删除 DELETE /admin/api/language-defines/${param0} */
export async function deleteLanguageDefinesId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteLanguageDefinesIdParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<any>(`/admin/api/language-defines/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  });
}
