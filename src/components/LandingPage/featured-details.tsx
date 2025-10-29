"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import stream from "@/lib/stream";
import { usePrivy } from "@privy-io/react-auth";
import { GetUserByWallet } from "@/server/user";
import { Channel } from "stream-chat";
import Image from "next/image";
import useTransfer from "@/hooks/use-transfer";
import { useSignAndSendTransaction, useWallets } from "@privy-io/react-auth/solana";
import { createTransaction } from "@/server/transaction";
import { useRouter } from "next/navigation";
import bs58 from "bs58";
import { GetReviewsByGroupId } from "@/server/review";
import { GetTips } from "@/server/tips";

// Type definitions
type UserData = {
  id: string;
  username: string;
  bio: string;
  walletAddress: string | null;
  avatar: string;
  createdAt: Date;
};

// Update the Review type definition
type Review = {
  id: string;
  groupId: string;
  reviewer: string;
  rating: number;
  comment: string;
  handle?: string;  // Make handle optional
  createdAt: Date;
};




interface FeaturedDetailsProps {
  groupData: {
    id: string;
    name: string;
    description: string;
    image: string;
    maxMembers: number;
    entryFee: string;
    owner: string;
    createdAt: Date;
  };
}

export default function FeaturedDetails({ groupData }: FeaturedDetailsProps) {
  const [joining, setJoining] = useState(false);
  const [joined, setJoined] = useState(false);
  const [channel, setChannel] = useState<Channel>();
  const { user, ready } = usePrivy();
  const userId = user?.wallet?.address || "guest";
  const owner = groupData.owner;
  const membershipProgress = 92;
  const [ownername, setOwnername] = useState<{ username: string; walletAddress: string | null } | null>(null);
  const { transfer } = useTransfer();
  const { signAndSendTransaction } = useSignAndSendTransaction();
  const { wallets } = useWallets();
  const router = useRouter();
  const [totalTips, setTotalTips] = useState<number>(0);

  // Reviews
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewersData, setReviewersData] = useState<Record<string, UserData>>({});
  const [loadingReviews, setLoadingReviews] = useState(true);

  const stats = [
    { label: "REVIEWS", value: reviews.length, icon: "⭐" },
    { label: "ENTRY", value: groupData.entryFee, icon: "💰" },
    { label: "TIPS", value: `${totalTips.toFixed(4)} SOL`, icon: "💵" },
  ];

  // Owner info
  useEffect(() => {
    const fetchOwnerName = async () => {
      const ownerData = await GetUserByWallet(owner);
      setOwnername(ownerData);
    };
    fetchOwnerName();
  }, [owner]);

  // Reviews + reviewer usernames
  useEffect(() => {
    const fetchReviewsAndUsers = async () => {
      try {
        setLoadingReviews(true);
        const fetchedReviews = await GetReviewsByGroupId(groupData.id);
        setReviews(fetchedReviews);

        const uniqueWallets = Array.from(new Set(fetchedReviews.map((r) => r.reviewer)));
        const reviewerResults = await Promise.all(
          uniqueWallets.map(async (wallet) => {
            const data = await GetUserByWallet(wallet);
            return { wallet, data };
          })
        );

        const reviewerMap = reviewerResults.reduce((acc, { wallet, data }) => {
          acc[wallet] = data;
          return acc;
        }, {} as Record<string, UserData>);

        setReviewersData(reviewerMap);
      } catch (err) {
        console.error("Error loading reviews:", err);
      } finally {
        setLoadingReviews(false);
      }
    };

    fetchReviewsAndUsers();
  }, [groupData.id]);

  // Fetch and sum up all tips
  const GetTipsData = async () => {
    try {
      const tipsData = await GetTips();
      const total = tipsData.reduce((sum, tip) => {
        const amount = parseFloat(tip.amount || "0");
        return sum + amount;
      }, 0);

      setTotalTips(total);
    } catch (err) {
      console.error("Error fetching tips:", err);
    }
  };

  useEffect(() => {
    GetTipsData();
    const interval = setInterval(GetTipsData, 10000);
    return () => clearInterval(interval);
  }, []);

  // Init Stream Chat
  useEffect(() => {
    const initChannel = async () => {
      try {
        await stream.connectUser(
          { id: owner || "guest" },
          stream.devToken(owner || "guest")
        );
        const channel = stream.channel("messaging", groupData.id);
        await channel.watch();
        setChannel(channel);

        const memberList = Object.values(channel.state.members);
        if (memberList.find((member) => member.user_id === userId)) {
          setJoined(true);
        }
      } catch (err) {
        console.error("Error initializing channel:", err);
      }
    };

    initChannel();
  }, [user, userId, groupData.id, owner, groupData.maxMembers]);

  // Join logic
  const handleJoin = async () => {
    if (!user) {
      router.push("/login");
      return;
    }

    if (joined || joining) return;
    setJoining(true);

    try {
      let signatureHash: Uint8Array<ArrayBufferLike> | undefined;

      if (Number(groupData.entryFee) > 0) {
        const transaction = await transfer(
          user.wallet!.address!,
          groupData.owner,
          Number(groupData.entryFee)
        );

        const { signature } = await signAndSendTransaction({
          transaction: new Uint8Array(
            transaction.serialize({
              requireAllSignatures: false,
            })
          ),
          wallet: wallets[0],
        });

        signatureHash = signature;
      }

      await channel?.addMembers([user.wallet!.address!]);

      await createTransaction({
        userId: user.wallet!.address!,
        groupId: groupData.id,
        transaction: signatureHash ? bs58.encode(Buffer.from(signatureHash)) : "",
        amount: Number(groupData.entryFee),
      });

      setJoined(true);
    } catch (err) {
      console.error("Error joining channel:", err);
    } finally {
      setJoining(false);
    }
  };

  // Members
  const members = channel?.state?.members
    ? Object.values(channel.state.members)
        .slice(0, 8)
        .map((member) => {
          const initial =
            member.user && typeof member.user.id === "string"
              ? member.user.id.slice(0, 2).toUpperCase()
              : "XX";
          return { initial, id: member.user?.id || null };
        })
    : [];

  // Show skeleton while not ready
  if (!ready) {
    return (
      <div className="min-h-screen bg-background m-2 flex flex-col pb-40 animate-pulse">
        <main className="flex-1 px-4 sm:px-8 py-8 sm:py-12 max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
            <div className="md:col-span-8 space-y-6 sm:space-y-8">
              <Skeleton className="h-8 w-1/3" /> {/* Title */}
              <Skeleton className="h-4 w-1/4" /> {/* Owner */}

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                <Skeleton className="h-20 rounded-lg" />
                <Skeleton className="h-20 rounded-lg" />
                <Skeleton className="h-20 rounded-lg" />
              </div>

              {/* About */}
              <Skeleton className="h-6 w-1/5" />
              <Skeleton className="h-20 w-full rounded-lg" />

              {/* Members */}
              <Skeleton className="h-6 w-1/4" />
              <div className="flex gap-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 w-10 rounded-full" />
                ))}
              </div>

              {/* Reviews */}
              <Skeleton className="h-6 w-1/5" />
              {Array.from({ length: 2 }).map((_, i) => (
                <Skeleton key={i} className="h-20 w-full rounded-lg" />
              ))}
            </div>

            {/* Right Sidebar */}
            <div className="md:col-span-4 space-y-4 xl:pl-8">
              <Skeleton className="h-[400px] w-full rounded-xl" />
            </div>
          </div>
        </main>

        <footer className="fixed bottom-0 left-0 right-0 bg-background border-t border-gray-200 dark:border-slate-700 p-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-10 w-24 rounded-lg" />
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background m-2 flex flex-col pb-40">
      {/* Main Content */}
      <main className="flex-1 px-4 sm:px-8 py-8 sm:py-12 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
          {/* Left Content - Second on mobile, First on tablet+ */}
          <div className="md:col-span-8 order-2 md:order-1 space-y-6 sm:space-y-8">
            {/* Title */}
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                {groupData.name}
              </h1>
              <p className="text-gray-600 dark:text-slate-400 text-sm sm:text-base">
                By{" "}
                <span className="text-gray-900 dark:text-white font-medium">
                  {ownername?.username || "0x..."}
                </span>
              </p>
            </div>

            {/* Stats */}
            <div className="bg-gray-100 dark:bg-slate-800/50 rounded-2xl border border-gray-300 dark:border-slate-700/50 p-4 sm:p-6">
              <div
                className="
                  grid
                  grid-cols-1
                  xs:grid-cols-2
                  md:grid-cols-3
                  gap-4 sm:gap-6
                  text-center
                "
              >
                {stats.map((stat, idx) => (
                  <div
                    key={idx}
                    className="
                      flex flex-col items-center justify-center
                       lg:border-r
                       md:border-r
                       
                      p-4 sm:p-5
                      shadow-sm
                    "
                  >
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                      {stat.label}
                    </p>
                    <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                      {stat.value}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
                      {idx === 0 && "⭐⭐⭐⭐⭐"}
                      {idx === 1 && "SOL"}
                      {idx === 2 && "Sent"}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* About */}
            <div className="space-y-3">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                About
              </h2>
              <p className="text-gray-700 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
                {groupData.description}
              </p>
            </div>

            {/* Members */}
            <div className="space-y-3">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                {members.length} Members
              </h2>
              <div className="flex flex-wrap gap-2">
                {members.map((member, idx) => {
                  const seed = member.id || member.initial;
                  const avatarUrl = `https://api.dicebear.com/9.x/thumbs/svg?seed=${seed}`;
                  return (
                    <Avatar
                      key={idx}
                      className="w-8 h-8 sm:w-10 sm:h-10 border-2 border-gray-300 dark:border-slate-700"
                    >
                      <AvatarImage src={avatarUrl} alt={member.id || "Member"} />
                      <AvatarFallback className="bg-gray-500 text-white text-xs font-bold">
                        {member.initial}
                      </AvatarFallback>
                    </Avatar>
                  );
                })}
              </div>
            </div>

            {/* Reviews */}
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Reviews</h2>

              {loadingReviews ? (
                <div className="space-y-4 animate-pulse">
                  {Array.from({ length: 2 }).map((_, i) => (
                    <div
                      key={i}
                      className="flex gap-3 sm:gap-4 bg-gray-100 dark:bg-white/5 p-3 sm:p-4 rounded-lg border border-gray-300 dark:border-slate-800"
                    >
                      <Skeleton className="h-12 w-12 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-1/3" />
                        <Skeleton className="h-3 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : reviews.length > 0 ? (
                <div className="space-y-4">
                  {reviews.map((review, idx) => {
                    const reviewerInfo = reviewersData[review.reviewer];
                    return (
                      <div
                        key={idx}
                        className="flex gap-3 sm:gap-4 bg-gray-100 dark:bg-white/5 p-3 sm:p-4 rounded-lg border border-gray-300 dark:border-slate-800"
                      >
                        <Avatar className="w-10 h-10 sm:w-12 sm:h-12 shrink-0">
                          <AvatarImage
                            src={reviewerInfo?.avatar}
                            alt={reviewerInfo?.username}
                          />
                          <AvatarFallback className="bg-gray-300 dark:bg-slate-700 text-gray-900 dark:text-white">
                            {reviewerInfo?.username?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-semibold text-sm sm:text-base truncate text-gray-900 dark:text-white">
                              {reviewerInfo?.username || "Anonymous"}
                            </p>
                          </div>
                          <p className="text-xs sm:text-sm text-gray-700 dark:text-slate-300 mb-1">
                            {review.comment}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-slate-500">
                            {review.handle}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-gray-500 dark:text-slate-400">
                  No reviews yet.
                </p>
              )}
            </div>
          </div>

          {/* Right Sidebar Image - First on mobile, Second on tablet+ */}
          <div className="md:col-span-4 order-1 md:order-2 space-y-4 xl:pl-8">
            <div className="aspect-square rounded-2xl bg-background border p-6 sm:p-8 flex items-center justify-center overflow-hidden">
              <Image
                src={groupData.image}
                width={400}
                height={400}
                alt={groupData.name}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4 sm:py-6 flex flex-col sm:flex-row items-stretch sm:items-end gap-4 sm:gap-8">
          <div className="flex-1 space-y-2">
            <h3 className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-slate-300">
              Members Left
            </h3>
            <div className="w-full bg-gray-300 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
              <div
                className="bg-primary rounded-full transition-all"
                style={{ width: `${membershipProgress}%` }}
              />
            </div>
            <p className="text-xs text-gray-600 dark:text-slate-400">
              {members.map(m => m.id).length}/{groupData.maxMembers}
            </p>
          </div>

          <Button
            onClick={handleJoin}
            disabled={joining || joined}
            className="bg-primary text-white px-8 sm:px-12 h-10 sm:h-11 font-semibold text-base sm:text-lg w-full sm:w-auto"
          >
            {joining ? "Joining..." : joined ? "Joined" : "Join"}
          </Button>
        </div>
      </footer>
    </div>
  );
}
