"use client";

import { useEffect, useState } from "react";
import { useChatContext } from "stream-chat-react";
import { GetUserByWallet } from "@/server/user"; // server expects a single wallet string per call

type User = {
  id: string;
  username: string;
  bio: string;
  walletAddress: string | null;
  avatar: string;
  createdAt: Date;
};

export function useGroupMembers(groupId?: string) {
  const { channel } = useChatContext();
  const [members, setMembers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMembers = async () => {
      if (!channel || !groupId) return;

      try {
        setLoading(true);
        setError(null);

    
        await channel.watch();

        
        const result = await channel.queryMembers({});
        const streamMembers = result.members || [];

        if (!streamMembers.length) {
          console.warn("No Stream members found for channel:", groupId);
          setMembers([]);
          setLoading(false);
          return;
        }

        
        const walletAddresses = [
          ...new Set(streamMembers.map((m: any) => m.user?.id)),
        ].filter((v): v is string => !!v);

        console.log("Wallet addresses from Stream:", walletAddresses);

       
        const usersData = await Promise.all(
          walletAddresses.map((addr) => GetUserByWallet(addr))
        );

        console.log("Fetched user data from DB:", usersData);

        
        setMembers(usersData.filter((u): u is User => !!u));
      } catch (err: any) {
        console.error("Error fetching group members:", err);
        setError(err.message || "Failed to fetch members");
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, [groupId, channel]);

  return { members, loading, error };
}
