"use client";

import { useRouter } from "next/navigation";
import { CompassIcon, UserIcon, SignOutIcon } from "@phosphor-icons/react";

export default function SidePanel() {
  const router = useRouter();

  return (
    <div className="h-screen w-16 bg-[#f9f9f9] flex flex-col items-center justify-between py-4 border-r rounded px-2 border-gray-300">
      <div className="flex flex-col items-center space-y-6 ">
        <button
          onClick={() => router.push("/")}
          className="p-2  rounded-xl hover:bg-gray-200 transition-all"
          title="Explore"
        >
          <CompassIcon size={28} color="#333" />
        </button>
      </div>

      <div className="flex flex-col items-center space-y-6 mb-4">
        <button
          onClick={() => router.push("/profile")}
          className="p-2 rounded-xl hover:bg-gray-200 transition-all"
          title="Profile"
        >
          <UserIcon size={28} color="#333" />
        </button>

        <button
          onClick={() => console.log("logout")}
          className="p-3 rounded-xl hover:bg-gray-200 transition-all"
          title="Logout"
        >
          <SignOutIcon size={28} color="#d9534f" />
        </button>
      </div>
    </div>
  );
}
