import { Users, Star } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

interface CommunityListItemProps {
  rank: number
  name: string
  image: string
  members: number
  rating: number
  reviews: number
  price: string
  description: string
}

export function CommunityListItem({
  rank,
  name,
  image,
  members,
  rating,
  reviews,
  price,
  description,
}: CommunityListItemProps) {
  const formatMembers = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(0)}K`
    return num.toString()
  }

  return (
    <Card className="group p-2 rounded-2xl bg-gray-200 hover:shadow-md transition-shadow duration-300">
      <CardContent className="flex flex-col sm:flex-row items-center gap-4 p-4">
        {/* Rank + Avatar */}
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <span className="text-2xl font-bold text-gray-400 shrink-0">{rank}</span>
          <Avatar className="h-20 w-20 sm:h-28 sm:w-28 rounded-xl">
            <AvatarImage
              src={image || "/placeholder.svg"}
              alt={name}
              className="object-cover"
            />
            <AvatarFallback className="rounded-xl bg-white/10 text-gray-700">
              {name[0]}
            </AvatarFallback>
          </Avatar>
        </div>

        {/* Info Section */}
        <div className="flex-1 space-y-2 w-full min-w-0">
          {/* Name + Members */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
            <div className="min-w-0">
              <h3 className="font-semibold text-black truncate">{name}</h3>
              <p className="text-sm text-gray-500 line-clamp-2">{description}</p>
            </div>
            <Badge
              variant="secondary"
              className="bg-white/10 text-gray-500 hover:bg-white/10 flex items-center gap-1 shrink-0"
            >
              <Users className="h-3 w-3" />
              {formatMembers(members)}
            </Badge>
          </div>

          {/* Rating + Button */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.round(rating)
                        ? "fill-orange-500 text-orange-500"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-black">{rating}</span>
              <span className="text-sm text-gray-400">({reviews})</span>
            </div>

            {/* Price Button */}
            <Button className="rounded-lg px-4 py-2 text-sm font-medium w-full sm:w-auto">
              {price}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
