import {
    SidebarGroup,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function NavMain({
    items,
}: {
    items: {
        title: string;
        url: string;
        icon: React.JSX.Element;
    }[];
}) {
    const pathname = usePathname();

    const isLanding = pathname?.startsWith('/landing');
    const isDev = pathname?.startsWith('/dev');

    return (
        <SidebarGroup className="mt-5 px-3">
            <SidebarMenu>
                {items.map((item) => {
                    let bgColor = "";
                    let iconColor = "text-yellow-500";

                    if (item.url.startsWith('/landing') && isLanding) {
                        bgColor = "bg-[#7619BC]";
                        iconColor = "text-[#7619BC]";
                    } else if (item.url.startsWith('/dev') && isDev) {
                        bgColor = "bg-[#FFEA00]";
                        iconColor = "text-[#FFEA00]";
                    }

                    return (
                        <SidebarMenuItem key={item.title}>
                            <Link href={item.url}>
                                <SidebarMenuButton
                                    size="lg"
                                    tooltip={item.title}
                                    className={`flex cursor-pointer items-center gap-3 py-2 my-2 px-5 rounded-lg transition-all duration-300 mx-auto hover:bg-gray-800 active:bg-gray-900 ${pathname?.startsWith(item.url) ? "" : ""}`}
                                >
                                    {item.icon && (
                                        <span className={`text-2xl ml-1 ${item.title === "Tokens" && "rotate-45"} ${pathname?.startsWith(item.url) ? iconColor : "text-white"}`}>
                                            {item.icon}
                                        </span>
                                    )}
                                    <span className="text-white text-base font-light">
                                        {item.title}
                                    </span>
                                </SidebarMenuButton>
                            </Link>
                        </SidebarMenuItem>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}
