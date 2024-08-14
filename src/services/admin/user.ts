// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 重置密码 重置密码 PUT /admin/api/user/${param0}/password-reset */
export async function putUserUserIdPasswordReset(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.putUserUserIDPasswordResetParams,
  body: API.PasswordResetRequest,
  options?: { [key: string]: any },
) {
  const { userID: param0, ...queryParams } = params;
  return request<any>(`/admin/api/user/${param0}/password-reset`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}

/** 获取验证码 获取验证码 POST /admin/api/user/fakeCaptcha */
export async function postUserFakeCaptcha(
  body: API.FakeCaptchaRequest,
  options?: { [key: string]: any },
) {
  return request<API.FakeCaptchaResponse>('/admin/api/user/fakeCaptcha', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 登录 登录 POST /admin/api/user/login */
export async function postUserLogin(body: API.UserLogin, options?: { [key: string]: any }) {
  return request<API.LoginResponse>('/admin/api/user/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 刷新token 刷新token GET /admin/api/user/refresh-token */
export async function getUserRefreshToken(options?: { [key: string]: any }) {
  return request<API.LoginResponse>('/admin/api/user/refresh-token', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 重置密码 重置密码 POST /admin/api/user/reset-password */
export async function postUserResetPassword(
  body: API.ResetPasswordRequest,
  options?: { [key: string]: any },
) {
  return request<any>('/admin/api/user/reset-password', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 获取登录用户信息 获取登录用户信息 GET /admin/api/user/userInfo */
export async function getUserUserInfo(options?: { [key: string]: any }) {
  return request<API.User>('/admin/api/user/userInfo', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 更新用户信息 更新用户信息 PUT /admin/api/user/userInfo */
export async function putUserUserInfo(
  body: API.UpdateUserInfoRequest,
  options?: { [key: string]: any },
) {
  return request<any>('/admin/api/user/userInfo', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
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
  return request<API.User>('/admin/api/users', {
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
  return request<API.User>(`/admin/api/users/${param0}`, {
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
