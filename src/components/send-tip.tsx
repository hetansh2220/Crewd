"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { CreateTip } from "@/server/tips"
import { usePrivy } from "@privy-io/react-auth"
import { useState } from "react"
import { useChatContext } from "stream-chat-react"


interface SetAmountDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const PRESET_AMOUNTS = [5, 15, 30, 100]


export function SendTip({ open, onOpenChange }: SetAmountDialogProps) {
  const { channel } = useChatContext()
  console.log("Channel in SendTip:", channel)
  const [amount, setAmount] = useState("")
  const [selectedPreset, setSelectedPreset] = useState<number | null>(null)
  const { user } = usePrivy()
  const [isLoading, setIsLoading] = useState(false)

  const handlePresetClick = (preset: number) => {
    setAmount(preset.toString())
    setSelectedPreset(preset)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setAmount(value)
    setSelectedPreset(null)
  }

  const handleDeposit = async () => {
    const numAmount = Number.parseFloat(amount)
    if (isNaN(numAmount) || numAmount <= 0) return

    // Ensure user + group context exist
    if (!user?.wallet?.address) {
      alert("Wallet not connected.")
      return
    }

    // ✅ You'll pass groupId via props


    setIsLoading(true)
    try {
      const newTip = await CreateTip(
        user.wallet.address,
        channel?.data?.id || "unknown-channel",
        numAmount
      )

      console.log("✅ Tip stored:", newTip)
      alert("Tip successfully sent!")

      setAmount("")
      setSelectedPreset(null)
      onOpenChange(false)
    } catch (err) {
      console.error("❌ Error sending tip:", err)
      alert("Failed to send tip.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[90vw] max-w-2xl border border-border bg-background p-6 sm:p-8 mx-auto my-auto rounded-2xl">
        <DialogHeader className="space-y-2">
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
              Send Tip
            </DialogTitle>
          </div>
          <DialogDescription className="text-muted-foreground text-left">
            Enter or select a preset amount to continue.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Custom Amount Input */}
          <Input
            type="number"
            placeholder="Enter custom amount"
            value={amount}
            onChange={handleInputChange}
            className="h-14 text-3xl font-semibold placeholder:text-md border border-border bg-background text-foreground placeholder:text-muted-foreground rounded-xl"
          />

          {/* Preset Amount Buttons */}
          <div className="grid grid-cols-4 gap-4 border-t border-border pt-6">
            {PRESET_AMOUNTS.map((preset) => (
              <button
                key={preset}
                onClick={() => handlePresetClick(preset)}
                className={`rounded-2xl border py-4 text-lg font-semibold transition-colors ${selectedPreset === preset
                  ? "bg-foreground/10 text-foreground"
                  : "border-border text-foreground hover:border-foreground/50"
                  }`}
              >
                ${preset}
              </button>
            ))}
          </div>

          {/* Confirm Button */}
          <Button
            onClick={handleDeposit}
            disabled={!amount || Number.parseFloat(amount) <= 0}
            className="h-14 w-full rounded-2xl text-lg font-semibold"
          >
            {isLoading ? "Processing..." : `Send $${amount} Tip`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>

  )
}
