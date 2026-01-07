'use client';

import { useEffect, useState } from 'react';
import { User } from 'lucide-react';

type Trader = {
  address: string;
  bought: number;
  sold: number;
  pnl: null;
  openPnl: null;
};

function shortenAddress(addr: string) {
  return `${addr.slice(0, 4)}…${addr.slice(-4)}`;
}

export default function TopTradersTable({ tokenMint }: { tokenMint: string }) {
  const [traders, setTraders] = useState<Trader[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      try {
        setLoading(true);
        const res = await fetch(`/api/orders?tokenMint=${tokenMint}`);
        const data = await res.json();

        const orders = data.orders || [];
        const traderMap: Record<string, { bought: number; sold: number }> = {};
        for (const order of orders) {
          const addr = order.userAddress;
          if (!traderMap[addr]) traderMap[addr] = { bought: 0, sold: 0 };
          if (order.side === 'buy') traderMap[addr].bought += Number(order.amountSol);
          if (order.side === 'sell') traderMap[addr].sold += Number(order.amountSol);
        }

        const topTraders = Object.entries(traderMap)
          .map(([address, data]) => ({
            address,
            bought: data.bought,
            sold: data.sold,
            pnl: null,
            openPnl: null,
            volume: data.bought + data.sold,
          }))
          .sort((a, b) => b.volume - a.volume)
          .slice(0, 5);

        setTraders(topTraders);
      } catch (err) {
        console.error('Failed to fetch orders', err);
      } finally {
        setLoading(false);
      }
    }

    if (tokenMint) fetchOrders();
  }, [tokenMint]);

  if (loading) return <div className="text-sm text-white/40">Loading top traders...</div>;

  return (
    <div className="w-full overflow-hidden rounded-xl border border-white/10 bg-[#0f0f0f]">
      <div className="grid grid-cols-[1.6fr_1fr_1fr_1fr_1fr] px-4 py-3 text-xs uppercase text-white/40 border-b border-white/10">
        <div>Trader</div>
        <div className="text-right">PnL</div>
        <div className="text-right">Open PnL</div>
        <div className="text-right">Bought</div>
        <div className="text-right">Sold</div>
      </div>

      <div className="divide-y divide-white/5">
        {traders.map((t, i) => (
          <div
            key={i}
            className="grid grid-cols-[1.6fr_1fr_1fr_1fr_1fr] items-center px-4 py-3 text-sm text-white hover:bg-white/5 transition"
          >
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-6 h-6 flex items-center justify-center rounded-full bg-white/10 shrink-0">
                <User size={14} className="text-white/60" />
              </div>
              <span className="text-white/80 font-medium truncate">
                {shortenAddress(t.address)}
              </span>
            </div>

            <div className="text-right text-white/40">—</div>

            <div className="text-right text-white/40">—</div>

            <div className="text-right text-green-400 font-mono tabular-nums">
              {t.bought.toFixed(4)}
            </div>

            <div className="text-right text-red-400 font-mono tabular-nums">
              {t.sold.toFixed(4)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
