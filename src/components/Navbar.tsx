"use client"

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuLink,
  NavigationMenuTrigger,
  NavigationMenuContent,
} from "@/components/ui/navigation-menu"

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"

import { GlobeIcon } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useState, useMemo, useEffect } from "react"
import { useCountry } from "@/context/CountryContext"

import {
  mainCategories,
  otherCategories,
  countries,
} from "@/data/Navbar"

type Country = {
  name: string
  code: string
}

function normalize(str: string) {
  return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
}

export default function Navbar() {
  const { country, setCountry } = useCountry()
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [debouncedSearch, setDebouncedSearch] = useState<string>("")
  const [isSmallScreen, setIsSmallScreen] = useState<boolean>(false)

  // Responsive logic using matchMedia
  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 768px)")

    const handleMediaChange = (e: MediaQueryListEvent | MediaQueryList) => {
      setIsSmallScreen(e.matches)
    }

    handleMediaChange(mediaQuery) // Initial check
    mediaQuery.addEventListener("change", handleMediaChange)

    return () => {
      mediaQuery.removeEventListener("change", handleMediaChange)
    }
  }, [])

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm)
    }, 200)
    return () => clearTimeout(handler)
  }, [searchTerm])

  const filteredCountries: Country[] = useMemo(() => {
    const normalizedSearch = normalize(debouncedSearch.trim())
    if (!normalizedSearch) return countries.slice(0, 50)

    const startsWithMatches: string[] = []
    const includesMatches: string[] = []

    countries.forEach(({ name }) => {
      const normalizedName = normalize(name)
      if (normalizedName.startsWith(normalizedSearch)) {
        startsWithMatches.push(name)
      } else if (normalizedName.includes(normalizedSearch)) {
        includesMatches.push(name)
      }
    })

    startsWithMatches.sort()
    includesMatches.sort()

    const combined = [...startsWithMatches, ...includesMatches].slice(0, 50)

    return combined
      .map((name) => countries.find((c) => c.name === name))
      .filter((c): c is Country => c !== undefined)
  }, [debouncedSearch])

  const latestNewsCategory = mainCategories.find(cat =>
    cat.toLowerCase().includes("latest news")
  )

  const smallScreenOtherCategories = [
    ...mainCategories.filter(cat => cat !== latestNewsCategory),
    ...otherCategories,
  ]

  return (
    <div className="relative flex w-full items-center justify-between px-4 py-2 border-b bg-background shadow-sm sticky top-0 z-50 text-black">
      {/* Left: Logo + Menu */}
      <div className="flex items-center gap-6">
        <Image
          src="/logo.png"
          alt="Logo"
          width={40}
          height={5}
          className="h-auto w-auto object-contain"
        />

        {/* NavigationMenu */}
        <NavigationMenu viewport={false}>
          <NavigationMenuList className="flex items-center gap-4">
            {isSmallScreen ? (
              <>
                {latestNewsCategory && (
                  <NavigationMenuItem key={latestNewsCategory}>
                    <NavigationMenuLink asChild>
                      <Link
                        href="/"
                        className="capitalize text-sm font-medium hover:no-underline"
                      >
                        {latestNewsCategory}
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                )}

                <NavigationMenuItem>
                  <NavigationMenuTrigger className="capitalize text-sm font-medium hover:no-underline">
                    Other Categories
                  </NavigationMenuTrigger>

                  <NavigationMenuContent
                    className="bg-white shadow-lg rounded-md border border-gray-200 p-4 text-gray-900 absolute left-0 top-full mt-2 z-50 w-[90vw] max-w-sm"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                      {smallScreenOtherCategories.map((category) => (
                        <NavigationMenuLink asChild key={category}>
                          <Link
                            href={`/category/${category.replace(/\s+/g, "-").toLowerCase()}`}
                            className="block text-sm hover:bg-gray-100 px-2 py-1 rounded capitalize whitespace-nowrap"
                          >
                            {category}
                          </Link>
                        </NavigationMenuLink>
                      ))}
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </>
            ) : (
              <>
                {mainCategories.map((category) => (
                  <NavigationMenuItem key={category}>
                    <NavigationMenuLink asChild>
                      <Link
                        href={
                          category.toLowerCase().includes("latest news")
                            ? "/"
                            : `/category/${category.replace(/\s+/g, "-").toLowerCase()}`
                        }
                        className="capitalize text-sm font-medium hover:no-underline"
                      >
                        {category}
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ))}

                <NavigationMenuItem>
                  <NavigationMenuTrigger className="capitalize text-sm font-medium hover:no-underline">
                    Other Categories
                  </NavigationMenuTrigger>

                  <NavigationMenuContent
                    className="bg-white shadow-lg rounded-md border border-gray-200 p-4 text-gray-900"
                    style={{ minWidth: "250px", maxWidth: "400px" }}
                  >
                    <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                      {otherCategories.map((category) => (
                        <NavigationMenuLink asChild key={category}>
                          <Link
                            href={`/category/${category.replace(/\s+/g, "-").toLowerCase()}`}
                            className="block text-sm hover:bg-gray-100 px-2 py-1 rounded capitalize whitespace-nowrap"
                          >
                            {category}
                          </Link>
                        </NavigationMenuLink>
                      ))}
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </>
            )}
          </NavigationMenuList>
        </NavigationMenu>
      </div>

      {/* Right: Country Selector */}
      <div className="flex items-center gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-1 px-3 py-2 text-sm font-medium border rounded-md hover:bg-gray-100">
              <GlobeIcon className="w-4 h-4" />
              {!isSmallScreen && <span>{country?.name ?? "World"}</span>}
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="min-w-[12rem] p-2 w-60">
            <div
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => e.stopPropagation()}
              className="mb-2"
            >
              <input
                autoFocus
                type="text"
                placeholder="Search country..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-2 py-1 border border-gray-300 rounded text-sm outline-none focus:ring focus:ring-blue-200"
              />
            </div>

            <div className="max-h-[200px] overflow-y-auto">
              {filteredCountries.length > 0 ? (
                filteredCountries.map(({ name, code }) => (
                  <DropdownMenuItem
                    key={code}
                    onClick={() => {
                      setCountry({ name, code })
                      setSearchTerm("")
                    }}
                    className="capitalize cursor-pointer"
                  >
                    {name}
                  </DropdownMenuItem>
                ))
              ) : (
                <div className="text-sm text-gray-500 px-2 py-1">
                  No matches found
                </div>
              )}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
