"use client"

import { Header } from '@/components/Header';
import { FeaturedSection } from "@/components/LandingPage/Featured-Groups";
import { HeroSection } from "@/components/LandingPage/Hero-section";
import { TopSection } from "@/components/LandingPage/top-section";
import { useEffect } from 'react';
import {Channel, useChat, useChatContext} from 'stream-chat-react';
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
