'use client';

import React, { useState } from "react";
import { StreamChat } from "stream-chat";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface CreateGroupProps {
  chatClient: StreamChat;
  userId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CreateGroup({
  chatClient,
  userId,
  open,
  onOpenChange,
}: CreateGroupProps) {
  const [groupName, setGroupName] = useState("");
  const [groupBio, setGroupBio] = useState("");
  const [groupImage, setGroupImage] = useState<File | null>(null);

  const handleCreateGroup = async () => {
    if (!groupName) return alert("Group name is required!");

    const channel = chatClient.channel("messaging", groupName.toLowerCase(), {
      name: groupName,
      members: [userId],
      image: groupImage ? URL.createObjectURL(groupImage) : undefined,
      custom: { bio: groupBio },
    } as Record<string, unknown>);

    await channel.create();

    setGroupName("");
    setGroupBio("");
    setGroupImage(null);
    onOpenChange(false); 
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Group</DialogTitle>
          <DialogDescription>
            Fill in the details to create a new group chat.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <Input
            placeholder="Group Name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
          />
          <Textarea
            placeholder="Group Bio"
            value={groupBio}
            onChange={(e) => setGroupBio(e.target.value)}
          />
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => setGroupImage(e.target.files?.[0] || null)}
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreateGroup}>Create</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}