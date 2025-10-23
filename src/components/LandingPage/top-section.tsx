import { Button } from "@/components/ui/button"
import { CommunityListItem } from "./community-list-item"

export function TopSection() {
  const topCommunities = [
    {
      id: 1,
      rank: 1,
      name: "West Coast Mining...",
      image: "https://pbs.twimg.com/profile_images/1941864407186702336/BtLzKmlV_400x400.jpg",
      members: 1600,
      rating: 5.0,
      reviews: 20,
      price: "0.01 SOL",
      description: "Mine Together, Rise Forever",
    },
    {
      id: 2,
      rank: 2,
      name: "BrazyBet",
      image: "https://pbs.twimg.com/profile_images/1941864407186702336/BtLzKmlV_400x400.jpg",
      members: 1,
      rating: 5.0,
      reviews: 1,
      price: "0.005 SOL",
      description: "When the fun stops, deposit m...",
    },
    {
      id: 3,
      rank: 3,
      name: "Creator Central by ...",
      image: "https://pbs.twimg.com/profile_images/1941864407186702336/BtLzKmlV_400x400.jpg",
      members: 603,
      rating: 5.0,
      reviews: 21,
      price: "~0.001 SOL",
      description: "Creator Central is a place for re...",
    },
    {
      id: 4,
      rank: 4,
      name: "The Peanut Gallery",
      image: "https://pbs.twimg.com/profile_images/1941864407186702336/BtLzKmlV_400x400.jpg",
      members: 173000,
      rating: 5.0,
      reviews: 2,
      price: "0.006 SOL",
      description: "where every voice has a seat at...",
    },
    {
      id: 5,
      rank: 5,
      name: "Lunar Leap Games",
      image: "https://pbs.twimg.com/profile_images/1941864407186702336/BtLzKmlV_400x400.jpg",
      members: 55000,
      rating: 5.0,
      reviews: 1,
      price: "0.005 SOL",
      description: "Game Dev: Decentralized",
    },
    {
      id: 6,
      rank: 6,
      name: "The Lyss Syndicate",
      image: "https://pbs.twimg.com/profile_images/1941864407186702336/BtLzKmlV_400x400.jpg",
      members: 220000,
      rating: 5.0,
      reviews: 21,
      price: "0.005 SOL",
      description: "A home for the innovators, a ha...",
    },
  ]

  return (
    <section className="m-2 mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
      <div className="mb-6 sm:mb-8 flex flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Top</h2>
          <p className="mt-1 text-muted-foreground text-sm sm:text-base">
            Highest revenue this month
          </p>
        </div>
        <Button variant="link" className="text-sm sm:text-base">
          See All
        </Button>
      </div>


      <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
        {topCommunities.map((community) => (
          <CommunityListItem key={community.id} {...community} />
        ))}
      </div>
    </section>
  )
}
