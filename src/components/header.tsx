"use client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { GetUserByWallet } from "@/server/user";
import { usePrivy } from "@privy-io/react-auth";
import { MoonIcon, SunIcon, Settings } from "lucide-react";
import { useTheme } from "next-themes";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Logo from "../../logo/crewd.png";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";
import Image from "next/image";
import "react-toastify/dist/ReactToastify.css";
import client from "@/lib/stream";
import { getStreamToken } from "@/server/stream";

const hideHeaderRoutes = ["/login"];

export function Header() {
  const { authenticated, logout, user: privyUser, ready } = usePrivy();
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();

  const [openPopover, setOpenPopover] = useState(false); // controls popover open/close
  const wallet = privyUser?.wallet?.address;

  type User = {
    id: string;
    username: string;
    bio: string;
    walletAddress: string | null;
    avatar: string;
  };

  const [user, setUser] = useState<User | null>(null);
  const [editedUser, setEditedUser] = useState<User | null>(null);

  useEffect(() => {
    const checkUser = async () => {
      if (!authenticated || !wallet) {
        setUser(null);
        return;
      }

      try {
        const data = await GetUserByWallet(wallet);

        if (!data) {
          router.replace("/login?stage=2");
          return;
        }

        setUser(data);
        setEditedUser(data);

        if (!data.walletAddress) return;
        const token = await getStreamToken(data.walletAddress);
        await client.connectUser(
          {
            id: data.walletAddress,
            name: data.username,
            image: data.avatar,
          },
          token
        );
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    };

    checkUser();
  }, [authenticated, wallet, router]);

  const navItems = [
    { name: "Home", href: "/dashboard" },
    { name: "Explore", href: "/" },
  ];

  if (hideHeaderRoutes.includes(pathname)) {
    return null;
  }

  return (
    <>
      <header className="sticky top-0 z-50 border border-border/50 bg-background/80 backdrop-blur-xl m-2 rounded-2xl shadow-sm">
        <div className="max-w-9xl mx-auto flex h-16 items-center justify-between px-4 lg:px-6">
          {/* Left: Logo */}
          <div className="flex items-center gap-2">
            <Image
              src={Logo.src}
              width={128}
              height={128}
              alt="Crewd Logo"
              className="h-32 w-32 cursor-pointer"
              onClick={() => router.push("/")}
            />
          </div>

          {/* Middle: Navigation */}
          {authenticated && ready && (
            <nav className="md:flex items-center gap-2">
              {navItems.map((item) => {
                const active = pathname === item.href;
                return (
                  <button
                    key={item.name}
                    onClick={() => router.push(item.href)}
                    className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${active
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                      }`}
                  >
                    {item.name}
                  </button>
                );
              })}
            </nav>
          )}

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            {/* Theme toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-secondary/80 transition-colors"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? (
                <SunIcon className="h-5 w-5" />
              ) : (
                <MoonIcon className="h-5 w-5" />
              )}
            </Button>

            {/* Auth Section */}
            {!authenticated && ready ? (
              <Button
                onClick={() => router.push("/login")}
                className="font-semibold shadow-sm hover:shadow-md transition-all"
              >
                Login
              </Button>
            ) : (
              <Popover open={openPopover} onOpenChange={setOpenPopover}>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    className="p-0 rounded-full hover:ring-2 hover:ring-primary/20 transition-all"
                  >
                    {!ready && !authenticated ? (
                      <Skeleton className="h-10 w-10 rounded-full" />
                    ) : (
                      <Avatar className="h-10 w-10 ring-2 ring-border hover:ring-primary transition-all">
                        <AvatarImage src={user?.avatar} alt={user?.username} />
                        <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                          {user?.username?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </Button>
                </PopoverTrigger>

                <PopoverContent
                  align="end"
                  className="w-56 p-3 rounded-xl border-border/50 shadow-lg"
                >
                  <div className="flex flex-col items-center text-center border-b border-border/50 pb-3 mb-2">
                    <Avatar className="h-16 w-16 mb-2 ring-2 ring-border">
                      <AvatarImage src={user?.avatar} alt={user?.username} />
                      <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">
                        {user?.username?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-bold text-base text-foreground">
                      {user?.username}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <Button
                      variant="ghost"
                      className="w-full justify-start hover:bg-secondary/80 rounded-lg"
                      onClick={() => {
                        setOpenPopover(false); // close popover
                        router.push("/settings/profile"); // then navigate
                      }}
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Button>
                    <Button
                      variant="destructive"
                      className="w-full justify-start mt-2 rounded-lg"
                      onClick={async () => {
                        await logout();
                        setUser(null);
                        setOpenPopover(false); // also close on logout
                        router.push("/");
                      }}
                    >
                      Logout
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            )}
          </div>
        </div>
      </header>
    </>
  );
}
