export function HeroSection() {
  return (
    <div className="px-6 md:px-12 lg:px-20 py-14 flex items-center justify-center">
      <section className="z-10 flex flex-col items-center text-center gap-6 max-w-4xl">
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-snug">
          The internet’s most <span className="text-primary">valuable conversations</span>,<br />
          owned by the people who power them.
        </h1>
        <p className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-2xl">
          Join a new kind of social space where creators earn, members engage, and every message holds value.
        </p>
      </section>
    </div>
  )
}
