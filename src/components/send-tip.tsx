"use client"

import type React from "react"

import { use, useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { usePrivy } from "@privy-io/react-auth"
import { CreateTip } from "@/server/tips"
import stream from "@/lib/stream";
import { useChatContext } from "stream-chat-react"

interface SetAmountDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onDeposit?: (amount: number) => void
}

const PRESET_AMOUNTS = [5, 15, 30, 100]


export function SendTip({ open, onOpenChange, onDeposit }: SetAmountDialogProps) {
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
      onDeposit?.(numAmount)
    } catch (err) {
      console.error("❌ Error sending tip:", err)
      alert("Failed to send tip.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-2xl border-border bg-background p-8">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-foreground">Set Amount</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Custom Amount Input */}
          <Input
            type="number"
            placeholder="Enter custom amount"
            value={amount}
            onChange={handleInputChange}
            className="h-12 text-3xl placeholder:text-md  border-border bg-background  text-foreground placeholder:text-muted-foreground"
          />

          {/* Preset Amount Buttons */}
          <div className="grid grid-cols-4 gap-4">
            {PRESET_AMOUNTS.map((preset) => (
              <button
                key={preset}
                onClick={() => handlePresetClick(preset)}
                className={`rounded-2xl border-1 py-4 text-md font-semibold transition-colors ${selectedPreset === preset
                  ? " bg-foreground/10 text-foreground"
                  : "border-border text-foreground hover:border-foreground/50"
                  }`}
              >
                ${preset}
              </button>
            ))}
          </div>
          {/* Deposit Button */}
          <Button
            onClick={handleDeposit}
            disabled={!amount || Number.parseFloat(amount) <= 0}
            className="h-10 w-full rounded-2xl text-lg font-semibold"
          >
            confirm
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
