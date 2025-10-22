"use client";

import emojiData from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { Smile } from "lucide-react";
import { useState } from "react";
import {
    MessageInput as StreamMessageInput,
    useMessageComposer,
    useMessageInputContext,
} from "stream-chat-react";

const MessageInput = () => {
    const [open, setOpen] = useState(false);
    const { textareaRef } = useMessageInputContext("MessageInput");
    const { textComposer } = useMessageComposer();

    const addEmoji = (emoji: { native: string }) => {
        textComposer.insertText({ text: emoji.native });
        textareaRef.current?.focus();
    };

    return (
        <div className="relative flex items-center rounded-md  bg-white dark:bg-background">
            <button
                type="button"
                onClick={() => setOpen((prev) => !prev)}
                className="p-2 rounded-full hover:bg-gray-800"
            >
                <Smile size={20} />
            </button>

            <div className="flex-1">
                <StreamMessageInput />
            </div>

            {open && (
                <div className="absolute bottom-14 left-2 z-50 bg-background">
                    <Picker
                        data={emojiData}
                        onEmojiSelect={addEmoji}
                        theme=""
                        emojiSize={24}
                        perLine={8}
                        previewPosition="none"
                    />
                </div>
            )}
        </div>
    );
};

export default MessageInput;