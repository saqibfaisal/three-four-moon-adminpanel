"use client"

import { Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useInternationalization, type Country } from "@/components/providers/internationalization-provider"

const countries: Array<{ code: Country; name: string; flag: string }> = [
  { code: "UAE", name: "UAE", flag: "🇦🇪" },
  { code: "Germany", name: "Germany", flag: "🇩🇪" },
  { code: "UK", name: "UK", flag: "🇬🇧" },
  { code: "USA", name: "USA", flag: "🇺🇸" },
  { code: "Pakistan", name: "Pakistan", flag: "🇵🇰" },
]

export function CountrySelector() {
  const { currentCountry, setCountry, currentConfig } = useInternationalization()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <span>{currentConfig.flag}</span>
          <Globe className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {countries.map((country) => (
          <DropdownMenuItem key={country.code} onClick={() => setCountry(country.code)} className="gap-2">
            <span>{country.flag}</span>
            <span>{country.name}</span>
            {currentCountry === country.code && <span className="ml-auto text-primary">✓</span>}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
