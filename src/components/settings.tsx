"use client"

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox"; // make sure this exists in your ShadCN setup
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePrivy } from "@privy-io/react-auth";
import { useExportWallet } from "@privy-io/react-auth/solana";
import QRCodeStyling from "qr-code-styling";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { ToastContainer, Bounce, toast } from "react-toastify";

interface WalletSettingsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDeposit?: (amount: number) => void;
  onWithdraw?: (address: string, amount: number) => void; // updated onWithdraw to include address
}

const PRESET_AMOUNTS = [5, 15, 30, 100];
const TABS = ["Withdraw", "Deposit", "Export"];

export function Settings({ open, onOpenChange, onWithdraw }: WalletSettingsProps) {
  const [amount, setAmount] = useState("");
  const [selectedPreset, setSelectedPreset] = useState<number | null>(null);
  const [selectedTab, setSelectedTab] = useState("Deposit");
  const [acknowledged, setAcknowledged] = useState(false); // controls checkbox
  const [walletAddress, setWalletAddress] = useState(""); // State for wallet address in Withdraw
  const qrRef = useRef<HTMLDivElement>(null);
  const { user } = usePrivy();
  const { exportWallet } = useExportWallet();
  const { theme } = useTheme();

  const CRYPTO_ADDRESS = user?.wallet?.address || "not_available";

  // Generate QR for Deposit tab
  useEffect(() => {
    if (selectedTab === "Deposit" && qrRef.current) {
      qrRef.current.innerHTML = "";

      const isLight = theme === "light";

      const qrCode = new QRCodeStyling({
        width: 300,
        height: 300,
        data: CRYPTO_ADDRESS,
        image: "https://s2.coinmarketcap.com/static/img/coins/200x200/5426.png",
        imageOptions: { hideBackgroundDots: true, margin: 8 },
        dotsOptions: {
          color: isLight ? "#000000" : "#ffffff",
          type: "dots",
        },
        backgroundOptions: {
          color: "transparent",
        },
        cornersSquareOptions: {
          color: isLight ? "#000000" : "#ffffff",
          type: "extra-rounded",
        },
        cornersDotOptions: {
          color: isLight ? "#000000" : "#ffffff",
          type: "extra-rounded",
        },
      });

      qrCode.append(qrRef.current);
    }
  }, [selectedTab, CRYPTO_ADDRESS, theme]);

  const handlePresetClick = (preset: number) => {
    setAmount(preset.toString());
    setSelectedPreset(preset);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
    setSelectedPreset(null);
  };

  const handleWalletAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWalletAddress(e.target.value);
  };

  const handleAction = async () => {
    const numAmount = parseFloat(amount);

    if (selectedTab === "Withdraw" && numAmount > 0 && walletAddress) {
      onWithdraw?.(walletAddress, numAmount); // Pass wallet address along with amount
      setAmount("");
      setSelectedPreset(null);
      setWalletAddress(""); // Reset wallet address after withdrawal
      onOpenChange(false);
    }

    if (selectedTab === "Deposit") {
      await navigator.clipboard.writeText(CRYPTO_ADDRESS);
      //Toast
        toast.success('Wallet address copied!', {
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
    }

    if (selectedTab === "Export") {
      if (!acknowledged) return; // ✅ require confirmation
      await exportWallet();        
      setAcknowledged(false); // reset checkbox
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[90vw] max-w-2xl border-border bg-background p-6 sm:p-8 mx-auto my-auto rounded-2xl">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0">
          <div className="flex items-center gap-3">
            <div className="rounded-lg border border-border bg-background/50 p-2">
              <svg
                className="h-6 w-6 text-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
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
                onClick={() => {
                  setSelectedTab(tab);
                  setAcknowledged(false);
                }}
                className={`flex-1 rounded-lg py-3 text-center font-semibold transition-colors ${selectedTab === tab
                  ? "bg-foreground/10 text-foreground"
                  : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Withdraw */}
          {selectedTab === "Withdraw" && (
            <div className="space-y-4 border-t border-border pt-6">
              <h3 className="text-lg font-semibold text-foreground">Enter Wallet Address</h3>
              <Input
                type="text"
                placeholder="Enter wallet address"
                value={walletAddress}
                onChange={handleWalletAddressChange}
                className="h-12 border-border bg-background text-lg text-foreground mt-2" // Reduced margin here
              />
              <h3 className="text-lg font-semibold text-foreground mt-4">Withdraw Amount</h3>
              <Input
                type="number"
                placeholder="Enter custom amount"
                value={amount}
                onChange={handleInputChange}
                className="h-12 border-border bg-background text-lg text-foreground"
              />
            
              <div className="grid grid-cols-4 gap-4 mt-4">
                {PRESET_AMOUNTS.map((preset) => (
                  <button
                    key={preset}
                    onClick={() => handlePresetClick(preset)}
                    className={`rounded border py-2 text-md font-semibold transition-colors ${selectedPreset === preset
                      ? "bg-foreground/10 text-foreground"
                      : "border-border text-foreground"
                      }`}
                  >
                    {preset} SOL
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Deposit */}
          {selectedTab === "Deposit" && (
            <div className="space-y-6 border-t border-border pt-6">
              <div className="flex justify-center">
                <div ref={qrRef} />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-foreground">Your Solana Address</h3>
                <div className="rounded-lg border border-border bg-background/50 p-4">
                  <p className="break-all font-mono text-sm text-foreground">{CRYPTO_ADDRESS}</p>
                </div>
              </div>
            </div>
          )}

          {/* Export Private Key */}
          {selectedTab === "Export" && (
            <div className="space-y-6 border-t border-border pt-6">
              <h3 className="text-lg font-semibold text-foreground">Export Private Key</h3>
              <p className="text-sm text-muted-foreground">
                Your wallet mnemonic is a secret phrase that enables full access to your wallet and funds.
                Never share this phrase with anyone or store it online.
              </p>

              {/* Checkbox */}
              <div className="flex items-start gap-3 pt-2">
                <Checkbox
                  className="border-black dark:border-white"
                  id="acknowledge"
                  checked={acknowledged}
                  onCheckedChange={(checked) => setAcknowledged(!!checked)}
                />
                <Label htmlFor="acknowledge" className="text-sm text-muted-foreground leading-snug">
                  I understand that revealing my private key may compromise my funds and wallet security.
                </Label>
              </div>
            </div>
          )}

          {/* Action Button */}
          <Button
            onClick={handleAction}
            disabled={
              (selectedTab === "Withdraw" && (!amount || parseFloat(amount) <= 0 || !walletAddress)) ||
              (selectedTab === "Export" && !acknowledged)
            }
            className="h-16 w-full rounded-2xl text-lg font-semibold"
          >
            {selectedTab === "Withdraw"
              ? "Withdraw"
              : selectedTab === "Deposit"
                ? "Copy Address"
                : "Export Private Key"
            }
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
