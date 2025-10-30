"use client"

import type React from "react"
import bs58 from 'bs58';
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { CreateTip } from "@/server/tips"
import { usePrivy } from "@privy-io/react-auth"
import { useState } from "react"
import { useChatContext } from "stream-chat-react"
import { useSignAndSendTransaction, useWallets } from "@privy-io/react-auth/solana"
import useTransfer from "@/hooks/use-transfer"
import {ChannelData} from "stream-chat"
import { Bounce, toast, ToastContainer } from "react-toastify";

interface SetAmountDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const PRESET_AMOUNTS = [0.01, 0.05, 0.1, 0.25]


export function SendTip({ open, onOpenChange }: SetAmountDialogProps) {
  const { channel } = useChatContext()
  console.log("Channel in SendTip:", channel)
  const [amount, setAmount] = useState("")
  const [selectedPreset, setSelectedPreset] = useState<number | null>(null)
  const { user } = usePrivy()
  const [isLoading, setIsLoading] = useState(false)
  const { wallets } = useWallets()
  const { signAndSendTransaction } = useSignAndSendTransaction()
  const { transfer } = useTransfer()

  const handlePresetClick = (preset: number) => {
    setAmount(preset.toString())
    setSelectedPreset(preset)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setAmount(value)
    setSelectedPreset(null)
  }

  const data = channel?.data as ChannelData & { owner?: string }
  const ownerAddress = data?.owner

  const handleDeposit = async () => {
    const numAmount = Number.parseFloat(amount)
    if (isNaN(numAmount) || numAmount <= 0) return

    if (!user?.wallet?.address) {
      alert("Wallet not connected.")
      return
    }

    if (!ownerAddress) {
      return alert("Channel owner address not found.")
    }

    if (!channel?.data?.id) {
      alert("No channel context.")
      return
    }

    setIsLoading(true)
    try {
      const transaction = await transfer(
        user.wallet.address,
        ownerAddress,
        numAmount
      )

      const { signature } = await signAndSendTransaction({
        transaction: new Uint8Array(transaction.serialize({ requireAllSignatures: false })),
        wallet: wallets[0],
      })

      const hash = bs58.encode(Buffer.from(signature));

      await CreateTip(
        user.wallet.address,
        channel.data.id,
        numAmount,
        hash
      )
      //Toast
      toast.success('Tip successfully sent!', {
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

      setAmount("")
      setSelectedPreset(null)
      onOpenChange(false)
    } catch (err) {
      //toast error
      toast.error('Failed to send tip.', {
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

    } finally {
      setIsLoading(false)
    }
  }


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[90vw] max-w-2xl border border-border bg-background p-7 sm:p-8 mx-auto my-auto rounded-2xl">
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
                className={`rounded-2xl border py-4   text-lg font-semibold transition-colors ${selectedPreset === preset
                  ? "bg-foreground/10 text-foreground"
                  : "border-border text-foreground hover:border-foreground/50"
                  }`}
              >
                {preset} SOL
              </button>
            ))}
          </div>

          {/* Confirm Button */}
          <Button
            onClick={handleDeposit}
            disabled={!amount || Number.parseFloat(amount) <= 0}
            className="h-14 w-full rounded-2xl text-lg font-semibold"
          >
            {isLoading ? "Processing..." : `Send Tip`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>

  )
}
