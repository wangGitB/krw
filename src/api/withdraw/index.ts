import { get, post } from '@/utils';
/**
 * WithdrawReq
 */
export interface WithdrawReq {
  /**
   * 提现金额
   */
  amount: string;
  /**
   * google验证码
   */
  google_code: string;
  /**
   * 签名
   */
  sign: string;
  /**
   * 提现币种
   */
  symbol_id: number;
  /**
   * 时间戳
   */
  t: number;
}

export const withdrawal = (data: WithdrawReq) => post('/withdraw', { data });

export const withdrawalHistory = (data: WithdrawalHistoryReq) => get<FundFlowHistoryRes>('/fundflow/history', { data });

export interface WithdrawalHistoryReq {
  current?: number;
  /**
   * 流水类型 Withdraw 提现  Deposit 存款
   */
  flow_type?: string;
  pageSize?: number;
}

export interface FundFlowHistoryRes {
  records: FundFlowHistoryItem[];
  total: number;
}

/**
 * FundFlowHistoryItem
 */
export interface FundFlowHistoryItem {
  /**
   * 流水金额
   */
  amount: string;
  /**
   * 流水创建时间
   */
  create_at: string;
  /**
   * 手续费
   */
  fee: string;
  /**
   * 流水类型 Withdraw 提现  Deposit 存款
   */
  flow_type: string;
  /**
   * 流水ID
   */
  id: number;
  nick_name: string;
  /**
   * 流水状态 'Init'处理中 ,'Processing' 处理中 ,'Success' 已完成,'Fail' 已失败,'Reviewed'  已审核
   */
  status: string;
  /**
   * 币种
   */
  symbol: string;
}
