import { notFound } from "next/navigation"
import { Star, Users, Hash, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"

const communities = [
  {
    id: "creator-central",
    name: "Creator Central",
    creator: "0x99a...3E1",
    image: "https://pbs.twimg.com/profile_images/1941864407186702336/BtLzKmlV_400x400.jpg",
    members: 489,
    rating: 5.0,
    reviews: 22,
    entry: "0.0005 ETH",
    perYear: "Per Year",
    tips: "$1,223",
    tipsSent: "Sent",
    description:
      "Creator Central is a place for real content creators to connect, spend time together, and grow....",
    channels: [
      { name: "general", type: "text" },
      { name: "content-feedback-corner", type: "text" },
      { name: "announcements", type: "text" },
      { name: "questions", type: "text" },
    ],
    reviewsList: [
      {
        user: "0xcef...FE3",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=1",
        rating: 5,
        text: "I saw post coinbilly about this towns! And i agree ,its great town !",
      },
      {
        user: "0x303...3cd",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=2",
        rating: 5,
        text: "Giving a 5 star rating cause I believe Wale is building something huge for us all! Let's connect.",
      },
      {
        user: "0x8a2...9f1",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=3",
        rating: 5,
        text: "Amazing community with great vibes and helpful members!",
      },
    ],
    membersLeft: 10505,
    totalMemberships: 11000,
  },
  {
    id: "ax1-vc",
    name: "AX1.vc",
    creator: "0xABC...123",
    image: "https://pbs.twimg.com/profile_images/1941864407186702336/BtLzKmlV_400x400.jpg",
    members: 22000,
    rating: 4.9,
    reviews: 1261,
    entry: "0.01 ETH",
    perYear: "Per Year",
    tips: "$45,680",
    tipsSent: "Sent",
    description: "Venture Club for bold builders and investors.",
    channels: [
      { name: "general", type: "text" },
      { name: "deals", type: "text" },
      { name: "announcements", type: "text" },
    ],
    reviewsList: [
      {
        user: "0xDEF...456",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=4",
        rating: 5,
        text: "Best VC community I've joined. Great deal flow!",
      },
    ],
    membersLeft: 5000,
    totalMemberships: 27000,
  },
  {
    id: "zenacademy",
    name: "ZenAcademy",
    creator: "0xZEN...789",
    image: "https://pbs.twimg.com/profile_images/1941864407186702336/BtLzKmlV_400x400.jpg",
    members: 55000,
    rating: 5.0,
    reviews: 35,
    entry: "0.001 ETH",
    perYear: "Per Year",
    tips: "$12,500",
    tipsSent: "Sent",
    description: "Learn and grow together",
    channels: [
      { name: "general", type: "text" },
      { name: "resources", type: "text" },
      { name: "study-groups", type: "text" },
    ],
    reviewsList: [
      {
        user: "0xLRN...321",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=5",
        rating: 5,
        text: "Amazing learning environment!",
      },
    ],
    membersLeft: 20000,
    totalMemberships: 75000,
  },
];

export default function FeaturedDetails({ params }: { params: { id: string } }) {
  const community = communities.find((item) => item.id === params.id);

  if (!community) return notFound();

  const membershipProgress = (community.membersLeft / community.totalMemberships) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 via-zinc-800 to-zinc-900">
      <div className="max-w-6xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-white mb-2">{community.name}</h1>
          <p className="text-muted-foreground text-sm">
            By <span className="text-zinc-300">{community.creator}</span>
          </p>
        </div>

        {/* Stats Cards + Image Card Row */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-xs text-muted-foreground mb-1">{community.reviews} REVIEWS</p>
              <p className="text-2xl font-bold">{community.rating}</p>
              <div className="flex justify-center gap-0.5 mt-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-xs text-muted-foreground mb-1">ENTRY</p>
              <p className="text-2xl font-bold">{community.entry}</p>
              <p className="text-xs text-muted-foreground mt-1">{community.perYear}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-xs text-muted-foreground mb-1">TIPS</p>
              <p className="text-2xl font-bold text-green-500">{community.tips}</p>
              <p className="text-xs text-muted-foreground mt-1">{community.tipsSent}</p>
            </CardContent>
          </Card>

          {/* Community Image Card */}
          <div className="md:row-span-2 space-y-4">
            <Card>
              <CardContent className="p-3">
                <img
                  src={community.image}
                  alt={community.name}
                  className="w-full aspect-square rounded-lg object-cover"
                />
              </CardContent>
            </Card>
            <Button className="w-full" variant="outline">
              <Share2 className="w-4 h-4 mr-2" />
              Share Link
            </Button>
          </div>

          {/* Left Column - Main Content */}
          <div className="md:col-span-3 space-y-6">

            {/* About Section */}
            <Card>
              <CardHeader>
                <CardTitle>About</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{community.description}</p>
              </CardContent>
            </Card>

            {/* Channels */}
            <Card>
              <CardHeader>
                <CardTitle>{community.channels.length} Channels</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {community.channels.map((channel, idx) => (
                    <Badge key={idx} variant="secondary" className="px-3 py-1.5">
                      <Hash className="w-3 h-3 mr-1" />
                      {channel.name}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Members */}
            <Card>
              <CardHeader>
                <CardTitle>{community.members} Members</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  {[...Array(8)].map((_, i) => (
                    <Avatar key={i}>
                      <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 10}`} />
                      <AvatarFallback>{String.fromCharCode(65 + i)}</AvatarFallback>
                    </Avatar>
                  ))}
                  <Avatar>
                    <AvatarFallback className="text-xs">
                      +{community.members - 8}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </CardContent>
            </Card>

            {/* Reviews */}
            <Card>
              <CardHeader>
                <CardTitle>{community.reviews} Reviews</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {community.reviewsList.map((review, idx) => (
                    <div key={idx}>
                      <div className="flex items-start gap-3">
                        <Avatar>
                          <AvatarImage src={review.avatar} alt={review.user} />
                          <AvatarFallback>{review.user.slice(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-1 mb-1">
                            {[...Array(review.rating)].map((_, i) => (
                              <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                            ))}
                          </div>
                          <p className="text-sm mb-1">{review.text}</p>
                          <p className="text-xs text-muted-foreground">{review.user}</p>
                        </div>
                      </div>
                      {idx < community.reviewsList.length - 1 && <Separator className="mt-4" />}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Sidebar */}
          <div className="md:col-start-4 space-y-4">
{/* Membership Footer Bar */}
<div className="fixed bottom-0 left-0 w-full bg-zinc-900/80 backdrop-blur-sm border-t border-zinc-800 px-4 py-3 flex justify-center">
  <div className="w-full max-w-2xl flex flex-col items-center">
    <div className="flex justify-between w-full text-sm mb-2 px-1">
      <span className="text-zinc-400">Memberships Left</span>
      <span className="font-medium text-zinc-200">
        {community.membersLeft}/{community.totalMemberships}
      </span>
    </div>

    <div className="relative w-full h-2 bg-zinc-700/70 rounded-full overflow-hidden mb-3">
      <div
        className="absolute top-0 left-0 h-full bg-green-500 transition-all duration-500 ease-in-out"
        style={{ width: `${membershipProgress}%` }}
      />
    </div>

    <Button className="w-full max-w-sm bg-[#00FFA3] hover:bg-[#00e69b] text-black font-semibold rounded-md">
      Join
    </Button>
  </div>
</div> 
</div>
</div>
</div>
</div>
);
}
