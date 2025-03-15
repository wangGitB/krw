import { get } from '@/utils/request';

// /**
//  * MySymbolsResp
//  */
// export interface MySymbolsResp {
//   code: number;
//   data: MySymbol[];
//   msg: string;
//   [property: string]: any;
// }

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
