"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import {
  Upload,
  X,
  User,
  Calendar,
  Weight,
  Ruler,
  Heart,
  Camera,
  ImageIcon,
  Check,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { usePatient } from "@/lib/patient-context"

export function FormPage() {
  const router = useRouter()
  const { setPatientData } = usePatient()

  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    weight: "",
    height: "",
    symptoms: "",
  })

  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [cameraError, setCameraError] = useState("")
  const [cameraOpen, setCameraOpen] = useState(false)
  const [cameraLoading, setCameraLoading] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const processSelectedImage = (file: File | undefined) => {
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result as string)
      setCapturedImage(null)
    }
    reader.readAsDataURL(file)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    processSelectedImage(file)
  }

  const stopCameraStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
  }

  const openCamera = async () => {
    try {
      setCameraError("")
      setCameraLoading(true)
      setCapturedImage(null)
      setCameraOpen(true)

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false,
      })

      streamRef.current = stream

      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          videoRef.current.play().catch(() => {})
        }
      }, 100)
    } catch (error) {
      setCameraError("Unable to access camera. Please allow permission or use Choose File.")
      setCameraOpen(false)
    } finally {
      setCameraLoading(false)
    }
  }

  const closeCamera = () => {
    stopCameraStream()
    setCameraOpen(false)
    setCapturedImage(null)
    setCameraError("")
  }

  const capturePhoto = () => {
    const video = videoRef.current
    const canvas = canvasRef.current

    if (!video || !canvas) return

    const width = video.videoWidth
    const height = video.videoHeight

    if (!width || !height) return

    canvas.width = width
    canvas.height = height

    const context = canvas.getContext("2d")
    if (!context) return

    context.drawImage(video, 0, 0, width, height)
    const imageData = canvas.toDataURL("image/png")
    setCapturedImage(imageData)
  }

  const retakePhoto = () => {
    setCapturedImage(null)
  }

  const confirmCapturedPhoto = () => {
    if (!capturedImage) return
    setImagePreview(capturedImage)
    closeCamera()
  }

  const removeImage = () => {
    setImagePreview(null)
    setCapturedImage(null)

    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) newErrors.name = "Name is required"
    if (!formData.age.trim()) newErrors.age = "Age is required"
    if (!formData.gender) newErrors.gender = "Gender is required"
    if (!formData.weight.trim()) newErrors.weight = "Weight is required"
    if (!formData.height.trim()) newErrors.height = "Height is required"
    if (!formData.symptoms.trim()) {
      newErrors.symptoms = "Health concerns are required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      setPatientData({
        ...formData,
        imageUrl: imagePreview || undefined,
      })

      router.push("/chat")
    }
  }

  useEffect(() => {
    return () => {
      stopCameraStream()
    }
  }, [])

  return (
    <div className="relative z-10 min-h-screen py-8 md:py-12">
      <div className="container mx-auto max-w-2xl px-4">
        <Card className="border-[#D4D0C1] bg-white/95 shadow-xl backdrop-blur-sm">
          <CardHeader className="pb-2 text-center">
            <CardTitle className="font-serif text-2xl font-bold text-[#3D4A2D] md:text-3xl">
              Patient Information
            </CardTitle>
            <p className="mt-2 text-[#6B7A5A]">
              Please fill in your details to begin your Ayurvedic consultation
            </p>
          </CardHeader>

          <CardContent className="p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div className="space-y-2">
                <Label
                  htmlFor="name"
                  className="flex items-center gap-2 font-medium text-[#3D4A2D]"
                >
                  <User className="h-4 w-4 text-[#9AB17A]" />
                  Full Name
                </Label>
                <Input
                  id="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="border-[#D4D0C1] bg-[#F5F0E1] text-[#3D4A2D] focus:border-[#9AB17A] focus:ring-[#9AB17A]"
                />
                {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
              </div>

              {/* Age and Gender */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label
                    htmlFor="age"
                    className="flex items-center gap-2 font-medium text-[#3D4A2D]"
                  >
                    <Calendar className="h-4 w-4 text-[#9AB17A]" />
                    Age
                  </Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="Years"
                    value={formData.age}
                    onChange={(e) => handleInputChange("age", e.target.value)}
                    className="border-[#D4D0C1] bg-[#F5F0E1] text-[#3D4A2D] focus:border-[#9AB17A] focus:ring-[#9AB17A]"
                  />
                  {errors.age && <p className="text-sm text-red-500">{errors.age}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gender" className="font-medium text-[#3D4A2D]">
                    Gender
                  </Label>
                  <Select
                    value={formData.gender}
                    onValueChange={(value) => handleInputChange("gender", value)}
                  >
                    <SelectTrigger className="border-[#D4D0C1] bg-[#F5F0E1] text-[#3D4A2D] focus:border-[#9AB17A] focus:ring-[#9AB17A]">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.gender && <p className="text-sm text-red-500">{errors.gender}</p>}
                </div>
              </div>

              {/* Weight and Height */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label
                    htmlFor="weight"
                    className="flex items-center gap-2 font-medium text-[#3D4A2D]"
                  >
                    <Weight className="h-4 w-4 text-[#9AB17A]" />
                    Weight (kg)
                  </Label>
                  <Input
                    id="weight"
                    type="number"
                    placeholder="kg"
                    value={formData.weight}
                    onChange={(e) => handleInputChange("weight", e.target.value)}
                    className="border-[#D4D0C1] bg-[#F5F0E1] text-[#3D4A2D] focus:border-[#9AB17A] focus:ring-[#9AB17A]"
                  />
                  {errors.weight && <p className="text-sm text-red-500">{errors.weight}</p>}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="height"
                    className="flex items-center gap-2 font-medium text-[#3D4A2D]"
                  >
                    <Ruler className="h-4 w-4 text-[#9AB17A]" />
                    Height (cm)
                  </Label>
                  <Input
                    id="height"
                    type="number"
                    placeholder="cm"
                    value={formData.height}
                    onChange={(e) => handleInputChange("height", e.target.value)}
                    className="border-[#D4D0C1] bg-[#F5F0E1] text-[#3D4A2D] focus:border-[#9AB17A] focus:ring-[#9AB17A]"
                  />
                  {errors.height && <p className="text-sm text-red-500">{errors.height}</p>}
                </div>
              </div>

              {/* Symptoms */}
              <div className="space-y-2">
                <Label
                  htmlFor="symptoms"
                  className="flex items-center gap-2 font-medium text-[#3D4A2D]"
                >
                  <Heart className="h-4 w-4 text-[#9AB17A]" />
                  Health Concerns / Symptoms <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="symptoms"
                  placeholder="Please describe your health concerns, symptoms, or any discomfort you're experiencing in detail..."
                  value={formData.symptoms}
                  onChange={(e) => handleInputChange("symptoms", e.target.value)}
                  className="min-h-[120px] border-[#D4D0C1] bg-[#F5F0E1] text-[#3D4A2D] focus:border-[#9AB17A] focus:ring-[#9AB17A]"
                />
                {errors.symptoms && (
                  <p className="text-sm text-red-500">{errors.symptoms}</p>
                )}
              </div>

              {/* Image Upload */}
              <div className="space-y-3">
                <Label className="flex items-center gap-2 font-medium text-[#3D4A2D]">
                  <Upload className="h-4 w-4 text-[#9AB17A]" />
                  Upload Tongue Image (Optional)
                </Label>

                {!imagePreview ? (
                  <div className="rounded-2xl border-2 border-dashed border-[#C3CC9B] bg-[#F5F0E1]/50 p-6 transition-colors">
                    <div className="mb-4 text-center">
                      <ImageIcon className="mx-auto mb-3 h-10 w-10 text-[#9AB17A]" />
                      <p className="font-medium text-[#5F6E4F]">Add an image if needed</p>
                      <p className="mt-1 text-sm text-[#6B7A5A]/80">
                        You can either take a photo or choose from your files
                      </p>
                    </div>

                    {cameraError && (
                      <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                        {cameraError}
                      </div>
                    )}

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                    />

                    <div className="flex flex-col gap-3 sm:flex-row">
                      <Button
                        type="button"
                        onClick={openCamera}
                        className="flex-1 rounded-xl bg-[#9AB17A] text-white hover:bg-[#7A9A5A]"
                      >
                        <Camera className="mr-2 h-4 w-4" />
                        Open Camera
                      </Button>

                      <Button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        variant="outline"
                        className="flex-1 rounded-xl border-[#9AB17A] bg-white text-[#3D4A2D] hover:bg-[#F5F0E1]"
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        Choose File
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-[#D4D0C1] bg-[#F8F4EA] p-4">
                    <div className="relative inline-block">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="h-36 w-36 rounded-xl border-2 border-[#C3CC9B] object-cover"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-red-500 text-white transition-colors hover:bg-red-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>

                    <p className="mt-3 text-sm text-[#6B7A5A]">
                      Image selected successfully.
                    </p>
                  </div>
                )}
              </div>

              {/* Submit */}
              <Button
                type="submit"
                className="w-full rounded-xl bg-[#9AB17A] py-6 text-lg text-white shadow-lg transition-all duration-300 hover:bg-[#7A9A5A] hover:shadow-xl"
              >
                Start Consultation
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Camera Card Modal */}
      {cameraOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4">
          <div className="relative w-full max-w-md rounded-3xl border border-[#D4D0C1] bg-white p-4 shadow-2xl">
            <button
              type="button"
              onClick={closeCamera}
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-[#F3EFDD] text-[#5F6E4F] hover:bg-[#E8E1CC]"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="mb-4 pt-3 text-center">
              <h3 className="font-serif text-xl font-semibold text-[#3D4A2D]">
                Capture Image
              </h3>
              <p className="mt-1 text-sm text-[#6B7A5A]">
                Take a photo of tongue and confirm to upload it
              </p>
            </div>

            <div className="overflow-hidden rounded-2xl border border-[#D4D0C1] bg-[#F5F0E1]">
              {!capturedImage ? (
                <div className="relative aspect-[4/3] w-full bg-black">
                  {cameraLoading && (
                    <div className="absolute inset-0 flex items-center justify-center text-sm text-white">
                      Opening camera...
                    </div>
                  )}
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : (
                <img
                  src={capturedImage}
                  alt="Captured"
                  className="aspect-[4/3] w-full object-cover"
                />
              )}
            </div>

            <div className="mt-4 flex items-center justify-center gap-3">
              {!capturedImage ? (
                <>
                  <Button
                    type="button"
                    onClick={closeCamera}
                    variant="outline"
                    className="rounded-full border-red-300 text-red-600 hover:bg-red-50"
                  >
                    <X className="mr-2 h-4 w-4" />
                    Cancel
                  </Button>

                  <Button
                    type="button"
                    onClick={capturePhoto}
                    className="rounded-full bg-[#9AB17A] text-white hover:bg-[#7A9A5A]"
                  >
                    <Camera className="mr-2 h-4 w-4" />
                    Click Photo
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    type="button"
                    onClick={retakePhoto}
                    variant="outline"
                    className="rounded-full border-[#9AB17A] text-[#3D4A2D] hover:bg-[#F5F0E1]"
                  >
                    <X className="mr-2 h-4 w-4" />
                    Retake
                  </Button>

                  <Button
                    type="button"
                    onClick={confirmCapturedPhoto}
                    className="rounded-full bg-[#9AB17A] text-white hover:bg-[#7A9A5A]"
                  >
                    <Check className="mr-2 h-4 w-4" />
                    Use Photo
                  </Button>
                </>
              )}
            </div>

            <canvas ref={canvasRef} className="hidden" />
          </div>
        </div>
      )}
    </div>
  )
}