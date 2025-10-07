'use client';

import React from "react";
import { ChannelHeader, useChannelStateContext, Avatar } from "stream-chat-react";
import { UsersIcon, ArrowLeft } from "@phosphor-icons/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Props {
  onBack?: () => void;
}

export default function ChannelHeaderWithMembers({ onBack }: Props) {
  const { channel } = useChannelStateContext();

  return (
    <div className="flex justify-between items-center p-2 border-b dark:bg-gray-800">
      <div className="flex items-center gap-2 flex-1">
      {onBack && (
  <button
    onClick={onBack}
    className="md:hidden p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
  >
    <ArrowLeft size={22} className="text-gray-700 dark:text-gray-300" />
  </button>
)}

        <ChannelHeader />
      </div>

      <Dialog>
        <DialogTrigger asChild>
          <button className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700">
            <UsersIcon className="w-6 h-6 text-gray-700 dark:text-gray-300" />
          </button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Group Members</DialogTitle>
          </DialogHeader>
          <ul className="mt-4 space-y-2 max-h-96 overflow-y-auto">
            {channel.state.members &&
              Object.values(channel.state.members).map((member) => (
                <li key={member.user_id} className="flex items-center gap-3">
                  <Avatar
                    image={member.user?.image || "/default-avatar.png"}
                    name={member.user?.name || member.user_id}
                    className="px-2 py-1 rounded-full dark:border-gray-700 shadow-sm"
                  />
                  <span className="text-gray-800 dark:text-gray-200 font-medium">
                    {member.user?.name || member.user_id}
                  </span>
                </li>
              ))}
          </ul>
        </DialogContent>
      </Dialog>
    </div>
  );
}
