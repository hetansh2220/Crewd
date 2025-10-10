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
  const [maxMembers, setMaxMembers] = useState<number>(10);
  const [entryFee, setEntryFee] = useState<number>(0);

  const handleCreateGroup = async () => {
    if (!groupName) return alert("Group name is required!");
    if (maxMembers <= 0) return alert("Maximum members must be greater than 0");
    if (entryFee < 0) return alert("Entry fee cannot be negative");

    const channel = chatClient.channel(
      "messaging",
      groupName.toLowerCase(),
      {
        name: groupName,
        members: [userId],
        image: groupImage ? URL.createObjectURL(groupImage) : undefined,
        custom: { 
          bio: groupBio,
          maxMembers,
          entryFee,
        },
      } as Record<string, unknown>
    );

    await channel.create();

    setGroupName("");
    setGroupBio("");
    setGroupImage(null);
    setMaxMembers(10);
    setEntryFee(0);
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
          <label htmlFor="" className="text-sm font-medium">
            Maximum Members
          </label>
          <Input
            type="number"
            placeholder="Maximum Members"
            value={maxMembers}
            onChange={(e) => setMaxMembers(Number(e.target.value))}
            min={1}
          />
          <label htmlFor="" className="text-sm font-medium">
            Entry Fee
          </label>
          <Input
            type="number"
            placeholder="Entry Fee"
            value={entryFee}
            onChange={(e) => setEntryFee(Number(e.target.value))}
            min={0}
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
