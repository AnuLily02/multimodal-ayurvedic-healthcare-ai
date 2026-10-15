"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { AnimatedBackground } from "@/components/background"
import { PrescriptionPage } from "@/components/pages/prescription-page"

export default function Prescription() {
  return (
    <div className="min-h-screen flex flex-col">
      <AnimatedBackground />
      <Header currentPage="prescription" />
      <main className="flex-1">
        <PrescriptionPage />
      </main>
      <Footer />
    </div>
  )
}
