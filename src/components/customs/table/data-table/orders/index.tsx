'use client';

import { useEffect, useState } from 'react';
import ReusableTable from '../..';
import { PiClockCounterClockwise } from 'react-icons/pi';

const headers = ['Side', 'Time ago', 'Type', 'Size', 'Price in $USD', 'Total in SOL', 'Trader'];

interface OrdersTableProps {
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

/* 🔹 Wallet shortener */
function shortenAddress(address: string, chars = 4) {
  if (!address) return '-';
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}

/* 🔹 Time ago formatter */
function timeAgo(date: string) {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m`;
  return `${Math.floor(mins / 60)}h`;
}

export default function OrdersTable({ tokenMint }: OrdersTableProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      try {
        setLoading(true);
        const res = await fetch(`/api/orders?tokenMint=${tokenMint}`);
        const data = await res.json();
        setOrders(data.orders || []);
      } catch (err) {
        console.error('Failed to fetch orders', err);
      } finally {
        setLoading(false);
      }
    }

    if (tokenMint) fetchOrders();
  }, [tokenMint]);

  const tableData = orders.map((order) => ({
    side: (
      <span className={`font-medium ${order.side === 'buy' ? 'text-green-400' : 'text-red-400'}`}>
        {order.side === 'buy' ? 'Buy' : 'Sell'}
      </span>
    ),

    timeAgo: (
      <div className="flex items-center gap-1 text-gray-400">
        <PiClockCounterClockwise className="text-sm" />
        {timeAgo(order.createdAt)}
      </div>
    ),

    type: (
      <span className="text-gray-300">{order.orderType === 'market' ? 'Market' : 'Limit'}</span>
    ),

    size: <span className="text-gray-200">{Number(order.amountSol).toLocaleString()}</span>,

    priceUSD: (
      <span className="text-gray-200">
        {order.executedPrice
          ? `$${order.executedPrice.toFixed(6)}`
          : order.limitPrice
          ? `$${order.limitPrice.toFixed(6)}`
          : '-'}
      </span>
    ),

    totalSOL: <span className="text-gray-200">{order.amountSol.toFixed(2)}</span>,

    trader: <span className="font-mono text-gray-400">{shortenAddress(order.userAddress)}</span>,
  }));

  if (loading) return <div className="text-sm text-gray-400">Loading orders...</div>;

  return <ReusableTable headers={headers} data={tableData} />;
}
