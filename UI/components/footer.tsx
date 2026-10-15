import { Leaf, Heart } from "lucide-react"

export function Footer() {
  return (
    <footer className="relative z-10 bg-white/60 backdrop-blur-sm border-t border-[#D4D0C1] mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#9AB17A] to-[#7A9A5A] flex items-center justify-center">
              <Leaf className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-semibold text-[#3D4A2D] font-serif">
              Ayurvedic consultation
            </span>
          </div>

          <p className="text-sm text-[#6B7A5A] text-center">
            Blending ancient Ayurvedic wisdom with modern AI technology
          </p>

          <div className="flex items-center gap-1 text-sm text-[#6B7A5A]">
            <span>Made with</span>
            <Heart className="w-4 h-4 text-[#9AB17A] fill-[#9AB17A]" />
            <span>for your wellness</span>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-[#D4D0C1]/50 text-center">
          <p className="text-xs text-[#6B7A5A]">
            © {new Date().getFullYear()} Ayurvedic consultation. This is for informational purposes only and not a substitute for professional medical advice.
          </p>
        </div>
      </div>
    </footer>
  )
}
