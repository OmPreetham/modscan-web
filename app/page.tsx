"use client"

import VoidSpace from "@/components/void-space"
import MarkdownRenderer from "@/components/markdown-renderer"
import { Logo } from "@/components/logo"
import { MaximizeProvider } from "@/context/maximize-context"
import { useEffect } from "react"

const sampleMarkdown = `
An advanced command-line tool that scans and analyzes node_modules folders, displaying comprehensive statistics and information in a clean, interactive table UI.

## Features

- Recursively scans for node_modules folders that belong to projects
- Two scanning modes:
  - Local scan (current directory and subdirectories)
  - Global scan (system-wide search across common project locations)
- Clean, minimalist table UI showing:
  - Status of each node_modules folder (Available, Deleting, Deleted, Error)
  - Project name (extracted from package.json)
  - Full path to each node_modules folder
  - Size of each node_modules folder
  - Last modified date
- Advanced sorting capabilities:
  - Sort by size (largest/smallest first)
  - Sort by date (newest/oldest first)
  - Sort by name (A-Z/Z-A)
  - Sort by path (A-Z/Z-A)
- Smart filtering options:
  - All modules
  - Active only (non-deleted)
  - Deleted only
  - Large modules (>100MB)
  - Old modules (>30 days)
- Comprehensive statistics:
  - Total scan time
  - Number of node_modules folders found
  - Total disk space used by node_modules
  - Number of unique projects scanned
  - Space freed by deletions
- Smart cache detection to skip cache directories for faster scanning
- Real-time progress updates during scanning
- Dynamic UI that adjusts to terminal size
- Interactive keyboard navigation with modern single-key shortcuts

## Installation

Install globally to use from anywhere:

\`\`\`bash
npm install -g modscan
\`\`\`

## Usage

### Basic Usage

Run from any directory to scan the current location and its subdirectories:

\`\`\`bash
modscan
\`\`\`

### Global Scan

Scan your entire system for node_modules folders:

\`\`\`bash
modscan --global
# or
modscan -g
\`\`\`

### Help

Display usage information and keyboard shortcuts:

\`\`\`bash
modscan --help
# or
modscan -h
\`\`\`

## Keyboard Controls

- **↑/↓**: Navigate between entries
- **R**: Start/restart scanning
- **D**: Delete the selected node_modules folder
- **S**: Open sort menu
- **F**: Open filter menu
- **Q**: Quit the application

## Why use ModScan?

- Get a comprehensive view of your node_modules usage across projects
- Quickly identify which node_modules folders are taking up the most space
- Find and clean up old or outdated dependencies
- Organize and filter results to focus on what matters most
- Interactive UI makes it easy to manage multiple node_modules folders
- Clean, minimal interface that works in any terminal

## Compatibility

Works on:
- macOS
- Linux
- Windows

Requires Node.js 12.0.0 or higher.

## License

[MIT](https://github.com/OmPreetham/modscan/blob/329a54bbf77c37a3924a45e49a8be18269d627b9/LICENSE)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. 
`

export default function Home() {
  // Register service worker
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker.register("/sw.js").then(
          (registration) => {
            console.log("ServiceWorker registration successful with scope: ", registration.scope)
          },
          (err) => {
            console.log("ServiceWorker registration failed: ", err)
          },
        )
      })
    }
  }, [])

  return (
    <MaximizeProvider>
      <main className="w-screen h-screen">
        <VoidSpace>
          <Logo />
          <div className="absolute inset-0 flex items-center justify-center p-4 z-10">
            <MarkdownRenderer content={sampleMarkdown} title="ModScan Documentation" />
          </div>
        </VoidSpace>
      </main>
    </MaximizeProvider>
  )
}

