"use client";

import { ChatCircleIcon, MoonIcon, SunIcon } from "@phosphor-icons/react";
import { usePrivy } from "@privy-io/react-auth";
import { Button } from "./ui/button";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { GetUserByWallet } from "@/server/user";
import { useEffect, useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Logo from '../../logo/crewd.png'
import { Skeleton } from "./ui/skeleton";

export function Header() {
  const { authenticated, logout, user: privyUser, ready } = usePrivy();
  const { theme, setTheme } = useTheme();
  const router = useRouter();

  const wallet = privyUser?.wallet?.address;

  type User = {
    id: string;
    username: string;
    bio: string;
    walletAddress: string | null;
    avatar: string;
  };

  const [user, setUser] = useState<User | null>(null);


  useEffect(() => {
    const checkUser = async () => {
      if (!authenticated || !wallet) {
        setUser(null);
        return;
      }

      try {
        const data = await GetUserByWallet(wallet);

        if (!data) {
          // User exists in Privy but not in DB → redirect to profile completion
          router.replace("/login?stage=2");
          return;
        }

        setUser(data);
      } catch (err) {
        console.error("Failed to fetch user:", err);
      } finally {
      }
    };

    checkUser();
  }, [authenticated, wallet, router]);

  return (
    <header className="sticky top-0 z-50 border bg-background m-2 rounded-xl">
      <div className="max-w-9xl mx-auto flex h-16 items-center justify-between px-4">
        {/* Left side: Logo */}
        <div className="flex items-center gap-2 ">
          <img src={Logo.src} alt="Crewd Logo" className="h-34 w-34 " />
        </div>

        {/* Right side: Actions */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? <SunIcon size={24} /> : <MoonIcon size={24} />}
          </Button>

          {/* Auth Section */}
     
            <>
              {!authenticated && ready ? (
                <Button onClick={() => router.push("/login")}>Login</Button>
              ) : (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" className="p-0 rounded-full">
                      {!ready && !authenticated ? (
                        <Skeleton className="h-9 w-9 rounded-full" />
                      ) : (
                         <Avatar className="h-9 w-9">
                        <AvatarImage src={user?.avatar} alt={user?.username} />
                        <AvatarFallback>
                          {user?.username?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      )}
                     
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    align="end"
                    className="w-48 p-2 flex flex-col gap-2"
                  >
                    <div className="flex flex-col items-center text-sm text-center border-b pb-2">
                      <Avatar className="h-10 w-10 mb-1">
                        <AvatarImage src={user?.avatar} alt={user?.username} />
                        <AvatarFallback>
                          {user?.username?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-semibold">{user?.username}</span>
                    </div>
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => router.push("/profile")}
                    >
                      Profile
                    </Button>
                    <Button
                      variant="destructive"
                      className="w-full justify-start"
                      onClick={async () => {
                        await logout();
                        setUser(null);
                        router.push("/");
                      }}
                    >
                      Logout
                    </Button>
                  </PopoverContent>
                </Popover>
              )}
            </>
        
        </div>
      </div>
    </header>
  );
}
