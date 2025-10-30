"use client"

import { Button } from "@/components/ui/button"
import { getAverageRating } from "@/server/review"
import { Star, Users } from "lucide-react"
import Image from "next/image"
import { useEffect, useState } from "react"
interface CommunityCardProps {
  name: string
  image: string
  members: number
  reviews: number
  price: string
  description: string
  id: string
}

//Get average rating


export function CommunityCard({ id, name, image, members, reviews, price, description }: CommunityCardProps) {
  const [rating, setRating] = useState<number>(0);
  const formatMembers = (num: number) =>
    num >= 1000000 ? `${(num / 1000000).toFixed(1)}M` : num >= 1000 ? `${(num / 1000).toFixed(0)}K` : num.toString()

  useEffect(() => {
    const fetchAverageRating = async () => {
      const data = await getAverageRating(id);
      if (!data) {
        setRating(0);
      } else {
        setRating(Math.round(parseInt(data)));
      }
    }

    fetchAverageRating()
  }, [id])


  return (
    <div className="group rounded-xl bg-card shadow-sm hover:shadow-md transition-all duration-300 border border-border overflow-hidden h-full flex flex-col">
      <div className="aspect-4/3 overflow-hidden">
        <Image
          src={image || "/placeholder.svg"}
          width={400}
          height={300}
          alt={name}
          className="h-full w-full object-cover "
        />
      </div>

      <div className="p-4 space-y-3 flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-card-foreground line-clamp-1 text-sm sm:text-base">{name}</h3>
            <p className="text-xs sm:text-sm text-muted-foreground line-clamp-1">{description}</p>
          </div>
          <div className="flex items-center gap-1 text-xs sm:text-sm text-muted-foreground shrink-0">
            <Users className="h-3 w-3 sm:h-4 sm:w-4" />
            <span>{formatMembers(members)}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-3 w-3 sm:h-4 sm:w-4 fill-orange-500 text-orange-500" />
            ))}
          </div>
          <span className="text-xs sm:text-sm text-card-foreground font-medium">{rating}</span>
          <span className="text-xs sm:text-sm text-muted-foreground">({reviews})</span>
        </div>

        <Button className="w-full mt-auto text-sm">
          {price === "0" ? "Free" : price + " SOL"}
        </Button>
      </div>
    </div>
  )
}
