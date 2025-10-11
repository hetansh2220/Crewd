import { StreamChat } from "stream-chat";

const stream = StreamChat.getInstance(
    process.env.NEXT_PUBLIC_STREAM_API_KEY!,
);

export default stream;