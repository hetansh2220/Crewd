'use client';

import LoginWithWallet from "@/components/LoginWithWallet";

export default function HomePage() {

  return (
    <>
      <nav className="bg-gray-800 p-4 flex justify-between items-center">
        <h1 className="text-white text-lg">Chat Application</h1>
        <LoginWithWallet />
      </nav>
    </>
  );
}
