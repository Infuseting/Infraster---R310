"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export default function UserMenu({ name }: { name?: string }) {
  const [initial, setInitial] = React.useState<string>(() => {
    if (name && name.length > 0) return name.trim()[0].toUpperCase()
    return "U"
  })

  React.useEffect(() => {
    // Priority: prop `name` -> localStorage 'userName' -> fetch '/api/auth/me' -> fallback 'U'
    if (name && name.length > 0) {
      setInitial(name.trim()[0].toUpperCase())
      return
    }

    try {
      const stored = localStorage.getItem("userName")
      if (stored && stored.length > 0) {
        setInitial(stored.trim()[0].toUpperCase())
        return
      }
    } catch (e) {
      // ignore localStorage errors
    }

    // Try optional API endpoint '/api/auth/me' — silently ignore failures
    ;(async () => {
      try {
        const res = await fetch("/api/auth/me")
        if (!res.ok) return
        const json = await res.json()
        const maybeName = json?.name || json?.user?.name
        if (maybeName && maybeName.length > 0) {
          setInitial(maybeName.trim()[0].toUpperCase())
        }
      } catch (e) {
        // ignore
      }
    })()
  }, [name])

  const router = useRouter()
  const [loggingOut, setLoggingOut] = React.useState(false)

  async function handleLogout() {
    if (loggingOut) return
    setLoggingOut(true)
    try {
      // Call logout endpoint which clears the server-side token and cookie
      const res = await fetch("/api/auth/logout", { method: "POST", credentials: "same-origin" })
      if (res.ok) {
        try {
          localStorage.removeItem("userName")
        } catch (e) {
          // ignore localStorage errors
        }
        // Redirect to login page
        router.push("/login")
        return
      }
      // If not ok, still navigate to login to force unauthenticated state
      router.push("/login")
    } catch (e) {
      // On error, still try to navigate to login
      router.push("/login")
    } finally {
      setLoggingOut(false)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          aria-label="Open user menu"
          className="rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Avatar>
            <AvatarFallback className="bg-purple-600 text-white">{initial}</AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" sideOffset={8} className="z-[100000]">
        <DropdownMenuItem asChild>
          <button
            onClick={handleLogout}
            className="w-full text-left"
            disabled={loggingOut}
            aria-disabled={loggingOut}
          >
            {loggingOut ? "Logging out..." : "Logout"}
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
