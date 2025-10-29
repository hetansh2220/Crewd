"use client";

import { MagnifyingGlassIcon, PlusIcon } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { ChannelList } from "stream-chat-react";
import CreateGroup from "./create-group";
import { usePrivy } from "@privy-io/react-auth";


export default function Sidebar() {
  const { user } = usePrivy();
  const currentUserId = user?.wallet?.address || "guest";
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 400);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const filters = {
    type: "messaging",
    members: { $in: [currentUserId] },
    ...(debouncedQuery ? { name: { $autocomplete: debouncedQuery } } : {}),
  };

  return (
    <div className="h-full border  bg-background/80 backdrop-blur-sm flex flex-col  mb-22 rounded">
      {/* Header */}
      <div className="flex items-center justify-between p-3 dark:bg-background border-b">
        <p className="text-lg font-semibold">Chat</p>
        <button
          onClick={() => setShowCreateModal(true)}
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-background transition"
          title="Create Group"
        >
          <PlusIcon className="w-6 h-6 text-gray-700 dark:text-gray-300" />
        </button>
      </div>

      {/* Search */}
      <div className="p-2 bg-[#f6f6f6] dark:bg-background border-b">
        <div className="flex items-center bg-white dark:bg-background rounded-full px-3 py-2 shadow-sm">
          <MagnifyingGlassIcon className="w-5 h-5 text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Search or start new chat"
            className="flex-1 bg-transparent outline-none text-sm text-gray-700 dark:text-gray-200 placeholder-gray-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Channel List */}
      <div className="flex-1 overflow-y-auto  scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700">
        <ChannelList
          filters={filters}
          options={{ state: true, watch: true }}
        />
      </div>

      {/* Create Group */}
      <CreateGroup
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
      />
    </div>
  );
}