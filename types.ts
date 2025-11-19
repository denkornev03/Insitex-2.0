
export type CoinId = 'USTC' | 'INSb' | 'HOT' | 'KEEP' | 'RBTC';

export interface PricePoint {
  time: string;
  value: number;
}

export interface CoinData {
  id: CoinId;
  name: string;
  symbol: string;
  description: string;
  balance: number;
  basePrice: number; // The price set by admin
  currentPrice: number; // The fluctuating price (+/- 2%)
  history: PricePoint[];
  color: string;
}

export interface CoinConfig {
    balance: number;
    basePrice: number;
}
