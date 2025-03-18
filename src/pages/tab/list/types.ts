// 订单状态枚举
export enum OrderStatus {
  INIT = 'INIT', // 处理中
  MAKE_ORDER = 'MAKE_ORDER', // 进行中
  ORDER_CANCELING = 'ORDER_CANCELING', // 取消中
  ORDER_ALL_CANCELED = 'ORDER_ALL_CANCELED', // 已取消
  ORDER_PARTIALLY_CANCELED = 'ORDER_PARTIALLY_CANCELED', // 部分取消
  ORDER_FINISHED = 'ORDER_FINISHED', // 已完成
  ORDER_COMMITTED = 'ORDER_COMMITTED', // 已成交
}

export interface OrderItem {
  id: number; // 主订单ID
  order_id: number; // 流水ID
  order_side: 'BUY' | 'SELL'; // 买卖方向
  make_type: 'LIMIT' | 'MARKET'; // 委托类型：LIMIT 限价委托，MARKET 市价委托
  symbol: string; // 交易对，如 BTCUSDT
  create_at: string; // 创建时间
  status: OrderStatus; // 订单状态
  amount: string; // 挂单量
  price: string; // 挂单价格
  deal_amount: string; // 成交量
  avg_price: string; // 成交均价
  volume: string; // 源币的成交额
  fee: string; // 手续费
  fee_symboml: string; // 手续费币种
  agent_fee: string; // 代理手续费
}
