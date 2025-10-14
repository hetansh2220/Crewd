'use client';

import React, { useState, useRef } from "react";
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
import { Plus } from "lucide-react";
import { uploadToCloudinary } from "@/providers/cloudinary-provider";
import { CreateGroup as CreateGroupDB } from "@/server/group";

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
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [maxMembers, setMaxMembers] = useState<number>(10);
  const [entryFee, setEntryFee] = useState<number>(0);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCreateGroup = async () => {
    if (!groupName) return alert("Group name is required!");
    if (maxMembers <= 0) return alert("Maximum members must be greater than 0");
    if (entryFee < 0) return alert("Entry fee cannot be negative");

    let imageUrl = previewUrl;
    if (groupImage) {
      try {
        imageUrl = await uploadToCloudinary(groupImage);
      } catch (err) {
        console.error(err);
        return alert("Failed to upload image. Try again.");
      }
    }

    // id 
    const id = crypto.randomUUID();
    // 1️⃣ Create Stream Chat channel
    const channel = chatClient.channel("messaging", id, {
      name: groupName,
      members: [userId],
      image: imageUrl || undefined,
      bio: groupBio,
      maxMembers,
      entryFee,
    } as Record<string, unknown>);

    await channel.create();
    console.log(channel.data);

    try {
      const dbGroup = await CreateGroupDB(
        id,
        groupName,
        groupBio,
        imageUrl || "",
        maxMembers,
        entryFee,
        userId,
      );
      console.log("Group saved in DB:", dbGroup);
    } catch (err) {
      console.error("Failed to save group in DB:", err);
    }

    // reset form
    setGroupName("");
    setGroupBio("");
    setGroupImage(null);
    setPreviewUrl(null);
    setMaxMembers(10);
    setEntryFee(0);
    onOpenChange(false);
  };



  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setGroupImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
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
          {/* Image Upload with + Icon */}
          <div
            className="w-24 h-24 mx-auto rounded-full bg-muted flex items-center justify-center cursor-pointer hover:bg-accent transition relative overflow-hidden"
            onClick={handleImageClick}
          >
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Group"
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <Plus className="w-8 h-8 text-muted-foreground" />
            )}
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

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

          <div className="space-y-2">
            <label className="text-sm font-medium">Maximum Members</label>
            <Input
              type="number"
              placeholder="Maximum Members"
              value={maxMembers}
              onChange={(e) => setMaxMembers(Number(e.target.value))}
              min={1}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Entry Fee(sol)</label>
            <Input
              type="number"
              placeholder="Entry Fee"
              value={entryFee}
              onChange={(e) => setEntryFee(Number(e.target.value))}
              min={0}
            />
          </div>
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
