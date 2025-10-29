"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useExportWallet } from "@privy-io/react-auth/solana";
import { toast } from "react-toastify";

export function ExportWallet() {
  const [acknowledged, setAcknowledged] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { exportWallet } = useExportWallet();

  const handleExport = async () => {
    if (!acknowledged) {
      toast.warning("Please confirm the risk.");
      return;
    }
    try {
      setIsLoading(true);
      await exportWallet();
      toast.success("Private key exported.");
    } catch {
      toast.error("Failed to export.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 border-t border-border pt-6">
      <h3 className="text-lg font-semibold">Export Private Key</h3>
      <p className="text-sm text-muted-foreground">
        This reveals your private key. Never share it or store it online.
      </p>
      <div className="flex items-start gap-3">
        <Checkbox id="ack" checked={acknowledged} onCheckedChange={(v) => setAcknowledged(!!v)} />
        <Label htmlFor="ack" className="text-sm text-muted-foreground">
          I understand the security risk.
        </Label>
      </div>
      <Button disabled={!acknowledged || isLoading} onClick={handleExport} className="w-full h-16 rounded-2xl text-lg">
        {isLoading ? "Exporting..." : "Export Private Key"}
      </Button>
    </div>
  );
}
