"use client";

import { Button } from "@/components/ui/button";
import { ChatCircleIcon } from "@phosphor-icons/react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border bg-background backdrop-blur-md m-2 rounded-xl">
      <div className="max-w-9xl mx-auto flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-2">
          <ChatCircleIcon size={32} className="text-black" />
        </div>

        <Button>
          Log In
        </Button>
      </div>
    </header>
  );
}
