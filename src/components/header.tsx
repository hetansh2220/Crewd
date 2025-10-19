"use client";

import { ChatCircleIcon, MoonIcon, SunIcon } from "@phosphor-icons/react";
import { usePrivy } from "@privy-io/react-auth";
import { Button } from "./ui/button";
import { useTheme } from "next-themes";
import { useRouter, usePathname } from "next/navigation";
import { GetUserByWallet } from "@/server/user";
import { useEffect, useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Logo from "../../logo/crewd.png";
import { Skeleton } from "./ui/skeleton";
import { UpdateUser } from "@/server/user";

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
            <img
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
                    className={`text-sm font-medium transition-colors ${
                      active
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
                    <div className="flex flex-col items-center text-sm text-center border-b pb-2">
                      <Avatar className="h-10 w-10 mb-1">
                        <AvatarImage
                          src={user?.avatar}
                          alt={user?.username}
                        />
                        <AvatarFallback>
                          {user?.username?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-semibold">{user?.username}</span>
                    </div>
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => setOpenProfileDialog(true)}
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

      {/* Profile Dialog */}
      <Dialog open={openProfileDialog} onOpenChange={setOpenProfileDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-2">
            <div className="flex flex-col items-center gap-2">
              <Avatar className="h-16 w-16">
                <AvatarImage src={editedUser?.avatar} />
                <AvatarFallback>
                  {editedUser?.username?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <p className="text-xs text-muted-foreground">
                {editedUser?.username}
              </p>
            </div>

            <div className="grid gap-3">
              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={editedUser?.username || ""}
                  onChange={(e) =>
                    setEditedUser((prev) =>
                      prev ? { ...prev, username: e.target.value } : prev
                    )
                  }
                />
              </div>
              <div>
                <Label htmlFor="bio">Bio</Label>
                <Input
                  id="bio"
                  value={editedUser?.bio || ""}
                  onChange={(e) =>
                    setEditedUser((prev) =>
                      prev ? { ...prev, bio: e.target.value } : prev
                    )
                  }
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSaveProfile}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
