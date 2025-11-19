
import { CoinData } from './types';

export const INITIAL_COINS: CoinData[] = [
  {
    id: 'USTC',
    name: 'SkyWay Shares',
    symbol: 'USTC',
    description: 'Investment shares in RSW Systems.',
    balance: 2694803,
    basePrice: 0.010,
    currentPrice: 0.010,
    history: [],
    color: '#10b981', // Emerald
  },
  {
    id: 'INSb',
    name: 'INSbit Token',
    symbol: 'INSb',
    description: 'Official exchange utility token.',
    balance: 1099999799,
    basePrice: 0.001,
    currentPrice: 0.001,
    history: [],
    color: '#3b82f6', // Blue
  },
  {
    id: 'HOT',
    name: 'Holo Fuel',
    symbol: 'HOT',
    description: 'Decentralized hosting fuel.',
    balance: 500,
    basePrice: 1.0,
    currentPrice: 1.0,
    history: [],
    color: '#f97316', // Orange
  },
  {
    id: 'KEEP',
    name: 'Храни Token',
    symbol: 'KEEP',
    description: 'Secure decentralized storage.',
    balance: 1000000000,
    basePrice: 0.00001,
    currentPrice: 0.00001,
    history: [],
    color: '#a855f7', // Purple
  },
  {
    id: 'RBTC',
    name: 'RabBitcoin',
    symbol: 'RBTC',
    description: 'Rabbit-themed Bitcoin token.',
    balance: 1961965,
    basePrice: 0.0000014,
    currentPrice: 0.0000014,
    history: [],
    color: '#ec4899', // Pink
  },
];

export const MAX_HISTORY_POINTS = 60; // Increased for smoother charts
export const SIMULATION_INTERVAL = 1500; // Slightly faster ticks
