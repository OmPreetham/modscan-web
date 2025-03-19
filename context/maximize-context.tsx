"use client"

import type React from "react"
import { createContext, useContext, useState, type ReactNode } from "react"

interface MaximizeContextType {
  isMaximized: boolean
  setIsMaximized: React.Dispatch<React.SetStateAction<boolean>>
}

const MaximizeContext = createContext<MaximizeContextType | undefined>(undefined)

export function MaximizeProvider({ children }: { children: ReactNode }) {
  const [isMaximized, setIsMaximized] = useState(false)

  return <MaximizeContext.Provider value={{ isMaximized, setIsMaximized }}>{children}</MaximizeContext.Provider>
}

export function useMaximizeContext() {
  const context = useContext(MaximizeContext)
  if (context === undefined) {
    throw new Error("useMaximizeContext must be used within a MaximizeProvider")
  }
  return context
}

