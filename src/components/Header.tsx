"use client";

import { ChatCircleIcon } from "@phosphor-icons/react";
import { usePrivy } from "@privy-io/react-auth";
import { Button } from "./ui/button";
import { LoginForm } from "./Login/login-form";


export function Header() {
  const { authenticated, logout , user, login} = usePrivy();
  console.log(user?.wallet?.address, "wallet address");
  console.log(user, "user info");
  return (
    <header className="sticky top-0 z-50 border-3 bg-background backdrop-blur-md m-2 rounded-xl">
      <div className="max-w-9xl mx-auto flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-2">
          <ChatCircleIcon size={32} className="text-black" />
        </div>
        {authenticated ? (
          <>
            <Button variant="ghost" onClick={logout}>Logout</Button>
          </>
        ) : (
          <LoginForm />
        )}
      </div>
    </header>
  );
}