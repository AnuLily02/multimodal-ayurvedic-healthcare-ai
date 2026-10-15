import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { AnimatedBackground } from "@/components/background"
import { HomePage } from "@/components/pages/home-page"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <AnimatedBackground />
      <Header currentPage="home" />
      <main className="flex-1">
        <HomePage />
      </main>
      <Footer />
    </div>
  )
}
