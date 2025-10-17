"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Share2, Star } from "lucide-react";
import stream from "@/lib/stream";
import { usePrivy } from "@privy-io/react-auth";
import { useChatContext } from "stream-chat-react";
import { Channel } from "stream-chat-react";
import { redirect } from "next/dist/server/api-utils";
import { GetUserByWallet } from "@/server/user";

interface FeaturedDetailsProps {
  groupData: {
    id: string;
    name: string;
    description: string;
    image: string;
    maxMembers: number;
    entryFee: number;
    owner: string;
    createdAt: Date;
  };
}

export default function FeaturedDetails({ groupData }: FeaturedDetailsProps) {
  const [joining, setJoining] = useState(false);
  const [joined, setJoined] = useState(false);
  const [channel, setChannel] = useState(null as any);
  const { user } = usePrivy();
  const userId = user?.wallet?.address || "guest";
  const owner = groupData.owner;
  const membershipProgress = 92;
  const [ownername, setOwnername] = useState<{ username: string, walletAddress: string | null } | null>(null);

  const stats = [
    { label: "REVIEWS", value: "5.0", icon: "⭐" },
    { label: "ENTRY", value: `0.0005 ETH`, icon: "💰" },
    { label: "TIPS", value: "$127", icon: "💵" },
    { label: "STAKED", value: "65K", icon: "🔒" },
  ];

  const members = [
    { initials: "ZA", color: "bg-cyan-500" },
    { initials: "AB", color: "bg-purple-500" },
    { initials: "CD", color: "bg-pink-500" },
    { initials: "EF", color: "bg-yellow-500" },
    { initials: "GH", color: "bg-orange-500" },
    { initials: "IJ", color: "bg-purple-600" },
    { initials: "KL", color: "bg-gray-600" },
    { initials: "MN", color: "bg-blue-500" },
  ];

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

  useEffect(() => {
    const initChannel = async () => {
      if (!user) return;
      console.log(ownername, "ownername");
      try {
        await stream.connectUser(
          { id: ownername?.walletAddress || "guest" },
          stream.devToken(ownername?.walletAddress || "guest")
        );

        const channel = stream.channel("team", groupData.id);
        await channel.watch();
        setChannel(channel);

        const memberIds = Object.keys(channel.state.members);
        if (memberIds.includes(ownername?.walletAddress || "guest")) {
          setJoined(true);
        }

        console.log(channel.state.members, "members loaded");
      } catch (err) {
        console.error("Error initializing channel:", err);
      }
    };

    initChannel();
  }, [user, ownername, groupData.id]);

  const handleJoin = async () => {
    if (!user || joined) return;
    setJoining(true);

    try {
      await channel.addMembers([userId || "guest"]);
      setJoined(true);
      console.log(`User ${userId} joined channel ${groupData.id}`);
    } catch (err) {
      console.error("Error joining channel:", err);
    } finally {
      setJoining(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-gray-900 dark:text-white flex flex-col pb-40">
      {/* Main Content */}
      <main className="flex-1 px-4 sm:px-8 py-8 sm:py-12 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Left Content */}
          <div className="lg:col-span-8 space-y-6 sm:space-y-8">
            {/* Title Section */}
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">{groupData.name}</h1>
                <div className="flex gap-2">
                  <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-white/20 flex items-center justify-center text-sm">✓</div>
                  <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-white/20 flex items-center justify-center text-sm">⚙</div>
                </div>
              </div>
              <p className="text-gray-600 dark:text-slate-400 text-sm sm:text-base">
                By <span className="text-gray-900 dark:text-white font-medium">{ownername?.username || "0x..."}</span>
              </p>
            </div>

            {/* Stats Grid */}
            <div className="bg-gray-100 dark:bg-slate-800/50 rounded-xl border border-gray-300 dark:border-slate-700/50 p-4 sm:p-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-gray-300 dark:divide-slate-600/50">
                {stats.map((stat, idx) => (
                  <div key={idx} className="px-3 sm:px-6 py-4 sm:py-0 first:pl-0 last:pr-0 sm:[&:nth-child(1)]:pl-0 sm:[&:nth-child(2)]:pl-6 sm:[&:nth-child(3)]:pl-6 sm:[&:nth-child(4)]:pl-6 [&:nth-child(1)]:pt-0 [&:nth-child(2)]:pt-0 sm:[&:nth-child(3)]:pt-0 sm:[&:nth-child(4)]:pt-0 [&:nth-child(3)]:pb-0 [&:nth-child(4)]:pb-0">
                    <div className="text-center space-y-1 sm:space-y-2">
                      <p className="text-xs text-gray-500 dark:text-slate-400 uppercase tracking-wider">{stat.label}</p>
                      <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                      <p className="text-xs text-gray-500 dark:text-slate-400">
                        {idx === 0 && "⭐⭐⭐⭐⭐"}
                        {idx === 1 && "Per Year"}
                        {idx === 2 && "Sent"}
                        {idx === 3 && "42nd Overall"}
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
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">768 Members</h2>
              <div className="flex flex-wrap gap-2">
                {members.map((member, idx) => (
                  <Avatar key={idx} className="w-8 h-8 sm:w-10 sm:h-10 border-2 border-gray-300 dark:border-slate-700">
                    <AvatarFallback className={`${member.color} text-white text-xs font-bold`}>
                      {member.initials}
                    </AvatarFallback>
                  </Avatar>
                ))}
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-200 dark:bg-slate-800 border-2 border-gray-300 dark:border-slate-700 flex items-center justify-center text-xs font-bold text-gray-700 dark:text-slate-300">
                  +758
                </div>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">35 Reviews</h2>
              <div className="space-y-4">
                {reviews.map((review, idx) => (
                  <div key={idx} className="flex gap-3 sm:gap-4 bg-gray-100 dark:bg-white/5 p-3 sm:p-4 rounded-lg border border-gray-300 dark:border-slate-800">
                    <Avatar className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0">
                      <AvatarImage src={review.avatar} alt={review.author} />
                      <AvatarFallback className="bg-gray-300 dark:bg-slate-700 text-gray-900 dark:text-white">{review.author[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-sm sm:text-base truncate text-gray-900 dark:text-white">{review.author}</p>
                        <div className="flex gap-0.5 flex-shrink-0">
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
            <div className="aspect-square rounded-2xl bg-gradient-to-br from-purple-100 to-gray-200 dark:from-purple-600/20 dark:to-slate-900 border border-gray-300 dark:border-slate-700 p-6 sm:p-8 flex items-center justify-center overflow-hidden">
              <img
                src={groupData.image}
                alt={groupData.name}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>

            {/* Share Button */}
            <Button className="w-full bg-gray-200 hover:bg-gray-300 dark:bg-white/10 dark:hover:bg-white/20 text-gray-900 dark:text-white border border-gray-300 dark:border-slate-700 gap-2">
              <Share2 className="w-4 h-4" />
              Share Link
            </Button>
          </div>
        </div>
      </main>

      {/* Footer - Membership Bar */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-black/80 backdrop-blur-sm border-t border-gray-300 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4 sm:py-6 flex flex-col sm:flex-row items-stretch sm:items-end gap-4 sm:gap-8">
          <div className="flex-1 space-y-2">
            <h3 className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-slate-300">Memberships Left</h3>
            <div className="w-full bg-gray-300 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-purple-500 to-purple-600 h-full rounded-full transition-all"
                style={{ width: `${membershipProgress}%` }}
              />
            </div>
            <p className="text-xs text-gray-600 dark:text-slate-400">9218/10000</p>
          </div>

          {/* Join Button */}
          <Button
            onClick={handleJoin}
            disabled={joining || joined}
            className="bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white px-8 sm:px-12 h-10 sm:h-11 rounded-full font-semibold text-base sm:text-lg w-full sm:w-auto"
          >
            {joining ? "Joining..." : joined ? "Joined" : "Join"}
          </Button>
        </div>
      </footer>
    </div>
  );
}