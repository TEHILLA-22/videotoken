import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MdSort } from "react-icons/md";
import Link from "next/link"

export default function SortTokens() {

    const links = [
        { name: "New", param: "new" },
        { name: "Trending", param: "trending" },
        { name: "About to Launch", param: "about-to-launch" }
    ]
    
    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                asChild
                className={"xl:hidden"}
            >
                <Button className="bg-[#262632] h-10 w-10 text-white rounded-full">
                    <MdSort  size={30}/>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-[#462C5A] text-white">
                {links.map((link) => (
                    <Link key={link.name} href={`?tab=${link.param}`} scroll={false}>
                        <DropdownMenuItem className={"text-sm"}>
                            {link.name}
                        </DropdownMenuItem>
                    </Link>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
