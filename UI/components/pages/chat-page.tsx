"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Send, User, Bot, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { usePatient, ChatMessage } from "@/lib/patient-context"

const sectionTitles = [
  "Expert System Prediction:",
  "Ayurvedic Interpretation:",
  "Home Remedies:",
  "Diet Recommendations:",
  "When to See a Doctor:",
  "Precautions:",
  "Wellness Guidance:",
]

function normalizeAssistantText(text: string) {
  let formatted = (text || "").replace(/\r/g, "")
  formatted = formatted.replace(/\*\*(.*?)\*\*/g, "$1")

  sectionTitles.forEach((title) => {
    const escaped = title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    const regex = new RegExp(`\\s*${escaped}`, "gi")
    formatted = formatted.replace(regex, `\n\n${title}`)
  })

  formatted = formatted.replace(/(\d+\.\s)/g, "\n$1")
  formatted = formatted.replace(/\n{3,}/g, "\n\n").trim()

  return formatted
}

function normalizeList(value: string) {
  return value
    .split("\n")
    .map((line) =>
      line
        .replace(/^\d+\.\s*/, "")
        .replace(/^[-•]\s*/, "")
        .trim()
    )
    .filter(Boolean)
}

function extractSection(text: string, headings: string[]) {
  const normalized = normalizeAssistantText(text)

  for (const heading of headings) {
    const escapedHeading = heading.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    const allOtherHeadings = sectionTitles
      .filter((title) => title !== heading)
      .map((title) => title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
      .join("|")

    const regex = new RegExp(
      `${escapedHeading}\\s*([\\s\\S]*?)(?=\\n\\n(?:${allOtherHeadings})|$)`,
      "i"
    )

    const match = normalized.match(regex)
    if (match?.[1]?.trim()) {
      return match[1].trim()
    }
  }

  return ""
}

function parseConsultationFromReply(reply: string) {
  const interpretation =
    extractSection(reply, ["Ayurvedic Interpretation:"]) || ""

  const remediesText =
    extractSection(reply, ["Home Remedies:"]) || ""

  const guidanceText =
    extractSection(reply, ["Diet Recommendations:", "Wellness Guidance:"]) || ""

  const precautionsText =
    extractSection(reply, ["When to See a Doctor:", "Precautions:"]) || ""

  return {
    summary: interpretation,
    interpretation,
    remedies: normalizeList(remediesText),
    precautions: normalizeList(precautionsText),
    guidance: normalizeList(guidanceText),
  }
}

function renderAssistantMessage(content: string) {
  const formatted = normalizeAssistantText(content)
  const blocks = formatted.split("\n\n").filter((block) => block.trim() !== "")

  return (
    <div className="space-y-4 text-sm md:text-base">
      {blocks.map((block, index) => {
        const trimmed = block.trim()

        const matchedHeading = sectionTitles.find((title) =>
          trimmed.toLowerCase().startsWith(title.toLowerCase())
        )

        if (matchedHeading) {
          const body = trimmed.slice(matchedHeading.length).trim()

          return (
            <div key={index} className="space-y-2">
              <p className="font-bold text-[#34412A]">{matchedHeading}</p>
              {body && (
                <p className="whitespace-pre-line leading-7 text-[#3D4A2D]">
                  {body}
                </p>
              )}
            </div>
          )
        }

        return (
          <p
            key={index}
            className="whitespace-pre-line leading-7 text-[#3D4A2D]"
          >
            {trimmed}
          </p>
        )
      })}
    </div>
  )
}

function TypingDots() {
  return (
    <div className="flex items-center gap-1 py-1">
      <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-[#9AB17A] [animation-delay:-0.3s]" />
      <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-[#9AB17A] [animation-delay:-0.15s]" />
      <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-[#9AB17A]" />
    </div>
  )
}

export function ChatPage() {
  const router = useRouter()
  const { patientData, chatMessages, addChatMessage, setConsultationData } =
    usePatient()

  const [inputMessage, setInputMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const hasSentWelcomeRef = useRef(false)

  useEffect(() => {
    if (!patientData) {
      router.push("/form")
      return
    }

    if (!hasSentWelcomeRef.current && chatMessages.length === 0) {
      hasSentWelcomeRef.current = true

      addChatMessage({
        role: "assistant",
        content: `Namaste ${patientData.name}! Welcome to Ayurvedic Consultation. I’ve received your details and your health concern: "${patientData.symptoms}". I’m starting the initial analysis of your symptoms now. To understand your condition better, please tell me how long you’ve had these symptoms, whether they get worse at any particular time, and how intense they feel right now.`,
      })
    }
  }, [patientData, chatMessages.length, addChatMessage, router])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [chatMessages, isTyping])

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !patientData) return

    const userMsg = inputMessage.trim()

    addChatMessage({
      role: "user",
      content: userMsg,
    })

    setInputMessage("")
    setIsTyping(true)

    try {
      const response = await fetch("http://localhost:5000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMsg,
          patient: patientData,
          chat_history: chatMessages,
        }),
      })

      const data = await response.json()
      const replyText = data.reply || "No response from AI."

      addChatMessage({
        role: "assistant",
        content: replyText,
      })

      if (data.consultation) {
        setConsultationData(data.consultation)
      } else {
        const parsedConsultation = parseConsultationFromReply(replyText)
        setConsultationData(parsedConsultation)
      }
    } catch (error) {
      addChatMessage({
        role: "assistant",
        content:
          "I’m unable to connect to the backend right now. Please make sure the Python server is running.",
      })
    } finally {
      setIsTyping(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleSendMessage()
    }
  }

  if (!patientData) {
    return null
  }

  return (
    <div className="relative z-10 min-h-screen py-8 md:py-12">
      <div className="container mx-auto max-w-4xl px-4">
        <Card className="border-[#D4D0C1] bg-white/95 shadow-xl backdrop-blur-sm">
          <CardHeader className="border-b border-[#D4D0C1] pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="font-serif text-2xl font-bold text-[#3D4A2D]">
                  Ayurvedic Consultation
                </CardTitle>
                <p className="mt-1 text-[#6B7A5A]">
                  Consulting with: {patientData.name}
                </p>
              </div>

              {patientData.imageUrl && (
                <div className="flex items-center gap-2 rounded-lg bg-[#F5F0E1] px-3 py-2">
                  <ImageIcon className="h-4 w-4 text-[#9AB17A]" />
                  <span className="text-sm text-[#6B7A5A]">Image attached</span>
                </div>
              )}
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <div className="h-[400px] space-y-4 overflow-y-auto p-6 md:h-[500px]">
              {chatMessages.map((message: ChatMessage) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {message.role === "assistant" && (
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#9AB17A] to-[#7A9A5A]">
                      <Bot className="h-5 w-5 text-white" />
                    </div>
                  )}

                  <div
                    className={`max-w-[80%] rounded-2xl p-4 shadow-md ${
                      message.role === "user"
                        ? "bg-[#9AB17A] text-white"
                        : "border border-[#D4D0C1] bg-[#F8F4EA] text-[#3D4A2D]"
                    }`}
                  >
                    {message.role === "assistant" ? (
                      renderAssistantMessage(message.content)
                    ) : (
                      <p className="whitespace-pre-line leading-7">
                        {message.content}
                      </p>
                    )}
                  </div>

                  {message.role === "user" && (
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#E4DFB5]">
                      <User className="h-5 w-5 text-[#3D4A2D]" />
                    </div>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start gap-3">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#9AB17A] to-[#7A9A5A]">
                    <Bot className="h-5 w-5 text-white" />
                  </div>

                  <div className="rounded-2xl border border-[#D4D0C1] bg-[#F8F4EA] p-4 shadow-md">
                    <TypingDots />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            <div className="border-t border-[#D4D0C1] p-4">
              <div className="flex gap-3">
                <Input
                  placeholder="Type your response here..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="border-[#D4D0C1] bg-[#F5F0E1] text-[#3D4A2D] focus:border-[#9AB17A] focus:ring-[#9AB17A]"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isTyping}
                  className="rounded-xl bg-[#9AB17A] px-6 text-white hover:bg-[#7A9A5A]"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}