'use client';
import { useEffect, useState } from 'react';

export type Token = {
  mint: string;
  name: string;
  symbol: string;
  amount: string;
  decimals?: number;
  videoUri: string;
  imageUri?: string; // <-- Add this line
  description?: string; // was added
  telegram?: string;
  instagram?: string;
  website?: string;
  other_socials?: string;
  createdAt: string;
};

export default function useTokens() {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTokens() {
      try {
        const res = await fetch('/api/token');
        const data = await res.json();
        setTokens(data.tokens || []);
      } catch (error) {
        console.error('Failed to fetch tokens:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchTokens();
  }, []);

  return { tokens, loading };
}
