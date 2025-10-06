"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Star } from "lucide-react"

const towns = [
  {
    id: 1,
    name: "CreatorCentral",
    description: "Creator Central is a place for...",
    members: "555",
    rating: 5.0,
    reviews: 20,
    price: "~0.001 ETH",
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
    color: "bg-gradient-to-br from-pink-500 to-orange-500",
  },
  {
    id: 7,
    name: "PixelTown",
    description: "A vibrant pixel art community.",
    members: "2.3K",
    rating: 4.8,
    reviews: 42,
    price: "0.002 ETH",
    color: "bg-blue-400",
  },
  {
    id: 8,
    name: "CryptoCrafters",
    description: "Crafting the future of crypto.",
    members: "12K",
    rating: 4.7,
    reviews: 88,
    price: "0.008 ETH",
    color: "bg-green-500",
  },
  {
    id: 9,
    name: "MetaMinds",
    description: "Discussing all things metaverse.",
    members: "7.1K",
    rating: 4.9,
    reviews: 54,
    price: "0.003 ETH",
    color: "bg-indigo-500",
  },
  {
    id: 10,
    name: "ArtistryHub",
    description: "For digital artists and creators.",
    members: "15K",
    rating: 5.0,
    reviews: 120,
    price: "0.005 ETH",
    color: "bg-red-400",
  },
  {
    id: 11,
    name: "TechiesTown",
    description: "Tech, gadgets, and innovation.",
    members: "9.8K",
    rating: 4.6,
    reviews: 76,
    price: "0.004 ETH",
    color: "bg-teal-500",
  },
  {
    id: 12,
    name: "NFT Nexus",
    description: "NFT drops and discussions.",
    members: "21K",
    rating: 4.8,
    reviews: 99,
    price: "0.009 ETH",
    color: "bg-orange-400",
  },
]

export function FeaturedTowns() {
  const [currentPage, setCurrentPage] = useState(0)
  const itemsPerPage = 6

  const totalPages = Math.ceil(towns.length / itemsPerPage)
  const startIndex = currentPage * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const visibleTowns = towns.slice(startIndex, endIndex)

  const goToNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1)
    }
  }

  const goToPrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1)
    }
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Featured</h2>
          <p className="text-sm text-gray-500">
            This week&rsquo;s curated towns (Page {currentPage + 1} of {totalPages})
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={goToPrevPage}
            disabled={currentPage === 0}
            className="h-8 w-8 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={goToNextPage}
            disabled={currentPage === totalPages - 1}
            className="h-8 w-8 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          <button className="text-blue-600 hover:text-blue-800 ml-2">
            See All
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {visibleTowns.map((town) => (
          <div
            key={town.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className={`relative h-32 ${town.color}`}>
              <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/20" />
            </div>
            <div className="p-4 space-y-3">
              <div>
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold">{town.name}</h3>
                  {town.members && (
                    <span className="text-xs text-gray-500 whitespace-nowrap">{town.members}</span>
                  )}
                </div>
                {town.description && (
                  <p className="text-xs text-gray-500 truncate">{town.description}</p>
                )}
              </div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3 w-3 ${
                      i < Math.floor(town.rating)
                        ? "fill-orange-500 text-orange-500"
                        : "fill-gray-300 text-gray-300"
                    }`}
                  />
                ))}
                <span className="text-xs font-semibold ml-1">{town.rating}</span>
                <span className="text-xs text-gray-500">({town.reviews})</span>
              </div>
              <div className="text-sm font-semibold">{town.price}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}