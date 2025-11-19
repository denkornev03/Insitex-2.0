
import React, { useState, useEffect } from 'react';
import { Activity, Lock, User, ExternalLink, TrendingUp, Database, ArrowUpRight, ArrowDownRight, Wallet, BarChart2, Pickaxe, Clock, Shield, Menu, X, Rabbit } from 'lucide-react';
import { INITIAL_COINS, MAX_HISTORY_POINTS, SIMULATION_INTERVAL } from './constants';
import { CoinData, CoinId } from './types';
import PriceChart from './components/PriceChart';
import CountdownTimer from './components/CountdownTimer';
import BuyModal from './components/BuyModal';

function App() {
  const [coins, setCoins] = useState<CoinData[]>(INITIAL_COINS);
  const [buyModalCoin, setBuyModalCoin] = useState<CoinId | null>(null);
  const [activeTab, setActiveTab] = useState<'markets' | 'trade'>('markets');
  const [selectedTradeCoinId, setSelectedTradeCoinId] = useState<CoinId>('USTC');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Simulation Engine
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCoins(currentCoins => {
        return currentCoins.map(coin => {
          // Volatility logic: +/- 2% from basePrice
          const randomFactor = 0.98 + Math.random() * 0.04;
          const newPrice = coin.basePrice * randomFactor;
          
          const newPoint = {
            time: new Date().toLocaleTimeString(),
            value: newPrice
          };

          const newHistory = [...coin.history, newPoint];
          if (newHistory.length > MAX_HISTORY_POINTS) {
            newHistory.shift();
          }

          return {
            ...coin,
            currentPrice: newPrice,
            history: newHistory
          };
        });
      });
    }, SIMULATION_INTERVAL);

    return () => clearInterval(intervalId);
  }, []);

  const getCoin = (id: CoinId) => coins.find(c => c.id === id);

  // Helper to calculate fake "24h Change" based on current price vs base price
  const getChangePercent = (current: number, base: number) => {
    const change = ((current - base) / base) * 100;
    return change;
  };

  const selectedTradeCoin = coins.find(c => c.id === selectedTradeCoinId) || coins[0];
  const selectedTradeChange = getChangePercent(selectedTradeCoin.currentPrice, selectedTradeCoin.basePrice);

  return (
    <div className="min-h-screen bg-[#0e1012] text-[#EAECEF] font-sans antialiased flex flex-col">
      
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-40 w-full bg-[#121518] border-b border-[#2b3139] h-16 flex items-center justify-between px-4 lg:px-6 flex-none shadow-sm relative">
        <div className="flex items-center gap-8">
          {/* Brand Logo */}
          <div className="flex items-center gap-3 cursor-pointer group select-none" onClick={() => setActiveTab('markets')}>
            <div className="relative w-9 h-9 flex items-center justify-center">
              <div className="absolute inset-0 bg-[#f7a600] rounded-lg opacity-20 rotate-6 group-hover:rotate-12 transition-transform duration-300 ease-out"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-[#f7a600] to-[#d97706] rounded-lg shadow-lg shadow-orange-500/20 flex items-center justify-center transform group-hover:scale-105 transition-transform duration-300">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                   <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" fill="#121518" stroke="#121518" strokeWidth="1.5" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
            <div className="flex flex-col justify-center h-full pt-1">
              <span className="font-black text-xl tracking-tight text-[#EAECEF] leading-none group-hover:text-white transition-colors">
                INSTA<span className="text-[#f7a600]">ITEX</span>
              </span>
              <span className="text-[9px] font-bold tracking-[0.25em] text-gray-500 uppercase group-hover:text-[#f7a600] transition-colors">
                Pro Exchange
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-6 text-sm font-medium text-gray-400 h-16 items-center ml-4">
            <button 
              onClick={() => setActiveTab('markets')}
              className={`h-full border-b-[3px] transition-all px-1 ${activeTab === 'markets' ? 'text-[#EAECEF] border-[#f7a600]' : 'border-transparent hover:text-[#EAECEF] hover:border-gray-700'}`}
            >
              Markets
            </button>
            <button 
              onClick={() => setActiveTab('trade')}
              className={`h-full border-b-[3px] transition-all px-1 ${activeTab === 'trade' ? 'text-[#EAECEF] border-[#f7a600]' : 'border-transparent hover:text-[#EAECEF] hover:border-gray-700'}`}
            >
              Trade
            </button>
            <span className="cursor-not-allowed opacity-50 h-full flex items-center border-b-[3px] border-transparent">Derivatives</span>
            <span className="cursor-not-allowed opacity-50 h-full flex items-center border-b-[3px] border-transparent">Tools</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-3 bg-[#1e2227] px-3 py-1.5 rounded border border-[#2b3139] hover:border-gray-600 transition-colors">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Est. Assets</span>
            <span className="text-sm font-mono text-white">
              ${coins.reduce((acc, c) => acc + (c.balance * c.currentPrice), 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          
          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-gray-400 hover:text-white p-2 hover:bg-[#2b3139] rounded-full transition-colors"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#121518] border-b border-[#2b3139] w-full fixed top-16 left-0 z-30 shadow-xl animate-in slide-in-from-top-5 duration-200">
          <div className="flex flex-col p-4 space-y-2">
            <button 
              onClick={() => { setActiveTab('markets'); setIsMobileMenuOpen(false); }}
              className={`text-left px-4 py-3 rounded-lg font-medium text-sm transition-colors ${activeTab === 'markets' ? 'bg-[#2b3139] text-[#f7a600]' : 'text-gray-400 hover:bg-[#1e2329] hover:text-white'}`}
            >
              Markets
            </button>
            <button 
              onClick={() => { setActiveTab('trade'); setIsMobileMenuOpen(false); }}
              className={`text-left px-4 py-3 rounded-lg font-medium text-sm transition-colors ${activeTab === 'trade' ? 'bg-[#2b3139] text-[#f7a600]' : 'text-gray-400 hover:bg-[#1e2329] hover:text-white'}`}
            >
              Trade
            </button>
            <div className="border-t border-[#2b3139] my-2"></div>
            <button className="text-left px-4 py-3 rounded-lg font-medium text-sm text-gray-500 cursor-not-allowed opacity-60 flex justify-between items-center">
              Derivatives <Lock size={14} />
            </button>
            <button className="text-left px-4 py-3 rounded-lg font-medium text-sm text-gray-500 cursor-not-allowed opacity-60 flex justify-between items-center">
              Tools <Lock size={14} />
            </button>
            
            {/* Mobile Assets Display */}
            <div className="mt-4 pt-4 border-t border-[#2b3139]">
               <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1 px-4">Total Assets</div>
               <div className="text-lg font-mono text-white px-4">
                  ${coins.reduce((acc, c) => acc + (c.balance * c.currentPrice), 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
               </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-grow flex flex-col">
        
        {activeTab === 'markets' ? (
          // MARKETS DASHBOARD VIEW
          <div className="container mx-auto px-4 py-6 space-y-6 animate-in fade-in duration-300">
            {/* Market Ticker Bar */}
            <div className="hidden lg:flex gap-8 overflow-x-auto pb-2 text-xs border-b border-[#2b3139] mb-6">
              {coins.map(coin => {
                const change = getChangePercent(coin.currentPrice, coin.basePrice);
                return (
                  <div key={coin.id} className="flex items-center gap-2 whitespace-nowrap cursor-pointer hover:bg-[#1e2329] p-1 rounded transition-colors" onClick={() => {
                    setSelectedTradeCoinId(coin.id);
                    setActiveTab('trade');
                  }}>
                    <span className="font-bold text-[#EAECEF]">{coin.symbol}/USDT</span>
                    <span className={`font-mono ${change >= 0 ? 'text-[#0ecb81]' : 'text-[#f6465d]'}`}>
                      {coin.currentPrice.toFixed(coin.basePrice < 1 ? 6 : 4)}
                    </span>
                    <span className={`font-mono ${change >= 0 ? 'text-[#0ecb81]' : 'text-[#f6465d]'}`}>
                      {change >= 0 ? '+' : ''}{change.toFixed(2)}%
                    </span>
                  </div>
                )
              })}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5 gap-4">
              
              {/* 1. USTC - RSW Shares */}
              <div className="bg-[#1e2329] rounded-sm border border-[#2b3139] flex flex-col hover:border-gray-600 transition-colors">
                <div className="p-4 flex justify-between items-center border-b border-[#2b3139]">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-emerald-900/30 rounded-full flex items-center justify-center text-emerald-500 font-bold text-xs border border-emerald-500/20">
                      RSW
                    </div>
                    <div>
                      <h3 className="font-bold text-[#EAECEF] text-lg leading-none flex items-center gap-2">
                        USTC <span className="text-xs bg-[#2b3139] text-gray-400 px-1 rounded font-normal">Shares</span>
                      </h3>
                      <span className="text-xs text-gray-500">{coins[0].name}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-mono text-[#0ecb81] tracking-tight">
                      {coins[0].currentPrice.toFixed(4)}
                    </div>
                    <div className="text-xs font-mono text-[#0ecb81] flex items-center justify-end gap-1">
                      <ArrowUpRight size={12} /> 
                      +{getChangePercent(coins[0].currentPrice, coins[0].basePrice).toFixed(2)}%
                    </div>
                  </div>
                </div>

                <div className="p-4 flex-grow flex flex-col justify-between">
                  <div className="grid grid-cols-2 gap-4 text-xs text-gray-400 mb-4">
                    <div>
                      <div className="mb-1">Holding (Vol)</div>
                      <div className="text-[#EAECEF] font-mono text-sm">{coins[0].balance.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="mb-1">Total Value</div>
                      <div className="text-[#EAECEF] font-mono text-sm">
                        ${(coins[0].balance * coins[0].currentPrice).toLocaleString(undefined, {maximumFractionDigits: 2})}
                      </div>
                    </div>
                  </div>
                  
                  <div className="h-32 mb-4">
                    <PriceChart data={coins[0].history} color="#0ecb81" />
                  </div>

                  <div className="space-y-3 mt-auto">
                    <a 
                      href="https://rsw-systems.com/?r=101716" 
                      target="_blank" 
                      rel="noreferrer"
                      className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#0ecb81] hover:bg-[#0ecb81]/90 text-white font-semibold rounded text-sm transition-colors"
                    >
                      Buy Shares <ExternalLink size={14} />
                    </a>
                    <CountdownTimer />
                  </div>
                </div>
              </div>

              {/* 2. INSb - Exchange Token (Was DKR) */}
              <div className="bg-[#1e2329] rounded-sm border border-[#2b3139] flex flex-col hover:border-gray-600 transition-colors">
                <div className="p-4 flex justify-between items-center border-b border-[#2b3139]">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-900/30 rounded-full flex items-center justify-center text-blue-500 font-bold text-xs border border-blue-500/20">
                      INSb
                    </div>
                    <div>
                      <h3 className="font-bold text-[#EAECEF] text-lg leading-none flex items-center gap-2">
                        INSb <span className="text-xs bg-[#2b3139] text-gray-400 px-1 rounded font-normal">Token</span>
                      </h3>
                      <span className="text-xs text-gray-500">{coins[1].name}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-mono text-[#3b82f6] tracking-tight">
                      {coins[1].currentPrice.toFixed(6)}
                    </div>
                    <div className="text-xs font-mono text-[#3b82f6] flex items-center justify-end gap-1">
                      <ArrowDownRight size={12} /> 
                      {(getChangePercent(coins[1].currentPrice, coins[1].basePrice)).toFixed(2)}%
                    </div>
                  </div>
                </div>

                <div className="p-4 flex-grow flex flex-col justify-between">
                  <div className="grid grid-cols-2 gap-4 text-xs text-gray-400 mb-4">
                    <div>
                      <div className="mb-1">Holding (Vol)</div>
                      <div className="text-[#EAECEF] font-mono text-sm">{coins[1].balance.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="mb-1">Total Value</div>
                      <div className="text-[#EAECEF] font-mono text-sm">
                        ${(coins[1].balance * coins[1].currentPrice).toLocaleString(undefined, {maximumFractionDigits: 2})}
                      </div>
                    </div>
                  </div>

                  <div className="h-32 mb-4">
                    <PriceChart data={coins[1].history} color="#3b82f6" />
                  </div>

                  <div className="space-y-3 mt-auto">
                    <button
                      onClick={() => setBuyModalCoin('INSb')}
                      className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#3b82f6] hover:bg-[#2563eb] text-white font-semibold rounded text-sm transition-colors"
                    >
                      Buy / Trade <TrendingUp size={14} />
                    </button>
                    <div className="flex items-center justify-center gap-2 text-[10px] text-gray-500 uppercase tracking-wider">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                      Secure Telegram Gateway
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. HOT - Mining */}
              <div className="bg-[#1e2329] rounded-sm border border-[#2b3139] flex flex-col relative overflow-hidden hover:border-gray-600 transition-colors">
                <div className="absolute top-0 right-0 p-2 opacity-20">
                   <Database size={100} className="text-gray-700 transform rotate-12" />
                </div>

                <div className="p-4 flex justify-between items-center border-b border-[#2b3139] relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-orange-900/30 rounded-full flex items-center justify-center text-orange-500 font-bold text-xs border border-orange-500/20">
                      HOT
                    </div>
                    <div>
                      <h3 className="font-bold text-[#EAECEF] text-lg leading-none flex items-center gap-2">
                        HOT <span className="text-xs bg-[#2b3139] text-gray-400 px-1 rounded font-normal">Utility</span>
                      </h3>
                      <span className="text-xs text-gray-500">{coins[2].name}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-mono text-[#EAECEF] tracking-tight">
                      {coins[2].currentPrice.toFixed(2)}
                    </div>
                    <div className="text-xs font-mono text-gray-400 flex items-center justify-end gap-1">
                      0.00%
                    </div>
                  </div>
                </div>

                <div className="p-4 flex-grow flex flex-col justify-between relative z-10">
                  <div className="grid grid-cols-2 gap-4 text-xs text-gray-400 mb-4">
                    <div>
                      <div className="mb-1">Holding (Vol)</div>
                      <div className="text-[#EAECEF] font-mono text-sm">{coins[2].balance.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="mb-1">Est. Value</div>
                      <div className="text-[#EAECEF] font-mono text-sm">
                        ${(coins[2].balance * coins[2].currentPrice).toLocaleString(undefined, {maximumFractionDigits: 2})}
                      </div>
                    </div>
                  </div>

                  <div className="h-32 mb-4 grayscale opacity-50">
                    <PriceChart data={coins[2].history} color="#f97316" />
                  </div>

                  <div className="space-y-3 mt-auto">
                    <button
                      disabled
                      className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#2b3139] text-gray-500 font-semibold rounded text-sm cursor-not-allowed border border-[#363c45]"
                    >
                      Mining Unavailable
                    </button>
                    <div className="text-center text-[10px] text-gray-600 uppercase tracking-wider">
                      Network Congested
                    </div>
                  </div>
                </div>
              </div>

              {/* 4. KEEP - Storage */}
              <div className="bg-[#1e2329] rounded-sm border border-[#2b3139] flex flex-col hover:border-gray-600 transition-colors">
                <div className="p-4 flex justify-between items-center border-b border-[#2b3139]">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-purple-900/30 rounded-full flex items-center justify-center text-purple-500 font-bold text-xs border border-purple-500/20">
                      KEEP
                    </div>
                    <div>
                      <h3 className="font-bold text-[#EAECEF] text-lg leading-none flex items-center gap-2">
                        KEEP <span className="text-xs bg-[#2b3139] text-gray-400 px-1 rounded font-normal">Храни</span>
                      </h3>
                      <span className="text-xs text-gray-500">{coins[3].name}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-mono text-[#a855f7] tracking-tight">
                      {coins[3].currentPrice.toFixed(6)}
                    </div>
                    <div className="text-xs font-mono text-[#a855f7] flex items-center justify-end gap-1">
                      <ArrowUpRight size={12} /> 
                      +{getChangePercent(coins[3].currentPrice, coins[3].basePrice).toFixed(2)}%
                    </div>
                  </div>
                </div>

                <div className="p-4 flex-grow flex flex-col justify-between">
                  <div className="grid grid-cols-2 gap-4 text-xs text-gray-400 mb-4">
                    <div>
                      <div className="mb-1">Holding (Vol)</div>
                      <div className="text-[#EAECEF] font-mono text-sm">{coins[3].balance.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="mb-1">Total Value</div>
                      <div className="text-[#EAECEF] font-mono text-sm">
                        ${(coins[3].balance * coins[3].currentPrice).toLocaleString(undefined, {maximumFractionDigits: 2})}
                      </div>
                    </div>
                  </div>
                  
                  <div className="h-32 mb-4">
                    <PriceChart data={coins[3].history} color="#a855f7" />
                  </div>

                  <div className="space-y-3 mt-auto">
                    <a 
                      href="https://keepfiles.ru" 
                      target="_blank" 
                      rel="noreferrer"
                      className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#a855f7] hover:bg-[#9333ea] text-white font-semibold rounded text-sm transition-colors"
                    >
                      Buy KEEP <Shield size={14} />
                    </a>
                    <div className="text-center text-[10px] text-gray-600 uppercase tracking-wider">
                       Direct Server Access
                    </div>
                  </div>
                </div>
              </div>

              {/* 5. RBTC - RabBitcoin */}
              <div className="bg-[#1e2329] rounded-sm border border-[#2b3139] flex flex-col hover:border-gray-600 transition-colors">
                <div className="p-4 flex justify-between items-center border-b border-[#2b3139]">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-pink-900/30 rounded-full flex items-center justify-center text-pink-500 font-bold text-xs border border-pink-500/20">
                      RBTC
                    </div>
                    <div>
                      <h3 className="font-bold text-[#EAECEF] text-lg leading-none flex items-center gap-2">
                        RBTC <span className="text-xs bg-[#2b3139] text-gray-400 px-1 rounded font-normal">Rabbit</span>
                      </h3>
                      <span className="text-xs text-gray-500">{coins[4].name}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-mono text-[#ec4899] tracking-tight">
                      {coins[4].currentPrice.toFixed(7)}
                    </div>
                    <div className="text-xs font-mono text-[#ec4899] flex items-center justify-end gap-1">
                      <ArrowUpRight size={12} /> 
                      +{getChangePercent(coins[4].currentPrice, coins[4].basePrice).toFixed(2)}%
                    </div>
                  </div>
                </div>

                <div className="p-4 flex-grow flex flex-col justify-between">
                  <div className="grid grid-cols-2 gap-4 text-xs text-gray-400 mb-4">
                    <div>
                      <div className="mb-1">Holding (Vol)</div>
                      <div className="text-[#EAECEF] font-mono text-sm">{coins[4].balance.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="mb-1">Total Value</div>
                      <div className="text-[#EAECEF] font-mono text-sm">
                        ${(coins[4].balance * coins[4].currentPrice).toLocaleString(undefined, {maximumFractionDigits: 2})}
                      </div>
                    </div>
                  </div>
                  
                  <div className="h-32 mb-4">
                    <PriceChart data={coins[4].history} color="#ec4899" />
                  </div>

                  <div className="space-y-3 mt-auto">
                    <button
                      onClick={() => setBuyModalCoin('RBTC')}
                      className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#ec4899] hover:bg-[#db2777] text-white font-semibold rounded text-sm transition-colors"
                    >
                      Buy RBTC <Rabbit size={14} />
                    </button>
                    <div className="flex items-center justify-center gap-2 text-[10px] text-gray-500 uppercase tracking-wider">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                      Secure Telegram Gateway
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        ) : (
          // TRADE VIEW
          <div className="flex flex-col lg:flex-row h-[calc(100vh-64px)] bg-[#121518] animate-in fade-in duration-300">
            
            {/* Left Side: Coin Selector */}
            <div className="w-full lg:w-72 bg-[#1e2329] border-r border-[#2b3139] flex flex-col order-2 lg:order-1 h-48 lg:h-auto">
              <div className="p-3 border-b border-[#2b3139] text-xs font-bold text-gray-400 flex justify-between bg-[#161a1e] sticky top-0 z-10">
                <span>PAIR</span>
                <span>PRICE</span>
              </div>
              <div className="overflow-y-auto flex-1 custom-scrollbar">
                {coins.map(coin => {
                  const change = getChangePercent(coin.currentPrice, coin.basePrice);
                  const isSelected = selectedTradeCoinId === coin.id;
                  return (
                    <button
                      key={coin.id}
                      onClick={() => setSelectedTradeCoinId(coin.id)}
                      className={`w-full flex items-center justify-between p-3 border-b border-[#2b3139]/50 hover:bg-[#2b3139] transition-colors ${isSelected ? 'bg-[#2b3139] border-l-4 border-l-[#f7a600]' : 'border-l-4 border-l-transparent'}`}
                    >
                      <div className="flex items-center gap-2">
                        <div style={{color: coin.color}} className="font-bold">{coin.symbol}</div>
                        <div className="text-xs text-gray-500">/USDT</div>
                      </div>
                      <div className="text-right">
                        <div className={`text-sm font-mono ${change >= 0 ? 'text-[#0ecb81]' : 'text-[#f6465d]'}`}>
                          {coin.currentPrice.toFixed(coin.basePrice < 1 ? 6 : 4)}
                        </div>
                        <div className={`text-[10px] ${change >= 0 ? 'text-[#0ecb81]' : 'text-[#f6465d]'}`}>
                          {change >= 0 ? '+' : ''}{change.toFixed(2)}%
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Center: Chart & Actions */}
            <div className="flex-1 flex flex-col min-w-0 order-1 lg:order-2">
              
              {/* Header Bar */}
              <div className="h-16 border-b border-[#2b3139] bg-[#1e2329] flex items-center px-4 lg:px-6 justify-between shadow-sm flex-shrink-0">
                <div className="flex items-center gap-4">
                  <h1 className="text-xl lg:text-2xl font-bold text-[#EAECEF] flex items-center gap-2">
                    {selectedTradeCoin.symbol}
                    <span className="text-sm font-normal text-gray-500">/USDT</span>
                  </h1>
                  <div className={`text-base lg:text-lg font-mono font-medium ${selectedTradeChange >= 0 ? 'text-[#0ecb81]' : 'text-[#f6465d]'}`}>
                    ${selectedTradeCoin.currentPrice.toFixed(selectedTradeCoin.basePrice < 1 ? 6 : 4)}
                  </div>
                  <div className="hidden md:block text-xs text-gray-500 bg-[#2b3139] px-2 py-1 rounded">
                    24h Change: <span className={selectedTradeChange >= 0 ? 'text-[#0ecb81]' : 'text-[#f6465d]'}>{selectedTradeChange >= 0 ? '+' : ''}{selectedTradeChange.toFixed(2)}%</span>
                  </div>
                </div>
                <div className="hidden lg:flex text-xs text-gray-400 items-center gap-4">
                    <div className="flex items-center gap-1"><Clock size={14}/> Spot Market</div>
                    <div className="flex items-center gap-1 text-[#f7a600]"><BarChart2 size={14}/> Trading View</div>
                </div>
              </div>

              {/* Chart Area */}
              <div className="flex-1 bg-[#161a1e] relative p-2 lg:p-4 flex flex-col min-h-[300px] lg:min-h-0">
                 <div className="flex-grow w-full h-full">
                    <PriceChart 
                      data={selectedTradeCoin.history} 
                      color={selectedTradeCoin.color} 
                      height="100%"
                      detailed={true}
                    />
                 </div>
              </div>

              {/* Trading Action Panel */}
              <div className="h-auto lg:h-24 bg-[#1e2329] border-t border-[#2b3139] p-4 flex flex-col md:flex-row items-center justify-between gap-4 flex-shrink-0">
                <div className="hidden md:flex gap-8 text-sm">
                   <div>
                      <div className="text-gray-500 text-xs mb-1">Your Balance</div>
                      <div className="font-mono text-white">{selectedTradeCoin.balance.toLocaleString()} {selectedTradeCoin.symbol}</div>
                   </div>
                   <div>
                      <div className="text-gray-500 text-xs mb-1">Equity Value</div>
                      <div className="font-mono text-white">${(selectedTradeCoin.balance * selectedTradeCoin.currentPrice).toLocaleString(undefined, {maximumFractionDigits: 2})}</div>
                   </div>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto">
                    {selectedTradeCoinId === 'USTC' && (
                        <div className="flex flex-col md:flex-row gap-3 w-full">
                            <div className="w-full md:w-48">
                                <CountdownTimer />
                            </div>
                            <a 
                                href="https://rsw-systems.com/?r=101716" 
                                target="_blank" 
                                rel="noreferrer"
                                className="flex-1 md:flex-none px-8 bg-[#0ecb81] hover:bg-[#0ecb81]/90 text-white font-bold py-2.5 rounded flex items-center justify-center gap-2 transition-colors"
                            >
                                Buy Shares
                            </a>
                        </div>
                    )}

                    {selectedTradeCoinId === 'INSb' && (
                        <button
                            onClick={() => setBuyModalCoin('INSb')}
                            className="w-full md:w-64 bg-[#3b82f6] hover:bg-[#2563eb] text-white font-bold py-3 rounded transition-colors flex items-center justify-center gap-2"
                        >
                            Buy INSb (Telegram) <TrendingUp size={16} />
                        </button>
                    )}

                    {selectedTradeCoinId === 'HOT' && (
                        <button
                            onClick={() => window.open('https://app.hot-labs.org/link?624146uu', '_blank')}
                            className="w-full md:w-64 bg-[#f97316] hover:bg-[#ea580c] text-white font-bold py-3 rounded transition-colors flex items-center justify-center gap-2 animate-pulse"
                        >
                            <Pickaxe size={18} /> Start Mining HOT
                        </button>
                    )}

                    {selectedTradeCoinId === 'KEEP' && (
                        <button
                            onClick={() => window.open('https://keepfiles.ru', '_blank')}
                            className="w-full md:w-64 bg-[#8b5cf6] hover:bg-[#7c3aed] text-white font-bold py-3 rounded transition-colors flex items-center justify-center gap-2"
                        >
                            Buy KEEP <ExternalLink size={18} />
                        </button>
                    )}

                    {selectedTradeCoinId === 'RBTC' && (
                        <button
                            onClick={() => setBuyModalCoin('RBTC')}
                            className="w-full md:w-64 bg-[#ec4899] hover:bg-[#db2777] text-white font-bold py-3 rounded transition-colors flex items-center justify-center gap-2"
                        >
                            Buy RBTC (Telegram) <Rabbit size={16} />
                        </button>
                    )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {(buyModalCoin === 'INSb' || buyModalCoin === 'RBTC') && (
        <BuyModal 
          isOpen={true}
          onClose={() => setBuyModalCoin(null)}
          currentPrice={getCoin(buyModalCoin)?.currentPrice || 0}
          symbol={getCoin(buyModalCoin)?.symbol || ''}
        />
      )}

    </div>
  );
}

export default App;
