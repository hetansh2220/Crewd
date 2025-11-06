"use client";

import { useEffect, useState } from "react";
import { useTransition } from "react";
import Link from "next/link";
import { usePrivy } from "@privy-io/react-auth";
import { ChannelHeader, useChatContext } from "stream-chat-react";
import { ArrowLeftIcon, DotsThreeVerticalIcon } from "@phosphor-icons/react";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import {SendTip} from '@/components/Dialogs/send-tip'

import { ViewMembersDialog } from "@/components/Dialogs/view-members";
import { RateGroupDialog } from "@/components/Dialogs/rate-group";

/**
 * Props
 */
interface Props {
  onBack?: () => void;
}

export default function ChannelHeaderWithMenu({ onBack }: Props) {
  const { user, ready } = usePrivy();
  const [showMembersDialog, setShowMembersDialog] = useState(false);
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [showTipDialog, setShowTipDialog] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { channel } = useChatContext();

  // Get all members from channel state
  const members = channel?.state?.members ? Object.values(channel.state.members) : [];

  return (
    <div className="flex justify-between items-center p-2 border-b dark:bg-background">
      {/* Left side */}
      <div className="flex items-center gap-2 flex-1">
        {onBack && (
          <button
            onClick={onBack}
            className="md:hidden p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            <ArrowLeftIcon size={22} className="text-gray-700 dark:text-gray-300" />
          </button>
        )}
        {!ready ? (
          <div className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
        ) : (
          <ChannelHeader />
        )}
      </div>

      {/* Right side - Menu */}
      <Popover>
        <PopoverTrigger asChild>
          <button className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700">
            <DotsThreeVerticalIcon size={24} className="text-gray-700 dark:text-gray-300" />
          </button>
        </PopoverTrigger>

        <PopoverContent className="w-40 p-3">
          <ul className="space-y-2">
            <li>
              <button
                className="w-full text-left px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-md"
                onClick={() => setShowMembersDialog(true)}
              >
                View Members
              </button>
            </li>
            <li>
              <button
                className="w-full text-left px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-md"
                onClick={() => setShowReviewDialog(true)}
              >
                Rate Group
              </button>
            </li>
            <li>
              <button
                className="w-full text-left px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-md"
                onClick={() => setShowTipDialog(true)}
              >
                Send Tip
              </button>
            </li>
          </ul>
        </PopoverContent>
      </Popover>

      {/* View Members Dialog */}
      <ViewMembersDialog
        open={showMembersDialog}
        onOpenChange={setShowMembersDialog}
        members={members}
        ready={ready}
      />

      {/* Rate Group Dialog */}
      <RateGroupDialog
        open={showReviewDialog}
        onOpenChange={setShowReviewDialog}
        reviewer={user?.wallet?.address}
        groupId={channel?.data?.id}
      />

      {/* Send Tip Dialog */}
      <SendTip open={showTipDialog} onOpenChange={setShowTipDialog} />
    </div>
  );
}
