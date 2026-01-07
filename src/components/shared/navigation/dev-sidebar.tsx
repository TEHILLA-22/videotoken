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
import { BsStars } from "react-icons/bs"
import { FiPlus } from "react-icons/fi"
import { IoMdHelpCircleOutline } from "react-icons/io"
import { IoCalendarOutline, IoDiamondOutline } from "react-icons/io5"
import { PiBookmarksDuotone, PiNewspaper, PiRanking } from "react-icons/pi"
import ModeSwitcher from "../mode-switcher"
import { NavMain } from "./nav-main"

const data = {

    nav_1: [
        {
            title: "Create Tokens",
            url: "/dev/create-token",
            icon: <FiPlus />
        },
        {
            title: "My Tokens",
            url: "/dev/my-tokens",
            icon: <PiBookmarksDuotone />
        },
    ],

    nav_2: [
        {
            title: "Dev Level",
            url: "/dev/dev-level",
            icon: <BsStars />
        },
        {
            title: "Leaderboard",
            url: "/dev/leaderboard",
            icon: <PiRanking />
        },
    ],
    nav_3: [
        {
            title: "Premium",
            url: "/dev/premium",
            icon: <IoDiamondOutline />
        },
        {
            title: "Events",
            url: "/dev/events",
            icon: <IoCalendarOutline />
        },
    ],
    nav_4: [
        {
            title: "News",
            url: "/dev/news",
            icon: <PiNewspaper />
        },
        {
            title: "Help / Support",
            url: "/dev/support",
            icon: <IoMdHelpCircleOutline />
        },
    ],

}


export function DevSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { toggleSidebar } = useSidebar()
    const handleMouseEnter = () => {
        toggleSidebar();
    };
    return (
        <Sidebar
            collapsible="icon"
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
                <NavMain items={data.nav_4} />
            </SidebarContent>
            <SidebarRail />
        </Sidebar>
    )
}
