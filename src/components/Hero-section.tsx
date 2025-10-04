import { Card } from "@/components/ui/card"

const stats = [
  {
    label: "CREATOR EARNINGS",
    value: "$41,767,903",
    color: "text-primary",
  },
  {
    label: "MEMBERSHIPS SOLD",
    value: "1,763,260",
    color: "text-primary",
  },
  {
    label: "$TOWNS STAKED",
    value: "2,343,135,135",
    color: "text-primary",
  },
]

export function HeroSection() {
  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-br from-muted/30 to-background rounded-2xl p-8 md:p-12">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight text-balance">
          The most valuable conversations on the internet
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="bg-card/80 backdrop-blur border-border/50 p-6 hover:bg-card transition-colors">
            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground tracking-wider">{stat.label}</p>
              <p className={`text-2xl md:text-3xl font-bold ${stat.color}`}>{stat.value}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
