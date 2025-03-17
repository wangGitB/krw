import { get } from '@/utils/request';

export interface SymbolInfosRes {
  target_id: number;
  target_name: string;
  source_id: number;
  source_name: string;
  exchange_id: number;
  exchange_name: string;
}
export const getSymbolInfos = () => get<SymbolInfosRes[]>('/symbol/infos');

export interface SymbolSettingReq {
  /**
   * 交易所ID
   */
  exchange_id?: number;
  /**
   * 源币ID
   */
  source_id?: number;
  /**
   * 目标币ID
   */
  symbol_id: number;
}

export interface SymbolSettingRes {
  /**
   * 目标可用额度
   */
  amount: string;
  /**
   * 最大名义价值
   */
  max_notional_price: string;
  /**
   * 最小名义价值
   */
  min_notional_price: string;
  /**
   * 最小数量
   */
  min_size: string;
  /**
   * 是否需要交易密码
   */
  need_trade_pwd: boolean;
  /**
   * 源币数量
   */
  source_amount: string;
  /**
   * 源币名称
   */
  source_name: string;
  /**
   * 数量步长
   */
  step_size: string;
  /**
   * 目标币名称
   */
  symbol: string;
  trade_fee: string;
  /**
   * 提现手续费
   */
  withdraw_fee: string;
  source_amount_display: string;
}

export const getSymbolSetting = (params: SymbolSettingReq) => get<SymbolSettingRes>('/symbol/setting', { params });
