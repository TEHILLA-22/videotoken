'use client';

import { Sidebar, SidebarContent, SidebarRail, useSidebar } from '@/components/ui/sidebar';
import Logo from '@public/icons/Logo.png';
import Image from 'next/image';
import Link from 'next/link';
import * as React from 'react';
import { GoTag } from 'react-icons/go';
import { HiOutlineSwatch, HiOutlineWallet } from 'react-icons/hi2';
import { IoMdHelpCircleOutline } from 'react-icons/io';
import { IoCalendarOutline, IoDiamondOutline } from 'react-icons/io5';
import { PiClockCountdown, PiNewspaper, PiShoppingBagOpenDuotone } from 'react-icons/pi';
import { TfiLayoutGrid2 } from 'react-icons/tfi';
import ModeSwitcher from '../mode-switcher';
import { NavMain } from './nav-main';

const data = {
  nav_1: [
    { title: 'Tokens', url: '/landing/tokens', icon: <TfiLayoutGrid2 /> },
    { title: 'About To launch', url: '/landing/to-launch', icon: <PiClockCountdown /> },
    { title: 'Promotoken', url: '/landing/promo-token', icon: <GoTag /> },
    { title: 'Watchlist', url: '/landing/watchlist', icon: <HiOutlineSwatch /> },
    { title: 'Portfolio', url: '/landing/port-folio', icon: <PiShoppingBagOpenDuotone /> },
    { title: 'Wallet', url: '/landing/wallet', icon: <HiOutlineWallet /> },
  ],
  nav_2: [
    { title: 'Events', url: '/landing/events', icon: <IoCalendarOutline /> },
    { title: 'Premium', url: '/landing/premium', icon: <IoDiamondOutline /> },
  ],
  nav_3: [
    { title: 'News', url: '/landing/news', icon: <PiNewspaper /> },
    { title: 'Support', url: '/landing/support', icon: <IoMdHelpCircleOutline /> },
  ],
};

export function TradingNavbar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { toggleSidebar } = useSidebar();

  return (
    <Sidebar
      collapsible="icon"
      {...props}
      className="!bg-[#0A0A0A]"
      onClick={(e) => {
        // Only toggle sidebar if the container itself was clicked
        if (e.target === e.currentTarget) {
          toggleSidebar();
        }
      }}
    >
      <SidebarContent className="!bg-[#0A0A0A] relative z-10 p-0">
        <Link href="/landing/tokens" className="mx-auto">
          <div className="mt-12 mb-5 mx-auto flex flex-row gap-2">
            <Image src={Logo} alt="Logo" fetchPriority="high" className="h-8 w-8" />
            <h1 className="group-data-[collapsible=icon]:hidden text-white urbanist font-bold">
              Videotokens
            </h1>
          </div>
        </Link>
        <ModeSwitcher />
        <NavMain items={data.nav_1} />
        <NavMain items={data.nav_2} />
        <NavMain items={data.nav_3} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}

/*



"use client"

import {
    Sidebar,
    SidebarContent,
    SidebarRail,
    useSidebar,
} from "@/components/ui/sidebar"
import Logo from "@public/icons/Logo.png"
import Image from "next/image"
import Link from "next/link"
import * as React from "react"
import { GoTag } from "react-icons/go"
import { HiOutlineSwatch, HiOutlineWallet } from "react-icons/hi2"
import { IoMdHelpCircleOutline } from "react-icons/io"
import { IoCalendarOutline, IoDiamondOutline } from "react-icons/io5"
import { PiClockCountdown, PiNewspaper, PiShoppingBagOpenDuotone } from "react-icons/pi"
import { TfiLayoutGrid2 } from "react-icons/tfi"
import ModeSwitcher from "../mode-switcher"
import { NavMain } from "./nav-main"

const data = {

    nav_1: [
        {
            title: "Tokens",
            url: "/landing/tokens",
            icon: <TfiLayoutGrid2 />
        },
        {
            title: "About To launch",
            url: "/landing/to-launch",
            icon: <PiClockCountdown />
        },
        {
            title: "Promotoken",
            url: "/landing/promo-token",
            icon: <GoTag />
        },
        {
            title: "Watchlist",
            url: "/landing/watchlist",
            icon: <HiOutlineSwatch />
        },
        {
            title: "Portfolio",
            url: "/landing/port-folio",
            icon: <PiShoppingBagOpenDuotone />
        },
        {
            title: "Wallet",
            url: "/landing/wallet",
            icon: <HiOutlineWallet />
        },
    ],

    nav_2: [
        {
            title: "Events",
            url: "/landing/events",
            icon: <IoCalendarOutline />,
        },
        {
            title: "Premium",
            url: "/landing/premium",
            icon: <IoDiamondOutline />
        },
    ],
    nav_3: [
        {
            title: "News",
            url: "/landing/news",
            icon: <PiNewspaper />
        },
        {
            title: "Support",
            url: "/landing/support",
            icon: <IoMdHelpCircleOutline />
        },
    ],

}


export function TradingNavbar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { toggleSidebar } = useSidebar()
    const handleMouseEnter = () => {
        toggleSidebar();
    };
    return (
        <Sidebar collapsible="icon"
          {...props}
          className="!bg-[#0A0A0A]"
          >
            <SidebarContent className="!bg-[#0A0A0A] relative z-10 p-0">
                <Link href="/landing/tokens" className="mx-auto">
                    <div className="mt-12 mb-5 mx-auto flex flex-row gap-2">
                        <Image src={Logo} alt="Logo" fetchPriority="high" className="h-8 w-8" />
                        <h1 className="group-data-[collapsible=icon]:hidden text-white urbanist font-bold">Videotokens</h1>
                    </div>
                </Link>
                <ModeSwitcher />
                <NavMain items={data.nav_1} />
                <NavMain items={data.nav_2} />
                <NavMain items={data.nav_3} />
            </SidebarContent>
            <SidebarRail />
        </Sidebar>
    )
}



*/
