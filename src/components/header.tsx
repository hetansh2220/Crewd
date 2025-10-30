"use client";

import { Settings } from '@/components/Settings/settings';
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
import { MoonIcon, SunIcon, User, Wallet } from "lucide-react";
import { useTheme } from "next-themes";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Logo from "../../logo/crewd.png";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";
import Image from 'next/image';
import { Bounce, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const hideHeaderRoutes = ['/login'];

export function Header() {
  const { authenticated, logout, user: privyUser, ready } = usePrivy();
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const [openProfileDialog, setOpenProfileDialog] = useState(false);
  const wallet = privyUser?.wallet?.address;
  // List of routes where header should be hidden

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
      const updated = await UpdateUser(editedUser.id, editedUser.username, editedUser.bio);

      if (updated) {
        setUser(editedUser);
        setOpenProfileDialog(false);
        //Toast
        toast.success('Profile Updated!', {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
            transition: Bounce,
            });
        <ToastContainer />
        
      } else {
        alert("Failed to update user");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

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
              className={`h-32 w-32 cursor-pointer ${theme === 'light' ? 'invert' : ''}`}
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
                    className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
                      active
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

            {/* Auth section */}
            <>
              {!authenticated && ready ? (
                <Button 
                  onClick={() => router.push("/login")}
                  className="font-semibold shadow-sm hover:shadow-md transition-all"
                >
                  Login
                </Button>
              ) : (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" className="p-0 rounded-full hover:ring-2 hover:ring-primary/20 transition-all">
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
                        <AvatarImage
                          src={user?.avatar}
                          alt={user?.username}
                        />
                        <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">
                          {user?.username?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-bold text-base text-foreground">{user?.username}</span>
                    </div>
                    
                    <div className="space-y-1">
                      <Button
                        variant="ghost"
                        className="w-full justify-start hover:bg-secondary/80 rounded-lg"
                        onClick={() => setOpenProfileDialog(true)}
                      >
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </Button>
                      <Button
                        variant="ghost"
                        className="w-full justify-start hover:bg-secondary/80 rounded-lg"
                        onClick={() => setOpenSettings(true)}
                      >
                        <Wallet className="mr-2 h-4 w-4" />
                        Wallet
                      </Button>
                      <Button
                        variant="destructive"
                        className="w-full justify-start mt-2 rounded-lg"
                        onClick={async () => {
                          await logout();
                          setUser(null);
                          router.push("/");
                        }}
                      >
                        Logout
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
              )}
            </>
          </div>
        </div>
      </header>

      {/* Profile Dialog */}
      <Dialog open={openProfileDialog} onOpenChange={setOpenProfileDialog}>
        <DialogContent className="w-[90vw] max-w-2xl border-border/50 bg-background p-6 sm:p-8 mx-auto my-auto rounded-2xl shadow-xl">
          <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b border-border/50">
            <div className="flex items-center gap-3">
              <div className="rounded-xl border border-border bg-primary/5 p-3">
                <User size={24} className="text-primary" />
              </div>
              <DialogTitle className="text-2xl font-bold text-foreground">
                Edit Profile
              </DialogTitle>
            </div>
          </DialogHeader>

          <div className="space-y-6 mt-6">
            <div className="flex flex-col items-center gap-4 border-b border-border/50 pb-6">
              <div className="relative">
                <Avatar className="h-24 w-24 ring-4 ring-border">
                  <AvatarImage src={editedUser?.avatar} />
                  <AvatarFallback className="bg-primary/10 text-primary text-3xl font-bold">
                    {editedUser?.username?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold shadow-lg">
                  {editedUser?.username?.charAt(0).toUpperCase()}
                </div>
              </div>
              <p className="text-base font-semibold text-foreground">
                @{editedUser?.username}
              </p>
            </div>

            <div className="space-y-5 pt-2">
              <div>
                <Label htmlFor="username" className="text-sm font-semibold text-foreground mb-2 block">
                  Username
                </Label>
                <Input
                  id="username"
                  value={editedUser?.username || ""}
                  onChange={(e) =>
                    setEditedUser((prev) =>
                      prev ? { ...prev, username: e.target.value } : prev
                    )
                  }
                  className="h-12 border-border/50 bg-secondary/20 text-base text-foreground rounded-xl focus:ring-2 focus:ring-primary/20"
                  placeholder="Enter your username"
                />
              </div>
              <div>
                <Label htmlFor="bio" className="text-sm font-semibold text-foreground mb-2 block">
                  Bio
                </Label>
                <Input
                  id="bio"
                  value={editedUser?.bio || ""}
                  onChange={(e) =>
                    setEditedUser((prev) =>
                      prev ? { ...prev, bio: e.target.value } : prev
                    )
                  }
                  className="h-12 border-border/50 bg-secondary/20 text-base text-foreground rounded-xl focus:ring-2 focus:ring-primary/20"
                  placeholder="Tell us about yourself"
                />
              </div>
            </div>

            <Button
              onClick={handleSaveProfile}
              className="h-14 w-full rounded-xl text-base font-bold shadow-lg hover:shadow-xl transition-all mt-6"
            >
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Settings
        open={openSettings}
        onOpenChange={setOpenSettings}
      />
    </>
  );
}