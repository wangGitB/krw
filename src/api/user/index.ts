/**
 * 用户信息相关接口
 */
import type { CommonRes } from '@/api/common/types';
import type { LoginReq, LoginRes, ProfileReq, ProfileRes } from './types';
import { get, post } from '@/utils/request';

/** 获取用户信息 */
export const profile = (params?: ProfileReq) => get<ProfileRes>('/user/profile', { params });

/** 登录 */
export const login = (data: LoginReq) => post<LoginRes>('/user/login', { data, custom: { auth: false } });

/** 验证码登录 */
export const loginByCode = () => get(`/user/captcha?t=${new Date().getTime()}`);

/** 退出登录 */
export const logout = () => post<CommonRes>('/user/logout');

/** 谷歌验证码 */
export const getGoogleCode = () => get('/user/google');

/** 绑定谷歌验证码 */
export const bindGoogleCode = () => post('/user/google/bind');

/** 验证码校验 */
export const verifyGoogleCode = (data: any) => post('/user/google/verify', { data });
