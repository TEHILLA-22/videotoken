"use client";

import React, { memo, useState, useRef } from 'react';
import { BadgeCheckIcon, Plus, X } from 'lucide-react';

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
  <div className="flex flex-col gap-6">
    <div className="flex flex-col gap-4">
      <h3 className="text-white text-lg font-bold">Performance</h3>
      
      <div className="flex gap-2 bg-[#121212] p-1 rounded-lg w-fit border border-gray-800">
        {['1D', '7D', '1W', '1M', '3M'].map((period) => (
          <button 
            key={period} 
            className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${period === '1D' ? 'bg-white text-black' : 'text-gray-500 hover:text-white'}`}
          >
            {period}
          </button>
        ))}
      </div>
    </div>

    <div className="grid grid-cols-3 gap-4 border-b border-gray-800 pb-6">
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

    <div className="flex justify-between items-end">
      <div>
        <p className="text-2xl font-bold text-white tracking-tight">${stats.totalPnl}</p>
        <p className="text-green-500 text-sm font-bold inline-flex items-center gap-1">
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M5 1L9 5M5 1L1 5M5 1V9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          {stats.percentage}%
        </p>
      </div>
      <div className="h-12 w-32">
        <svg viewBox="0 0 100 40" className="w-full h-full stroke-blue-500 fill-none stroke-2">
          <path d="M0 30 Q 15 35, 30 20 T 60 25 T 100 5" strokeLinecap="round" />
        </svg>
      </div>
    </div>
    
    <div className="grid grid-cols-2 gap-8 pt-6 border-t border-gray-800">
      <div>
        <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Wins</p>
        <p className="text-green-400 font-mono text-sm font-bold">{stats.wins} <span className="text-gray-600">→</span> ${stats.winAmount}</p>
      </div>
      <div>
        <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Losses</p>
        <p className="text-red-400 font-mono text-sm font-bold">{stats.losses} <span className="text-gray-600">→</span> ${stats.lossAmount}</p>
      </div>
    </div>

    <div className="flex items-center gap-2 text-gray-500 mt-4">
      <BadgeCheckIcon className="w-4 h-4" />
       <span className="text-xs font-bold uppercase tracking-widest">Verified Trader</span>
    </div>
  </div>
));

PortfolioStats.displayName = "PortfolioStats";

const TokenRow = ({ token }: { token: any }) => (
  <div className="flex items-center justify-between p-4 hover:bg-white/[0.02] transition-all cursor-pointer group border-b border-gray-900/50">
    <div className="flex items-center gap-4">
      <div className="w-12 h-16 rounded bg-gray-900 overflow-hidden relative border border-gray-800 shrink-0">
        <img src={token.image} className="object-cover w-full h-full opacity-80" alt="" />
      </div>
      <div>
        <h4 className="font-bold text-white group-hover:text-purple-400 transition-colors">{token.symbol} <span className="text-gray-600 font-normal text-xs ml-1">Solana</span></h4>
        <p className="text-[10px] text-gray-500 font-mono">MC: ${token.marketCap} • 15s</p>
        <div className="flex gap-2 mt-1 opacity-40 group-hover:opacity-100 transition-opacity">
           <div className="w-3 h-3 bg-gray-600 rounded-full" />
           <div className="w-3 h-3 bg-gray-600 rounded-full" />
        </div>
      </div>
    </div>
    <div className="flex flex-col items-end gap-2">
      <div className="flex items-center gap-4">
        <p className="text-white font-mono text-sm">$0</p>
        <button className="text-[10px] font-bold bg-[#1a1225] text-purple-500 border border-purple-900/50 px-3 py-1 rounded hover:bg-purple-600 hover:text-white transition-all uppercase">
          Buy
        </button>
      </div>
      <div className="flex gap-3 text-[10px] text-gray-600 font-bold uppercase">
         <span>1.5k <span className="text-xs">👍</span></span>
         <span>1.5k <span className="text-xs">👎</span></span>
      </div>
    </div>
  </div>
);

export default function PortfolioPage() {
  const [avatar, setAvatar] = useState("https://api.dicebear.com/7.x/avataaars/svg?seed=Felix");
  const [cover, setCover] = useState("https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=2832&auto=format&fit=crop");
  const [showFullAvatar, setShowFullAvatar] = useState(false);
  
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex flex-col min-h-screen bg-[#000000] text-white">
      {/* FULL IMAGE MODAL */}
      {showFullAvatar && (
        <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4" onClick={() => setShowFullAvatar(false)}>
          <button className="absolute top-6 right-6 text-white"><X size={32}/></button>
          <img src={avatar} className="max-w-full max-h-[80vh] rounded-lg shadow-2xl" alt="Full view" />
        </div>
      )}

      {/* COVER PHOTO */}
      <div className="relative h-[200px] md:h-[280px] w-full group overflow-hidden bg-[#111]">
        <img src={cover} className="w-full h-full object-cover" alt="Cover" />
        <div 
          onClick={() => coverInputRef.current?.click()}
          className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity"
        >
          <div className="flex flex-col items-center gap-2 border border-white p-3 rounded-lg">
            <Plus size={20} />
            <span className="text-[10px] font-bold uppercase">Change Cover</span>
          </div>
        </div>
        <input type="file" ref={coverInputRef} className="hidden" accept="image/*" onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) setCover(URL.createObjectURL(file));
        }} />
      </div>

      {/* PROFILE INFO HEADER - Optimized for Mobile Spacing */}
      <div className="px-6 md:px-10 -mt-16 md:-mt-12 relative z-10 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div className="flex flex-col md:flex-row items-start md:items-end gap-4 md:gap-6">
          <div className="relative group shrink-0">
            <div 
              onClick={() => setShowFullAvatar(true)}
              className="w-28 h-28 md:w-32 md:h-32 rounded-full border-[6px] border-[#000] bg-gray-900 overflow-hidden shadow-2xl cursor-pointer"
            >
              <img src={avatar} className="w-full h-full object-cover group-hover:opacity-75 transition-opacity" alt="Profile" />
            </div>
            {/* Highly Visible Plus Icon for Avatar Edit */}
            <button 
              onClick={(e) => { e.stopPropagation(); avatarInputRef.current?.click(); }}
              className="absolute bottom-1 right-1 bg-purple-600 p-2 rounded-full border-2 border-black shadow-lg active:scale-90 transition-all"
            >
              <Plus size={16} className="text-white" strokeWidth={3} />
            </button>
            <input type="file" ref={avatarInputRef} className="hidden" accept="image/*" onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) setAvatar(URL.createObjectURL(file));
            }} />
          </div>
          
          <div className="md:pb-1 mt-2 md:mt-0">
            <h2 className="text-xl md:text-2xl font-black text-white italic tracking-tight leading-none uppercase">
              #The Bay Harbour Stifler
            </h2>
            <p className="text-xs text-gray-500 font-bold mt-2 uppercase tracking-wider">
              Followers: <span className="text-white">487</span>
            </p>
            <div className="flex gap-2 mt-4">
              <button className="bg-white text-black text-[10px] font-black px-6 py-2 rounded-full transition-all uppercase">Follow</button>
              <button className="bg-[#1a1a1a] border border-gray-800 text-white text-[10px] font-black px-4 py-2 rounded-full uppercase">Message</button>
            </div>
          </div>
        </div>
        <div className="hidden md:block pb-4 text-gray-500 text-sm font-bold italic">Rank: 1</div>
      </div>

      {/* MAIN CONTENT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 p-6 md:p-10 mt-6 md:mt-4">
        
        {/* PORTFOLIO SECTION */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="flex items-center justify-between py-2 border-b border-gray-800 mb-2">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Portfolio</span>
            <span className="text-[10px] text-purple-500 font-bold">3 Active</span>
          </div>
          <div className="flex flex-col bg-[#080808] rounded-xl overflow-hidden border border-gray-900">
            <TokenRow token={{symbol: 'SOL', marketCap: '711K', balance: '0', image: '/api/placeholder/150/200'}} />
            <TokenRow token={{symbol: 'SOL', marketCap: '711K', balance: '0', image: '/api/placeholder/150/200'}} />
            <TokenRow token={{symbol: 'SOL', marketCap: '711K', balance: '0', image: '/api/placeholder/150/200'}} />
          </div>
        </div>

        {/* LAUNCH LEGACY SECTION */}
        <div className="lg:col-span-4 flex flex-col gap-4">
           <div className="flex items-center justify-center py-2 border-b border-gray-800 mb-2">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Launch Legacy</span>
          </div>
          <div className="h-48 border border-dashed border-gray-800 rounded-xl flex items-center justify-center bg-[#050505]">
             <span className="text-[10px] font-bold uppercase text-gray-700">No launches detected</span>
          </div>
        </div>

        {/* PERFORMANCE SECTION */}
        <div className="lg:col-span-4 bg-[#0a0a0a] p-6 rounded-2xl border border-gray-900">
          <div className="sticky top-6">
            <PortfolioStats stats={MOCK_STATS} />
          </div>
        </div>

      </div>
    </div>
  );
}
