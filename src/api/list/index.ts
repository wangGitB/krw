import { get } from '@/utils/request';

export interface OrderListReq {
  /**
   * 创建时间开始  按天 格式 20250101
   */
  create_begin?: string;
  /**
   * 创建时间结束
   */
  create_end?: string;
  current?: number;
  /**
   * 挂单类型 LIMIT 限价委托，MARKET 市价委托
   */
  make_type?: string;
  /**
   * 订单方向。BUY 买单，SELL 卖单
   */
  order_side?: string;
  pageSize?: number;
  /**
   * 源币ID
   */
  source_id?: number;
  /**
   * 0 进行中的  1 已完成的 2 所有的
   */
  status?: number;
  /**
   * 目标币ID
   */
  symbol_id?: number;
  [property: string]: any;
}

interface OrderListRes {
  records: [
    {
      id: 0;
      order_id: 0;
      order_side: 'string';
      make_type: 'string';
      symbol: 'string';
      create_at: 'string';
      status: 'string';
      amount: 'string';
      price: 'string';
      deal_amount: 'string';
      avg_price: 'string';
      volume: 'string';
      fee: 'string';
      fee_symboml: 'string';
    },
  ];
  total: 0;
}
/** 历史订单列表 */
export const getOrderList = (params?: OrderListReq) => get<OrderListRes>('/order/list', { params });
