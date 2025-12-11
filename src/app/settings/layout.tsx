import React from "react";
import Sidebar from "./@sidebar/page";
import MobileNavDropdown from "./@sidebar/mobile-nav";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex bg-background">
      {/* Sidebar */}
      <Sidebar />

      {/* Mobile Dropdown Navigation */}
      <MobileNavDropdown />

      {/* Main content area */}
      <div className="mx-auto w-full md:ml-64">{children}</div>
    </div>
  );
}