'use client';

import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import Logo from '@public/icons/Logo.png';
import { SearchIcon, User } from 'lucide-react';
import Image from 'next/image';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Connection } from '@solana/web3.js';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '../../ui/button';
import SearchInput from './search-input';
import ReownButton from '../ReownButton';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const connection = new Connection('https://api.devnet.solana.com', 'confirmed');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`sticky ${
        pathname?.includes('expanded') ? 'hidden' : ''
      } top-0 right-0 z-20 md:mt-8 flex py-4 min-h-16 shrink-0 items-center gap-2 transition-all w-full mx-auto duration-75 ease-linear 
            ${isScrolled ? 'bg-[#0A0A0A] text-white shadow-md' : 'bg-transparent'}`}
    >
      <div className="flex items-center justify-between w-full 2xl:max-w-[97%] mx-auto">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="cursor-pointer sm:hidden" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <SearchInput />
        </div>

        <div className="hidden lg:flex">
          <Image src={Logo} alt="Logo" fetchPriority="high" className="h-7 w-7 xl:h-10 xl:w-10" />
        </div>

        <div className="flex flex-row items-center gap-5">
          <Button
            size={'icon'}
            className="bg-white/10 border border-white/50 h-10 w-10 text-white rounded-full xl:hidden"
          >
            <SearchIcon size={30} />
          </Button>
          <ReownButton />
          <Button
            size={'icon'}
            className="bg-white/10 border border-[#F5F5F5]/25 h-10 w-10 text-white rounded-full"
          >
            <User size={60} className="h-9 w-9" />
          </Button>
        </div>
      </div>
    </header>
  );
}
