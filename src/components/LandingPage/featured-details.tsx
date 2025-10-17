"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import stream from "@/lib/stream";
import { usePrivy } from "@privy-io/react-auth";
import { useChatContext } from "stream-chat-react";
import { Channel } from "stream-chat-react";
import { redirect } from "next/dist/server/api-utils";
import { GetUserByWallet } from "@/server/user";
import { User } from "lucide-react";

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
  console.log(groupData, "group data in featured details");
  const membershipProgress = 70;
  const [ownerName, setOwnerName] = useState<{ username: string } | null>(null);

  useEffect(() => {
    const fetchOwnerName = async () => {
      const ownerDetails = await GetUserByWallet(owner);
      console.log(ownerDetails, "owner details");
      setOwnerName({
        username: ownerDetails.username,
      });
    };
    fetchOwnerName();
  }, [owner]);

  console.log(channel, "channel state");

  useEffect(() => {
    const initChannel = async () => {
      if (!user) return;

      try {
        // Connect current user
        await stream.connectUser(
          { id: owner || "guest" },
          stream.devToken(owner || "guest")
        );

        // Get channel and watch it
        const channel = stream.channel("messaging", groupData.id);
        await channel.watch();
        setChannel(channel);

        // Check if current user is already a member
        const memberIds = Object.values(channel.state.members);
        console.log(memberIds, "member IDs");
        if (memberIds.includes(userId)) {
          setJoined(true);
        }

        console.log(channel.state.members, "members loaded");
      } catch (err) {
        console.error("Error initializing channel:", err);
      }
    };

    initChannel();
  }, [user, userId, groupData.id]);

  const handleJoin = async () => {
    if (!user || joined) return;
    setJoining(true);

    try {
      await channel.addMembers([userId]);
      setJoined(true);
      console.log(`User ${userId} joined channel ${groupData.id}`);
    } catch (err) {
      console.error("Error joining channel:", err);
    } finally {
      setJoining(false);
    }
  };




  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 via-zinc-800 to-zinc-900 text-white">
      <div className="max-w-6xl mx-auto py-8 px-4 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold mb-2">{groupData.name}</h1>
          <p className="text-sm text-zinc-400">
            Created by <span className="text-zinc-200">{ownerName?.username}</span>
          </p>
        </div>

        {/* Image and Stats */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-xs text-muted-foreground mb-1">ENTRY FEE</p>
              <p className="text-2xl font-bold">${groupData.entryFee}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-xs text-muted-foreground mb-1">MAX MEMBERS</p>
              <p className="text-2xl font-bold">{groupData.maxMembers}</p>
            </CardContent>
          </Card>

          <div className="md:col-span-2">
            <Card>
              <CardContent className="p-2">
                <img
                  src={groupData.image}
                  alt={groupData.name}
                  className="w-full rounded-lg object-cover"
                />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* About Section */}
        <Card>
          <CardHeader>
            <CardTitle>About</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-zinc-300 leading-relaxed">{groupData.description}</p>
          </CardContent>
        </Card>

        {/* Membership Progress Bar */}
        <div className="fixed bottom-0 left-0 w-full bg-zinc-900/90 backdrop-blur-md border-t border-zinc-800 p-4 flex justify-center">
          <div className="w-full max-w-2xl flex flex-col items-center">
            <div className="flex justify-between w-full text-sm mb-2 px-1">
              <span className="text-zinc-400">Memberships Left</span>
              <span className="font-medium text-zinc-200">7/10</span>
            </div>

            <div className="relative w-full h-2 bg-zinc-700 rounded-full overflow-hidden mb-3">
              <div
                className="absolute top-0 left-0 h-full bg-green-500 transition-all duration-500 ease-in-out"
                style={{ width: `${membershipProgress}%` }}
              />
            </div>

            <Button
              className="w-full max-w-sm bg-[#00FFA3] hover:bg-[#00e69b] text-black font-semibold rounded-md"
              onClick={handleJoin}
              disabled={joining || joined}
            >
              {joining ? "Joining..." : joined ? "Joined" : "Join Now"}
            </Button>

          </div>
        </div>
      </div>
    </div>
  );
}