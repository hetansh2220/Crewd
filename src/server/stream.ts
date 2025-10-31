"use server"

import { StreamChat } from "stream-chat";

if (!process.env.NEXT_PUBLIC_STREAM_API_KEY!) {
    throw new Error("Missing NEXT_PUBLIC_STREAM_API_KEY in environment variables");
}

if (!process.env.STREAM_SECRET_KEY) {
    throw new Error("Missing STREAM_SECRET_KEY in environment variables");
}

const client = StreamChat.getInstance(
    process.env.NEXT_PUBLIC_STREAM_API_KEY!,
    process.env.STREAM_SECRET_KEY
);

export async function getStreamToken(id: string) {
    const token = client.createToken(id)
    return token
}

export async function joinStreamChatChannel(userID: string, ownerID: string, groupID: string) {
    await client.disconnectUser();
    const token = await getStreamToken(ownerID);
    await client.connectUser({ id: ownerID }, token);
    const channel = client.channel("messaging", groupID);
    await channel.addMembers([userID]);
    await client.disconnectUser();
}