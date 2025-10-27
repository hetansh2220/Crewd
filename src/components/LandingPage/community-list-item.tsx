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
    <Card className="group rounded-xl bg-muted/50 border-border hover:shadow-md transition-all duration-300">
      <CardContent className="p-2 sm:p-3">
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Rank and Avatar */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <span className="text-xl sm:text-2xl font-bold text-muted-foreground w-6 sm:w-8">{rank}</span>
            <Avatar className="h-16 w-16 sm:h-26 sm:w-26 rounded-lg">
              <AvatarImage src={image || "/placeholder.svg"} alt={name} className="object-cover" />
              <AvatarFallback className="rounded-lg bg-muted">{name[0]}</AvatarFallback>
            </Avatar>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-card-foreground text-sm sm:text-base line-clamp-1">{name}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground line-clamp-1">{description}</p>
              </div>
              <Badge
                variant="secondary"
                className="bg-background/80 text-muted-foreground hover:bg-background/80 shrink-0 text-xs"
              >
                <Users className="mr-1 h-3 w-3" />
                {formatMembers(members)}
              </Badge>
            </div>

            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3 w-3 sm:h-4 sm:w-4 fill-orange-500 text-orange-500" />
                  ))}
                </div>
                <span className="text-xs sm:text-sm text-card-foreground font-medium">{rating}</span>
                <span className="text-xs sm:text-sm text-muted-foreground">({reviews})</span>
              </div>

              <Button size="sm" className="text-xs sm:text-sm cursor-pointer ">
                {price}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
