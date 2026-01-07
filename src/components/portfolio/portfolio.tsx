"use client";

import React, { memo, useState, useRef } from 'react';
import { BadgeCheckIcon, X } from 'lucide-react';

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

// --- MOBILE OPTIMIZED STATS ---
const PortfolioStats = memo(({ stats }: { stats: typeof MOCK_STATS }) => (
  <div className="flex flex-col gap-6 bg-[#0a0a0a] p-5 rounded-2xl border border-gray-900 mt-4">
    <div className="flex flex-col gap-4">
      <h3 className="text-white text-lg font-bold">Performance</h3>
      <div className="flex gap-2 bg-[#121212] p-1 rounded-lg w-full overflow-x-auto no-scrollbar border border-gray-800">
        {['1D', '7D', '1W', '1M', '3M'].map((period) => (
          <button 
            key={period} 
            className={`flex-1 px-3 py-2 text-xs font-bold rounded-md transition-all ${period === '1D' ? 'bg-white text-black' : 'text-gray-500'}`}
          >
            {period}
          </button>
        ))}
      </div>
    </div>

    <div className="grid grid-cols-3 gap-2 border-b border-gray-800 pb-6 text-center">
      <div>
        <p className="text-[9px] text-gray-500 uppercase font-black">Total PnL</p>
        <p className="text-green-500 text-sm font-bold">{stats.totalProfit}</p>
      </div>
      <div>
        <p className="text-[9px] text-gray-500 uppercase font-black">Winrate</p>
        <p className="text-white text-sm font-bold">{stats.winRate}</p>
      </div>
      <div>
        <p className="text-[9px] text-gray-500 uppercase font-black">Trades</p>
        <p className="text-white text-sm font-bold">{stats.trades}</p>
      </div>
    </div>

    <div className="flex justify-between items-center">
      <div>
        <p className="text-3xl font-black text-white italic tracking-tighter">${stats.totalPnl}</p>
        <p className="text-green-500 text-xs font-bold flex items-center gap-1">↑ {stats.percentage}%</p>
      </div>
      <div className="h-10 w-24">
        <svg viewBox="0 0 100 40" className="w-full h-full stroke-blue-500 fill-none stroke-2">
          <path d="M0 35 Q 25 35, 40 15 T 70 20 T 100 5" strokeLinecap="round" />
        </svg>
      </div>
    </div>

    <div className="flex items-center gap-2 text-gray-500">
      <BadgeCheckIcon className="w-4 h-4 text-blue-500" />
      <span className="text-[10px] font-black uppercase tracking-[0.1em]">Verified Trader Status</span>
    </div>
  </div>
));

PortfolioStats.displayName = "PortfolioStats";

const TokenRow = ({ token }: { token: any }) => (
  <div className="flex items-center justify-between p-4 bg-[#111]/50 border-b border-gray-900 active:scale-[0.98] transition-transform">
    <div className="flex items-center gap-3">
      <div className="w-14 h-14 rounded-xl bg-gray-900 overflow-hidden border border-gray-800 shrink-0">
        <img src={token.image} className="object-cover w-full h-full" alt="" />
      </div>
      <div>
        <h4 className="font-bold text-white text-sm">{token.symbol}</h4>
        <p className="text-[10px] text-gray-500 font-mono">MC: ${token.marketCap}</p>
        <div className="flex gap-1 mt-1">
           <span className="text-[9px] bg-green-500/10 text-green-500 px-1.5 py-0.5 rounded font-bold">LIVE</span>
        </div>
      </div>
    </div>
    <div className="text-right flex flex-col items-end gap-1">
      <p className="text-white font-mono font-bold text-sm">$0</p>
      <button className="bg-purple-600 text-white text-[10px] font-black px-4 py-1.5 rounded uppercase tracking-tighter shadow-lg shadow-purple-600/20">
        Buy
      </button>
    </div>
  </div>
);

export default function PortfolioPage() {
  const [avatar, setAvatar] = useState("/api/placeholder/400/400");
  const [cover, setCover] = useState("/api/placeholder/1200/600");
  const [isFullImage, setIsFullImage] = useState(false);
  
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex flex-col min-h-screen bg-black text-white pb-24">
      
      {/* FULL IMAGE LIGHTBOX */}
      {isFullImage && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-6 animate-in fade-in duration-200">
          <button onClick={() => setIsFullImage(false)} className="absolute top-10 right-10 text-white"><X /></button>
          <img src={avatar} className="max-w-full max-h-[80vh] rounded-2xl shadow-2xl object-contain" alt="Full Profile" />
        </div>
      )}

      {/* COVER PHOTO - Slightly shorter on mobile for better visibility */}
      <div className="relative h-[220px] lg:h-[280px] w-full group overflow-hidden bg-[#111]">
        <img src={cover} className="w-full h-full object-cover opacity-60" alt="Cover" />
        <div 
          onClick={() => coverInputRef.current?.click()}
          className="absolute inset-0 flex items-center justify-center cursor-pointer"
        >
          <span className="text-[10px] font-black uppercase bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">Change Cover</span>
        </div>
        <input type="file" ref={coverInputRef} className="hidden" accept="image/*" onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) setCover(URL.createObjectURL(file));
        }} />
      </div>

      {/* PROFILE INFO - REPOSITIONED FOR MOBILE */}
      <div className="px-5 -mt-16 relative z-10 flex flex-col items-center lg:flex-row lg:items-end lg:justify-between lg:px-10 lg:-mt-12">
        <div className="flex flex-col items-center lg:flex-row lg:items-end lg:gap-6">
          <div 
            className="w-32 h-32 rounded-full border-[6px] border-black bg-gray-900 overflow-hidden shadow-2xl cursor-pointer relative shrink-0 aspect-square"
          >
            <img 
              src={avatar} 
              onClick={() => setIsFullImage(true)}
              className="w-full h-full object-cover active:scale-95 transition-transform" 
              alt="Profile" 
            />
            <div 
              onClick={(e) => { e.stopPropagation(); avatarInputRef.current?.click(); }}
              className="absolute bottom-1 right-1 bg-white text-black p-1.5 rounded-full shadow-lg border-2 border-black"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M12 5v14M5 12h14"/></svg>
            </div>
            <input type="file" ref={avatarInputRef} className="hidden" accept="image/*" onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) setAvatar(URL.createObjectURL(file));
            }} />
          </div>
          
          <div className="mt-4 text-center lg:text-left lg:pb-2">
            <h2 className="text-2xl font-black italic tracking-tighter uppercase leading-none">#The Bay Harbour Stifler</h2>
            <p className="text-xs text-gray-500 font-bold mt-1 uppercase tracking-widest">Followers: <span className="text-white">487</span></p>
            <div className="flex gap-2 mt-4 lg:mt-2">
              <button className="flex-1 lg:flex-none bg-white text-black text-[10px] font-black px-8 py-2.5 rounded-full transition-all uppercase active:scale-95">Follow</button>
              <button className="bg-[#111] border border-gray-800 text-white text-[10px] font-black px-4 py-2.5 rounded-full uppercase active:scale-95">Message</button>
            </div>
          </div>
        </div>
        <div className="hidden lg:block pb-4 text-gray-500 text-sm font-bold italic tracking-tighter">Rank: 1</div>
      </div>

      {/* MOBILE TABS (Standard UI for Social Portfolios) */}
      <div className="flex border-b border-gray-900 mt-8 px-5 sticky top-0 bg-black/80 backdrop-blur-xl z-20">
        {['Portfolio', 'Legacy', 'Stats'].map((tab, i) => (
          <button key={tab} className={`flex-1 py-4 text-[10px] font-black uppercase tracking-[0.2em] ${i === 0 ? 'text-white border-b-2 border-white' : 'text-gray-600'}`}>
            {tab}
          </button>
        ))}
      </div>

      {/* CONTENT LIST */}
      <div className="flex flex-col lg:grid lg:grid-cols-12 lg:gap-12 lg:p-10">
        
        {/* Mobile: Sequence of items / Desktop: Columns */}
        <div className="lg:col-span-8 flex flex-col">
          <TokenRow token={{symbol: 'SOL', marketCap: '711K', image: '/api/placeholder/100/100'}} />
          <TokenRow token={{symbol: 'PEPE', marketCap: '2.1B', image: '/api/placeholder/100/100'}} />
          <TokenRow token={{symbol: 'WIF', marketCap: '400M', image: '/api/placeholder/100/100'}} />
        </div>

        <div className="p-5 lg:col-span-4">
          <PortfolioStats stats={MOCK_STATS} />
        </div>

      </div>
    </div>
  );
}
