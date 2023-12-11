import { request } from '@umijs/max';
import type { GeographicItemType } from './data';

export async function queryCurrent(): Promise<API.User> {
  return request('/admin/api/user/userInfo');
}

export async function queryProvince(): Promise<{ data: GeographicItemType[] }> {
  return request('/api/geographic/province');
}

export async function queryCity(province: string): Promise<{ data: GeographicItemType[] }> {
  return request(`/api/geographic/city/${province}`);
}

export async function query() {
  return request('/api/users');
}
