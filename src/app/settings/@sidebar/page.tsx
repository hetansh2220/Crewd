"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { User, Wallet } from "lucide-react";

const Sidebar = () => {
  const pathname = usePathname();

  const linkClasses = (path: string) =>
    `flex items-center gap-2 block text-sm font-medium transition-colors ${
      pathname === path
        ? "text-primary"
        : "text-muted-foreground hover:text-primary"
    }`;

  return (
    <aside className="fixed w-64 border-r border-border p-6 space-y-8 hidden lg:block bg-card/30 backdrop-blur-xl h-[calc(100vh-84px)]">
      <div className="space-y-4">
        <h2 className="text-muted-foreground text-xs font-semibold"></h2>
        <nav className="space-y-2">
          <Link href="/settings/profile" className={linkClasses("/settings/profile")}>
            <User className="h-4 w-4" />
            Profile 
          </Link>
        </nav>
      </div>

      <div className="space-y-4">
        <h2 className="text-muted-foreground text-xs font-semibold"></h2>
        <nav className="space-y-2">
          <Link href="/settings/wallet" className={linkClasses("/settings/wallet")}>
            <Wallet className="h-4 w-4" />
            Wallet
          </Link>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;