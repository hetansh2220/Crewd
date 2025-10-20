"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import QRCodeStyling from "qr-code-styling"
import { usePrivy } from "@privy-io/react-auth"

interface WalletSettingsProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onDeposit?: (amount: number) => void
  onWithdraw?: (amount: number) => void
}

const PRESET_AMOUNTS = [5, 15, 30, 100]
const TABS = ["Deposit", "Withdraw", "Export"]

export function Settings({ open, onOpenChange, onDeposit, onWithdraw }: WalletSettingsProps) {
  const [amount, setAmount] = useState("")
  const [selectedPreset, setSelectedPreset] = useState<number | null>(null)
  const [selectedTab, setSelectedTab] = useState("Deposit")
  const qrRef = useRef<HTMLDivElement>(null)
  const { user } = usePrivy()

  const CRYPTO_ADDRESS = user?.wallet?.address || "not_available"
  const PRIVATE_KEY = user?.wallet?.privateKey || "hidden_for_security"

  // Generate QR for Withdraw tab
  useEffect(() => {
    if (selectedTab === "Withdraw" && qrRef.current) {
      qrRef.current.innerHTML = "" // clear previous QR
      const qrCode = new QRCodeStyling({
        width: 300,
        height: 300,
        data: CRYPTO_ADDRESS,
        image: "https://s2.coinmarketcap.com/static/img/coins/200x200/5426.png",
        imageOptions: { hideBackgroundDots: true, margin: 8 },
        dotsOptions: { color: "#ffffff", type: "dots" },
        backgroundOptions: { color: "transparent" },
        cornersSquareOptions: { color: "#ffffff", type: "extra-rounded" },
        cornersDotOptions: { color: "#ffffff", type: "extra-rounded" },
      })
      qrCode.append(qrRef.current)
    }
  }, [selectedTab, CRYPTO_ADDRESS])

  const handlePresetClick = (preset: number) => {
    setAmount(preset.toString())
    setSelectedPreset(preset)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value)
    setSelectedPreset(null)
  }

  const handleAction = async () => {
    const numAmount = parseFloat(amount)

    if (selectedTab === "Deposit" && numAmount > 0) {
      onDeposit?.(numAmount)
      setAmount("")
      setSelectedPreset(null)
      onOpenChange(false)
    }

    if (selectedTab === "Withdraw") {
      await navigator.clipboard.writeText(CRYPTO_ADDRESS)
      alert("Crypto address copied to clipboard.")
    }

    if (selectedTab === "Export") {
      await navigator.clipboard.writeText(PRIVATE_KEY)
      alert("Private key copied to clipboard.")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-2xl border-border bg-background p-8">
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
            <DialogTitle className="text-2xl font-semibold text-foreground">
              Wallet Settings
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Tabs */}
          <div className="flex gap-2 rounded-lg border border-border bg-background/50 p-2">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedTab(tab)}
                className={`flex-1 rounded-lg py-3 text-center font-semibold transition-colors ${
                  selectedTab === tab
                    ? "bg-foreground/10 text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Content */}
          {selectedTab === "Deposit" && (
            <div className="space-y-4 border-t border-border pt-6">
              <h3 className="text-lg font-semibold text-foreground">Deposit Amount</h3>
              <Input
                type="number"
                placeholder="Enter custom amount"
                value={amount}
                onChange={handleInputChange}
                className="h-12 border-border bg-background text-lg text-foreground"
              />
              <div className="grid grid-cols-4 gap-4">
                {PRESET_AMOUNTS.map((preset) => (
                  <button
                    key={preset}
                    onClick={() => handlePresetClick(preset)}
                    className={`rounded-2xl border-1 py-2 text-2xl font-semibold transition-colors ${
                      selectedPreset === preset
                        ? " bg-foreground/10 text-foreground"
                        : "border-border text-foreground "
                    }`}
                  >
                    ${preset}
                  </button>
                ))}
              </div>
            </div>
          )}

          {selectedTab === "Withdraw" && (
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

          {selectedTab === "Export" && (
            <div className="space-y-6 border-t border-border pt-6">
              <h3 className="text-lg font-semibold text-foreground">Export Private Key</h3>
              <div className="rounded-lg border border-border bg-background/50 p-4">
                <p className="font-mono text-sm text-foreground">
                  {PRIVATE_KEY === "hidden_for_security"
                    ? "Private key not available in session."
                    : PRIVATE_KEY.slice(0, 6) + "..." + PRIVATE_KEY.slice(-6)}
                </p>
              </div>
            </div>
          )}

          {/* Action Button */}
          <Button
            onClick={handleAction}
            disabled={selectedTab === "Deposit" && (!amount || parseFloat(amount) <= 0)}
            className="h-16 w-full rounded-2xl text-lg font-semibold"
          >
            {selectedTab === "Deposit"
              ? "Deposit"
              : selectedTab === "Withdraw"
              ? "Copy Address"
              : "Copy Private Key"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
