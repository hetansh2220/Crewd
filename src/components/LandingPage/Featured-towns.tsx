"use client"

import {CaretRightIcon,  CaretLeftIcon, StarIcon, UsersIcon} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button"
import { CommunityCard } from "./community-card"

export function FeaturedSection() {
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
  ]

  return (
    <section className="p-4">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-black">Featured</h2>
          <p className="mt-1 text-gray-700">{"This week's curated Groups"}</p>
        </div>
        <div className="flex items-center justify-center gap-4">
          <Button>
            <CaretLeftIcon size={22} />
          </Button>
          <Button>
            <CaretRightIcon size={22} />
          </Button>
          <Button variant="link" className="text-lg">
            See All
          </Button>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {communities.map((community) => (
          <CommunityCard key={community.id} {...community} />
        ))}
      </div>
    </section>
  )
}
