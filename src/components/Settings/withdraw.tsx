"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { usePrivy } from "@privy-io/react-auth";
import { useSignAndSendTransaction, useWallets } from "@privy-io/react-auth/solana";
import useTransfer from "@/hooks/use-transfer";

const PRESET_AMOUNTS = [5, 15, 30, 100];

export function Withdraw({ onClose }: { onClose: () => void }) {
  const [amount, setAmount] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [selectedPreset, setSelectedPreset] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { user } = usePrivy();
  const { signAndSendTransaction } = useSignAndSendTransaction();
  const { wallets } = useWallets();
  const { transfer } = useTransfer();

  const handleWithdraw = async () => {
    const numAmount = parseFloat(amount);
    if (!user?.wallet?.address || !walletAddress || numAmount <= 0) {
      toast.error("Enter valid details.");
      return;
    }

    try {
      setIsLoading(true);
      const transaction = await transfer(user.wallet.address, walletAddress, numAmount);

      await signAndSendTransaction({
        transaction: new Uint8Array(transaction.serialize({ requireAllSignatures: false })),
        wallet: wallets[0],
      });

      toast.success("Withdraw successful!");
      setAmount("");
      setWalletAddress("");
      setSelectedPreset(null);
    } catch (err) {
      toast.error("Transaction failed.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4 border-t border-border pt-6">
      <h3 className="text-lg font-semibold text-foreground">Withdraw SOL</h3>
      <Input
        placeholder="Wallet address"
        className="h-12"
        value={walletAddress}
        onChange={(e) => setWalletAddress(e.target.value)}
      />
      <Input
        placeholder="Amount"
        type="number"
        className="h-12"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <div className="grid grid-cols-4 gap-4">
        {PRESET_AMOUNTS.map((preset) => (
          <button
            key={preset}
            onClick={() => {
              setAmount(preset.toString());
              setSelectedPreset(preset);
            }}
            className={`rounded border py-2 text-md font-semibold ${
              selectedPreset === preset ? "bg-foreground/10" : "border-border"
            }`}
          >
            {preset} SOL
          </button>
        ))}
      </div>

      <Button
        disabled={isLoading}
        onClick={handleWithdraw}
        className="w-full h-16 rounded-2xl text-lg font-semibold"
      >
        {isLoading ? "Processing..." : "Withdraw"}
      </Button>
    </div>
  );
}
