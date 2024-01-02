// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

export async function listVirtualModels(
  params: API.listVirtualModelsParams,
  options?: { [key: string]: any },
) {
  const { key: param0, ...queryParams } = params;
  return request<API.Page & { data?: { [key: string]: any }[] }>(`/admin/api/${param0}`, {
    method: 'GET',
    params: {
      ...queryParams,
    },
    ...(options || {}),
  });
}

export async function getVirtualModel(
  params: API.getVirtualModelParams,
  options?: { [key: string]: any },
) {
  const { key, id, ...queryParams } = params;
  return request<{ [key: string]: any }>(`/admin/api/${key}/${id}`, {
    method: 'GET',
    params: {
      ...queryParams,
    },
    ...(options || {}),
  });
}

export async function createVirtualModel(
  params: API.createVirtualModelParams,
  body: { [key: string]: any },
  options?: { [key: string]: any },
) {
  const { key, ...queryParams } = params;
  return request<{ [key: string]: any }>(`/admin/api/${key}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    params: {
      ...queryParams,
    },
    data: body,
    ...(options || {}),
  });
}

export async function updateVirtualModel(
  params: API.updateVirtualModelParams,
  body: { [key: string]: any },
  options?: { [key: string]: any },
) {
  const { key, id, ...queryParams } = params;
  return request<{ [key: string]: any }>(`/admin/api/${key}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    params: {
      ...queryParams,
    },
    data: body,
    ...(options || {}),
  });
}

export async function deleteVirtualModel(
  params: API.deleteVirtualModelParams,
  options?: { [key: string]: any },
) {
  const { key, id, ...queryParams } = params;
  return request<any>(`/admin/api/${key}/${id}`, {
    method: 'DELETE',
    params: {
      ...queryParams,
    },
    ...(options || {}),
  });
}

export async function getVirtualDocumentation(
  params: API.getVirtualDocumentationParams,
  options?: { [key: string]: any },
) {
  const { key, ...queryParams } = params;
  return request<API.documentation>(`/admin/api/documentation/${key}`, {
    method: 'GET',
    params: {
      ...queryParams,
    },
    ...(options || {}),
  });
}
