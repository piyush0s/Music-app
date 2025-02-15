"use client"

import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Sun, Moon, Laptop } from "lucide-react"
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs"
import toast from "react-hot-toast"
import { useEffect, useState } from "react"

export default function Navbar() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const themes = ["light", "dark", "system"] as const

  // Ensure component is mounted before showing theme
  useEffect(() => setMounted(true), [])

  const cycleTheme = () => {
    const currentIndex = themes.indexOf((theme as typeof themes[number]) ?? "system")
    const nextTheme = themes[(currentIndex + 1) % themes.length]
    setTheme(nextTheme)
    toast.success(`Theme changed to ${nextTheme}`)
  }

  const themeIcons = {
    light: <Sun className="h-[1.2rem] w-[1.2rem]" />,
    dark: <Moon className="h-[1.2rem] w-[1.2rem]" />,
    system: <Laptop className="h-[1.2rem] w-[1.2rem]" />
  }

  if (!mounted) return null

  return (
    <nav className="flex justify-between h-16 items-center px-4 bg-border text-foreground bg-primary/30">
      <span className="font-bold text-xl">NO-pass</span>
      <ul className="flex gap-5 justify-start items-center">
        <li>Home</li>
        <li>About</li>
        <li>Service</li>
      </ul>

      <div className="flex items-center gap-4">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={cycleTheme}
          aria-label="Cycle theme"
        >
          {themeIcons[theme as keyof typeof themeIcons] || <Laptop className="h-[1.2rem] w-[1.2rem]" />}
          <span className="sr-only">Cycle theme</span>
        </Button>

        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </nav>
  )
}