"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";
import stream from "@/lib/stream";
import { usePrivy } from "@privy-io/react-auth";
import { GetUserByWallet } from "@/server/user";
import { Channel } from "stream-chat";
import Image from "next/image";
import useTransfer from "@/hooks/use-transfer";
import { useSignAndSendTransaction, useWallets } from '@privy-io/react-auth/solana';
import { createTransaction } from "@/server/transaction";
import { useRouter } from "next/navigation";
import bs58 from 'bs58';

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
  const { user } = usePrivy();
  const userId = user?.wallet?.address || "guest";
  const owner = groupData.owner;
  const membershipProgress = 92;
  const [ownername, setOwnername] = useState<{ username: string, walletAddress: string | null } | null>(null);
  const { transfer } = useTransfer();
  const { signAndSendTransaction } = useSignAndSendTransaction();
  const { wallets } = useWallets();
  const router = useRouter();

  const stats = [
    { label: "REVIEWS", value: "5.0", icon: "⭐" },
    { label: "ENTRY", value: groupData.entryFee, icon: "💰" },
    { label: "TIPS", value: "$127", icon: "💵" },
    { label: "STAKED", value: "65K", icon: "🔒" },
  ];
  console.log(channel, "channel initialized");

  const reviews = [
    {
      author: "ZenMaster",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ZenMaster",
      rating: 5,
      text: "Amazing community, always dropping useful content and insights.",
      handle: "0x4A6...F41",
    },
    {
      author: "CryptoEnthusiast",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=CryptoEnthusiast",
      rating: 5,
      text: "Great place to be part of something meaningful!",
      handle: "0xfE9...4AE",
    },
  ];

  useEffect(() => {
    const fetchOwnerName = async () => {
      const ownerData = await GetUserByWallet(owner);
      console.log(ownerData, "owner details");
      setOwnername(ownerData);
    };
    fetchOwnerName();
  }, [owner]);

  console.log(channel, "channel initialized");


  useEffect(() => {
    const initChannel = async () => {
      if (!user) return;

      try {
        await stream.connectUser(
          { id: owner || "guest" },
          stream.devToken(owner || "guest")
        );

        const channel = stream.channel("messaging", groupData.id);
        await channel.watch();
        setChannel(channel);
        console.log(channel, "channel initialized");
        const memberIds = Object.values(channel.state.members);
        console.log(memberIds, "member ids", user.wallet?.address);
        if (memberIds.find((member) => member.user_id === user.wallet?.address)) {
          setJoined(true);
        }

        console.log(channel.state.members, "members loaded");
      } catch (err) {
        console.error("Error initializing channel:", err);
      }
    };

    initChannel();
  }, [user, userId, groupData.id, ownername, owner]);

  console.log(wallets[0]?.address, "wallet address");

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
          transaction: new Uint8Array(transaction.serialize({
            requireAllSignatures: false,
          })),
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
      console.log(`User ${user.wallet!.address!} joined group ${groupData.id}`);
    } catch (err) {
      console.error("Error joining channel:", err);
    } finally {
      setJoining(false);
    }
  };

  const members = channel?.state?.members
    ? Object.values(channel.state.members).slice(0, 8).map((member) => {
      const initial = member.user && typeof member.user.id === "string"
        ? member.user.id.slice(0, 2).toUpperCase()
        : "XX";
      return { initial, id: member.user?.id || null };

    })
    : [];


  return (
    <div className="min-h-screen bg-background  m-2 flex flex-col pb-40">
      {/* Main Content */}
      <main className="flex-1 px-4 sm:px-8 py-8 sm:py-12 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Left Content */}
          <div className="lg:col-span-8 space-y-6 sm:space-y-8">
            {/* Title Section */}
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">{groupData.name}</h1>
              </div>
              <p className="text-gray-600 dark:text-slate-400 text-sm sm:text-base">
                By <span className="text-gray-900 dark:text-white font-medium">{ownername?.username || "0x..."}</span>
              </p>
            </div>

            {/* Stats Grid */}
            <div className="bg-gray-100 dark:bg-slate-800/50 rounded-xl border border-gray-300 dark:border-slate-700/50 p-4 sm:p-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-gray-300 dark:divide-slate-600/50">
                {stats.map((stat, idx) => (
                  <div key={idx} className="px-3 sm:px-6 py-4 sm:py-0 first:pl-0 last:pr-0 sm:nth-1:pl-0 m:nth-2:pl-6 sm:nth-3:pl-6 sm:nth-4:pl-6 nth-1:pt-0 nth-2:pt-0 sm:nth-3:pt-0 sm:nth-4:pt-0 nth-3:pb-0 nth-4:pb-0">
                    <div className="text-center space-y-1 sm:space-y-2">
                      <p className="text-xs text-gray-500 dark:text-slate-400 uppercase tracking-wider">{stat.label}</p>
                      <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                      <p className="text-xs text-gray-500 dark:text-slate-400">
                        {idx === 0 && "⭐⭐⭐⭐⭐"}
                        {idx === 1 && "SOL"}
                        {idx === 2 && "Sent"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* About Section */}
            <div className="space-y-3">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">About</h2>
              <p className="text-gray-700 dark:text-slate-300 leading-relaxed text-sm sm:text-base">{groupData.description}</p>
            </div>

            {/* Members Section */}
            <div className="space-y-3">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">{members.length} Members</h2>
              <div className="flex flex-wrap gap-2">
                {members.map((member, idx) => {
                  const seed = member.id || member.initial; // unique seed for each member
                  const avatarUrl = `https://api.dicebear.com/9.x/thumbs/svg?seed=${seed}`;
                  return (
                    <Avatar key={idx} className="w-8 h-8 sm:w-10 sm:h-10 border-2 border-gray-300 dark:border-slate-700">
                      <AvatarImage src={avatarUrl} alt={member.id || "Member"} />
                      <AvatarFallback className="bg-gray-500 text-white text-xs font-bold">
                        {member.initial}
                      </AvatarFallback>
                    </Avatar>
                  );
                })}
              </div>
            </div>

            {/* Reviews Section */}
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">35 Reviews</h2>
              <div className="space-y-4">
                {reviews.map((review, idx) => (
                  <div key={idx} className="flex gap-3 sm:gap-4 bg-gray-100 dark:bg-white/5 p-3 sm:p-4 rounded-lg border border-gray-300 dark:border-slate-800">
                    <Avatar className="w-10 h-10 sm:w-12 sm:h-12 shrink-0">
                      <AvatarImage src={review.avatar} alt={review.author} />
                      <AvatarFallback className="bg-gray-300 dark:bg-slate-700 text-gray-900 dark:text-white">{review.author[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-sm sm:text-base truncate text-gray-900 dark:text-white">{review.author}</p>
                        <div className="flex gap-0.5 shrink-0">
                          {Array(review.rating)
                            .fill(0)
                            .map((_, i) => (
                              <Star key={i} className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400" />
                            ))}
                        </div>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-700 dark:text-slate-300 mb-1">{review.text}</p>
                      <p className="text-xs text-gray-500 dark:text-slate-500">{review.handle}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-4 space-y-4 xl:pl-8">
            {/* Logo Card */}
            <div className="aspect-square rounded-2xl bg-background border p-6 sm:p-8 flex items-center justify-center overflow-hidden">
              <Image
                src={groupData.image}
                width={400}
                height={400}
                alt={groupData.name}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>

            {/* Share Button */}
            {/* <Button className="w-full bg-gray-200 hover:bg-gray-300 dark:bg-white/10 dark:hover:bg-white/20 text-gray-900 dark:text-white border border-gray-300 dark:border-slate-700 gap-2">
              <Share2 className="w-4 h-4" />
              Share Link
            </Button> */}
          </div>
        </div>
      </main>

      {/* Footer - Membership Bar */}
      <footer className="fixed bottom-0 left-0 right-0 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4 sm:py-6 flex flex-col sm:flex-row items-stretch sm:items-end gap-4 sm:gap-8">
          <div className="flex-1 space-y-2">
            <h3 className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-slate-300">Members Left</h3>
            <div className="w-full bg-gray-300 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
              <div
                className="bg-primary rounded-full transition-all"
                style={{ width: `${membershipProgress}%` }}
              />
            </div>
            <p className="text-xs text-gray-600 dark:text-slate-400">9218/10000</p>
          </div>

          {/* Join Button */}
          <Button
            onClick={handleJoin}
            disabled={joining || joined}
            className="bg-primary text-white px-8 sm:px-12 h-10 sm:h-11 rounded-full font-semibold text-base sm:text-lg w-full sm:w-auto"
          >
            {joining ? "Joining..." : joined ? "Joined" : "Join"}
          </Button>
        </div>
      </footer>
    </div>
  );
}