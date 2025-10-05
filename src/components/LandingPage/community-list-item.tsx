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
    <Card className="group p-2 rounded-2xl bg-gray-200">
      <CardContent className="flex items-center gap-4 p-4">
        <div className="flex items-center gap-4">
          <span className="text-2xl font-bold text-gray-400">{rank}</span>
          <Avatar className="h-32 w-32 rounded-xl">
            <AvatarImage src={image || "/placeholder.svg"} alt={name} className="object-cover" />
            <AvatarFallback className="rounded-xl bg-white/10">{name[0]}</AvatarFallback>
          </Avatar>
        </div>

        <div className="flex-1 space-y-2">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h3 className="font-semibold text-black">{name}</h3>
              <p className="text-sm text-gray-400 line-clamp-1">{description}</p>
            </div>
            <Badge variant="secondary" className="bg-white/10 text-gray-400 hover:bg-white/10">
              <Users className="mr-1 h-3 w-3" />
              {formatMembers(members)}
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-orange-500 text-orange-500" />
                ))}
              </div>
              <span className="text-sm text-white">{rating}</span>
              <span className="text-sm text-gray-400">({reviews})</span>
            </div>

            <Button
              className="rounded-lg px-4 py-2 text-sm font-medium"
            >
              {price}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
