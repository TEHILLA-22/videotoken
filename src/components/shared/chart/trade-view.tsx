'use client';

import React, { useEffect, useState, memo } from 'react';
import { fetchOHLCV } from '@/lib/ohlcv';
import TokenChart from '@/components/shared/chart/TokenChart';
import { OHLCV } from '@/types/ohlcv';
import { Copy } from 'lucide-react';

type Props = { tokenMint: string };

function TradingViewWidget({ tokenMint }: Props) {
  const [ohlcv, setOhlcv] = useState<OHLCV[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await fetchOHLCV(tokenMint);
        setOhlcv(data);
      } catch (err) {
        console.error('Failed to fetch OHLCV', err);
      } finally {
        setLoading(false);
      }
    }

    if (tokenMint) load();
  }, [tokenMint]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(tokenMint);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (error) {
      console.error('Failed to copy token address', error);
    }
  };

  return (
    <div className="p-2 sm:p-3 h-[400px] xl:h-[550px] w-full mx-auto overflow-hidden">
      <div className="flex flex-col sm:flex-row items-center  gap-1 mb-2">
        <h1 className="text-white text-base sm:text-sm font-medium text-center sm:text-left break-all">
          <span className="font-semibold">
            Video<span className="text-[#7619bc]">Token</span>
          </span>{' '}
          Chart for
        </h1>

        <div className="flex items-center gap-1.5 bg-[#0b0d10] px-2 py-1 rounded border  shadow-sm text-xl">
          <span className="text-gray-200 text-lg sm:text-xs font-light break-all max-w-[200px] sm:max-w-none">
            {tokenMint}
          </span>
          <button
            onClick={handleCopy}
            className="text-gray-400 hover:text-white p-1 transition"
            title="Copy"
          >
            <Copy size={14} />
          </button>
          <span
            className={`text-[#7619bc] text-xs ml-1 transition-opacity duration-200 ${
              copied ? 'opacity-100' : 'opacity-0'
            }`}
          >
            Copied!
          </span>
        </div>
      </div>

      {loading ? (
        <p className="text-gray-400 text-xs text-center">Loading...</p>
      ) : ohlcv.length > 0 ? (
        <TokenChart data={ohlcv} />
      ) : (
        <p className="text-gray-400 text-xs text-center">No data available</p>
      )}
    </div>
  );
}

export default memo(TradingViewWidget);
