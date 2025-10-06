"use client"

import { useState } from "react"
import { CaretRightIcon, CaretLeftIcon } from "@phosphor-icons/react"
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
    {
      id: 8,
      name: "Pixel Pioneers",
      image: "https://pbs.twimg.com/profile_images/1941864407186702336/BtLzKmlV_400x400.jpg",
      members: 8700,
      rating: 4.5,
      reviews: 220,
      price: "Free",
      description: "For indie game creators.",
    },
    {
      id: 9,
      name: "DeFi Lounge",
      image: "https://pbs.twimg.com/profile_images/1941864407186702336/BtLzKmlV_400x400.jpg",
      members: 12200,
      rating: 4.7,
      reviews: 312,
      price: "0.003 ETH",
      description: "Discuss yield strategies.",
    },
    {
      id: 10,
      name: "MetaVerse Builders",
      image: "https://pbs.twimg.com/profile_images/1941864407186702336/BtLzKmlV_400x400.jpg",
      members: 46000,
      rating: 4.9,
      reviews: 642,
      price: "0.02 ETH",
      description: "Building the virtual future.",
    },
    {
      id: 11,
      name: "ArtDrop Studio",
      image: "https://pbs.twimg.com/profile_images/1941864407186702336/BtLzKmlV_400x400.jpg",
      members: 720,
      rating: 4.2,
      reviews: 14,
      price: "0.0015 ETH",
      description: "NFT artists and collectors.",
    },
    {
      id: 12,
      name: "Crypto Coders",
      image: "https://pbs.twimg.com/profile_images/1941864407186702336/BtLzKmlV_400x400.jpg",
      members: 10400,
      rating: 5.0,
      reviews: 389,
      price: "0.002 ETH",
      description: "Developers building web3.",
    },
  ]

  const [page, setPage] = useState(0)
  const itemsPerPage = 6
  const totalPages = Math.ceil(communities.length / itemsPerPage)

  const handleNext = () => {
    if (page < totalPages - 1) setPage(page + 1)
  }

  const handlePrev = () => {
    if (page > 0) setPage(page - 1)
  }

  const currentItems = communities.slice(page * itemsPerPage, (page + 1) * itemsPerPage)

  return (
    <section className="px-4 py-8 md:px-8 lg:px-16 xl:px-24">
      {/* Header Section */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-black">Featured</h2>
          <p className="mt-1 text-gray-600 text-sm md:text-base">
            This week&#39;s curated Groups
          </p>
        </div>

        {/* Button Group */}
        <div className="flex items-center justify-center gap-2 sm:gap-4">
          <Button
            onClick={handlePrev}
            disabled={page === 0}
            className={`p-2 sm:p-3 rounded-full ${page === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <CaretLeftIcon size={20} />
          </Button>
          <Button
            onClick={handleNext}
            disabled={page === totalPages - 1}
            className={`p-2 sm:p-3 rounded-full ${page === totalPages - 1 ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <CaretRightIcon size={20} />
          </Button>

          <Button
            variant="link"
            className="text-sm md:text-base text-blue-600 hover:text-blue-800"
          >
            See All
          </Button>
        </div>
      </div>

      {/* Cards Grid */}
      <div
        className="
          grid 
          gap-4 sm:gap-6 
          grid-cols-1 
          xs:grid-cols-2 
          md:grid-cols-3 
          lg:grid-cols-4 
          xl:grid-cols-6
          transition-all 
          duration-300
        "
      >
        {currentItems.map((community) => (
          <CommunityCard key={community.id} {...community} />
        ))}
      </div>

      {/* Pagination info (optional) */}
      <div className="mt-6 text-center text-gray-500 text-sm">
        Page {page + 1} of {totalPages}
      </div>
    </section>
  )
}
