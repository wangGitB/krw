import { get, post } from '@/utils/request';

/**
 * MySymbol
 */
export interface MySymbol {
  /**
   * 可用余额
   */
  amount: string;
  /**
   * 目标币ID
   */
  symbol_id: number;
  symbol_name: string;
  withdraw_fee: string;
  [property: string]: any;
}

// 获取币种
export const getCurrency = () => get<MySymbol>('/symbol/mine');

export interface Request {
  symbol: string;
  [property: string]: any;
}

/**
 * UserAssetResp
 */
export interface Response {
  code: number;
  data: UserAssetData;
  msg: string;
  /**
   * 计价用的币种
   */
  symbol: string;
  [property: string]: any;
}

/**
 * UserAssetData
 */
export interface UserAssetData {
  assets: UserAssetItem[];
  total_value: string;
  /**
   * 交易手续费
   */
  trade_fee: string;
  /**
   * 提现手续费
   */
  withdraw_fee: string;
}

/**
 * UserAssetItem
 */
export interface UserAssetItem {
  /**
   * 账户余额
   */
  amount: string;
  amount_value: string;
  icon: string;
  price: string;
  /**
   * 币种
   */
  symbol: string;
  [property: string]: any;
}

// 获取当前选择币种的货币数量以及对应币种数据
export const getCurrencyAmount = (params?: Request) => get<UserAssetData>('/user/asset', { params });

/**
 * 重置交易密码
 */

export interface ResetTradePwdReq {
  /**
   * google验证码
   */
  google_code: string;
  /**
   * 新交易密码
   */
  new_pwd: string;
  /**
   * 旧交易密码
   */
  old_pwd?: string;
  /**
   * 是否开启交易密码
   */
  status: boolean;

}

export const resetTradePwd = (data: ResetTradePwdReq) => post('/user/reset_trade_pwd', { data });

/**
 * ResetPwdReq
 */
export interface ModifyPasswordReq {
  /**
   * google验证码
   */
  google_code: string;
  /**
   * 新密码
   */
  new_pwd: string;
  /**
   * 原始密码
   */
  old_pwd: string;
}

/**
 * 修改密码
 */
export const modifyPassword = (data: ModifyPasswordReq) => post('/user/reset_pwd', { data });
