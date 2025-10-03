'use client';

import { useState } from 'react';
import { StreamChat } from 'stream-chat';
import { ChannelList } from 'stream-chat-react';
import { PlusIcon, MagnifyingGlassIcon } from "@phosphor-icons/react";
import CreateGroup from './CreateGroup';

interface SidebarProps {
  client: StreamChat;
  currentUserId: string;
}

export default function Sidebar({ client, currentUserId }: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);

  const filters = {
    type: "messaging",
    members: { $in: [currentUserId] },
    ...(searchQuery
      ? { name: { $autocomplete: searchQuery } }
      : {}),
  };

  return (
    <div className="w-[350px] h-screen border-r flex flex-col bg-[#f0f2f5] dark:bg-gray-900 main">
      <div className="flex items-center justify-between p-3 bg-[#ededed] dark:bg-gray-800 border-b">
        <p className="text-lg font-semibold">Chat</p>
        <button
          onClick={() => setShowCreateModal(true)}
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          title="Create Group"
        >
          <PlusIcon className="w-6 h-6 text-gray-700 dark:text-gray-300" />
        </button>
      </div>

      <div className="p-2 bg-[#f6f6f6] dark:bg-gray-800 border-b">
        <div className="flex items-center bg-white dark:bg-gray-700 rounded-full px-3 py-2 shadow-sm">
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

      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700">
        <ChannelList
          filters={filters}
          options={{ state: true, watch: true }}
        />
      </div>

      <CreateGroup
        chatClient={client}
        userId={currentUserId}
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
      />
    </div>
  );
}