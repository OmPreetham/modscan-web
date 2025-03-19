"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import ReactMarkdown from "react-markdown"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Maximize2, Minimize2, Moon, Sun, Laptop, Github, Package, Copy, Check } from "lucide-react"
import { useTheme } from "next-themes"
import { useMaximizeContext } from "@/context/maximize-context"
import { JetBrains_Mono } from "next/font/google"

// Load JetBrains Mono font
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jetbrains",
  weight: ["400", "700"],
})

interface MarkdownRendererProps {
  content?: string
  filePath?: string
  title?: string
  npmLink?: string
  githubLink?: string
}

export default function MarkdownRenderer({
  content,
  filePath,
  title = "Documentation",
  npmLink = "https://www.npmjs.com/package/modscan",
  githubLink = "https://github.com/ompreetham/modscan",
}: MarkdownRendererProps) {
  const [markdown, setMarkdown] = useState<string | null>(content || null)
  const [loading, setLoading] = useState(!content && !!filePath)
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerHeight, setContainerHeight] = useState(70)
  const { theme, setTheme } = useTheme()
  const { isMaximized, setIsMaximized } = useMaximizeContext()
  const [copied, setCopied] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Resize state
  const [isResizing, setIsResizing] = useState(false)
  const [startSize, setStartSize] = useState({ width: 0, height: 0 })
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 })

  // Handle mounting for theme
  useEffect(() => {
    setMounted(true)
  }, [])

  // Load markdown from file if provided
  useEffect(() => {
    if (filePath && !content) {
      setLoading(true)
      fetch(filePath)
        .then((response) => response.text())
        .then((text) => {
          setMarkdown(text)
          setLoading(false)
        })
        .catch((error) => {
          console.error("Error loading markdown file:", error)
          setLoading(false)
          setMarkdown("**Error loading markdown content**")
        })
    }
  }, [filePath, content])

  const toggleMaximize = () => setIsMaximized(!isMaximized)

  const cycleTheme = () => {
    if (theme === "light") setTheme("dark")
    else if (theme === "dark") setTheme("system")
    else setTheme("light")
  }

  const getThemeIcon = () => {
    if (theme === "light") return <Sun className="h-4 w-4" />
    if (theme === "dark") return <Moon className="h-4 w-4" />
    return <Laptop className="h-4 w-4" />
  }

  const openNpmLink = () => window.open(npmLink, "_blank")
  const openGithubLink = () => window.open(githubLink, "_blank")

  const copyInstallCommand = () => {
    navigator.clipboard.writeText("npm i modscan -g").then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  // Resize handlers
  const handleResizeStart = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsResizing(true)

    // Remove transition during resize for smoother experience
    if (containerRef.current) {
      containerRef.current.style.transition = "none"
    }

    // Get current container dimensions
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return

    setStartSize({
      width: rect.width,
      height: rect.height,
    })

    // Get starting position
    if ("touches" in e) {
      setStartPosition({
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      })
    } else {
      setStartPosition({
        x: e.clientX,
        y: e.clientY,
      })
    }

    // Add event listeners
    document.addEventListener("mousemove", handleResize)
    document.addEventListener("touchmove", handleResize)
    document.addEventListener("mouseup", handleResizeEnd)
    document.addEventListener("touchend", handleResizeEnd)
  }

  const handleResize = (e: MouseEvent | TouchEvent) => {
    if (!isResizing) return

    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY

    const deltaX = clientX - startPosition.x
    const deltaY = clientY - startPosition.y

    // Calculate new height as percentage of viewport height
    const viewportHeight = window.innerHeight
    const newHeightPx = startSize.height + deltaY
    const newHeightVh = (newHeightPx / viewportHeight) * 100

    // Calculate new width
    const viewportWidth = window.innerWidth
    const newWidthPx = Math.min(startSize.width + deltaX, viewportWidth - 40)

    // Update container dimensions with requestAnimationFrame for smoother updates
    requestAnimationFrame(() => {
      // Update container height (with limits)
      setContainerHeight(Math.max(30, Math.min(newHeightVh, 95)))

      if (containerRef.current) {
        // Ensure minimum width
        containerRef.current.style.width = `${Math.max(300, newWidthPx)}px`
      }
    })
  }

  const handleResizeEnd = () => {
    setIsResizing(false)

    // Restore transition for smooth animations after resize
    if (containerRef.current) {
      containerRef.current.style.transition = "all 0.3s ease-in-out"
    }

    // Remove event listeners
    document.removeEventListener("mousemove", handleResize)
    document.removeEventListener("touchmove", handleResize)
    document.removeEventListener("mouseup", handleResizeEnd)
    document.removeEventListener("touchend", handleResizeEnd)
  }

  // Cleanup event listeners
  useEffect(() => {
    return () => {
      document.removeEventListener("mousemove", handleResize)
      document.removeEventListener("touchmove", handleResize)
      document.removeEventListener("mouseup", handleResizeEnd)
      document.removeEventListener("touchend", handleResizeEnd)
    }
  }, [isResizing]) // eslint-disable-line react-hooks/exhaustive-deps

  // If not mounted yet, return a simple loading state
  if (!mounted) {
    return <div className="w-[800px] h-[70vh] bg-background animate-pulse rounded-lg"></div>
  }

  const isDark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)

  return (
    <div
      ref={containerRef}
      className={`
        transition-all duration-300 ease-in-out relative
        ${isMaximized ? "w-[calc(100%-2rem)] h-[calc(100vh-2rem)]" : "w-[800px] max-w-[calc(100vw-2rem)]"}
        ${isResizing ? "select-none" : ""}
      `}
      style={{
        height: isMaximized ? "calc(100vh - 2rem)" : `${containerHeight}vh`,
        minWidth: "300px",
        cursor: isResizing ? "nwse-resize" : "auto",
        margin: "1rem",
      }}
    >
      <Card
        className={`h-full w-full overflow-hidden backdrop-blur-sm ${isDark ? "bg-black/90" : "bg-white/90"} ${isDark ? "border-gray-850" : "border-gray-300"} border shadow-lg rounded-none transform-style-preserve-3d relative`}
        style={{
          boxShadow: "0 10px 30px -10px rgba(0,0,0,0.3), 0 4px 10px rgba(0,0,0,0.2), 0 0 0 1px rgba(128,128,128,0.1)",
        }}
      >
        <CardHeader
          className={`sticky top-0 z-10 backdrop-blur-sm ${isDark ? "bg-black/95" : "bg-white/95"} border-b ${isDark ? "border-gray-700" : "border-gray-300"} rounded-none flex flex-row items-center justify-between p-2 sm:p-4`}
        >
          <div className="flex items-center gap-2 flex-wrap">
            <CardTitle
              className={`flex items-center gap-1 sm:gap-2 cursor-pointer hover:opacity-80 transition-colors text-xs sm:text-sm ${
                isDark ? "text-white" : "text-black"
              }`}
              onClick={copyInstallCommand}
              title="Click to copy installation command"
            >
              <code className={`font-mono ${jetbrainsMono.className}`}>npm i modscan -g</code>
              {copied ? (
                <Check className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" />
              ) : (
                <Copy className={`h-3 w-3 sm:h-4 sm:w-4 ${isDark ? "text-white" : "text-black"} opacity-70`} />
              )}
            </CardTitle>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <Button
              variant="outline"
              size="sm"
              className={`h-7 sm:h-8 text-xs sm:text-sm border ${isDark ? "border-gray-700" : "border-gray-400"} ${
                isDark ? "bg-black text-white hover:bg-gray-900" : "bg-white text-black hover:bg-gray-50"
              } flex items-center gap-1`}
              onClick={openNpmLink}
              title="View on npm"
            >
              <Package className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">npmjs</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={`h-7 sm:h-8 text-xs sm:text-sm border ${isDark ? "border-gray-700" : "border-gray-400"} ${
                isDark ? "bg-black text-white hover:bg-gray-900" : "bg-white text-black hover:bg-gray-50"
              } flex items-center gap-1`}
              onClick={openGithubLink}
              title="View on GitHub"
            >
              <Github className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">GitHub</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className={`h-7 w-7 sm:h-8 sm:w-8 border ${isDark ? "border-gray-700" : "border-gray-400"} ${
                isDark ? "bg-black text-white hover:bg-gray-900" : "bg-white text-black hover:bg-gray-50"
              }`}
              onClick={cycleTheme}
              title={`Current theme: ${theme}. Click to change.`}
            >
              {getThemeIcon()}
              <span className="sr-only">Toggle theme</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className={`h-7 w-7 sm:h-8 sm:w-8 border ${isDark ? "border-gray-700" : "border-gray-400"} ${
                isDark ? "bg-black text-white hover:bg-gray-900" : "bg-white text-black hover:bg-gray-50"
              }`}
              onClick={toggleMaximize}
            >
              {isMaximized ? (
                <Minimize2 className="h-3 w-3 sm:h-4 sm:w-4" />
              ) : (
                <Maximize2 className="h-3 w-3 sm:h-4 sm:w-4" />
              )}
              <span className="sr-only">{isMaximized ? "Restore" : "Maximize"}</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent
          className={`prose prose-sm md:prose-base ${isDark ? "prose-invert" : ""} max-w-none pt-4 sm:pt-6 h-[calc(100%-4rem)] overflow-auto px-3 sm:px-6 ${jetbrainsMono.className}`}
        >
          {loading ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-full" />
            </div>
          ) : (
            <ReactMarkdown className="text-sm sm:text-base font-mono">{markdown || ""}</ReactMarkdown>
          )}
        </CardContent>

        {/* Resize handle */}
        {!isMaximized && (
          <div
            className={`absolute bottom-0 right-0 w-10 h-10 cursor-nwse-resize z-20 flex items-center justify-center ${isDark ? "text-gray-400" : "text-gray-600"} hover:text-primary transition-colors resize-handle`}
            onMouseDown={handleResizeStart}
            onTouchStart={handleResizeStart}
            title="Drag to resize"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`${isResizing ? "scale-110" : ""} transition-transform`}
            >
              <path d="M22 22L12 12M22 12L12 22"></path>
            </svg>
          </div>
        )}
      </Card>
    </div>
  )
}

