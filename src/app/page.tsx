import {Header} from '@/components/Header'
import { HeroSection } from "@/components/LandingPage/Hero-section";
import { FeaturedSection } from "@/components/LandingPage/Featured-Groups";
import { TopSection } from "@/components/LandingPage/top-section";

export default function Home() {
  return (
    <>
      <Header />
      <HeroSection />
      <FeaturedSection />
      <TopSection />

    </>
  )
}
