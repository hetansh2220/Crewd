"use client";

import { Settings } from '@/components/settings';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { GetUserByWallet, UpdateUser } from "@/server/user";
import { usePrivy } from "@privy-io/react-auth";
import { MoonIcon, SunIcon, User } from "lucide-react";
import { useTheme } from "next-themes";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Logo from "../../logo/crewd.png";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";
import Image from 'next/image';


export function Header() {
  const { authenticated, logout, user: privyUser, ready } = usePrivy();
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const [openProfileDialog, setOpenProfileDialog] = useState(false);
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
  const [openSettings, setOpenSettings] = useState(false);
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

  const handleSaveProfile = async () => {
    if (!editedUser) return;

    try {
      // Call your server function directly
      const updated = await UpdateUser(editedUser.id, editedUser.username, editedUser.bio);

      if (updated) {
        setUser(editedUser); // Update UI immediately
        setOpenProfileDialog(false);
      } else {
        alert("Failed to update user");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };


  return (
    <>
      <header className="sticky top-0 z-50 border bg-background m-2 rounded-xl">
        <div className="max-w-9xl mx-auto flex h-16 items-center justify-between px-4">
          {/* Left: Logo */}
          <div className="flex items-center gap-2">
            <Image
              src={Logo.src}
              alt="Crewd Logo"
              className="h-32 w-32 cursor-pointer"
              onClick={() => router.push("/")}
            />
          </div>

          {/* Middle: Navigation */}
          {authenticated && ready && (
            <nav className="flex items-center gap-6">
              {navItems.map((item) => {
                const active = pathname === item.href;
                return (
                  <button
                    key={item.name}
                    onClick={() => router.push(item.href)}
                    className={`text-md font-medium transition-colors ${active
                      ? "text-primary border-b-2 border-primary pb-1"
                      : "text-muted-foreground hover:text-foreground"
                      }`}
                  >
                    {item.name}
                  </button>
                );
              })}
            </nav>
          )}

          {/* Right: Actions */}
          <div className="flex items-center gap-3">
            {/* Theme toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? (
                <SunIcon size={24} />
              ) : (
                <MoonIcon size={24} />
              )}
            </Button>

            {/* Auth section */}
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
                    <div className="flex flex-col items-center t text-center border-b pb-2 px-8">
                      <Avatar className="h-12 w-12 mb-1">
                        <AvatarImage
                          src={user?.avatar}
                          alt={user?.username}
                        />
                        <AvatarFallback>
                          {user?.username?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-semibold text-md">{user?.username}</span>
                    </div>
                    <Button
                      variant="ghost"
                      className="w-full text-md justify-start"
                      onClick={() => setOpenProfileDialog(true)}
                    >
                      Profile
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full text-md justify-start"
                      onClick={() => setOpenSettings(true)}
                    >
                      Wallet
                    </Button>
                    <Button
                      variant="destructive"
                      className=" text-md w-full justify-start"
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

      {/* Profile Dialog */}
      <Dialog open={openProfileDialog} onOpenChange={setOpenProfileDialog}>
        <DialogContent className="w-[90vw] max-w-2xl border-border bg-background p-6 sm:p-8 mx-auto my-auto rounded-2xl">
          <DialogHeader className="flex flex-row items-center justify-between space-y-0">
            <div className="flex items-center gap-3">
              <div className="rounded-lg border border-border bg-background/50 p-2">
                <User size={24} />
              </div>
              <DialogTitle className="text-2xl font-semibold text-foreground">
                Edit Profile
              </DialogTitle>
            </div>
          </DialogHeader>

          <div className="space-y-6 mt-4">
            <div className="flex flex-col items-center gap-3 border-t border-border pt-6">
              <Avatar className="h-20 w-20">
                <AvatarImage src={editedUser?.avatar} />
                <AvatarFallback>
                  {editedUser?.username?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <p className="text-sm text-muted-foreground">
                {editedUser?.username}
              </p>
            </div>

            <div className="space-y-4 border-t border-border pt-6">
              <div className="grid gap-4">
                <div className="">
                  <Label htmlFor="username" className="p-2">Username</Label>
                  <Input
                    id="username"
                    value={editedUser?.username || ""}
                    onChange={(e) =>
                      setEditedUser((prev) =>
                        prev ? { ...prev, username: e.target.value } : prev
                      )
                    }
                    className="h-12 border-border bg-background text-lg text-foreground"
                  />
                </div>
                <div>
                  <Label htmlFor="bio" className="p-2">Bio</Label>
                  <Input
                    id="bio"
                    value={editedUser?.bio || ""}
                    onChange={(e) =>
                      setEditedUser((prev) =>
                        prev ? { ...prev, bio: e.target.value } : prev
                      )
                    }
                    className="h-12 border-border bg-background text-lg text-foreground"
                  />
                </div>
              </div>
            </div>

            <Button
              onClick={handleSaveProfile}
              className="h-16 w-full rounded-2xl text-lg font-semibold"
            >
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Settings
        open={openSettings}
        onOpenChange={(setOpenSettings)}
        onWithdraw={() => { }}
      />
    </>
  );
}
