"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { AnimatedBackground } from "@/components/background"
import { ChatPage } from "@/components/pages/chat-page"

export default function Chat() {
  return (
    <div className="min-h-screen flex flex-col">
      <AnimatedBackground />
      <Header currentPage="chat" />
      <main className="flex-1">
        <ChatPage />
      </main>
      <Footer />
    </div>
  )
}
