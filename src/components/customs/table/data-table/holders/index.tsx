'use client';

import { useEffect, useState } from 'react';

interface Order {
  trader: string;
  amount: number;
  percent: number;
  totalSol: number;
}

export default function OrdersTable({ tokenMint }: { tokenMint: string }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      setLoading(true);

      const res = await fetch(`/api/orders?tokenMint=${tokenMint}`);
      const data = await res.json();

      const rawOrders = data.orders || [];

      const walletMap: Record<string, number> = {};

      for (const o of rawOrders) {
        const wallet = o.userAddress;
        const amount = Number(o.amountSol || 0);

        walletMap[wallet] = (walletMap[wallet] || 0) + amount;
      }

      const totalVolume = Object.values(walletMap).reduce((sum, v) => sum + v, 0);

      const aggregatedOrders: Order[] = Object.entries(walletMap).map(([wallet, amount]) => ({
        trader: wallet,
        amount,
        totalSol: amount,
        percent: totalVolume ? Number(((amount / totalVolume) * 100).toFixed(1)) : 0,
      }));

      setOrders(aggregatedOrders);
      setLoading(false);
    }

    if (tokenMint) fetchOrders();
  }, [tokenMint]);

  if (loading) return <div className="text-white">Loading orders...</div>;

  return (
    <div className="flex gap-6 w-full h-full">
      <div className="flex-1">
        <div className="grid grid-cols-3 text-xs text-white/40 border-b border-white/10 pb-2 mb-2">
          <span>Trader</span>
          <span>Amount</span>
          <span className="text-right">Total in SOL</span>
        </div>

        <div className="space-y-2">
          {orders.map((order, i) => (
            <div
              key={order.trader}
              className="grid grid-cols-3 items-center text-sm text-white/80 py-2 border-b border-white/5"
            >
              <span className="truncate">{order.trader.slice(0, 6)}…</span>

              <span>
                {order.amount.toLocaleString()} / {order.percent}%
              </span>

              <span className="text-right flex items-center justify-end gap-1">
                {order.totalSol.toFixed(2)}
                <span className="opacity-60">◎</span>
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="w-[200px] flex items-center justify-center">
        <div className="relative w-40 h-40">
          <svg className="w-full h-full -rotate-90">
            <circle
              cx="80"
              cy="80"
              r="70"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="10"
              fill="none"
            />
            <circle
              cx="80"
              cy="80"
              r="70"
              stroke="#8b5cf6"
              strokeWidth="10"
              fill="none"
              strokeDasharray="440"
              strokeDashoffset="338"
              strokeLinecap="round"
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
            <span className="text-2xl font-semibold">23%</span>
            <span className="text-xs text-white/50">Top 10</span>
          </div>
        </div>
      </div>
    </div>
  );
}
