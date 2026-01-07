'use client';
import { Card } from '@/components/ui/card';
import { TokenCardProps } from '@/types/token-card';
import { Globe, Send, ThumbsDown, ThumbsUp } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { FaDiscord, FaInstagram, FaXTwitter } from 'react-icons/fa6';
import { LuUserRoundCheck } from 'react-icons/lu';
import { useState, useEffect } from 'react';

function formatNumber(num: number): string {
  if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1) + 'B';
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + 'M';
  if (num >= 1_000) return (num / 1_000).toFixed(1) + 'K';
  return num.toString();
}

export function TokenCard({
  name,
  id,
  subtext,
  marketCap,
  followers,
  likes: initialLikes,
  dislikes: initialDislikes,
  timeFrame,
  amount,
  imageUrl,
  socialLinks,
}: TokenCardProps) {
  const [likes, setLikes] = useState(initialLikes || 0);
  const [dislikes, setDislikes] = useState(initialDislikes || 0);
  const [userReaction, setUserReaction] = useState<'like' | 'dislike' | null>(null);
  const [jupMarketCap, setJupMarketCap] = useState<string | null>(null);
  const [holderCount, setHolderCount] = useState<string | null>(null);
  const [priceChange24h, setPriceChange24h] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTokenData() {
      try {
        const res = await fetch(`https://lite-api.jup.ag/ultra/v1/search?query=${id}`);
        const data = await res.json();

        if (data && data.length > 0) {
          const token = data[0];

          const mc = token.mcap ? `$${formatNumber(Number(token.mcap))}` : 'N/A';
          const holders = token.holderCount ? formatNumber(token.holderCount) : 'N/A';

          const change = token.stats1h?.priceChange ?? null;
          const formattedChange = change !== null ? `${change.toFixed(2)}%` : 'N/A';

          setJupMarketCap(mc);
          setHolderCount(holders);
          setPriceChange24h(formattedChange);
        } else {
          setJupMarketCap('0');
          setHolderCount('0');
          setPriceChange24h('0');
        }
      } catch (error) {
        console.error('Error fetching Jupiter token data:', error);
      }
    }

    if (id) fetchTokenData();
  }, [id]);

  const handleLike = () => {
    if (userReaction === 'like') {
      setLikes((prev) => prev - 1);
      setUserReaction(null);
    } else {
      if (userReaction === 'dislike') setDislikes((prev) => prev - 1);
      setLikes((prev) => prev + 1);
      setUserReaction('like');
    }
  };

  const handleDislike = () => {
    if (userReaction === 'dislike') {
      setDislikes((prev) => prev - 1);
      setUserReaction(null);
    } else {
      if (userReaction === 'like') setLikes((prev) => prev - 1);
      setDislikes((prev) => prev + 1);
      setUserReaction('dislike');
    }
  };

  return (
    <Link href={`/landing/tokens/${id}`} className="flex flex-col w-full">
      <Card className="min-w-full max-w-full w-full mt-2 xl:max-w-md bg-[#1A1A1A] h-[120px] 2xl:h-[130px] border-none text-white p-1.5 rounded-xl relative z-10">
        <div className="border border-white/25 rounded-xl flex flex-row justify-between items-center px-2 h-full">
          <div className="flex gap-2 items-center">
            <div className="relative w-12 h-16 border border-gray-500 rounded">
              <Image
                src={imageUrl || '/images/token-img.png'}
                alt={name}
                fill
                className="rounded-md object-cover"
              />
            </div>

            <div className="flex flex-col urbanist">
              <div className="flex items-center gap-1">
                <span className="text-sm 2xl:text-base font-semibold">{name}</span>
                <span className="text-gray-400 text-xs">{subtext}</span>
              </div>

              <div className="flex items-center gap-1.5 text-[10px]">
                <p className="text-[#F5F5F5]/50">MC:</p>

                <span className="text-amber-300">{jupMarketCap || '...'}</span>

                <span className="text-gray-500 text-[10px]">
                  <LuUserRoundCheck className="w-3 h-3" />
                </span>

                <span>{holderCount || '...'}</span>

                <span
                  className={`ml-1 ${
                    priceChange24h && priceChange24h.includes('-')
                      ? 'text-red-400'
                      : 'text-green-400'
                  } text-[10px]`}
                >
                  {priceChange24h || '...'}
                </span>
              </div>

              <div className="flex gap-1.5 mt-1.5">
                {socialLinks.instagram && (
                  <Link
                    href={socialLinks.instagram}
                    className="p-1 rounded-full bg-purple-600/20 text-purple-400 hover:bg-purple-600/30 hover:text-purple-300 transition-colors"
                  >
                    <FaInstagram className="w-3.5 h-3.5" />
                  </Link>
                )}
                {socialLinks.website && (
                  <Link
                    href={socialLinks.website}
                    className="p-1 rounded-full bg-purple-600/20 text-purple-400 hover:bg-purple-600/30 hover:text-purple-300 transition-colors"
                  >
                    <Globe className="w-3.5 h-3.5" />
                  </Link>
                )}
                {socialLinks.discord && (
                  <Link
                    href={socialLinks.discord}
                    className="p-1 rounded-full bg-purple-600/20 text-purple-400 hover:bg-purple-600/30 hover:text-purple-300 transition-colors"
                  >
                    <FaDiscord className="w-3.5 h-3.5" />
                  </Link>
                )}
                {socialLinks.telegram && (
                  <Link
                    href={socialLinks.telegram}
                    className="p-1 rounded-full bg-purple-600/20 text-purple-400 hover:bg-purple-600/30 hover:text-purple-300 transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </Link>
                )}
                {socialLinks.twitter && (
                  <Link
                    href={socialLinks.twitter}
                    className="p-1 rounded-full bg-purple-600/20 text-purple-400 hover:bg-purple-600/30 hover:text-purple-300 transition-colors"
                  >
                    <FaXTwitter className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>
            </div>
          </div>

          <div className="flex-1 min-h-full max-w-[1px] bg-white/10" />

          <div className="flex items-center flex-col gap-1.5 text-xs text-gray-300">
            <div className="flex items-center gap-1 bg-[#161622] px-3 py-1 rounded-sm border border-[#F5F5F5]/50">
              <svg className="w-3.5 h-3.5 text-purple-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
              <span className="text-xs">{amount}</span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleLike();
                }}
                className={`flex items-center gap-1 transition-colors ${
                  userReaction === 'like' ? 'text-green-400' : 'text-gray-400 hover:text-green-300'
                }`}
              >
                <ThumbsUp className="w-3.5 h-4" />
                <span className="text-xs">{likes}</span>
              </button>

              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleDislike();
                }}
                className={`flex items-center gap-1 transition-colors ${
                  userReaction === 'dislike' ? 'text-red-400' : 'text-gray-400 hover:text-red-300'
                }`}
              >
                <ThumbsDown className="w-3.5 h-4" />
                <span className="text-xs">{dislikes}</span>
              </button>
            </div>
            <span className="text-gray-500 text-[10px]">{timeFrame}</span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
