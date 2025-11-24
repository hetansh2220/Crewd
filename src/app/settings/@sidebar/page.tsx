"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const Sidebar = () => {
  const pathname = usePathname();

  const linkClasses = (path: string) =>
    `block text-sm font-medium transition-colors ${
      pathname === path
        ? "text-primary"
        : "text-muted-foreground hover:text-primary"
    }`;

  return (
    <aside className="fixed w-64 border-r border-border p-6 space-y-8 hidden md:block bg-card/30 backdrop-blur-xl h-[calc(100vh-84px)]">
      <div className="space-y-4">
        <h2 className="text-muted-foreground text-xs font-semibold"></h2>
        <nav className="space-y-2">
          <Link href="/settings/profile" className={linkClasses("/settings/profile")}>
            Profile 
          </Link>
        </nav>
      </div>

      <div className="space-y-4">
        <h2 className="text-muted-foreground text-xs font-semibold"></h2>
        <nav className="space-y-2">
          <Link href="/settings/wallet" className={linkClasses("/settings/wallet")}>
            Wallet
          </Link>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
