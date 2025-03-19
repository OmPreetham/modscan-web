"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { useMaximizeContext } from "@/context/maximize-context"
import Link from "next/link"

export function Logo() {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const { isMaximized } = useMaximizeContext()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || isMaximized) return null

  const isDark = resolvedTheme === "dark"
  const textColor = isDark ? "text-white" : "text-black"
  const borderColor = isDark ? "border-white/20" : "border-black/20"
  const bgColor = isDark ? "bg-black" : "bg-white"
  const subtitleColor = isDark ? "text-white/70" : "text-black/70"

  return (
    <header
      className="fixed top-5 left-5 flex flex-col items-center z-20 transition-opacity duration-300"
      role="banner"
    >
      <Link href="/" className="flex flex-col items-center group">
        <div className="flex gap-1" role="heading" aria-label="MODSCAN">
          {["M", "O", "D", "S", "C", "A", "N"].map((letter, index) => (
            <div
              key={index}
              className={`w-6 h-6 ${bgColor} border ${borderColor} ${textColor} flex items-center justify-center text-sm font-bold uppercase backdrop-blur-sm transition-transform duration-200 group-hover:translate-y-[-2px] group-hover:shadow-md`}
              style={{ transitionDelay: `${index * 30}ms` }}
              aria-hidden="true"
            >
              {letter}
            </div>
          ))}
        </div>
        <div
          className={`${subtitleColor} font-mono italic text-base mt-2 tracking-wider transition-all duration-300 group-hover:tracking-widest`}
          role="heading"
          aria-label="NUKE MODULES"
        >
          NUKE MODULES
        </div>
      </Link>
    </header>
  )
}

