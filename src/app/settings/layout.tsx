import React from "react";
import Sidebar from "./@sidebar/page";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content area */}
      <div className="flex-1 flex justify-center items-start overflow-y-auto p-8">
        <div className="w-full max-w-3xl">{children}</div>
      </div>
    </div>
  );
}
