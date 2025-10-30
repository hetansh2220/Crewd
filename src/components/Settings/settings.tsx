"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { Withdraw } from "./withdraw";
import { Deposit } from "./deposite";
import { ExportWallet } from "./export-wallet";

const TABS = ["Withdraw", "Deposit", "Export"];

export function Settings({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [selectedTab, setSelectedTab] = useState("Deposit");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[90vw] max-w-2xl border-border bg-background p-6 sm:p-8 mx-auto my-auto rounded-2xl">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0">
          <div className="flex items-center gap-3">
            <div className="rounded-lg border border-border bg-background/50 p-2">
              <svg className="h-6 w-6 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <DialogTitle className="text-2xl font-semibold text-foreground">Wallet Settings</DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Tabs */}
          <div className="flex gap-2 rounded-lg border border-border bg-background/50 p-2">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedTab(tab)}
                className={`flex-1 rounded-lg py-3 text-center font-semibold transition-colors ${selectedTab === tab
                  ? "bg-foreground/10 text-foreground"
                  : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Render tab content */}
          {selectedTab === "Withdraw" && <Withdraw />}
          {selectedTab === "Deposit" && <Deposit />}
          {selectedTab === "Export" && <ExportWallet />}
        </div>
      </DialogContent>
    </Dialog>
  );
}
