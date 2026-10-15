"use client"

import Link from "next/link"
import {
  ClipboardList,
  MessageCircle,
  FileText,
  Download,
  Sparkles,
  Stethoscope,
  ImageIcon,
  Brain,
  Leaf,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

const steps = [
  {
    icon: ClipboardList,
    title: "Fill Your Details",
    description: "Enter your basic information, body details, and health concerns before starting.",
  },
  {
    icon: MessageCircle,
    title: "Chat Consultation",
    description: "Continue to the consultation page and chat with Ayurvedic consultation in a guided interface.",
  },
  {
    icon: FileText,
    title: "View Prescription",
    description: "After consultation, move to the prescription page to see your wellness summary and recommendations.",
  },
  {
    icon: Download,
    title: "Download Report",
    description: "Save your prescription/report for future reference in a clean downloadable format.",
  },
]

const features = [
  {
    icon: Brain,
    title: "Intelligent Wellness Guidance",
    description:
      "A modern wellness experience that blends intelligent assistance with Ayurvedic-inspired guidance.",
  },
  {
    icon: Stethoscope,
    title: "Symptom-Based Support",
    description:
      "Describe your concern in detail and move through a structured consultation flow designed for clarity.",
  },
  {
    icon: ImageIcon,
    title: "Optional Image Upload",
    description:
      "Users can upload an image if needed, while still being able to continue the consultation without it.",
  },
  {
    icon: FileText,
    title: "Structured Prescription View",
    description:
      "Get your details, consultation summary, wellness guidance, and recommendations in a clean report-style card.",
  },
]

export function HomePage() {
  return (
    <div className="relative z-10 min-h-screen">
      <section className="container mx-auto px-4 pt-10 pb-12 md:pt-16 md:pb-16">
        <Card className="overflow-hidden rounded-[28px] border border-[#D8D4C8] bg-white/90 shadow-xl backdrop-blur-sm">
          <CardContent className="p-8 md:p-12 lg:p-16">
            <div className="mx-auto max-w-4xl text-center">
              <div className="mb-6 flex justify-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#9AB17A] to-[#7A9A5A] shadow-lg">
                  <Leaf className="h-10 w-10 text-white" />
                </div>
              </div>

              <p className="mb-3 text-sm font-medium uppercase tracking-[0.22em] text-[#7A8B63]">
                Ayurvedic Wellness • Modern Consultation 
              </p>

              <h1 className="mb-5 font-serif text-4xl font-bold leading-tight text-[#34412A] md:text-5xl lg:text-6xl">
                Welcome to Ayurvedic consultation
              </h1>

              <p className="mx-auto mb-8 max-w-3xl text-base leading-8 text-[#667456] md:text-lg">
                A refined Ayurvedic consultation experience that blends traditional wisdom with modern intelligence to support your well-being.
              </p>

              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link href="/form">
                  <Button
                    size="lg"
                    className="rounded-full bg-[#9AB17A] px-8 py-6 text-base text-white shadow-md transition-all duration-300 hover:bg-[#7F9860] hover:shadow-lg"
                  >
                    Get Consult
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="container mx-auto px-4 py-10 md:py-12">
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-[#8B9A71]">
            Consultation Flow
          </p>
          <h2 className="font-serif text-3xl font-bold text-[#34412A] md:text-4xl">
            How It Works
          </h2>
          <p className="mt-4 text-base leading-7 text-[#6B7A5A]">
            A structured consultation journey designed for clarity, comfort, and personalized guidance.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          {steps.map((step, index) => (
            <Card
              key={index}
              className="rounded-[24px] border border-[#D8D4C8] bg-white/90 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <CardContent className="p-6 text-center">
                <div className="mb-4 flex justify-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E7E1BF] text-lg font-bold text-[#34412A]">
                    {index + 1}
                  </div>
                </div>

                <div className="mb-4 flex justify-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F4F0E3]">
                    <step.icon className="h-7 w-7 text-[#8AA36B]" />
                  </div>
                </div>

                <h3 className="mb-2 text-lg font-semibold text-[#34412A]">
                  {step.title}
                </h3>

                <p className="text-sm leading-6 text-[#6B7A5A]">
                  {step.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 py-10 pb-24 md:py-12 md:pb-24">
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-[#8B9A71]">
            Core Highlights
          </p>
          <h2 className="font-serif text-3xl font-bold text-[#34412A] md:text-4xl">
            Why Choose Ayurvedic consultation
          </h2>
          <p className="mt-4 text-base leading-7 text-[#6B7A5A]">
            A thoughtfully designed experience that helps you understand your health with clarity and confidence.
          </p>
        </div>

        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="rounded-[24px] border border-[#D8D4C8] bg-white/90 shadow-lg transition-all duration-300 hover:shadow-xl"
            >
              <CardContent className="p-6 md:p-7">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#C3CC9B] to-[#9AB17A] shadow-sm">
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>

                  <div>
                    <h3 className="mb-2 text-lg font-semibold text-[#34412A]">
                      {feature.title}
                    </h3>
                    <p className="text-sm leading-7 text-[#6B7A5A]">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}