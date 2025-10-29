export function HeroSection() {
  return (
    <div className="relative p-8 md:p-14 rounded-2xl border border-border/50 flex items-center justify-center m-4 overflow-hidden">
      {/* Subtle gradient background for light theme */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 dark:from-primary/10 dark:via-transparent dark:to-primary/20" />
      
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-primary/5 dark:bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 dark:bg-primary/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
      
      <section className="relative z-10 flex flex-col items-center text-center gap-6 py-8 md:py-12">
        <h1 className="text-4xl md:text-6xl font-bold max-w-4xl leading-tight">
          The internet&apos;s most{" "}
          <span className="text-primary bg-primary/10 dark:bg-primary/20 px-3 py-1 rounded-lg inline-block">
            valuable conversations
          </span>
          ,<br />
          owned by the people who power them.
        </h1>
        <p className="text-lg md:text-xl max-w-2xl text-muted-foreground leading-relaxed">
          Join a new kind of social space where creators earn, members engage, and every message holds value.
        </p>
      </section>
    </div>
  );
}