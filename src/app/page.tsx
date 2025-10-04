import { Header } from "../components/Header"
import { HeroSection } from "../components/Hero-section"
import { ActivityFeed } from "../components/Activity-feed"
import { FeaturedTowns } from "../components/Featured-towns"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <HeroSection />
          </div>
          <div className="lg:col-span-1">
            <ActivityFeed />
          </div>
        </div>
        <div className="mt-16">
          <FeaturedTowns />
        </div>
      </main>
    </div>
  )
}
