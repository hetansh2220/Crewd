"use client";

import Channelheader from "@/components/Dashboard/channel-header";
import MessageInput from "@/components/Dashboard/message-input";
import Sidebar from "@/components/Dashboard/sidebar";
import client from "@/lib/stream";
import { GetUserByWallet } from "@/server/user";
import { usePrivy } from "@privy-io/react-auth";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Channel,
  Chat,
  MessageList,
  useChatContext
} from "stream-chat-react";
import "stream-chat-react/dist/css/v2/index.css";


// Inner component that has access to ChatContext
const DashboardContent = () => {
  const [showChat, setShowChat] = useState(false);
  const { channel } = useChatContext();
  const { user, ready } = usePrivy();


  useEffect(() => {
    if (ready) {
      if (!user) {
        redirect("/");
      }
    }
  }, [ready, user]);



  useEffect(() => {
    if (channel) {
      setShowChat(true);
    }
  }, [channel]);


  return (
    <div className="flex flex-col h-full">
      {/* <Header /> */}

      <div className="flex flex-1 overflow-hidden p-2 gap-2">
        {/* Sidebar - visible on desktop or when showChat=false */}
        <div
          className={`transition-all duration-300 ${showChat ? "hidden md:flex" : "flex"
            } flex-col w-full md:w-xs `}
        >
          <Sidebar />
        </div>

        {/* Chat area - visible on desktop or when showChat=true */}
        <div
          className={`p-2 mb-2 border rounded flex-1 flex flex-col transition-all duration-300 ${showChat ? "flex" : "hidden md:flex"
            }`}
        >
          {channel ? (
            <Channel channel={channel}>
              <div className="flex-1 flex flex-col">
                <Channelheader onBack={() => setShowChat(false)} />
                <MessageList />
                <MessageInput />
              </div>
            </Channel>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              Select a chat to start messaging
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { user } = usePrivy();
  const [isLoading, setIsLoading] = useState(true)

  const fetchUser = async () => {
    try {
      if (!user?.wallet?.address) return;
      const userData = await GetUserByWallet(user.wallet.address);
      if (!userData.walletAddress) return;
      await client.connectUser(
        {
          id: userData.walletAddress,
          name: userData.username,
          image: userData.avatar,
        },
        client.devToken(userData.walletAddress)
      );
    } catch (error) {
      console.log("Error fetching user:", error);
    } finally {
      setIsLoading(false)
    }
  };

  useEffect(() => {
    if (user?.wallet?.address) {
      fetchUser();
    }
  }, [user]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="h-[calc(100vh-84px)]">
      <Chat client={client} theme="str-chat__theme-dark">
        <DashboardContent />
      </Chat>
    </div>
  );
};

export default Dashboard;