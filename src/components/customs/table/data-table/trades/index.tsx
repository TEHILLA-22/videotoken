'use client';

import { useEffect, useState } from 'react';
import ReusableTable from '../..';
import { PiClockCounterClockwise } from 'react-icons/pi';

const headers = ['Side', 'Time ago', 'Type', 'Size', 'Price in $USD', 'Total in SOL', 'Trader'];

interface TradesTableProps {
  tokenMint: string;
}

interface Trade {
  side: 'buy' | 'sell';
  orderType: 'market' | 'limit';
  amountSol: number;
  executedPrice?: number;
  limitPrice?: number;
  userAddress: string;
  createdAt: string;
}

export default function TradesTable({ tokenMint }: TradesTableProps) {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTrades() {
      try {
        setLoading(true);

        const res = await fetch(`/api/orders?tokenMint=${tokenMint}`);
        const data = await res.json();

        /**
         * Treat executed orders as trades
         * (executedPrice exists === trade happened)
         */
        const executedTrades = (data.orders || []).filter(
          (order: Trade) => order.executedPrice !== undefined,
        );

        setTrades(executedTrades);
      } catch (err) {
        console.error('Failed to fetch trades', err);
      } finally {
        setLoading(false);
      }
    }

    if (tokenMint) fetchTrades();
  }, [tokenMint]);

  const tableData = trades.map((trade) => ({
    side: trade.side === 'buy' ? 'Buy' : 'Sell',
    timeAgo: (
      <div className="flex items-center gap-2">
        <PiClockCounterClockwise />
        {Math.floor((Date.now() - new Date(trade.createdAt).getTime()) / 60000)}m
      </div>
    ),
    type: trade.orderType === 'market' ? 'Market' : 'Limit',
    size: trade.amountSol.toString(),
    priceUSD: trade.executedPrice
      ? `$${trade.executedPrice}`
      : trade.limitPrice
      ? `$${trade.limitPrice}`
      : '-',
    totalSOL: trade.amountSol.toString(),
    trader: trade.userAddress,
  }));

  if (loading) return <div className="text-white">Loading trades...</div>;

  return <ReusableTable headers={headers} data={tableData} />;
}

/*


import ReusableTable from "../..";
import { PiClockCounterClockwise } from "react-icons/pi";

const headers = ["Side", "Time ago", "Type", "Size", "Price in $USD", "Total in SOL", "Trader"];

const trades = [
    { side: "Buy", timeAgo: <PiClockCounterClockwise /> + " 5m", type: "Limit", size: "1.2", priceUSD: "$50,000", totalSOL: "0.8", trader: "Alice" },
    { side: "Sell", timeAgo: <PiClockCounterClockwise /> + " 10m", type: "Market", size: "0.5", priceUSD: "$48,000", totalSOL: "0.4", trader: "Bob" }
];

export default function TradesTable() {
    return (
        <ReusableTable headers={headers} data={trades} />
    )
}


*/
