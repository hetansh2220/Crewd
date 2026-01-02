"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import useTransfer from "@/hooks/use-transfer";
import client from "@/lib/stream";
import { GetReviewsByGroupId } from "@/server/review";
import { GetTipByGroupId } from "@/server/tips";
import { createTransaction } from "@/server/transaction";
import { GetUserByWallet } from "@/server/user";
import { usePrivy } from "@privy-io/react-auth";
import { useSignAndSendTransaction, useWallets } from "@privy-io/react-auth/solana";
import bs58 from "bs58";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Channel } from "stream-chat";
import { joinStreamChatChannel } from "@/server/stream";
import { getStreamToken } from "@/server/stream";

// Types
type UserData = {
  id: string;
  username: string;
  bio: string;
  walletAddress: string | null;
  avatar: string;
  createdAt: Date;
};

type Review = {
  id: string;
  groupId: string;
  reviewer: string;
  rating: number;
  comment: string;
  handle?: string;
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
  const [membersLoading, setMembersLoading] = useState(true); // ✅ NEW: Members skeleton state
  const { user } = usePrivy();
  const userId = user?.wallet?.address;
  const owner = groupData.owner;


  const [ownername, setOwnername] = useState<{ username: string; walletAddress: string | null } | null>(null);

  const { transfer } = useTransfer();
  const { signAndSendTransaction } = useSignAndSendTransaction();
  const { wallets } = useWallets();
  const router = useRouter();

  const [totalTips, setTotalTips] = useState<number>(0);

  const Members = Object.values(channel?.state?.members ?? {});

  if (Members.find((member) => member.user_id?.toLowerCase() === userId?.toLowerCase())) {
    if (!joined) setJoined(true);
  }

  // Reviews
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewersData, setReviewersData] = useState<Record<string, UserData>>({});
  const [loading, setLoading] = useState(true); // Review loading

  const stats = [
    { label: "REVIEWS", value: reviews.length, icon: "⭐" },
    { label: "ENTRY", value: `${Number(groupData.entryFee) == 0 ? "Free" : `${groupData.entryFee} SOL`}`, icon: "💰" },
    { label: "TIPS", value: `${totalTips === 0 ? 0 : totalTips.toFixed(4)} SOL`, icon: "💵" },
  ];

  // Owner info
  useEffect(() => {
    const fetchOwnerName = async () => {
      const ownerData = await GetUserByWallet(owner);
      setOwnername(ownerData);
    };
    fetchOwnerName();
  }, [owner]);

  // Reviews
  useEffect(() => {
    const fetchReviewsAndUsers = async () => {
      try {
        setLoading(true);
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
        setLoading(false);
      }
    };

    fetchReviewsAndUsers();
  }, [groupData.id]);

  // Tips
  useEffect(() => {
    const fetchTips = async () => {
      try {
        const tipsData = await GetTipByGroupId(groupData.id);
        const total = tipsData.reduce((sum, tip) => {
          const amount = parseFloat(tip.amount || "0");
          return sum + amount;
        }, 0);

        setTotalTips(total);
      } catch (err) {
        console.error("Error fetching tips:", err);
      }
    };

    fetchTips();
  }, [groupData.id]);

  // Init Chat Channel
  useEffect(() => {
    const initChannel = async () => {
      try {
        const token = await getStreamToken(owner);
        await client.connectUser({ id: owner }, token);
        const channel = client.channel("messaging", groupData.id);
        await channel.watch();
        setChannel(channel);
      } catch (err) {
        console.error("Error initializing channel:", err);
      } finally {
        setMembersLoading(false); // ✅ Turn off members skeleton
      }
    };

    initChannel();
  }, [userId, groupData.id, owner]);

  // Join
  const handleJoin = async () => {
    if (!user) {
      router.push("/login");
      return;
    }

    if (joined || joining) return;
    setJoining(true);

    try {
      let signatureHash: Uint8Array | undefined;

      if (Number(groupData.entryFee) > 0) {
        const transaction = await transfer(user.wallet!.address!, groupData.owner, Number(groupData.entryFee));

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

      await joinStreamChatChannel(user.wallet!.address!, groupData.owner, groupData.id);

      await createTransaction({
        userId: user.wallet!.address!,
        groupId: groupData.id,
        transaction: signatureHash ? bs58.encode(Buffer.from(signatureHash)) : "",
        amount: Number(groupData.entryFee),
      });

      router.push("/dashboard");
      setJoined(true);
    } catch (err) {
      console.error("Error joining:", err);
    } finally {
      setJoining(false);
    }
  };
  const membershipProgress = Math.min(
    ((channel?.data?.member_count || 0) / groupData.maxMembers) * 100,
    100
  );

  return (
    <div className="min-h-screen bg-background m-2 flex flex-col pb-40">
      {/* Main */}
      <main className="flex-1 px-4 sm:px-8 py-8 sm:py-12 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">

          {/* LEFT */}
          <div className="md:col-span-8 order-2 md:order-1 space-y-6 sm:space-y-8">

            {/* Title */}
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">{groupData.name}</h1>
              <p className="text-gray-600 text-sm">
                By <span className="font-medium">{ownername?.username || "0x..."}</span>
              </p>
            </div>

            {/* Stats */}
            {/* Stats */}
            <div className="rounded-2xl border border-white/10 px-6 py-4 bg-background">
              <div
                className="
      grid grid-cols-1 sm:grid-cols-3 
      justify-items-center text-center 
      sm:divide-x sm:divide-white/10
      gap-8
    "
              >
                {stats.map((stat, idx) => (
                  <div key={idx} className="flex flex-col items-center space-y-2 py-4 w-full">
                    {/* LABEL */}
                    <p className="text-xs tracking-wide text-gray-400 uppercase">
                      {stat.label}
                    </p>

                    {/* VALUE */}
                    <p className="text-4xl font-semibold text-white">
                      {stat.value}
                    </p>

                    {/* EXTRA ROWS BASED ON INDEX */}
                    {idx === 0 && (
                      <p className="text-yellow-400 text-md">★★★★★</p>
                    )}

                    {idx === 1 && (
                      <p className="text-gray-400 text-sm">{Number(groupData.entryFee) === 0 ? "" : "SOL"}</p>
                    )}

                    {idx === 2 && (
                      <p className="text-gray-400 text-sm">Sent</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* About */}
            <div className="space-y-3">
              <h2 className="text-lg font-bold">About</h2>
              <p className="text-gray-400">{groupData.description}</p>
            </div>

            {/* Members */}
            <div className="space-y-3">
              <h2 className="text-lg font-bold">
                {Members.length} {Members.length === 1 ? "Member" : "Members"}
              </h2>

              <div className="flex flex-wrap gap-2">
                {membersLoading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton key={i} className="h-10 w-10 rounded-full" />
                  ))
                ) : Members.length > 0 ? (
                  Members.map((member) => (
                    <Link
                      key={member.user_id}
                      href={`/${member.user?.name || "user"}`}
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={member.user?.image || undefined} alt={member.user?.name || "Member"} />
                        <AvatarFallback>
                          {member.user?.name?.charAt(0)?.toUpperCase() || "M"}
                        </AvatarFallback>
                      </Avatar>
                    </Link>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No members yet.</p>
                )}
              </div>
            </div>

            {/* Reviews */}
            <div className="space-y-4">
              <h2 className="text-lg font-bold">Reviews</h2>

              {loading ? (
                <div className="space-y-4 animate-pulse">
                  {Array.from({ length: 2 }).map((_, i) => (
                    <div
                      key={i}
                      className="flex gap-3 bg-gray-100 dark:bg-white/5 p-4 rounded-lg border"
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
                        className="flex gap-4 bg-gray-100 dark:bg-white/5 p-4 rounded-lg border"
                      >
                        <Link href={`/${reviewerInfo?.username}`}>
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={reviewerInfo?.avatar} />
                            <AvatarFallback>{reviewerInfo?.username?.[0]}</AvatarFallback>
                          </Avatar>
                        </Link>

                        <div className="flex-1">
                          <p className="font-semibold">{reviewerInfo?.username || "Anonymous"}</p>
                          <p className="text-sm text-gray-400">{review.comment}</p>
                          <p className="text-xs text-gray-500">{review.handle}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No reviews yet.</p>
              )}
            </div>
          </div>

          {/* RIGHT */}
          <div className="md:col-span-4 order-1 md:order-2">
            <div className="aspect-square rounded-2xl  p-6 overflow-hidden">
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
      <footer className="fixed bottom-0 left-0 right-0 bg-background border-t">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-end gap-8">
          <div className="flex-1">
            <h3 className="text-sm font-semibold">Members Progress</h3>
            <div className="w-full bg-gray-300 rounded-full h-2 overflow-hidden">
              <div
                className="bg-primary h-full rounded-full"
                style={{ width: `${membershipProgress}%` }}
              />
            </div>
            <p className="text-sm text-gray-600">
              {groupData.maxMembers - Members.length} spots left out of {groupData.maxMembers}
            </p>
          </div>

          <Button
            onClick={handleJoin}
            disabled={joining || joined}
            className="bg-primary text-white px-12 h-11 text-lg"
          >
            {joining ? "Joining..." : joined ? "Joined" : "Join"}
          </Button>
        </div>
      </footer>
    </div>
  );
}
