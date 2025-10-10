"use client"

import { useRef } from "react"
import { CaretRightIcon, CaretLeftIcon } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { CommunityCard } from "./community-card"

export function FeaturedSection() {
  const scrollRef = useRef<HTMLDivElement>(null)

  const communities = [
    {
      id: 1,
      name: "Creator Central",
      image: "https://pbs.twimg.com/profile_images/1941864407186702336/BtLzKmlV_400x400.jpg",
      members: 603,
      rating: 5.0,
      reviews: 21,
      price: "~0.001 ETH",
      description: "Creator Central is a place for re...",
    },
    {
      id: 2,
      name: "AX1.vc",
      image: "https://pbs.twimg.com/profile_images/1941864407186702336/BtLzKmlV_400x400.jpg",
      members: 22000,
      rating: 4.9,
      reviews: 1261,
      price: "0.01 ETH",
      description: "Venture Club",
    },
    {
      id: 3,
      name: "ZenAcademy",
      image: "https://pbs.twimg.com/profile_images/1941864407186702336/BtLzKmlV_400x400.jpg",
      members: 55000,
      rating: 5.0,
      reviews: 35,
      price: "~0.001 ETH",
      description: "Learn and grow together",
    },
    {
      id: 4,
      name: "CATAPULT",
      image: "https://pbs.twimg.com/profile_images/1941864407186702336/BtLzKmlV_400x400.jpg",
      members: 6900,
      rating: 4.3,
      reviews: 3,
      price: "~0.001 ETH",
      description: "CATAPULT TOWNS CO...",
    },
    {
      id: 5,
      name: "Sistine Research",
      image: "https://pbs.twimg.com/profile_images/1941864407186702336/BtLzKmlV_400x400.jpg",
      members: 8300000,
      rating: 5.0,
      reviews: 65,
      price: "0.1 ETH",
      description: "Trading, investing, and re...",
    },
    {
      id: 6,
      name: "BrazyBet",
      image: "https://pbs.twimg.com/profile_images/1941864407186702336/BtLzKmlV_400x400.jpg",
      members: 1,
      rating: 5.0,
      reviews: 1,
      price: "0.005 ETH",
      description: "When the fun stops, dep...",
    },
    {
      id: 7,
      name: "naja",
      image: "https://pbs.twimg.com/profile_images/1941864407186702336/BtLzKmlV_400x400.jpg",
      members: 3400,
      rating: 4.8,
      reviews: 84,
      price: "0.002 ETH",
      description: "Exclusive alpha community.",
    },
  ]

  const scroll = (direction: "left" | "right") => {
    const container = scrollRef.current
    if (!container) return
    const scrollAmount = container.clientWidth * 0.8
    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    })
  }

  return (
    <section className="m-2 mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
      {/* Header */}
      <div className="mb-6 sm:mb-8 flex items-center justify-between gap-2">
        <div className="min-w-0">
          <h2 className="text-lg sm:text-2xl font-bold text-foreground truncate">
            Featured
          </h2>
          <p className="text-muted-foreground text-xs sm:text-sm truncate">
            This week&#39;s curated towns
          </p>
        </div>

        <div className="flex items-center gap-1 flex-shrink-0">
          <Button
            onClick={() => scroll("left")}
            size="icon"
            className="h-8 w-8 sm:h-9 sm:w-9"
          >
            <CaretLeftIcon size={16} />
          </Button>
          <Button
            onClick={() => scroll("right")}
            size="icon"
            className="h-8 w-8 sm:h-9 sm:w-9"
          >
            <CaretRightIcon size={16} />
          </Button>
          <Button
            variant="link"
            className="text-sm sm:text-md px-1 sm:px-2 whitespace-nowrap"
          >
            See All
          </Button>
        </div>
      </div>



      {/* Carousel Container */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scroll-smooth scrollbar-hide pb-2 -mx-4 px-4 sm:mx-0 sm:px-0"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {communities.map((community) => (
          <div
            key={community.id}
            className="flex-shrink-0 w-[280px] sm:w-[300px] md:w-[320px] transition-all duration-300"
          >
            <CommunityCard {...community} />
          </div>
        ))}
      </div>
    </section>
  )
}
