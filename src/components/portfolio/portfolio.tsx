"use client";

import React, { memo, useState, useRef } from 'react';
import { BadgeCheckIcon, Plus, X, Globe, MessageCircle, Send, Instagram, ExternalLink } from 'lucide-react';

const MOCK_STATS = {
  totalPnl: "34,188.10",
  percentage: "51.1",
  wins: 80,
  winAmount: "20,889",
  losses: 45,
  lossAmount: "8,932",
  biggestWin: "2,500",
  biggestLoss: "790",
  winRate: "69%",
  trades: 128,
  totalProfit: "+$12,587",
};

const PortfolioStats = memo(({ stats }: { stats: typeof MOCK_STATS }) => (
  <div className="flex flex-col gap-6 text-left">
    <div className="flex flex-col gap-4">
      <h3 className="text-white text-lg font-bold">Performance</h3>
      
      <div className="flex gap-2 bg-[#121212] p-1 rounded-lg w-fit border border-gray-800">
        {['1D', '7D', '1W', '1M', '3M'].map((period) => (
          <button 
            key={period} 
            className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all cursor-pointer ${period === '1D' ? 'bg-white text-black' : 'text-gray-500 hover:text-white'}`}
          >
            {period}
          </button>
        ))}
      </div>
    </div>

    {/* Top Row Stats */}
    <div className="grid grid-cols-3 gap-4">
      <div>
        <p className="text-[10px] text-gray-500 uppercase font-bold">Total PnL</p>
        <p className="text-green-500 text-sm font-bold">{stats.totalProfit}</p>
      </div>
      <div>
        <p className="text-[10px] text-gray-500 uppercase font-bold">Winrate</p>
        <p className="text-white text-sm font-bold">{stats.winRate}</p>
      </div>
      <div>
        <p className="text-[10px] text-gray-500 uppercase font-bold">Trades</p>
        <p className="text-white text-sm font-bold">{stats.trades}</p>
      </div>
    </div>

    {/* Big PnL Display */}
    <div className="flex flex-col gap-1">
      <div className="flex items-baseline gap-2">
        <p className="text-2xl font-bold text-white tracking-tight">${stats.totalPnl}</p>
        <p className="text-green-500 text-sm font-bold inline-flex items-center gap-1">
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="rotate-45"><path d="M5 1L9 5M5 1L1 5M5 1V9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          {stats.percentage}%
        </p>
      </div>
      <div className="h-16 w-full">
        <svg viewBox="0 0 100 40" className="w-full h-full stroke-blue-500 fill-none stroke-2">
          <path d="M0 35 Q 20 38, 35 25 T 60 28 T 100 10" strokeLinecap="round" />
        </svg>
      </div>
    </div>
    
    {/* Win/Loss Breakdown */}
    <div className="grid grid-cols-2 gap-8 pt-4 border-t border-gray-900">
      <div>
        <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Wins</p>
        <p className="text-green-400 font-mono text-sm font-bold">{stats.wins} <span className="text-gray-600 text-xs mx-1">→</span> ${stats.winAmount}</p>
      </div>
      <div>
        <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Losses</p>
        <p className="text-red-400 font-mono text-sm font-bold">{stats.losses} <span className="text-gray-600 text-xs mx-1">→</span> ${stats.lossAmount}</p>
      </div>
    </div>

    {/* Biggest Win/Loss - From Figma Design */}
    <div className="grid grid-cols-2 gap-8">
      <div>
        <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Biggest Win</p>
        <p className="text-green-500 font-bold text-sm">+ ${stats.biggestWin}</p>
      </div>
      <div>
        <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Biggest Loss</p>
        <p className="text-red-500 font-bold text-sm">† ${stats.biggestLoss}</p>
      </div>
    </div>

    <div className="flex items-center gap-2 text-gray-500 mt-2">
      <BadgeCheckIcon className="w-4 h-4" />
       <span className="text-[10px] font-bold uppercase tracking-widest">Verified Trader</span>
    </div>
  </div>
));

PortfolioStats.displayName = "PortfolioStats";

const TokenRow = ({ token }: { token: any }) => (
  <div className="flex items-center justify-between p-4 hover:bg-white/[0.02] transition-all cursor-pointer group border-b border-gray-900/50">
    <div className="flex items-center gap-4">
      <div className="w-14 h-20 rounded bg-gray-900 overflow-hidden relative border border-gray-800 shrink-0">
        <img src={token.image} className="object-cover w-full h-full opacity-90" alt="" />
      </div>
      <div className="flex flex-col gap-0.5">
        <div className="flex items-center gap-2">
          <h4 className="font-bold text-white text-sm group-hover:text-purple-400 transition-colors uppercase">{token.symbol}</h4>
          <span className="text-gray-600 font-medium text-[10px]">Solana</span>
        </div>
        <p className="text-[10px] text-gray-500 font-mono uppercase">MC: ${token.marketCap} • 15s</p>
        
        <div className="flex gap-2 mt-2">
          <Instagram size={12} className="text-gray-600 hover:text-white transition-colors cursor-pointer" />
          <ExternalLink size={12} className="text-gray-600 hover:text-white transition-colors cursor-pointer" /> {/* Solscan */}
          <MessageCircle size={12} className="text-gray-600 hover:text-white transition-colors cursor-pointer" /> {/* Discord */}
          <Send size={12} className="text-gray-600 hover:text-white transition-colors cursor-pointer" /> {/* Telegram */}
          <X size={12} className="text-gray-600 hover:text-white transition-colors cursor-pointer" /> {/* Twitter/X */}
        </div>
      </div>
    </div>
    
    <div className="flex flex-col items-end gap-2">
      <div className="flex items-center gap-4">
        <p className="text-white font-mono text-sm font-bold">$0</p>
        <button className="text-[10px] font-black bg-[#1a1225] text-purple-500 border border-purple-900/50 px-4 py-1 rounded hover:bg-purple-600 hover:text-white transition-all uppercase cursor-pointer">
          Buy
        </button>
      </div>
      <div className="flex gap-3 text-[10px] text-gray-500 font-bold">
         <span className="flex items-center gap-1 cursor-pointer hover:text-white">1.5k 👍</span>
         <span className="flex items-center gap-1 cursor-pointer hover:text-white">1.5k 👎</span>
      </div>
    </div>
  </div>
);

export default function PortfolioPage() {
  const [avatar, setAvatar] = useState("/api/placeholder/400/400");
  const [cover, setCover] = useState("/api/placeholder/1200/400");
  
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex flex-col min-h-screen bg-[#000000] text-white font-sans">
      
      {/* COVER PHOTO */}
      <div className="relative h-[220px] md:h-[280px] w-full group overflow-hidden bg-[#111]">
        <img src={cover} className="w-full h-full object-cover" alt="Cover" />
        <div 
          onClick={() => coverInputRef.current?.click()}
          className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity"
        >
          <div className="flex flex-col items-center gap-2 border border-white p-3">
             <Plus size={18} />
             <span className="text-[10px] font-bold uppercase">Update Cover</span>
          </div>
        </div>
        <input type="file" ref={coverInputRef} className="hidden" accept="image/*" />
      </div>

      {/* PROFILE HEADER - MOBILE STACKED */}
      <div className="px-6 md:px-10 -mt-16 relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex flex-col md:flex-row items-start md:items-end gap-5">
          <div className="relative shrink-0">
            <div 
              className="w-32 h-32 rounded-full border-[6px] border-[#000] bg-gray-900 overflow-hidden shadow-2xl aspect-square"
            >
              <img src={avatar} className="w-full h-full object-cover" alt="Profile" />
            </div>
            <button 
              onClick={() => avatarInputRef.current?.click()}
              className="absolute bottom-1 right-1 bg-purple-600 p-2 rounded-full border-2 border-black cursor-pointer shadow-lg active:scale-90"
            >
              <Plus size={14} className="text-white" />
            </button>
            <input type="file" ref={avatarInputRef} className="hidden" accept="image/*" />
          </div>
          
          <div className="md:pb-2">
            <div className="flex items-center gap-2">
               <h2 className="text-xl md:text-2xl font-bold tracking-tight">#The Bay Harbour Stifler</h2>
            </div>
            <p className="text-xs text-gray-500 font-bold mt-1 uppercase tracking-widest">Followers: <span className="text-white">487</span></p>
            <div className="flex gap-2 mt-4">
              <button className="bg-[#1a1a1a] hover:bg-[#222] text-white text-[10px] font-black px-8 py-2 rounded-md transition-all uppercase cursor-pointer border border-gray-800">Follow</button>
            </div>
            <div className="mt-3 text-gray-500 text-[10px] font-bold uppercase tracking-widest">Rank: <span className="text-white">1</span></div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT GRID - Mobile Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 p-6 md:p-10 mt-8">
        
        {/* PORTFOLIO SECTION */}
        <div className="lg:col-span-4 flex flex-col">
          <div className="flex items-center justify-center py-3 border-b border-gray-900 mb-4">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Portfolio</span>
          </div>
          <div className="flex flex-col">
            <TokenRow token={{symbol: 'SOL', marketCap: '711K', image: '/api/placeholder/200/300'}} />
            <TokenRow token={{symbol: 'SOL', marketCap: '711K', image: '/api/placeholder/200/300'}} />
            <TokenRow token={{symbol: 'SOL', marketCap: '711K', image: '/api/placeholder/200/300'}} />
          </div>
        </div>

        {/* LAUNCH LEGACY SECTION */}
        <div className="lg:col-span-4 flex flex-col">
           <div className="flex items-center justify-center py-3 border-b border-gray-900 mb-4">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Launch Legacy</span>
          </div>
          <div className="h-64 border border-dashed border-gray-900 rounded-xl flex items-center justify-center text-gray-800 bg-[#050505]">
             <span className="text-[10px] font-bold uppercase">No records found</span>
          </div>
        </div>

        {/* PERFORMANCE SECTION */}
        <div className="lg:col-span-4">
          <div className="sticky top-10 border-l border-transparent lg:border-gray-900 lg:pl-10">
            <PortfolioStats stats={MOCK_STATS} />
          </div>
        </div>

      </div>
    </div>
  );
}
