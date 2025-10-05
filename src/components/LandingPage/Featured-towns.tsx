"use client"

import Image from "next/image"
import { Star, ChevronLeft, ChevronRight } from "lucide-react"
import { useRef } from "react"

interface FeaturedTown {
  name: string
  description: string
  image: string
  rating: number
  reviewCount: number
  followers: number
  ethPrice: string
}

const featuredTownsData: FeaturedTown[] = [
  {
    name: "Creator Centr...",
    description: "Creator Central is a place...",
    image: "/creator-central-avatar.jpg",
    rating: 5.0,
    reviewCount: 21,
    followers: 576,
    ethPrice: "~0.001 ETH",
  },
  {
    name: "AX1.vc",
    description: "Venture Club",
    image: "/ax1-logo-white.jpg",
    rating: 4.9,
    reviewCount: 1261,
    followers: 23000000,
    ethPrice: "0.01 ETH",
  },
  {
    name: "ZenAcademy",
    description: "",
    image: "/zen-academy-purple-logo.jpg",
    rating: 5.0,
    reviewCount: 35,
    followers: 55000,
    ethPrice: "~0.001 ETH",
  },
  {
    name: "CATAPULT",
    description: "CATAPULT TOWNS CO...",
    image: "/catapult-logo-black.jpg",
    rating: 4.3,
    reviewCount: 3,
    followers: 6900,
    ethPrice: "~0.001 ETH",
  },
  {
    name: "Sistine Rese...",
    description: "Trading, investing, and re...",
    image: "/sistine-research-yellow-logo.jpg",
    rating: 5.0,
    reviewCount: 65,
    followers: 8700000,
    ethPrice: "0.1 ETH",
  },
  {
    name: "BrazyBet",
    description: "When the fun stops, dep...",
    image: "/brazybet-premium-community.jpg",
    rating: 5.0,
    reviewCount: 65,
    followers: 0,
    ethPrice: "0.005 ETH",
  },
]

function formatFollowers(count: number): string {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(count % 1000000 === 0 ? 0 : 1)}M`
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(count % 1000 === 0 ? 0 : 1)}K`
  }
  return count.toString()
}

export function FeaturedTowns() {
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      })
    }
  }

  return (
    <div className="w-full bg-[#1a1a1a] p-8">
      <div className="mb-6">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Featured</h2>
            <p className="text-sm text-gray-400">This week's curated towns</p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => scroll("left")}
              className="rounded-full bg-[#252525] p-2 text-white hover:bg-[#303030]"
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="rounded-full bg-[#252525] p-2 text-white hover:bg-[#303030]"
              aria-label="Scroll right"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            <button className="text-sm text-blue-400 hover:text-blue-300">See All</button>
          </div>
        </div>
      </div>

      <div
        ref={scrollContainerRef}
        className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {featuredTownsData.map((town, index) => (
          <div key={index} className="flex min-w-[280px] flex-col rounded-lg bg-[#252525] overflow-hidden">
            <div className="relative h-[200px] w-full">
              <Image src={town.image || "/placeholder.svg"} alt={town.name} fill className="object-cover" />
            </div>

            <div className="flex flex-col gap-2 p-4">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-white">{town.name}</h3>
                {town.followers > 0 && (
                  <span className="flex items-center gap-1 text-xs text-gray-400">
                    <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                    </svg>
                    {formatFollowers(town.followers)}
                  </span>
                )}
              </div>

              {town.description && <p className="text-sm text-gray-400">{town.description}</p>}

              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(town.rating) ? "fill-orange-500 text-orange-500" : "fill-gray-600 text-gray-600"
                    }`}
                  />
                ))}
                <span className="ml-1 text-sm text-white">{town.rating.toFixed(1)}</span>
                <span className="text-sm text-gray-400">({town.reviewCount})</span>
              </div>

              <div className="mt-2 rounded-full bg-[#1a1a1a] px-4 py-2 text-center">
                <span className="text-sm font-medium text-white">{town.ethPrice}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
