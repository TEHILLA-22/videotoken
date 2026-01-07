'use client';

import { useEffect, useState } from 'react';
import ReusableTable from '../..';
import { PiClockCounterClockwise } from 'react-icons/pi';

const headers = ['Side', 'Time ago', 'Type', 'Size', 'Price in $USD', 'Total in SOL', 'Trader'];

interface PositionsTableProps {
  tokenMint: string;
}

interface Order {
  side: 'buy' | 'sell';
  orderType: 'market' | 'limit';
  amountSol: number;
  limitPrice?: number;
  executedPrice?: number;
  userAddress: string;
  createdAt: string;
}

export default function PositionsTable({ tokenMint }: PositionsTableProps) {
  const [positions, setPositions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPositions() {
      try {
        setLoading(true);

        const res = await fetch(`/api/orders?tokenMint=${tokenMint}`);
        const data = await res.json();

        const orders: Order[] = data.orders || [];

        const openPositions = orders.filter((o) => o.orderType === 'limit' && !o.executedPrice);

        const tableData = openPositions.map((order) => ({
          side: order.side === 'buy' ? 'Buy' : 'Sell',
          timeAgo: (
            <div className="flex items-center gap-2">
              <PiClockCounterClockwise />
              {Math.floor((Date.now() - new Date(order.createdAt).getTime()) / 60000)}m
            </div>
          ),
          type: 'Limit',
          size: order.amountSol.toString(),
          priceUSD: order.limitPrice ? `$${order.limitPrice}` : '-',
          totalSOL: order.amountSol.toString(),
          trader: order.userAddress,
        }));

        setPositions(tableData);
      } catch (err) {
        console.error('Failed to fetch positions', err);
      } finally {
        setLoading(false);
      }
    }

    if (tokenMint) fetchPositions();
  }, [tokenMint]);

  if (loading) return <div className="text-white">Loading positions...</div>;

  return <ReusableTable headers={headers} data={positions} />;
}

/*
import ReusableTable from "../..";
import { PiClockCounterClockwise } from "react-icons/pi";

const headers = ["Side", "Time ago", "Type", "Size", "Price in $USD", "Total in SOL", "Trader"];

const positions = [
    { side: "Sell", timeAgo: <div className={"flex items-center gap-2"}> <PiClockCounterClockwise /> 15m </div>, type: "Limit", size: "0.8", priceUSD: "$49,000", totalSOL: "0.6", trader: "Charlie" },
    { side: "Sell", timeAgo: <div className={"flex items-center gap-2"}> <PiClockCounterClockwise /> 15m </div>, type: "Limit", size: "0.8", priceUSD: "$49,000", totalSOL: "0.6", trader: "Charlie" },
    { side: "Buy", timeAgo: <div className={"flex items-center gap-2"}> <PiClockCounterClockwise /> 30m </div>, type: "Market", size: "1.5", priceUSD: "$47,500", totalSOL: "1.2", trader: "Dave" }
];


export default function PositionsTable() {
    return (
        <ReusableTable headers={headers} data={positions} />
    )
}


*/
