"use client";

import { usePathname, useRouter } from "next/navigation";
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User, Wallet } from "lucide-react";

const MobileNavDropdown = () => {
  const pathname = usePathname();
  const router = useRouter();

  const navigationItems = [
    { value: "/settings/profile", label: "Profile", icon: User },
    { value: "/settings/wallet", label: "Wallet", icon: Wallet },
  ];

  const handleNavigation = (value: string) => {
    router.push(value);
  };

  const currentItem = navigationItems.find((item) => item.value === pathname);

  return (
    <div className="md:hidden lg:hidden w-full px-4 py-4 bg-card/30 backdrop-blur-xl border-b border-border sticky top-0 z-50">
      <Select value={pathname} onValueChange={handleNavigation}>
        <SelectTrigger className="w-full h-12 text-base font-medium bg-card border-border">
          <SelectValue>
            <div className="flex items-center gap-2">
              {currentItem?.icon && (
                <currentItem.icon className="h-4 w-4" />
              )}
              <span>{currentItem?.label || "Select Page"}</span>
            </div>
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="bg-card border-border">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <SelectItem
                key={item.value}
                value={item.value}
                className="text-base py-3 cursor-pointer hover:bg-accent"
              >
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </div>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
};

export default MobileNavDropdown;