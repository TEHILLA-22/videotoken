"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { ChevronDown, Search } from "lucide-react"
import { usePathname } from "next/navigation"
import type React from "react"
import { useState } from "react"

type SearchType = "profile" | "tokens" | "ALT"

export default function SearchInput() {
  const pathname = usePathname()
  const [selectedType, setSelectedType] = useState<SearchType>("profile")
  const [searchValue, setSearchValue] = useState("")
  const [open, setOpen] = useState(false)

  const searchOptions = [
    { value: "profile" as SearchType, label: "Profile" },
    { value: "tokens" as SearchType, label: "Tokens" },
    { value: "ALT" as SearchType, label: "ALT" },
  ]

  const getPlaceholder = () => {
    switch (selectedType) {
      case "profile":
        return " "
      case "tokens":
        return " "
      case "ALT":
        return "Search"
      default:
        return " "
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle search logic here
    console.log(`Searching for "${searchValue}" in ${selectedType}`)
  }

  return (
    <div className="relative hidden xl:flex z-50">
      <form onSubmit={handleSearch} className="flex w-full">
        <DropdownMenu open={open} onOpenChange={setOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              onClick={() => setOpen(true)}
              variant="ghost"
              className={`h-[2.3rem] px-3 rounded-r-none bg-transparent z-10 text-white hover:bg-white/10 absolute left-0 top-0.5 ${pathname?.startsWith("/dev")
                  ? "focus:border-[#FFEA00]"
                  : pathname?.startsWith("/landing")
                    ? "focus:border-[#7619BC]"
                    : ""
                }`}
            >
              <span className="urbanist font-light capitalize">{selectedType}</span>
              <ChevronDown size={16} />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="bg-gray-600">
            {searchOptions.map((option) => (
              <DropdownMenuItem
                key={option.value}
                onClick={() => {
                  setSelectedType(option.value)
                  setSearchValue("")
                }}
                className="cursor-pointer text-white"
              >
                {option.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>


        <div className="relative flex-1">
          <Input
            placeholder={getPlaceholder()}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className={`min-w-2xs urbanist active:ring-0 ring-0 outline-0 w-full pl-20 py-5 placeholder:font-light bg-transparent pr-3 text-white placeholder:text-white border border-white/25 ${pathname?.startsWith("/dev")
              ? "focus:border-[#FFEA00]"
              : pathname?.startsWith("/landing")
                ? "focus:border-[#7619BC]"
                : ""
              }`}
          />
          <button type="submit" className="absolute top-2 right-2 p-1 hover:bg-white/10 rounded transition-colors">
            <Search size={22} color="white" />
          </button>
        </div>
      </form>
    </div>
  )
}
