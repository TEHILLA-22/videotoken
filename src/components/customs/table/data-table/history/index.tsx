'use client';

import { useEffect, useState } from 'react';
import ReusableTable from '../..';
import { PiClockCounterClockwise } from 'react-icons/pi';

const headers = ['Side', 'Time ago', 'Type', 'Size', 'Price in $USD', 'Total in SOL', 'Trader'];

interface HistoryTableProps {
  tokenMint: string;
}

interface Order {
  side: 'buy' | 'sell';
  orderType: 'market' | 'limit';
  amountSol: number;
  executedPrice?: number;
  userAddress: string;
  createdAt: string;
}

export default function HistoryTable({ tokenMint }: HistoryTableProps) {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHistory() {
      try {
        setLoading(true);

        const res = await fetch(`/api/orders?tokenMint=${tokenMint}`);
        const data = await res.json();

        const orders: Order[] = data.orders || [];

        const executedOrders = orders.filter((o) => o.executedPrice);

        const tableData = executedOrders.map((order) => ({
          side: order.side === 'buy' ? 'Buy' : 'Sell',
          timeAgo: (
            <div className="flex items-center gap-2">
              <PiClockCounterClockwise />
              {Math.floor((Date.now() - new Date(order.createdAt).getTime()) / 60000)}m
            </div>
          ),
          type: order.orderType === 'market' ? 'Market' : 'Limit',
          size: order.amountSol.toString(),
          priceUSD: `$${order.executedPrice}`,
          totalSOL: order.amountSol.toString(),
          trader: order.userAddress,
        }));

        setHistory(tableData);
      } catch (err) {
        console.error('Failed to fetch history', err);
      } finally {
        setLoading(false);
      }
    }

    if (tokenMint) fetchHistory();
  }, [tokenMint]);

  if (loading) return <div className="text-white">Loading history...</div>;

  return <ReusableTable headers={headers} data={history} />;
}

/*


import ReusableTable from "../..";

import { PiClockCounterClockwise } from "react-icons/pi";

const headers = ["Side", "Time ago", "Type", "Size", "Price in $USD", "Total in SOL", "Trader"];

const history = [
    { side: "Sell", timeAgo: <div className={"flex items-center gap-2"}> <PiClockCounterClockwise /> 15m </div>, type: "Limit", size: "0.8", priceUSD: "$49,000", totalSOL: "0.6", trader: "Charlie" },
    { side: "Buy", timeAgo: <div className={"flex items-center gap-2"}> <PiClockCounterClockwise /> 30m </div>, type: "Market", size: "1.5", priceUSD: "$47,500", totalSOL: "1.2", trader: "Dave" },
    { side: "Buy", timeAgo: <div className={"flex items-center gap-2"}> <PiClockCounterClockwise /> 30m </div>, type: "Market", size: "1.5", priceUSD: "$47,500", totalSOL: "1.2", trader: "Sammy" }
];
export default function HistoryTable() {
    return (
        <ReusableTable headers={headers} data={history} />
    )
}


*/
