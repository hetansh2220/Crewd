import React from "react";
import Sidebar from "./@sidebar/page";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex bg-background ">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content area
       */}
      <div className="mx-auto ">{children}</div>
    </div>
  );
}

