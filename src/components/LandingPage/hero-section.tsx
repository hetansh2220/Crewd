export function HeroSection() {
  return (
    <div className=" p-14  rounded border  flex items-center justify-center m-4">
      <section className=" z-10 flex flex-col items-center text-center gap-6">
        <h1 className="text-4xl md:text-6xl font-bold max-w-4xl">
          The internet’s most <span className="text-primary">valuable conversations</span>,<br />
          owned by the people who power them.
        </h1>
        <p className="text-lg md:text-xl max-w-2xl text-muted-foreground">
          Join a new kind of social space where creators earn, members engage, and every message holds value.
        </p>
      </section>
    </div>
  );
}