import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const activities = [
  {
    id: 1,
    action: "Someone bought tokens",
    community: "Creator Central by Wale",
    time: "3m",
    avatar: "/diverse-group.png",
  },
  {
    id: 2,
    action: "Someone joined for Free",
    community: "Creator Central by Wale",
    time: "4m",
    avatar: "/diverse-group.png",
  },
  {
    id: 3,
    action: "Someone joined for Free",
    community: "Creator Central by Wale",
    time: "2h",
    avatar: "/diverse-group.png",
  },
  {
    id: 4,
    action: "Someone joined for Free",
    community: "BLACKOUT",
    time: "2h",
    avatar: "/abstract-geometric.png",
  },
]

export function ActivityFeed() {
  return (
    <Card className="bg-card/80 backdrop-blur border-border/50 p-6 sticky top-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-foreground">Recent Activity</h2>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
          <span className="text-xs font-bold text-primary tracking-wider">LIVE</span>
        </div>
      </div>

      <div className="space-y-3">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/30 transition-colors">
            <Avatar className="w-10 h-10 border border-border/50">
              <AvatarImage src={activity.avatar || "/placeholder.svg"} alt={activity.community} />
              <AvatarFallback>{activity.community[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">{activity.action}</p>
              <p className="text-xs text-muted-foreground truncate">{activity.community}</p>
            </div>
            <span className="text-xs text-muted-foreground">{activity.time}</span>
          </div>
        ))}
      </div>
    </Card>
  )
}
