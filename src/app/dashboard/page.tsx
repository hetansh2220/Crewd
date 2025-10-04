"use client";

import MessageInput from "@/components/MessageInput";
import Sidebar from "@/components/Sidebar";
import SidePanel from "@/components/SidePanel";
import { StreamChat } from "stream-chat";
import {
  Channel,
  Chat,
  MessageList,
  Thread,
  useCreateChatClient,
} from "stream-chat-react";
import "stream-chat-react/dist/css/v2/index.css";
import Channelheader from "@/components/ChannelHeader";

const chatClient = StreamChat.getInstance(
  process.env.NEXT_PUBLIC_STREAM_API_KEY!,
);

const Dashboard = () => {
  const client = useCreateChatClient({
    apiKey: process.env.NEXT_PUBLIC_STREAM_API_KEY!,
    tokenOrProvider: chatClient.devToken("guest"),
    userData: { id: "guest" },
  });

  if (!client) return null;

  return (
    <Chat client={client} theme="str_chat__theme-light">
      <div className="flex h-screen">
        <SidePanel />
        <Sidebar client={client} currentUserId="guest" />
        <div className="flex-1 flex flex-col">
          <Channel>
            <div className="flex-1 flex flex-col">
              <Channelheader />
              <MessageList />
              <MessageInput />
            </div>
          </Channel>
          <Thread />
        </div>
      </div>
    </Chat>
  );
};

export default Dashboard;
