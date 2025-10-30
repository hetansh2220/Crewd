"use client";

import { SendTip } from "@/components/send-tip";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CreateReview } from "@/server/review";
import { ArrowLeftIcon, DotsThreeVerticalIcon, UserListIcon } from "@phosphor-icons/react";
import { usePrivy } from "@privy-io/react-auth";
import { useEffect, useState, useTransition } from "react";
import { ChannelHeader, useChatContext } from "stream-chat-react";
import { Skeleton } from "../ui/skeleton";
import { GetUserByWallet } from "@/server/user";
import { AvatarFallback, AvatarImage, Avatar } from "../ui/avatar";
import Link from "next/link";
import { Bounce, toast, ToastContainer } from "react-toastify";





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

  // Review state
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [memberDetails, setMemberDetails] = useState<{
    id: string;
    username: string;
    bio: string;
    walletAddress: string | null;
    avatar: string;
    createdAt: Date;
  }[]>();

  const handleSubmitReview = () => {
    const reviewer = user?.wallet?.address;
    const groupId = channel?.data?.id;
    if (!reviewer || !groupId) {
      alert("Missing reviewer or group ID");
      return;
    }

    if (rating < 1 || rating > 5) {
      alert("Please select a rating between 1 and 5 stars");
      return;
    }

    startTransition(async () => {
      try {
        await CreateReview(reviewer, groupId, rating, comment);
        // toast
        toast.success('Review submitted successfully!', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          transition: Bounce,
        });
        <ToastContainer />
        setShowReviewDialog(false);
        setRating(0);
        setComment("");
      } catch (error) {

        console.error("Error submitting review:", error);
        // toast error
        toast.error("Failed to submit review.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          transition: Bounce,
        });
      }
    });
  };


  const members = channel?.state?.members ? Object.values(channel.state.members) : [];

  useEffect(() => {
    const fetchMemberDetails = async () => {
      const details = await Promise.all(
        members.map(async (member) => {
          const userDetails = await GetUserByWallet(member.user_id as string);
          return userDetails;
        })
      );
      console.log("dsds:", details);
      setMemberDetails(details);
    };

    if (members.length && ready && !memberDetails) {
      fetchMemberDetails();
    }
  }, [members, ready, memberDetails]);

  return (
    <div className="flex justify-between items-center p-2 border-b dark:bg-background">
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

      {/* Menu */}
      <Popover>
        <PopoverTrigger asChild>
          <button className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700">
            <DotsThreeVerticalIcon size={24} className="text-gray-700 dark:text-gray-300" />
          </button>
        </PopoverTrigger>

        <PopoverContent className="w-40 p-3">
          <ul className="space-y-2 ">
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

      {/* Members Dialog */}
      <Dialog open={showMembersDialog} onOpenChange={setShowMembersDialog}>
        <DialogContent className="w-[90vw] max-w-2xl border-border bg-background p-6 sm:p-8 mx-auto my-auto rounded-2xl">
          <DialogHeader className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="rounded-lg border border-border bg-background/50 p-2">
                <UserListIcon className="h-6 w-6 text-foreground" />
              </div>
              <DialogTitle className="text-2xl font-semibold text-foreground">
                Group Members
              </DialogTitle>
            </div>
            <DialogDescription className="text-muted-foreground text-left">
              View all members in this group.
            </DialogDescription>
          </DialogHeader>

          <ul className="mt-6 space-y-3 max-h-96 overflow-y-auto border-t border-border pt-4">
            {memberDetails && memberDetails.map((member) => (
              <Link
                key={member.id}
                href={`/${member.username}`}
                onClick={() => setShowMembersDialog(false)}
                className="flex items-center gap-3 rounded border bg-background/50 p-3 transition hover:bg-accent/50"
              >
                <Avatar>
                  <AvatarImage src={member.avatar} alt={member.username} />
                  <AvatarFallback>{member.username?.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-foreground font-medium">
                    {member.username}
                  </span>
                  {member.bio && (
                    <span className="text-sm text-muted-foreground truncate max-w-[200px]">
                      {member.bio}
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </ul>
        </DialogContent>
      </Dialog>


      {/* Review Dialog */}
      <Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
        <DialogContent className="w-[90vw] max-w-2xl border-border bg-background p-6 sm:p-8 mx-auto my-auto rounded-2xl">
          <DialogHeader className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="rounded-lg border border-border bg-background/50 p-2">
                <svg
                  className="h-6 w-6 text-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.91c.969 0 1.371 1.24.588 1.81l-3.974 2.888a1 1 0 00-.364 1.118l1.518 4.674c.3.921-.755 1.688-1.54 1.118l-3.975-2.888a1 1 0 00-1.175 0l-3.975 2.888c-.784.57-1.838-.197-1.539-1.118l1.518-4.674a1 1 0 00-.364-1.118L2.082 10.1c-.783-.57-.38-1.81.588-1.81h4.91a1 1 0 00.95-.69l1.519-4.674z"
                  />
                </svg>
              </div>
              <DialogTitle className="text-2xl font-semibold text-foreground">
                Rate Group
              </DialogTitle>
            </div>
            <DialogDescription className="text-muted-foreground text-left">
              Share your experience with this group.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 mt-6">
            {/* Star Rating */}
            <div className="flex items-center justify-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`text-5xl transition ${star <= rating
                    ? "text-yellow-400"
                    : "text-gray-400 dark:text-gray-500"
                    }`}
                >
                  ★
                </button>
              ))}
            </div>

            {/* Comment */}
            <div className="border-t border-border pt-6">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write your comment..."
                className="w-full min-h-[120px] rounded-xl border border-border bg-background text-foreground p-4 text-base focus:outline-none focus:ring-2 focus:ring-foreground/20 transition"
              />
            </div>

            <Button
              onClick={handleSubmitReview}
              disabled={isPending}
              className="h-12 w-full rounded-xl text-lg font-semibold"
            >
              {isPending ? "Submitting..." : "Submit Review"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>


      <SendTip open={showTipDialog} onOpenChange={setShowTipDialog} />

    </div>
  );
}
