"use client"

import Link from "next/link"
import { useState } from "react"
import { Leaf } from "lucide-react"
import { Button } from "@/components/ui/button"

interface HeaderProps {
  currentPage: "home" | "form" | "chat" | "prescription"
  nextDisabled?: boolean
  nextHref?: string
  nextLabel?: string
  blockedMessage?: string
}

export function Header({
  currentPage,
  nextDisabled = false,
  nextHref,
  nextLabel,
  blockedMessage = "Please fill the form first.",
}: HeaderProps) {
  const [showBlockedMessage, setShowBlockedMessage] = useState(false)

  const getDefaultButtonConfig = () => {
    switch (currentPage) {
      case "home":
        return { text: "Get Consult", href: "/form" }
      case "form":
        return { text: "Chat", href: "/chat" }
      case "chat":
        return { text: "Prescription", href: "/prescription" }
      case "prescription":
        return null
      default:
        return { text: "Get Consult", href: "/form" }
    }
  }

  const defaultConfig = getDefaultButtonConfig()
  const buttonText = nextLabel || defaultConfig?.text
  const buttonHref = nextHref || defaultConfig?.href

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#D4D0C1] bg-white/80 shadow-sm backdrop-blur-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="group flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#9AB17A] to-[#7A9A5A] shadow-md transition-shadow group-hover:shadow-lg">
              <Leaf className="h-5 w-5 text-white" />
            </div>
            <span className="font-serif text-xl font-semibold text-[#3D4A2D]">
              Ayurvedic consultation
            </span>
          </Link>

          {defaultConfig && (
            <>
              {nextDisabled ? (
                <Button
                  type="button"
                  onClick={() => setShowBlockedMessage(true)}
                  className="rounded-full bg-[#B8C5A4] px-6 py-2 text-white shadow-md transition-all duration-300 hover:bg-[#A6B593]"
                >
                  {buttonText}
                </Button>
              ) : (
                <Link href={buttonHref || "#"}>
                  <Button className="rounded-full bg-[#9AB17A] px-6 py-2 text-white shadow-md transition-all duration-300 hover:bg-[#7A9A5A] hover:shadow-lg">
                    {buttonText}
                  </Button>
                </Link>
              )}
            </>
          )}
        </div>

        {showBlockedMessage && nextDisabled && (
          <p className="mt-1 text-right text-sm font-medium text-red-500">
            {blockedMessage}
          </p>
        )}
      </div>
    </header>
  )
}