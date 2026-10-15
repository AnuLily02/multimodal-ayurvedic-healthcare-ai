"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { AnimatedBackground } from "@/components/background"
import { FormPage } from "@/components/pages/form-page"

export default function FormScreen() {
  const [showHeaderError, setShowHeaderError] = useState(false)

  return (
    <div className="min-h-screen flex flex-col">
      <AnimatedBackground />

      <Header
        currentPage="form"
        nextDisabled={true}
        onNextClick={() => setShowHeaderError(true)}
      />

      <main className="flex-1">
        {showHeaderError && (
          <div className="container mx-auto px-4 pt-4">
            <div className="mx-auto max-w-2xl rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 shadow-sm">
              Please fill the form and click <span className="font-semibold">Start Consultation</span> first.
            </div>
          </div>
        )}

        <FormPage />
      </main>

      <Footer />
    </div>
  )
}