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
import { Header } from "@/components/Header";

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
    <div className="h-screen ">
      <Chat client={client} theme="str_chat__theme-dark" >
        <div className="flex flex-col h-screen">
          <Header />
          <div className="flex flex-1 overflow-hidden">
            <Sidebar client={client} currentUserId="guest" />
            <div className="flex-1 flex flex-col mr-1 rounded border-3 mb-2 ">
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
        </div>
      </Chat>
    </div>
  );
}
export default Dashboard;
