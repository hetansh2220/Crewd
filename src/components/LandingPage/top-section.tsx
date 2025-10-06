import { Button } from "@/components/ui/button"
import { CommunityListItem } from "@/components/LandingPage/community-list-item"

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
      price: "0.01 ETH",
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
      price: "0.005 ETH",
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
      price: "~0.001 ETH",
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
      price: "0.006 ETH",
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
      price: "0.005 ETH",
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
      price: "0.005 ETH",
      description: "A home for the innovators, a ha...",
    },
  ]

  return (
    <section className="mx-auto px-4 md:px-8 lg:px-16 py-16">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-black">Top</h2>
          <p className="mt-1 text-gray-400 text-sm md:text-base">
            Highest revenue this month
          </p>
        </div>
        <Button variant="link" className="text-sm md:text-base">
          See All
        </Button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
        {topCommunities.map((community) => (
          <CommunityListItem key={community.id} {...community} />
        ))}
      </div>
    </section>
  )
}
