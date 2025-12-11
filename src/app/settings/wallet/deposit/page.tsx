"use client";

import { useEffect, useRef, useState } from "react";
import QRCodeStyling from "qr-code-styling";
import { Button } from "@/components/ui/button";
import { usePrivy } from "@privy-io/react-auth";
import { useTheme } from "next-themes";
import { toast } from "react-toastify";

export default function DepositPage() {
  const qrRef = useRef<HTMLDivElement>(null);
  const { user } = usePrivy();
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const address = user?.wallet?.address || "not_available";

  useEffect(() => {
    if (qrRef.current) {
      qrRef.current.innerHTML = "";
      const qr = new QRCodeStyling({
        width: 300,
        height: 300,
        data: address,
        image: "https://s2.coinmarketcap.com/static/img/coins/200x200/5426.png",
        dotsOptions: { color: theme === "light" ? "#000" : "#fff" },
        backgroundOptions: { color: "transparent" },
      });
      qr.append(qrRef.current);
    }
  }, [theme, address]);

  const handleCopy = async () => {
    try {
      setIsLoading(true);
      await navigator.clipboard.writeText(address);
      toast.success("Address copied!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-84px)] space-y-6">
      <div ref={qrRef} />
      <div className="rounded-lg border border-border bg-background/50 p-4 w-full max-w-md text-center">
        <p className="break-all font-mono text-sm">{address}</p>
      </div>
      <Button
        onClick={handleCopy}
        disabled={isLoading}
        className="h-16 w-full max-w-md rounded-2xl text-lg font-semibold"
      >
        {isLoading ? "Copying..." : "Copy Address"}
      </Button>
    </div>
  );
}
