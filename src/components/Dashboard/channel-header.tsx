"use client";

import React, { useState, useTransition } from "react";
import { ChannelHeader, useChannelStateContext, Avatar } from "stream-chat-react";
import { DotsThreeVertical, ArrowLeft } from "@phosphor-icons/react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CreateReview } from "@/server/review";
import { usePrivy } from "@privy-io/react-auth";
import stream from "@/lib/stream";

interface Props {
  onBack?: () => void;
}

export default function ChannelHeaderWithMenu({ onBack }: Props) {
  const { channel } = useChannelStateContext();
  const { user } = usePrivy();

  const [showMembersDialog, setShowMembersDialog] = useState(false);
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [isPending, startTransition] = useTransition();
 console.log(channel, "Channel in Header");
  // Review state
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const handleSubmitReview = () => {
    const reviewer = user?.wallet?.address;
    //@ts-ignore
    const streamId = channel?.data?.id;
  
     
    if (!reviewer || !streamId) {
      alert("Missing reviewer or stream ID");
      return;
    }

    if (rating < 1 || rating > 5) {
      alert("Please select a rating between 1 and 5 stars");
      return;
    }

    startTransition(async () => {
      try {
        await CreateReview(reviewer, streamId, rating, comment);
        alert("Review submitted successfully!");
        setShowReviewDialog(false);
        setRating(0);
        setComment("");
      } catch (error) {
        console.error("Error submitting review:", error);
        alert("Failed to submit review.");
      }
    });
  };

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

      {/* Menu */}
      <Popover>
        <PopoverTrigger asChild>
          <button className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700">
            <DotsThreeVertical size={24} className="text-gray-700 dark:text-gray-300" />
          </button>
        </PopoverTrigger>

        <PopoverContent className="w-40 p-2">
          <ul className="space-y-2">
            <li>
              <button
                className="w-full text-left px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                onClick={() => setShowMembersDialog(true)}
              >
                View Members
              </button>
            </li>
            <li>
              <button
                className="w-full text-left px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                onClick={() => setShowReviewDialog(true)}
              >
                Rate Group
              </button>
            </li>
          </ul>
        </PopoverContent>
      </Popover>

      {/* Members Dialog */}
      <Dialog open={showMembersDialog} onOpenChange={setShowMembersDialog}>
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

      {/* Review Dialog */}
      <Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Rate Group</DialogTitle>
          </DialogHeader>

          <div className="mt-4 flex flex-col gap-4">
            {/* Star Rating */}
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`text-2xl transition ${
                    star <= rating ? "text-yellow-400" : "text-gray-400 dark:text-gray-500"
                  }`}
                >
                  ★
                </button>
              ))}
            </div>

            {/* Comment */}
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write your comment..."
              className="w-full p-2 border rounded bg-accent"
              rows={4}
            />

            <Button onClick={handleSubmitReview} disabled={isPending}>
              {isPending ? "Submitting..." : "Submit Review"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
