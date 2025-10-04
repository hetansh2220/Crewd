"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Star } from "lucide-react"
import { useRef } from "react"
import Image from "next/image";

const towns = [
  {
    id: 1,
    name: "CreatorCentral",
    description: "Creator Central is a place for...",
    members: "555",
    rating: 5.0,
    reviews: 20,
    price: "~0.001 ETH",
    image: "/creator-community.jpg",
    color: "bg-pink-500",
  },
  {
    id: 2,
    name: "AX1",
    description: "Venture Club",
    members: "22M",
    rating: 4.9,
    reviews: 1261,
    price: "0.01 ETH",
    image: "/venture-club.jpg",
    color: "bg-gray-900",
  },
  {
    id: 3,
    name: "ZenAcademy",
    description: "",
    members: "55K",
    rating: 5.0,
    reviews: 35,
    price: "~0.001 ETH",
    image: "/zen-academy.jpg",
    color: "bg-purple-500",
  },
  {
    id: 4,
    name: "CATAPULT",
    description: "CATAPULT TOWNS COMM...",
    members: "6.9K",
    rating: 4.3,
    reviews: 3,
    price: "~0.01 ETH",
    image: "/catapult.jpg",
    color: "bg-black",
  },
  {
    id: 5,
    name: "Slatine Research",
    description: "Trading, investing, and resea...",
    members: "8.7M",
    rating: 5.0,
    reviews: 65,
    price: "0.1 ETH",
    image: "/research-concept.png",
    color: "bg-yellow-400",
  },
  {
    id: 6,
    name: "BrazyBet",
    description: "When the fun stops, deposit...",
    members: "",
    rating: 5.0,
    reviews: 1,
    price: "0.005 ETH",
    image: "/betting.jpg",
    color: "bg-gradient-to-br from-pink-500 to-orange-500",
  },
]

export function FeaturedTowns() {
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 320
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      })
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Featured</h2>
          <p className="text-sm text-muted-foreground">This week&#39;s curated towns</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => scroll("left")}
            className="h-8 w-8 rounded-full bg-muted/50 hover:bg-muted"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => scroll("right")}
            className="h-8 w-8 rounded-full bg-muted/50 hover:bg-muted"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button variant="link" className="text-primary hover:text-primary/80">
            See All
          </Button>
        </div>
      </div>

      <div
        ref={scrollContainerRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide pb-4"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {towns.map((town) => (
          <Card
            key={town.id}
            className="flex-shrink-0 w-[280px] bg-card/80 backdrop-blur border-border/50 overflow-hidden hover:bg-card transition-colors cursor-pointer"
          >
<div className={`relative h-32 ${town.color} overflow-hidden`}>
  <Image
    src="https://river.delivery/media/ffc966d34a9e47159e94dba1478f460c151c9b3be50d545bedb3ce09f7ea6fa8?size=300x300&key=4a831bdc3b83478ba6967cdc12c7955d511f9236a28ac6ce875c1c1b3b1f29e5&iv="  // <-- use one image for all cards
    alt={town.name}
    fill
    className="object-cover"
  />
</div>

            <div className="p-4 space-y-3">
              <div>
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-foreground">{town.name}</h3>
                  {town.members && (
                    <span className="text-xs text-muted-foreground whitespace-nowrap">{town.members}</span>
                  )}
                </div>
                {town.description && <p className="text-xs text-muted-foreground truncate">{town.description}</p>}
              </div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3 w-3 ${
                      i < Math.floor(town.rating) ? "fill-orange-500 text-orange-500" : "fill-muted text-muted"
                    }`}
                  />
                ))}
                <span className="text-xs font-semibold text-foreground ml-1">{town.rating}</span>
                <span className="text-xs text-muted-foreground">({town.reviews})</span>
              </div>
              <div className="text-sm font-semibold text-foreground">{town.price}</div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
