"use client"

import { useEffect, useMemo, useRef } from "react"
import { useRouter } from "next/navigation"
import {
  Download,
  User,
  Calendar,
  Weight,
  Ruler,
  Leaf,
  Heart,
  Sparkles,
  Activity,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { usePatient } from "@/lib/patient-context"
import {
  calculateBMI,
  getBMICategory,
  generatePrescriptionId,
  formatDate,
  getDoshaAnalysis,
} from "@/lib/helpers"

type ConsultationDataType = {
  summary?: string
  interpretation?: string
  remedies?: string[] | string
  precautions?: string[] | string
  guidance?: string[] | string
  dietRecommendations?: string[] | string
  whenToSeeDoctor?: string[] | string
}

function normalizeList(value: string[] | string | undefined): string[] {
  if (!value) return []

  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean)
  }

  return value
    .split(/\n|•/)
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => item.replace(/^-+\s*/, "").trim())
    .filter(Boolean)
}

function escapeHtml(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
}

export function PrescriptionPage() {
  const router = useRouter()
  const { patientData, consultationData } = usePatient()
  const prescriptionRef = useRef<HTMLDivElement>(null)
  const prescriptionId = useMemo(() => generatePrescriptionId(), [])
  const currentDate = useMemo(() => formatDate(new Date()), [])

  useEffect(() => {
    if (!patientData) {
      router.push("/form")
    }
  }, [patientData, router])

  if (!patientData) {
    return null
  }

  const bmi = calculateBMI(patientData.weight, patientData.height)
  const bmiCategory = getBMICategory(bmi)
  const doshaAnalysis = getDoshaAnalysis(patientData.symptoms)

  const fallbackRemedies = [
    "Drink warm water throughout the day to support digestion and hydration.",
    "Take adequate rest and avoid overexertion until the symptoms settle.",
    "Use simple home-based soothing measures such as warm herbal drinks or light, freshly prepared food.",
    "Follow a gentle daily routine with proper sleep and reduced stress.",
  ]

  const fallbackPrecautions = [
    "Avoid cold beverages and heavily processed foods.",
    "Do not skip meals or eat very late at night.",
    "Reduce excessive spicy, oily, or packaged foods.",
    "Consult a healthcare professional if symptoms worsen or persist.",
  ]

  const fallbackGuidance = [
    "Maintain a consistent sleep schedule and daily routine.",
    "Drink enough water and eat fresh, balanced meals.",
    "Include light movement such as walking, stretching, or yoga.",
    "Practice stress management through breathing exercises or meditation.",
  ]

  const fallbackDietRecommendations = [
    "Prefer warm, freshly cooked, easy-to-digest meals.",
    "Include fruits, vegetables, and simple balanced foods in daily meals.",
    "Avoid excessively oily, spicy, junk, or packaged food.",
    "Eat on time and do not overeat.",
  ]

  const fallbackDoctorAdvice = [
    "Seek medical help if symptoms worsen.",
    "Consult a doctor if symptoms continue for several days.",
    "Get professional care immediately if there is severe pain, breathing difficulty, high fever, fainting, or unusual weakness.",
  ]

  const structuredData: ConsultationDataType = consultationData || {}

  const summary =
    structuredData.summary?.trim() ||
    `Patient ${patientData.name} presented with ${patientData.symptoms}. This consultation provides a structured Ayurvedic wellness summary based on the details shared.`

  const interpretation =
    structuredData.interpretation?.trim() || doshaAnalysis

  const parsedRemedies = normalizeList(structuredData.remedies)
  const parsedPrecautions = normalizeList(structuredData.precautions)
  const parsedGuidance = normalizeList(structuredData.guidance)
  const parsedDietRecommendations = normalizeList(structuredData.dietRecommendations)
  const parsedDoctorAdvice = normalizeList(structuredData.whenToSeeDoctor)

  const remedies =
    parsedRemedies.length > 0 ? parsedRemedies : fallbackRemedies

  const precautions =
    parsedPrecautions.length > 0 ? parsedPrecautions : fallbackPrecautions

  const guidance =
    parsedGuidance.length > 0 ? parsedGuidance : fallbackGuidance

  const dietRecommendations =
    parsedDietRecommendations.length > 0
      ? parsedDietRecommendations
      : fallbackDietRecommendations

  const whenToSeeDoctor =
    parsedDoctorAdvice.length > 0 ? parsedDoctorAdvice : fallbackDoctorAdvice

  const handleDownload = () => {
    const printWindow = window.open("", "", "width=1000,height=800")
    if (!printWindow) return

    const remediesHtml = remedies
      .map(
        (item, index) => `
          <li class="numbered-item">
            <span class="number-badge">${index + 1}</span>
            <span>${escapeHtml(item)}</span>
          </li>
        `
      )
      .join("")

    const precautionsHtml = precautions
      .map(
        (item) => `
          <li class="icon-item">
            <span class="shield-bullet">•</span>
            <span>${escapeHtml(item)}</span>
          </li>
        `
      )
      .join("")

    const guidanceHtml = guidance
      .map(
        (item) => `
          <li class="icon-item">
            <span class="dot-bullet"></span>
            <span>${escapeHtml(item)}</span>
          </li>
        `
      )
      .join("")

    const dietHtml = dietRecommendations
      .map(
        (item) => `
          <li class="icon-item">
            <span class="dot-bullet"></span>
            <span>${escapeHtml(item)}</span>
          </li>
        `
      )
      .join("")

    const doctorHtml = whenToSeeDoctor
      .map(
        (item) => `
          <li class="icon-item">
            <span class="shield-bullet">•</span>
            <span>${escapeHtml(item)}</span>
          </li>
        `
      )
      .join("")

    printWindow.document.write(`
      <html>
        <head>
          <title>Ayurvedic Consultation - Prescription</title>
          <style>
            * {
              box-sizing: border-box;
            }

            body {
              margin: 0;
              padding: 32px;
              font-family: Georgia, serif;
              color: #3D4A2D;
              background: #ffffff;
            }

            .wrapper {
              max-width: 920px;
              margin: 0 auto;
            }

            .header {
              text-align: center;
              padding-bottom: 20px;
              margin-bottom: 24px;
              border-bottom: 2px solid #9AB17A;
            }

            .brand {
              font-size: 34px;
              font-weight: bold;
              color: #3D4A2D;
              margin-bottom: 8px;
            }

            .subhead {
              font-size: 18px;
              margin-bottom: 8px;
            }

            .meta {
              font-size: 13px;
              color: #6B7A5A;
            }

            .section {
              margin-bottom: 22px;
              border: 1px solid #D4D0C1;
              border-radius: 16px;
              padding: 18px 20px;
              background: #ffffff;
            }

            .soft-section {
              background: #F5F0E1;
            }

            .warm-section {
              background: #FBE8CE55;
              border-color: #E4DFB5;
            }

            .green-section {
              background: #9AB17A12;
              border-color: #C3CC9B;
            }

            .red-section {
              background: #FFF5F5;
              border-color: #F5C6CB;
            }

            .section-title {
              font-size: 20px;
              font-weight: bold;
              margin: 0 0 14px 0;
              color: #3D4A2D;
            }

            .section-title-red {
              color: #dc2626;
            }

            .patient-grid {
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              gap: 16px;
            }

            .info-box {
              background: #ffffffcc;
              border: 1px solid #DCD7C8;
              border-radius: 12px;
              padding: 12px;
            }

            .label {
              font-size: 12px;
              color: #6B7A5A;
              margin-bottom: 6px;
            }

            .value {
              font-size: 16px;
              font-weight: 600;
              color: #3D4A2D;
            }

            p {
              margin: 0;
              line-height: 1.7;
            }

            .inner-box {
              margin-top: 14px;
              background: #F5F0E1;
              border-radius: 12px;
              padding: 14px;
            }

            .inner-title {
              font-size: 13px;
              font-weight: bold;
              color: #9AB17A;
              margin-bottom: 8px;
            }

            ul {
              list-style: none;
              padding: 0;
              margin: 0;
            }

            .numbered-item,
            .icon-item {
              display: flex;
              align-items: flex-start;
              gap: 10px;
              margin-bottom: 12px;
              line-height: 1.7;
            }

            .number-badge {
              width: 26px;
              height: 26px;
              min-width: 26px;
              border-radius: 999px;
              background: #9AB17A;
              color: white;
              font-size: 13px;
              display: flex;
              align-items: center;
              justify-content: center;
              font-weight: bold;
              margin-top: 2px;
            }

            .shield-bullet {
              color: #B9770E;
              font-size: 20px;
              line-height: 1;
              margin-top: 1px;
            }

            .dot-bullet {
              width: 8px;
              height: 8px;
              min-width: 8px;
              border-radius: 999px;
              background: #9AB17A;
              margin-top: 10px;
            }

            .disclaimer {
              margin-top: 28px;
              padding-top: 18px;
              border-top: 1px solid #E4DFB5;
              text-align: center;
              font-size: 11px;
              color: #6B7A5A;
              line-height: 1.7;
            }

            @media print {
              body {
                padding: 20px;
              }
            }
          </style>
        </head>
        <body>
          <div class="wrapper">
            <div class="header">
              <div class="brand">🌿 Ayurvedic Consultation</div>
              <div class="subhead">Ayurvedic Wellness Prescription</div>
              <div class="meta">Prescription ID: ${escapeHtml(
                prescriptionId
              )} | Date: ${escapeHtml(currentDate)}</div>
            </div>

            <div class="section soft-section">
              <h2 class="section-title">Patient Information</h2>
              <div class="patient-grid">
                <div class="info-box">
                  <div class="label">Name</div>
                  <div class="value">${escapeHtml(patientData.name)}</div>
                </div>
                <div class="info-box">
                  <div class="label">Age</div>
                  <div class="value">${escapeHtml(`${patientData.age} years`)}</div>
                </div>
                <div class="info-box">
                  <div class="label">Gender</div>
                  <div class="value">${escapeHtml(patientData.gender)}</div>
                </div>
                <div class="info-box">
                  <div class="label">Weight</div>
                  <div class="value">${escapeHtml(`${patientData.weight} kg`)}</div>
                </div>
                <div class="info-box">
                  <div class="label">Height</div>
                  <div class="value">${escapeHtml(`${patientData.height} cm`)}</div>
                </div>
                <div class="info-box">
                  <div class="label">BMI</div>
                  <div class="value">${escapeHtml(`${bmi} (${bmiCategory})`)}</div>
                </div>
              </div>
            </div>

            <div class="section warm-section">
              <h2 class="section-title">Health Concerns</h2>
              <p>${escapeHtml(patientData.symptoms)}</p>
            </div>

            <div class="section">
              <h2 class="section-title">Consultation Summary</h2>
              <p>${escapeHtml(summary)}</p>
              <div class="inner-box">
                <div class="inner-title">Ayurvedic Interpretation</div>
                <p>${escapeHtml(interpretation)}</p>
              </div>
            </div>

            <div class="section green-section">
              <h2 class="section-title">Home Remedies</h2>
              <ul>${remediesHtml}</ul>
            </div>

            <div class="section warm-section">
              <h2 class="section-title">Precautions</h2>
              <ul>${precautionsHtml}</ul>
            </div>

            <div class="section">
              <h2 class="section-title">Wellness Guidance</h2>
              <ul>${guidanceHtml}</ul>
            </div>

            <div class="section warm-section">
              <h2 class="section-title">Diet Recommendations</h2>
              <ul>${dietHtml}</ul>
            </div>

            <div class="section red-section">
              <h2 class="section-title section-title-red">When to See a Doctor</h2>
              <ul>${doctorHtml}</ul>
            </div>

            <div class="disclaimer">
              This prescription is for informational purposes only and is not a substitute for professional medical advice,
              diagnosis, or treatment. Always consult with a qualified healthcare provider before making any changes to your
              health routine.
            </div>
          </div>
        </body>
      </html>
    `)

    printWindow.document.close()
    printWindow.focus()
    printWindow.print()
  }

  return (
    <div className="relative z-10 min-h-screen py-8 md:py-12">
      <div className="container mx-auto max-w-4xl px-4">
        <Card className="border-[#D4D0C1] bg-white/95 shadow-xl backdrop-blur-sm">
          <CardHeader className="border-b border-[#D4D0C1] pb-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#9AB17A] to-[#7A9A5A]">
                  <Leaf className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="font-serif text-2xl font-bold text-[#3D4A2D]">
                    Ayurvedic Prescription
                  </CardTitle>
                  <p className="text-sm text-[#6B7A5A]">ID: {prescriptionId}</p>
                </div>
              </div>
              <p className="text-sm text-[#6B7A5A]">{currentDate}</p>
            </div>
          </CardHeader>

          <CardContent className="p-6 md:p-8" ref={prescriptionRef}>
            {/* Patient Information */}
            <div className="mb-6 rounded-xl bg-[#F5F0E1] p-6">
              <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-[#3D4A2D]">
                <User className="h-5 w-5 text-[#9AB17A]" />
                Patient Information
              </h3>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-lg border border-[#DDD6C3] bg-white/70 p-4">
                  <p className="text-sm text-[#6B7A5A]">Name</p>
                  <p className="font-medium text-[#3D4A2D]">{patientData.name}</p>
                </div>

                <div className="rounded-lg border border-[#DDD6C3] bg-white/70 p-4">
                  <p className="flex items-center gap-1 text-sm text-[#6B7A5A]">
                    <Calendar className="h-3 w-3" /> Age
                  </p>
                  <p className="font-medium text-[#3D4A2D]">{patientData.age} years</p>
                </div>

                <div className="rounded-lg border border-[#DDD6C3] bg-white/70 p-4">
                  <p className="text-sm text-[#6B7A5A]">Gender</p>
                  <p className="font-medium capitalize text-[#3D4A2D]">
                    {patientData.gender}
                  </p>
                </div>

                <div className="rounded-lg border border-[#DDD6C3] bg-white/70 p-4">
                  <p className="flex items-center gap-1 text-sm text-[#6B7A5A]">
                    <Weight className="h-3 w-3" /> Weight
                  </p>
                  <p className="font-medium text-[#3D4A2D]">{patientData.weight} kg</p>
                </div>

                <div className="rounded-lg border border-[#DDD6C3] bg-white/70 p-4">
                  <p className="flex items-center gap-1 text-sm text-[#6B7A5A]">
                    <Ruler className="h-3 w-3" /> Height
                  </p>
                  <p className="font-medium text-[#3D4A2D]">{patientData.height} cm</p>
                </div>

                <div className="rounded-lg border border-[#DDD6C3] bg-white/70 p-4">
                  <p className="text-sm text-[#6B7A5A]">BMI</p>
                  <p className="font-medium text-[#3D4A2D]">
                    {bmi} ({bmiCategory})
                  </p>
                </div>
              </div>
            </div>

            {/* Health Concerns */}
            <div className="mb-6 rounded-xl border border-[#E4DFB5] bg-[#FBE8CE]/50 p-6">
              <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-[#3D4A2D]">
                <Heart className="h-5 w-5 text-[#9AB17A]" />
                Health Concerns
              </h3>
              <p className="leading-relaxed text-[#3D4A2D]">{patientData.symptoms}</p>
            </div>

            {/* Consultation Summary */}
            <div className="mb-6 rounded-xl border border-[#D4D0C1] bg-white p-6">
              <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-[#3D4A2D]">
                <Sparkles className="h-5 w-5 text-[#9AB17A]" />
                Consultation Summary
              </h3>

              <p className="mb-4 leading-relaxed text-[#3D4A2D]">{summary}</p>

              <div className="rounded-lg bg-[#F5F0E1] p-4">
                <h4 className="mb-2 text-sm font-semibold text-[#9AB17A]">
                  Ayurvedic Interpretation
                </h4>
                <p className="text-sm leading-relaxed text-[#3D4A2D]">
                  {interpretation}
                </p>
              </div>
            </div>

            {/* Home Remedies */}
            <div className="mb-6 rounded-xl border border-[#C3CC9B] bg-gradient-to-r from-[#9AB17A]/10 to-[#C3CC9B]/10 p-6">
              <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-[#3D4A2D]">
                <Leaf className="h-5 w-5 text-[#9AB17A]" />
                Home Remedies
              </h3>

              <ul className="space-y-3">
                {remedies.map((remedy, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#9AB17A] text-sm text-white">
                      {index + 1}
                    </span>
                    <span className="text-[#3D4A2D]">{remedy}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Wellness Guidance */}
            <div className="mb-6 rounded-xl border border-[#D4D0C1] bg-white p-6">
              <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-[#3D4A2D]">
                <Activity className="h-5 w-5 text-[#9AB17A]" />
                Wellness Guidance
              </h3>
              <ul className="space-y-2">
                {guidance.map((guide, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-[#9AB17A]" />
                    <span className="text-[#3D4A2D]">{guide}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Diet Recommendations */}
            <div className="mb-6 rounded-xl border border-[#E4DFB5] bg-[#FBE8CE]/30 p-6">
              <h3 className="mb-4 text-lg font-semibold text-[#3D4A2D]">
                Diet Recommendations
              </h3>

              <ul className="space-y-2">
                {dietRecommendations.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="mt-2 h-2 w-2 rounded-full bg-[#9AB17A]" />
                    <span className="text-[#3D4A2D]">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* When to See a Doctor */}
            <div className="mb-6 rounded-xl border border-[#F5C6CB] bg-[#FFF5F5] p-6">
              <h3 className="mb-4 text-lg font-semibold text-red-600">
                When to See a Doctor
              </h3>

              <ul className="space-y-2">
                {whenToSeeDoctor.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="mt-2 h-2 w-2 rounded-full bg-red-500" />
                    <span className="text-[#3D4A2D]">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Disclaimer */}
            <div className="mb-6 rounded-xl bg-[#F5F0E1] p-4 text-center">
              <p className="text-xs text-[#6B7A5A]">
                This prescription is for informational purposes only and is not a
                substitute for professional medical advice, diagnosis, or treatment.
                Always consult with a qualified healthcare provider before making any
                changes to your health routine.
              </p>
            </div>

            {/* Download Button */}
            <div className="flex justify-end">
              <Button
                onClick={handleDownload}
                className="flex items-center gap-2 rounded-xl bg-[#9AB17A] px-8 py-6 text-lg text-white shadow-lg transition-all duration-300 hover:bg-[#7A9A5A] hover:shadow-xl"
              >
                <Download className="h-5 w-5" />
                Download Prescription
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}