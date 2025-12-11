"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useExportWallet } from "@privy-io/react-auth/solana";
import { toast } from "react-toastify";

export default function ExportKeyPage() {
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
    <div className="flex flex-col items-center justify-center h-[calc(100vh-84px)] space-y-6">
      <div className="w-full max-w-md border-t border-border pt-6 space-y-6">
        <h3 className="text-lg font-semibold text-center">Export Private Key</h3>
        <p className="text-sm text-muted-foreground text-center">
          This reveals your private key. Never share it or store it online.
        </p>

        <div className="flex items-start gap-3">
          <Checkbox
            id="ack"
            checked={acknowledged}
            onCheckedChange={(v) => setAcknowledged(!!v)}
          />
          <Label htmlFor="ack" className="text-sm text-muted-foreground">
            I understand the security risk.
          </Label>
        </div>

        <Button
          disabled={!acknowledged || isLoading}
          onClick={handleExport}
          className="w-full h-16 rounded-2xl text-lg font-semibold"
        >
          {isLoading ? "Exporting..." : "Export Private Key"}
        </Button>
      </div>
    </div>
  );
}
