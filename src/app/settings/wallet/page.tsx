"use client";

import { useState } from "react";
import { Withdraw } from "@/app/settings/wallet/withdraw";
import { Deposit } from "@/app/settings/wallet/deposit";
import { ExportWallet } from "@/app/settings/wallet/export-wallet";

const TABS = ["Withdraw", "Deposit", "Export"];

export default function Settings() {
  const [selectedTab, setSelectedTab] = useState("Deposit");

  return (
    <div className="w-full px-4 lg:px-0 py-4 lg:py-0">
      <div className="w-full max-w-2xl border-border bg-background mx-auto rounded-2xl">
        <div className="space-y-6 mt-4 p-4 lg:p-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-center">WALLET SETTINGS</h1>
          {/* Tabs */}
          <div className="flex gap-2 rounded-lg border border-border bg-background/50 p-2">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedTab(tab)}
                className={`flex-1 rounded-lg py-3 text-center font-semibold transition-colors text-sm lg:text-base ${
                  selectedTab === tab
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
      </div>
    </div>
  );
}