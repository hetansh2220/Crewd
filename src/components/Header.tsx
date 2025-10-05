"use client";

import { Button } from "@/components/ui/button";
import { ChatCircleIcon } from "@phosphor-icons/react";
import { usePrivy } from "@privy-io/react-auth";

export function Header() {
  const { authenticated, user } = usePrivy();

  return (
    <header className="sticky top-0 z-50 border-3 bg-background backdrop-blur-md m-2 rounded-xl">
      <div className="max-w-9xl mx-auto flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-2">
          <ChatCircleIcon size={32} className="text-black" />
        </div>
        {authenticated ? (
          <p>{user?.email?.address}</p>
        ) : (
          <Button>
            Log In
          </Button>
        )}
      </div>
    </header>
  );
}
