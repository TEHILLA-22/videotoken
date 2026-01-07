'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import useTokens from '@/hooks/useTokens';
import filter_icon from '@public/icons/filter_icon.svg';
import tokenImage from '@public/icons/token.svg';
import Image from 'next/image';
import { Fragment } from 'react';
import SortTokens from './sort-tokens';
import { TokenCard } from './token-card';

type TokenProps = {
  category: string;
};

function timeAgo(createdAt: string) {
  if (typeof window === 'undefined') return '';

  const seconds = Math.floor((Date.now() - new Date(createdAt).getTime()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

function Tokens({ category }: TokenProps) {
  const { tokens, loading } = useTokens();
  console.log(tokens);

  return (
    <div className="flex flex-col w-full sm:max-w-xl pt-3 rounded-t-sm px-2 h-screen mx-auto relative z-10 border border-white/30">
      <div className="flex flex-row items-center justify-between pb-3 border-b border-b-white/30">
        <SortTokens />
        <h1 className="text-white font font-normal urbanist">{category}</h1>

        <DropdownMenu>
          <DropdownMenuTrigger className="hidden lg:flex flex-row items-center gap-2 border rounded-sm px-2 py-1 border-gray-200/20  bg-[#1A1A1A]">
            <Fragment>
              <Image src={filter_icon} fetchPriority="high" alt="filter icon" className="h-4 w-4" />
              <span className="text-sm font-light text-white">Filters</span>
            </Fragment>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-[#462C5A] text-white">
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Billing</DropdownMenuItem>
            <DropdownMenuItem>Team</DropdownMenuItem>
            <DropdownMenuItem>Subscription</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Scrollable Token List */}
      <ScrollArea className="whitespace-nowrap flex-1 max-h-[calc(100vh-100px)] w-full flex flex-col">
        {loading ? (
          <div className="flex flex-col gap-4 mt-2">
            {[0, 1, 2, 3, 4, 5].map((ske) => (
              <Skeleton key={ske} className="h-24 w-full rounded-sm shadow-2xs bg-[#1A1A1A]" />
            ))}
          </div>
        ) : (
          tokens.map((token) => (
            <TokenCard
              key={token.mint}
              id={token.mint}
              name={token.name}
              description={token.description || ''}
              subtext={token.symbol}
              marketCap="$N/A" // or fetch actual market cap if available
              followers={0}
              likes={0}
              dislikes={0}
              timeFrame={timeAgo(token.createdAt)}
              amount={token.amount}
              imageUrl={token.imageUri || '/images/token-img.png'}
              socialLinks={{
                instagram: token.instagram || '',
                website: token.website || '',
                discord: token.other_socials || '',
                telegram: token.telegram || '',
                twitter: '',
              }}
            />
          ))
        )}
      </ScrollArea>
    </div>
  );
}

export default Tokens;
