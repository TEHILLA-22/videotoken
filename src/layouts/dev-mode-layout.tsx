import { DevSidebar } from "@/components/shared/navigation/dev-sidebar"
import Header from "@/components/shared/navigation/header"
import {
    SidebarInset,
    SidebarProvider
} from "@/components/ui/sidebar"

interface DevModeNavLayoutProps {
    children: React.ReactNode
}

export default function DevModeNavLayout({ children }: DevModeNavLayoutProps) {
    return (
        <SidebarProvider className="px-3">
            <DevSidebar />
            <SidebarInset>
                <Header />
                <div className="flex flex-1 flex-col gap-4 sm:p-4 pt-0 ">
                    {children}
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
