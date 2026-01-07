import { useState } from 'react';

import Player from '@/components/customs/video-player/player';
import useTokens from '@/hooks/useTokens';
import images from '@public/images/dev_token_img.jpg';
import Video from 'next-video';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { FaXTwitter } from 'react-icons/fa6';
import { FiThumbsUp } from 'react-icons/fi';
import { IoLogoInstagram } from 'react-icons/io5';
import { LuThumbsDown } from 'react-icons/lu';
import { PiShareFat, PiTelegramLogoDuotone } from 'react-icons/pi';
import { TbBrandDiscord } from 'react-icons/tb';
import { TfiWorld } from 'react-icons/tfi';
import { useMediaQuery } from 'react-responsive';
import Comments from './comments';

function VideoSection() {
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' });
  const { tokens, loading } = useTokens();
  const [likes, setLikes] = useState(5);
  const [dislikes, setDislikes] = useState(2);
  const [userReaction, setUserReaction] = useState<'like' | 'dislike' | null>(null);
  const [showShare, setShowShare] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const handleLike = () => {
    if (userReaction === 'like') {
      setLikes(likes - 1);
      setUserReaction(null);
    } else {
      setLikes(userReaction === 'dislike' ? likes + 1 : likes + 1);
      if (userReaction === 'dislike') setDislikes(dislikes - 1);
      setUserReaction('like');
    }
  };

  const handleDislike = () => {
    if (userReaction === 'dislike') {
      setDislikes(dislikes - 1);
      setUserReaction(null);
    } else {
      setDislikes(userReaction === 'like' ? dislikes + 1 : dislikes + 1);
      if (userReaction === 'like') setLikes(likes - 1);
      setUserReaction('dislike');
    }
  };

  const handleShareClick = () => {
    setShowShare(true);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);

    setCopySuccess(true);

    setTimeout(() => {
      setCopySuccess(false);
    }, 1000);
  };

  const params = useParams();
  const id =
    typeof params?.id === 'string'
      ? params.id
      : Array.isArray(params?.id)
      ? params?.id[0]
      : undefined;

  const token = tokens.find((t) => t.mint === id);

  const buttons = [
    {
      name: 'Instagram',
      path: token?.instagram || '',
      icon: <IoLogoInstagram color="white" size={19} />,
    },
    { name: 'Website', path: token?.website || '', icon: <TfiWorld color="white" size={19} /> },
    {
      name: 'Telegram',
      path: token?.telegram || '',
      icon: <PiTelegramLogoDuotone color="white" size={19} />,
    },
    {
      name: 'Twitter',
      path: token?.other_socials || '',
      icon: <FaXTwitter color="white" size={19} />,
    },
    { name: 'Discord', path: '', icon: <TbBrandDiscord color="white" size={19} /> },
  ];

  if (loading) {
    return <div className="text-white text-sm">Loading...</div>;
  }

  if (!token) {
    return <div className="text-white text-sm">No token found.</div>;
  }

  return (
    <div className="flex flex-col sm:flex-col xl:flex-row w-full gap-5 mt-5 md:max-w-xl lg:max-w-full">
      <div
        className={
          'relative h-full md:max-w-full lg:max-w-sm border w-full rounded-md broder-gray-300'
        }
      >
        <Video as={Player} height={500} src={token.videoUri} poster={token.imageUri} />
        <Link href={`/landing/tokens/${token.mint}/expanded`}>
          <button
            className={
              'absolute top-1 right-1 bg-[#7619BC] text-white text-xs rounded-full p-2 cursor-pointer'
            }
          >
            Watch more
          </button>
        </Link>
      </div>
      <div className="flex flex-col">
        <div className="flex flex-row urbanist gap-3">
          <h1 className="text-white text-2xl font-semibold">{token.symbol}</h1>
          <h1 className="text-white/50 text-xl">{token.name}</h1>
        </div>
        <div className="flex flex-col sm:flex-row justify-between max-w-full sm:items-center my-3 gap-y-2">
          <div className="flex gap-3 items-center flex-row">
            <Image
              src={images}
              fetchPriority="high"
              alt="High_Avatar"
              className="h-16 w-16 border border-white rounded-full"
            />
            <div className="flex flex-col py-3">
              <h1 className="text-base">Devtoken_0012</h1>
              <h1 className="text-xs text-white/25">1500 Followers</h1>
            </div>
          </div>

          <div className="flex flex-row gap-4">
            <button className="flex flex-row items-center cursor-pointer rounded-full border border-white/25 px-6 gap-5 py-1">
              <div
                onClick={handleLike}
                className="flex flex-row items-center gap-2 border-r border-white/25 pr-2 cursor-pointer"
              >
                <FiThumbsUp size={18} color={userReaction === 'like' ? '#00FF99' : 'white'} />
                <span className="text-xs sm:text-sm">{likes}</span>
              </div>

              <div onClick={handleDislike} className="cursor-pointer">
                <LuThumbsDown size={18} color={userReaction === 'dislike' ? '#FF5555' : 'white'} />
              </div>
            </button>

            <button
              onClick={handleShareClick}
              className="flex flex-row items-center cursor-pointer rounded-full border gap-2 border-white/25 px-6 py-1.5"
            >
              <PiShareFat color="white" />
              <span className="text-xs">Share</span>
            </button>
          </div>

          {showShare && (
            <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
              <div className="bg-[#1A1A1A] p-5 rounded-lg w-[90%] max-w-sm border border-white/10">
                <h1 className="text-white text-base mb-3">Share this video</h1>

                <div className="flex flex-col gap-3">
                  <button
                    onClick={handleCopy}
                    className="text-white bg-[#7619BC] px-4 py-2 rounded-md text-sm"
                  >
                    {copySuccess ? 'Link Copied!' : 'Copy Link'}
                  </button>

                  <a
                    href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                      window.location.href,
                    )}`}
                    target="_blank"
                    className="text-white text-sm border border-white/20 px-4 py-2 rounded-md text-center"
                  >
                    Share to Twitter
                  </a>

                  <a
                    href={`https://t.me/share/url?url=${encodeURIComponent(window.location.href)}`}
                    target="_blank"
                    className="text-white text-sm border border-white/20 px-4 py-2 rounded-md text-center"
                  >
                    Share to Telegram
                  </a>

                  <a
                    href="#"
                    className="text-white text-sm border border-white/20 px-4 py-2 rounded-md text-center"
                  >
                    Share to Discord
                  </a>

                  <button
                    onClick={() => setShowShare(false)}
                    className="text-gray-300 text-xs mt-2"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <blockquote className="text-sm text-[#F5F5F5]">
          {token.description || 'No description available.'}
        </blockquote>

        <div className="flex items-center gap-2 my-3 overflow-x-auto max-w-screen">
          {buttons.map(({ path, name, icon }) => (
            <Link href={path} key={name} target="_blank" rel="noopener noreferrer">
              <button
                className="flex flex-row items-center gap-3 rounded-full border border-white/25 py-1 px-3"
                disabled={!path}
              >
                <span className="text-xs urbanist text-[#F5F5F5]/70">{name}</span>
                <span>{icon}</span>
              </button>
            </Link>
          ))}
        </div>

        <hr className={'text-white/10 my-5'} />

        <div className="flex flex-col w-full">
          <h1 className="text-white text-base font-medium mb-3">Comments</h1>

          <div className="flex flex-col">
            <div className="flex flex-row items-center">
              <h1 className="text-[#F5F5F5]/75 text-xs font-medium">
                @Devtoken_001:
                <span className="text-white/50 font-light text-xs"> 15 sec</span>
              </h1>
            </div>

            <blockquote className="text-sm text-white pt-2">
              This is the best Video ever. This will go to the moon.
            </blockquote>
          </div>
        </div>

        <Comments />
      </div>
    </div>
  );
}
export default VideoSection;
