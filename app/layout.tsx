import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

export const metadata: Metadata = {
  title: "ModScan - Node Modules Scanner and Cleaner",
  description:
    "An advanced command-line tool that scans and analyzes node_modules folders, displaying comprehensive statistics and information in a clean, interactive table UI.",
  keywords: ["node modules", "npm", "disk space", "cleanup", "developer tools", "cli", "node.js", "javascript"],
  authors: [{ name: "ModScan Team" }],
  creator: "ModScan",
  publisher: "ModScan",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://modscan.dev",
    title: "ModScan - Node Modules Scanner and Cleaner",
    description:
      "An advanced command-line tool that scans and analyzes node_modules folders, displaying comprehensive statistics and information in a clean, interactive table UI.",
    siteName: "ModScan",
    images: [
      {
        url: "/logo.jpg",
        width: 1200,
        height: 630,
        alt: "ModScan Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ModScan - Node Modules Scanner and Cleaner",
    description:
      "An advanced command-line tool that scans and analyzes node_modules folders, displaying comprehensive statistics and information in a clean, interactive table UI.",
    images: ["/logo.jpg"],
  },
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/logo.jpg", sizes: "32x32" },
      { url: "/logo.jpg", sizes: "16x16" },
    ],
    apple: [{ url: "/logo.jpg", sizes: "180x180" }],
    shortcut: ["/logo.jpg"],
  },
    generator: 'v0.dev'
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="color-scheme" content="light dark" />
        <link rel="icon" href="/logo.jpg" />
        <link rel="apple-touch-icon" href="/logo.jpg" />
        <link rel="mask-icon" href="/logo.jpg" color="#000000" />
        <meta name="msapplication-TileImage" content="/logo.jpg" />
        <meta name="msapplication-TileColor" content="#000000" />
      </head>
      <body className={`${inter.className} ${inter.variable}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
          storageKey="modscan-theme"
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'