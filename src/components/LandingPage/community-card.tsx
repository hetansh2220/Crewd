import { Users, Star } from "lucide-react"
import { Button } from "@/components/ui/button"

interface CommunityCardProps {
  name: string
  image: string
  members: number
  rating: number
  reviews: number
  price: string
  description: string
}

export function CommunityCard({
  name,
  image,
  members,
  rating,
  reviews,
  price,
  description,
}: CommunityCardProps) {
  const formatMembers = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(0)}K`
    return num.toString()
  }

  return (
    <div className="group overflow-hidden rounded-2xl bg-gray-200 hover:shadow-md transition-shadow duration-300">
      {/* Image */}
      <div className="aspect-[4/3] overflow-hidden">
        <img
          src={image || "/placeholder.svg"}
          alt={name}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-black truncate">{name}</h3>
            <p className="text-sm text-gray-700 line-clamp-2">{description}</p>
          </div>
          <div className="flex items-center gap-1 text-sm text-gray-500 shrink-0">
            <Users className="h-4 w-4" />
            <span>{formatMembers(members)}</span>
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.round(rating) ? "fill-orange-500 text-orange-500" : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-black">{rating}</span>
          <span className="text-sm text-gray-400">({reviews})</span>
        </div>

        {/* Button */}
        <Button className="w-full h-10 text-sm font-medium">{price}</Button>
      </div>
    </div>
  )
}
