import Header from "@/components/shared/navigation/header"
import { TradingNavbar } from "@/components/shared/navigation/trading-sidebar"
import {
    SidebarInset,
    SidebarProvider
} from "@/components/ui/sidebar"

interface NavLayoutProps {
    children: React.ReactNode
}

export default function NavLayout({ children }: NavLayoutProps) {
    return (
        <SidebarProvider className="px-3">
            <TradingNavbar />
            <SidebarInset>
                <Header />
                <div className="flex flex-1 flex-col gap-4 sm:p-4 pt-0 ">
                    {children}
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
