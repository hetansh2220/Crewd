"use client";

import { Separator } from "@/components/ui/separator";
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
    <aside className="w-64 border-r border-border p-6 space-y-8 hidden md:block bg-card/30 backdrop-blur-xl">
      <div className="space-y-4">
        <h2 className="text-muted-foreground text-xs font-semibold">My Profile</h2>
        <nav className="space-y-2">
          <Link href="/settings/profile" className={linkClasses("/settings/profile")}>
            Profile Settings
          </Link>
        </nav>
      </div>

      <Separator />

      <div className="space-y-4">
        <h2 className="text-muted-foreground text-xs font-semibold">Wallet</h2>
        <nav className="space-y-2">
          <Link href="/settings/wallet/deposit" className={linkClasses("/settings/wallet/deposit")}>
            Deposit
          </Link>
          <Link href="/settings/wallet/withdraw" className={linkClasses("/settings/wallet/withdraw")}>
            Withdraw
          </Link>
          <Link href="/settings/wallet/export-key" className={linkClasses("/settings/wallet/export-key")}>
            Export Private Key
          </Link>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
