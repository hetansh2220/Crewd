import { StreamChat } from "stream-chat";

if (!process.env.NEXT_PUBLIC_STREAM_API_KEY!) {
    throw new Error("Missing NEXT_PUBLIC_STREAM_API_KEY in environment variables");
}

const client = StreamChat.getInstance(
    process.env.NEXT_PUBLIC_STREAM_API_KEY!,
);

export default client;