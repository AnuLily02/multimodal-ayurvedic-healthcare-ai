"use client"

import { ReactNode } from "react"
import { PatientProvider } from "@/lib/patient-context"

export function Providers({ children }: { children: ReactNode }) {
  return <PatientProvider>{children}</PatientProvider>
}
