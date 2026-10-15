"use client"

import { createContext, useContext, useState, ReactNode } from "react"

export interface PatientData {
  name: string
  age: string
  gender: string
  weight: string
  height: string
  symptoms: string
  imageUrl?: string
}

export interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export interface ConsultationData {
  summary: string
  interpretation: string
  remedies: string[]
  precautions: string[]
  guidance: string[]
}

interface PatientContextType {
  patientData: PatientData | null
  setPatientData: (data: PatientData) => void
  chatMessages: ChatMessage[]
  addChatMessage: (message: Omit<ChatMessage, "id" | "timestamp">) => void
  consultationData: ConsultationData | null
  setConsultationData: (data: ConsultationData) => void
  clearAllData: () => void
}

const PatientContext = createContext<PatientContextType | undefined>(undefined)

export function PatientProvider({ children }: { children: ReactNode }) {
  const [patientData, setPatientData] = useState<PatientData | null>(null)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [consultationData, setConsultationData] = useState<ConsultationData | null>(null)

  const addChatMessage = (message: Omit<ChatMessage, "id" | "timestamp">) => {
    const newMessage: ChatMessage = {
      ...message,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
    }
    setChatMessages((prev) => [...prev, newMessage])
  }

  const clearAllData = () => {
    setPatientData(null)
    setChatMessages([])
    setConsultationData(null)
  }

  return (
    <PatientContext.Provider
      value={{
        patientData,
        setPatientData,
        chatMessages,
        addChatMessage,
        consultationData,
        setConsultationData,
        clearAllData,
      }}
    >
      {children}
    </PatientContext.Provider>
  )
}

export function usePatient() {
  const context = useContext(PatientContext)
  if (context === undefined) {
    throw new Error("usePatient must be used within a PatientProvider")
  }
  return context
}
