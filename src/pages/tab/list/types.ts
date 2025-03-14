export interface OrderItem {
  symbol: string;
  type: 'BUY' | 'SELL';
  orderType: '市价' | '限价';
  time: string;
  price: string;
  avgPrice: string;
  amount: string;
  fee: string;
  feeProfit: string;
  status: string;
}
