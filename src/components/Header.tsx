"use client";

import { ChatCircleIcon, MoonIcon, SunIcon } from "@phosphor-icons/react";
import { usePrivy } from "@privy-io/react-auth";
import { Button } from "./ui/button";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";

export function Header() {
  const { authenticated, logout } = usePrivy();
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const { login } = usePrivy()


  return (
    <header className="sticky top-0 z-50 border-1 bg-background backdrop-blur-md m-2 rounded-xl">
      <div className="max-w-9xl mx-auto flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-2">
          <ChatCircleIcon size={32} />
        </div>

        {/* Login Button */}
        <Button onClick={() => router.push('/login')}>
          {authenticated ? <Button onClick={logout}>Logout</Button > : 'Login'}
        </Button>

        {/* Theme Toggle */}
        <Button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
          {theme === "dark" ? <SunIcon size={24} /> : <MoonIcon size={24} />}
        </Button>
      </div>
    </header>
  );
}
