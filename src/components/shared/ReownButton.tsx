'use client';

import { useAppKit, useAppKitAccount } from '@reown/appkit/react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

export default function ReownButton() {
  const { open } = useAppKit();
  const { isConnected } = useAppKitAccount();

  return (
    <Button
      onClick={() => open()}
      className="relative flex items-center gap-2 rounded-md px-3 md:px-4 bg-transparent border border-[#F5F5F5]/25 text-white hover:bg-[#2B2B2B] transition-all duration-200"
    >
      {isConnected && (
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full rounded-full bg-[#7619bc] opacity-75 animate-ping" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#7619bc] animate-pulse" />
        </span>
      )}

      <span className="hidden font-light xl:flex">
        {isConnected ? 'Connected' : 'Connect Wallet'}
      </span>

      <Image
        src="/icons/wallet.svg"
        alt="wallet icon"
        width={20}
        height={20}
        fetchPriority="high"
        className="object-contain"
      />
    </Button>
  );
}
