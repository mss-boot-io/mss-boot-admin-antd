// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 迁移虚拟模型 迁移虚拟模型 GET /admin/api/model/migrate/${param0} */
export async function getModelMigrateId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getModelMigrateIdParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<any>(`/admin/api/model/migrate/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}
