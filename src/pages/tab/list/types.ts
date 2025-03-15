export interface OrderItem {
  id: number;
  order_id: number;
  order_side: 'BUY' | 'SELL';
  make_type: 'MARKET' | 'LIMIT';
  symbol: string;
  create_at: string;
  status: string;
  amount: string;
  price: string;
  deal_amount: string;
  avg_price: string;
  volume: string;
  fee: string;
  fee_symboml: string;
}
