"use client"

import { Header } from '@/components/header';
import { FeaturedSection } from "@/components/LandingPage/featured-groups";
import { HeroSection } from "@/components/LandingPage/hero-section";
import { TopSection } from "@/components/LandingPage/top-section";
import { useEffect } from 'react';
import { Channel, useChat, useChatContext } from 'stream-chat-react';
export default function Home() {


  return (
    <>
      {/* <Header /> */}
      <HeroSection />
      <FeaturedSection />
      <TopSection />
    </>
  )
}
