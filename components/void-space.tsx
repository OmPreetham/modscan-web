"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import { useTheme } from "next-themes"

export default function VoidSpace({ children }: { children?: React.ReactNode }) {
  const gridRef = useRef<HTMLDivElement>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [targetPosition, setTargetPosition] = useState({ x: 0, y: 0 })
  const [currentPosition, setCurrentPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [touchStart, setTouchStart] = useState({ x: 0, y: 0 })
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Handle mounting for theme
  useEffect(() => {
    setMounted(true)
  }, [])

  // Handle mouse movement
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const mouseX = (e.clientX - window.innerWidth / 2) / window.innerWidth
      const mouseY = (e.clientY - window.innerHeight / 2) / window.innerHeight

      setMousePosition({ x: mouseX, y: mouseY })
      setTargetPosition({
        x: mouseX * 400,
        y: mouseY * 400,
      })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  // Handle touch events
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      setTouchStart({
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      })
      setIsDragging(true)
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging) return

      const touchX = e.touches[0].clientX
      const touchY = e.touches[0].clientY

      const deltaX = (touchX - touchStart.x) / window.innerWidth
      const deltaY = (touchY - touchStart.y) / window.innerHeight

      setTargetPosition((prev) => ({
        x: prev.x + deltaX * 400,
        y: prev.y + deltaY * 400,
      }))

      setTouchStart({
        x: touchX,
        y: touchY,
      })

      e.preventDefault()
    }

    const handleTouchEnd = () => {
      setIsDragging(false)
    }

    window.addEventListener("touchstart", handleTouchStart)
    window.addEventListener("touchmove", handleTouchMove)
    window.addEventListener("touchend", handleTouchEnd)

    return () => {
      window.removeEventListener("touchstart", handleTouchStart)
      window.removeEventListener("touchmove", handleTouchMove)
      window.removeEventListener("touchend", handleTouchEnd)
    }
  }, [isDragging, touchStart])

  // Animation loop
  useEffect(() => {
    let animationFrameId: number

    const animate = () => {
      setCurrentPosition((prev) => ({
        x: prev.x + (targetPosition.x - prev.x) * 0.05,
        y: prev.y + (targetPosition.y - prev.y) * 0.05,
      }))

      animationFrameId = requestAnimationFrame(animate)
    }

    animate()
    return () => cancelAnimationFrame(animationFrameId)
  }, [targetPosition])

  // Apply transform styles
  useEffect(() => {
    if (gridRef.current) {
      gridRef.current.style.transform = `
        translate(-50%, -50%) 
        translate3d(${currentPosition.x}px, ${currentPosition.y}px, 0)
        rotateX(${-mousePosition.y * 3}deg) 
        rotateY(${mousePosition.x * 3}deg)
      `
    }
  }, [currentPosition, mousePosition])

  // Grid background style based on theme
  const isDark = resolvedTheme === "dark"

  const gridStyle = {
    backgroundImage: `
      radial-gradient(circle at 0 0, ${isDark ? "rgba(255, 255, 255, 0.5)" : "rgba(0, 0, 0, 0.3)"} 1px, transparent 1px),
      linear-gradient(${isDark ? "rgba(255, 255, 255, 0.15)" : "rgba(0, 0, 0, 0.1)"} 1px, transparent 1px),
      linear-gradient(90deg, ${isDark ? "rgba(255, 255, 255, 0.15)" : "rgba(0, 0, 0, 0.1)"} 1px, transparent 1px)
    `,
    backgroundSize: "100px 100px, 100px 100px, 100px 100px",
    backgroundPosition: "0 0, 0 0, 0 0",
  }

  if (!mounted) {
    return <div className="fixed w-screen h-screen bg-background"></div>
  }

  return (
    <div className={`fixed w-screen h-screen perspective-[1000px] ${isDark ? "bg-black" : "bg-white"}`}>
      <div
        ref={gridRef}
        className="absolute top-1/2 left-1/2 w-[1000vw] h-[1000vh] transform-style-preserve-3d"
        style={gridStyle}
      />
      {children}
    </div>
  )
}

