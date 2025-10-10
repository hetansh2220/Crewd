"use client";

import { useEffect, useState } from "react";
import MessageInput from "@/components/Dashboard/message-input";
import Sidebar from "@/components/Dashboard/sidebar";
import { StreamChat } from "stream-chat";
import {
  Channel,
  Chat,
  MessageList,
  Thread,
  useCreateChatClient,
  useChatContext,
} from "stream-chat-react";
import "stream-chat-react/dist/css/v2/index.css";
import Channelheader from "@/components/Dashboard/channel-header";
import  {Header} from "@/components/Header";

const chatClient = StreamChat.getInstance(
  process.env.NEXT_PUBLIC_STREAM_API_KEY!,
);

// Inner component that has access to ChatContext
const DashboardContent = () => {
  const [showChat, setShowChat] = useState(false);
  const { client, channel } = useChatContext();

  // Listen for channel changes
  useEffect(() => {
    if (channel) {
      console.log("Active channel changed:", channel.id);
      setShowChat(true);
    }
  }, [channel]);

  return (
    <div className="flex flex-col h-screen">
      <Header />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - visible on desktop or when showChat=false */}
        <div
          className={`transition-all duration-300 ${showChat ? "hidden md:flex" : "flex"
            } flex-col w-full md:w-[320px] border-r`}
        >
          <Sidebar
            client={client}
            currentUserId="guest"
          />
        </div>

        {/* Chat area - visible on desktop or when showChat=true */}
        <div
          className={`flex-1 flex flex-col transition-all duration-300 ${showChat ? "flex" : "hidden md:flex"
            }`}
        >
          {channel ? (
            <Channel channel={channel}>
              <div className="flex-1 flex flex-col">
                <Channelheader onBack={() => setShowChat(false)} />
                <MessageList />
                <MessageInput />
              </div>
              <Thread />
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
  const client = useCreateChatClient({
    apiKey: process.env.NEXT_PUBLIC_STREAM_API_KEY!,
    tokenOrProvider: chatClient.devToken("guest"),
    userData: { id: "guest" },
  });

  if (!client) return null;

  return (
    <div className="h-screen">
      <Chat client={client} theme="str-chat__theme-dark">
        <DashboardContent />
      </Chat>
    </div>
  );
};

export default Dashboard;