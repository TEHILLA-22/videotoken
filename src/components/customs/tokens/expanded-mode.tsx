'use client';
import TradingViewWidget from '@/components/shared/chart/trade-view';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import useEmblaCarousel from 'embla-carousel-react';
import { Globe, Send } from 'lucide-react';
import Video from 'next-video';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { BsDiscord } from 'react-icons/bs';
import { FaInstagram } from 'react-icons/fa6';
import { FiFileText, FiThumbsDown, FiThumbsUp } from 'react-icons/fi';
import { IoArrowForwardOutline } from 'react-icons/io5';
import { LuMessageCircleMore } from 'react-icons/lu';
import { MdOutlineKeyboardArrowDown, MdOutlineKeyboardArrowUp } from 'react-icons/md';
import { PiShareFat } from 'react-icons/pi';
import { RiTwitterXFill } from 'react-icons/ri';
import { SiSolana } from 'react-icons/si';
import useTokens from '@/hooks/useTokens';

const socials = [
  { icon: <FaInstagram size={20} /> },
  { icon: <Globe size={20} /> },
  { icon: <BsDiscord size={20} /> },
  { icon: <Send size={20} /> },
  { icon: <RiTwitterXFill size={20} /> },
];

const quick_buy = [
  { icon: <SiSolana size={20} />, label: 'Solana', value: 5 },
  { icon: <SiSolana size={20} />, label: 'Solana', value: 10 },
  { icon: <SiSolana size={20} />, label: 'Solana', value: 50 },
];

type ExpandedModeProps = {
  tokenMint: string;
};

function ExpandedMode({ tokenMint }: ExpandedModeProps) {
  const { tokens, loading } = useTokens();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [emblaRef, embla] = useEmblaCarousel({ dragFree: false, watchDrag: false });
  const videoRefs = useRef<any[]>([]);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  const [showComments, setShowComments] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [comments, setComments] = useState([
    { id: 1, user: 'User123', text: 'This token is crazy 🔥' },
    { id: 2, user: 'AlphaWolf', text: 'I love the project!' },
    { id: 3, user: 'MoonBoy', text: 'When moon? 🚀' },
  ]);

  const [newComment, setNewComment] = useState('');

  const addComment = () => {
    if (newComment.trim() === '') return;

    const newEntry = {
      id: Date.now(),
      user: 'GuestUser', // Mock username
      text: newComment,
    };

    setComments([newEntry, ...comments]);
    setNewComment('');
  };

  const toggleLike = () => {
    setLiked(!liked);
    if (!liked) setDisliked(false); // remove dislike
  };

  const toggleDislike = () => {
    setDisliked(!disliked);
    if (!disliked) setLiked(false); // remove like
  };

  const [selectedTokenIndex, setSelectedTokenIndex] = useState<number>(
    () => tokens?.findIndex((t) => t.mint === tokenMint) ?? 0,
  );

  useEffect(() => {
    if (!tokens) return;
    const idx = tokens.findIndex((t) => t.mint === tokenMint);
    setSelectedTokenIndex(idx >= 0 ? idx : 0);
  }, [tokens, tokenMint]);

  const token = tokens?.[selectedTokenIndex];

  const videos = token?.videoUri ? [{ id: 1, url: token.videoUri, title: token.name }] : [];

  useEffect(() => {
    videoRefs.current.forEach((p) => p?.pause?.());
    videoRefs.current = [];
    setCurrentIndex(0);
    setLiked(false);
    setDisliked(false);
    setCopiedShare(false);
    setComments([{ id: 1, user: 'User123', text: `Welcome to ${token?.name || 'this token'} 🎬` }]);
  }, [selectedTokenIndex, token?.mint]);

  useEffect(() => {
    videoRefs.current.forEach((player, index) => {
      if (player) {
        if (index === currentIndex) {
          player.play?.();
        } else {
          player.pause?.();
        }
      }
    });
  }, [currentIndex]);

  const handleNext = () => {
    if (currentIndex < videos.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Move to next token when at end of current video list
      const nextToken = Math.min(selectedTokenIndex + 1, tokens.length - 1);
      if (nextToken !== selectedTokenIndex) changeTokenByIndex(nextToken);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      // Move to previous token when at start of current video list
      const prevToken = Math.max(selectedTokenIndex - 1, 0);
      if (prevToken !== selectedTokenIndex) changeTokenByIndex(prevToken);
    }
  };

  // change selected token by index and reset inner state
  const changeTokenByIndex = (newIndex: number) => {
    if (!tokens || tokens.length === 0) return;
    if (newIndex < 0 || newIndex >= tokens.length) return;
    setSelectedTokenIndex(newIndex);
  };

  // --- NEW: scroll / swipe handling to move between tokens (not videos) ---
  const rootRef = useRef<HTMLDivElement | null>(null);
  const lastScrollRef = useRef<number>(0);
  const TOUCH_THRESHOLD = 50;
  const SCROLL_THROTTLE_MS = 600;
  const touchStartY = useRef<number | null>(null);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const canScrollTokens = () => Array.isArray(tokens) && tokens.length > 1;

    const onWheel = (e: WheelEvent) => {
      if (!canScrollTokens()) return;
      e.preventDefault();
      const now = Date.now();
      if (now - lastScrollRef.current < SCROLL_THROTTLE_MS) return;
      lastScrollRef.current = now;

      if (e.deltaY > 0) {
        // scroll down -> next token
        const next = Math.min(selectedTokenIndex + 1, tokens.length - 1);
        if (next !== selectedTokenIndex) changeTokenByIndex(next);
      } else if (e.deltaY < 0) {
        // scroll up -> previous token
        const prev = Math.max(selectedTokenIndex - 1, 0);
        if (prev !== selectedTokenIndex) changeTokenByIndex(prev);
      }
    };

    const onTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0]?.clientY ?? null;
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (!canScrollTokens() || touchStartY.current == null) return;
      const touchEndY = e.changedTouches[0]?.clientY ?? null;
      if (touchEndY == null) return;
      const delta = touchStartY.current - touchEndY;
      if (Math.abs(delta) < TOUCH_THRESHOLD) return;
      const now = Date.now();
      if (now - lastScrollRef.current < SCROLL_THROTTLE_MS) return;
      lastScrollRef.current = now;

      if (delta > 0) {
        // swipe up -> next token
        const next = Math.min(selectedTokenIndex + 1, tokens.length - 1);
        if (next !== selectedTokenIndex) changeTokenByIndex(next);
      } else {
        // swipe down -> prev token
        const prev = Math.max(selectedTokenIndex - 1, 0);
        if (prev !== selectedTokenIndex) changeTokenByIndex(prev);
      }
      touchStartY.current = null;
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    el.addEventListener('touchstart', onTouchStart, { passive: true });
    el.addEventListener('touchend', onTouchEnd, { passive: true });

    return () => {
      el.removeEventListener('wheel', onWheel);
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchend', onTouchEnd);
    };
  }, [tokens, selectedTokenIndex]);

  const containerStyle = {
    height: '100vh',
    overflow: 'hidden',
    position: 'relative' as const,
  };

  const innerStyle = {
    transform: `translateY(-${currentIndex * 100}vh)`,
    transition: 'transform 0.3s ease-in-out',
  };

  if (loading) {
    return <div className="text-white text-center pt-10">Loading token data...</div>;
  }

  if (!token) {
    return <div className="text-white text-center pt-10">Token not found</div>;
  }

  return (
    <section ref={rootRef} className="flex flex-col min-w-full w-full flex-1 min-h-full h-full">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 min-w-full min-h-full h-full">
        {/* LEFT: Video Section */}
        <div className="flex flex-col xl:flex-row w-full xl:gap-3 2xl:gap-5 min-h-full h-full">
          <div style={containerStyle} className="rounded-sm border border-gray-400 mx-auto w-full">
            <div style={{ ...innerStyle }}>
              {videos.map((video, index) => (
                <div
                  key={video.id}
                  style={{
                    height: '100vh',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'relative',
                  }}
                  className="w-full"
                >
                  <Video
                    ref={(el) => {
                      if (el) videoRefs.current[index] = el;
                    }}
                    src={video.url}
                    title={video.title}
                    controls
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-row xl:flex-col items-center justify-around pb-5 pt-5">
            <div className="flex flex-row xl:flex-col items-center gap-4">
              <button
                onClick={handlePrev}
                className="rounded-full h-12 w-12 bg-white/25 border border-white/10 py-1.5 text-white flex flex-row items-center justify-center gap-2"
              >
                <MdOutlineKeyboardArrowUp className="text-white" size={30} />
              </button>
              <button
                onClick={handleNext}
                className="rounded-full h-12 w-12 bg-white/25 border border-white/10 py-1.5 text-white flex flex-row items-center justify-center gap-2"
              >
                <MdOutlineKeyboardArrowDown className="text-white" size={30} />
              </button>
            </div>

            <div className="flex flex-row xl:flex-col items-center gap-4">
              <div className="flex flex-row xl:flex-col items-center gap-2">
                <div className="flex flex-col items-center gap-2">
                  <button
                    onClick={toggleLike}
                    className={`rounded-full h-12 w-12 border px-1 py-1.5 flex items-center justify-center 
      ${liked ? 'bg-green-600 border-green-400' : 'bg-white/10 border-white/10'}`}
                  >
                    <FiThumbsUp className="text-white" size={30} />
                  </button>
                  <h1 className="text-white text-sm urbanist">{liked ? '4' : '3'}</h1>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <button
                    onClick={toggleDislike}
                    className={`rounded-full h-12 w-12 border px-1 py-1.5 flex items-center justify-center 
      ${disliked ? 'bg-red-600 border-red-400' : 'bg-white/10 border-white/10'}`}
                  >
                    <FiThumbsDown className="text-white" size={30} />
                  </button>
                  <h1 className="text-white text-sm urbanist">{disliked ? '1' : '0'}</h1>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <button
                    onClick={() => setShowComments(true)}
                    className="rounded-full h-12 w-12 bg-white/10 border border-white/10 px-1 py-1.5 flex items-center justify-center text-white"
                  >
                    <LuMessageCircleMore size={30} />
                  </button>
                  <h1 className="text-white text-sm urbanist">{comments.length}</h1>
                </div>

                <div className="flex flex-col items-center gap-2">
                  <button
                    onClick={() => setShowShare(true)}
                    className="rounded-full h-10 w-10 bg-white/10 border border-white/10 p-1.5 flex items-center justify-center text-white"
                  >
                    <PiShareFat size={30} />
                  </button>
                  <h1 className="text-white text-sm urbanist">0</h1>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-col w-full gap-5 min-w-full col-span-2">
          <div className="flex flex-col min-w-full gap-5">
            <div className="flex flex-row items-center gap-2">
              <Avatar className="w-12 h-12">
                <AvatarImage src={token.imageUri} className="rounded-full w-12 h-12" />
                <AvatarFallback>{token.symbol.charAt(0)}</AvatarFallback>
              </Avatar>
              <h1 className="text-white text-xl font-medium urbanist">{token.name}</h1>
            </div>
            <div className="flex flex-row items-center justify-between min-w-full gap-5 urbanist">
              <h1 className="text-white text-2xl font-bold">{token.symbol}</h1>
              <div className="flex flex-row gap-5">
                <h1 className="text-white text-sm break-all">{token.mint}</h1>
                <button onClick={() => navigator.clipboard.writeText(token.mint)}>
                  <FiFileText className="text-[#F5F5F5]/50 text-2xl cursor-pointer hover:text-white" />
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-col xl:flex-row items-start w-full gap-5 min-h-[300px]">
            {/* pass current token mint so TradingViewWidget updates with selected token */}
            <TradingViewWidget tokenMint={token.mint} />
          </div>

          <div className="flex flex-col w-full">
            <div className="flex flex-row items-center justify-between max-w-full flex-1 w-full">
              <div className="rounded-full flex flex-row items-center gap-2 border border-white px-3 py-1.5">
                {quick_buy.map((q, i) => (
                  <button
                    key={i}
                    className="rounded-full border border-white px-4 py-1.5 text-white flex flex-row items-center gap-2"
                  >
                    <h1 className="text-white text-sm">{q.value}</h1>
                    {q.icon}
                  </button>
                ))}

                <Button className="rounded-full bg-green-700 border border-[#CCCCCC] px-4 py-1.5 text-white flex flex-row items-center gap-2">
                  Quick Buy
                </Button>
              </div>

              <div className="ml-3">
                <Link
                  href={`/landing/tokens/${token.mint}`}
                  className="flex flex-row items-center rounded-full border border-white px-3 py-0.5"
                >
                  <span className="text-white">Go to Coin</span>
                  <IoArrowForwardOutline color="white" />
                </Link>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-[#161622] via-[#FFFFFF] to-[#161622] w-full h-0.5" />

          <div className="flex flex-col gap-3">
            <h1 className="text-white font-semibold">Description</h1>
            <blockquote className="text-white/50 inter text-sm">
              {token.description || 'No description available for this token.'}
            </blockquote>

            <div className="flex space-x-2">
              {token.instagram && (
                <Link href={token.instagram} target="_blank">
                  <button className="text-gray-400 bg-[#161622] border border-[#F5F5F5]/10 p-2 rounded-full hover:text-white">
                    <FaInstagram size={20} />
                  </button>
                </Link>
              )}
              {token.website && (
                <Link href={token.website} target="_blank">
                  <button className="text-gray-400 bg-[#161622] border border-[#F5F5F5]/10 p-2 rounded-full hover:text-white">
                    <Globe size={20} />
                  </button>
                </Link>
              )}
              {token.telegram && (
                <Link href={token.telegram} target="_blank">
                  <button className="text-gray-400 bg-[#161622] border border-[#F5F5F5]/10 p-2 rounded-full hover:text-white">
                    <Send size={20} />
                  </button>
                </Link>
              )}
              {token.other_socials && (
                <Link href={token.other_socials} target="_blank">
                  <button className="text-gray-400 bg-[#161622] border border-[#F5F5F5]/10 p-2 rounded-full hover:text-white">
                    <RiTwitterXFill size={20} />
                  </button>
                </Link>
              )}
            </div>
          </div>

          <div className="bg-gradient-to-r from-[#161622] via-[#FFFFFF] to-[#161622] w-full h-0.5" />
        </div>
      </div>

      {showComments && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[999]">
          <div className="bg-[#161622] border border-white/10 rounded-lg p-5 w-[95%] md:w-[650px] h-[80vh] flex flex-col">
            <h2 className="text-white text-xl font-semibold mb-3">Comments</h2>

            <div className="flex-1 overflow-y-auto space-y-4 pr-2">
              {comments.map((c) => (
                <div key={c.id} className="flex gap-3 items-start">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white">
                    {c.user.charAt(0).toUpperCase()}
                  </div>

                  <div className="flex flex-col">
                    <h3 className="text-white font-medium text-sm">{c.user}</h3>
                    <p className="text-white/70 text-sm">{c.text}</p>
                  </div>
                </div>
              ))}
            </div>

            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full p-3 bg-black/30 border border-white/10 text-white rounded-lg mt-3"
              placeholder="Write a comment..."
            />

            <div className="flex justify-between mt-4">
              <button
                onClick={() => setShowComments(false)}
                className="px-4 py-2 bg-white/10 rounded text-white"
              >
                Close
              </button>

              <button onClick={addComment} className="px-4 py-2 bg-green-700 rounded text-white">
                Post Comment
              </button>
            </div>
          </div>
        </div>
      )}
      {showShare && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[999]">
          <div className="bg-[#161622] border border-white/10 rounded-lg p-5 w-[90%] md:w-[400px]">
            <h2 className="text-white text-lg font-semibold mb-4">Share</h2>

            <button
              className={`border border-white/10 text-white rounded p-3 w-full mb-2 transition 
    ${copiedShare ? 'bg-green-700' : 'bg-white/10'}`}
              onClick={() => {
                navigator.clipboard.writeText(
                  `https://videotoken-roewn.vercel.app/landing/tokens/${token.mint}/expanded`,
                );
                setCopiedShare(true);
                setTimeout(() => setCopiedShare(false), 1500);
              }}
            >
              {copiedShare ? 'Copied!' : 'Copy Link'}
            </button>

            <button
              className="bg-white/10 border border-white/10 text-white rounded p-3 w-full mb-2"
              onClick={() =>
                window.open(
                  `https://twitter.com/intent/tweet?url=${encodeURIComponent(
                    `https://videotoken-roewn.vercel.app/landing/tokens/${token.mint}/expanded`,
                  )}`,
                  '_blank',
                )
              }
            >
              Share to Twitter
            </button>

            <button
              className="bg-white/10 border border-white/10 text-white rounded p-3 w-full"
              onClick={() =>
                window.open(
                  `https://t.me/share/url?url=${encodeURIComponent(
                    `https://videotoken-roewn.vercel.app/landing/tokens/${token.mint}/expanded`,
                  )}`,
                  '_blank',
                )
              }
            >
              Share to Telegram
            </button>

            <div className="flex justify-end mt-4">
              <button
                onClick={() => setShowShare(false)}
                className="px-4 py-2 bg-white/10 rounded text-white"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default ExpandedMode;
