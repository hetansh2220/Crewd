import { Button } from "@/components/ui/button"
import { CommunityListItem } from "@/components/LandingPage/community-list-item"

export function TopSection() {
  const topCommunities = [
    {
      id: 1,
      rank: 1,
      name: "West Coast Mining...",
      image: "https://river.delivery/media/ffc966d34a9e47159e94dba1478f460c151c9b3be50d545bedb3ce09f7ea6fa8?size=300x300&key=4a831bdc3b83478ba6967cdc12c7955d511f9236a28ac6ce875c1c1b3b1f29e5&iv=",
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
      image: "https://river.delivery/media/ffc966d34a9e47159e94dba1478f460c151c9b3be50d545bedb3ce09f7ea6fa8?size=300x300&key=4a831bdc3b83478ba6967cdc12c7955d511f9236a28ac6ce875c1c1b3b1f29e5&iv=",
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
      image: "https://river.delivery/media/ffc966d34a9e47159e94dba1478f460c151c9b3be50d545bedb3ce09f7ea6fa8?size=300x300&key=4a831bdc3b83478ba6967cdc12c7955d511f9236a28ac6ce875c1c1b3b1f29e5&iv=",
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
      image: "https://river.delivery/media/ffc966d34a9e47159e94dba1478f460c151c9b3be50d545bedb3ce09f7ea6fa8?size=300x300&key=4a831bdc3b83478ba6967cdc12c7955d511f9236a28ac6ce875c1c1b3b1f29e5&iv=",
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
      image: "https://river.delivery/media/ffc966d34a9e47159e94dba1478f460c151c9b3be50d545bedb3ce09f7ea6fa8?size=300x300&key=4a831bdc3b83478ba6967cdc12c7955d511f9236a28ac6ce875c1c1b3b1f29e5&iv=",
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
      image: "https://river.delivery/media/ffc966d34a9e47159e94dba1478f460c151c9b3be50d545bedb3ce09f7ea6fa8?size=300x300&key=4a831bdc3b83478ba6967cdc12c7955d511f9236a28ac6ce875c1c1b3b1f29e5&iv=",
      members: 220000,
      rating: 5.0,
      reviews: 21,
      price: "0.005 ETH",
      description: "A home for the innovators, a ha...",
    },
  ]

  return (
    <section className=" mx-auto px-4 py-16">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-black">Top</h2>
          <p className="mt-1 text-gray-400">Highest revenue this month</p>
        </div>
        <Button variant="link" className="text-lg">
          See All
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3 text-black ">
        {topCommunities.map((community) => (
          <CommunityListItem key={community.id} {...community} />
        ))}
      </div>
    </section>
  )
}
