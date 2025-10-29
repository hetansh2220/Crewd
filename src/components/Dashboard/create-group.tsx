'use client';

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { uploadToCloudinary } from "@/providers/cloudinary-provider";
import { CreateGroup as CreateGroupDB } from "@/server/group";
import { usePrivy } from "@privy-io/react-auth";
import { Plus, Users } from "lucide-react";
import Image from "next/image";
import React, { useRef, useState } from "react";
import { useChatContext } from "stream-chat-react";

interface CreateGroupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CreateGroup({
  open,
  onOpenChange,
}: CreateGroupProps) {
  const { client } = useChatContext();
  const { user } = usePrivy()
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


    const id = crypto.randomUUID();
    const channel = client.channel("messaging", id, {
      name: groupName,
      members: [user?.wallet?.address],
      image: imageUrl || undefined,
      bio: groupBio,
      maxMembers,
      entryFee,
      owner: user?.wallet?.address,
    } as Record<string, unknown>);

    await channel.create();
    console.log(channel.data);

    try {
      if (!user?.wallet || !imageUrl) return;
      console.log(id,
        groupName,
        groupBio,
        imageUrl,
        maxMembers,
        entryFee,
        user?.wallet?.address)
      const dbGroup = await CreateGroupDB(
        {
          id: id,
          name: groupName,
          description: groupBio,
          image: imageUrl,
          maxMembers,
          entryFee: entryFee.toString(),
          owner: user?.wallet?.address,
        }
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
      <DialogContent className="w-[90vw] max-w-2xl border-border bg-background p-6 sm:p-8 mx-auto my-auto rounded-2xl">
        <DialogHeader className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="rounded-lg border border-border bg-background/50 p-2">
              <Users size={24} className="text-foreground" />
            </div>
            <DialogTitle className="text-2xl font-semibold text-foreground">
              Create Group
            </DialogTitle>
          </div>
          <DialogDescription className="text-muted-foreground text-left">
            Fill in the details to create a new group chat.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Image Upload with + Icon */}
          <div
            className="w-28 h-28 mx-auto rounded-full bg-muted flex items-center justify-center cursor-pointer hover:bg-accent transition relative overflow-hidden border border-border"
            onClick={handleImageClick}
          >
            {previewUrl ? (
              <Image
                width={112}
                height={112}
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

          <div className="space-y-4 border-t border-border pt-6">
            <Input
              placeholder="Group Name"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="h-12 border-border bg-background text-lg text-foreground"
            />

            <Textarea
              placeholder="Group Bio"
              value={groupBio}
              onChange={(e) => setGroupBio(e.target.value)}
              className="border-border bg-background text-lg text-foreground"
            />

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Maximum Members
              </label>
              <Input
                type="number"
                placeholder="Maximum Members"
                value={maxMembers}
                onChange={(e) => setMaxMembers(Number(e.target.value))}
                min={1}
                className="h-12 border-border bg-background text-lg text-foreground"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Entry Fee (SOL)
              </label>
              <Input
                type="number"
                placeholder="Entry Fee"
                value={entryFee}
                onChange={(e) => setEntryFee(Number(e.target.value))}
                min={0}
                className="h-12 border-border bg-background text-lg text-foreground"
              />
            </div>
          </div>

          <div className=" pt-4 border-t border-border">

            <Button
              onClick={handleCreateGroup}
              className=" w-full text-base font-semibold"
            >
              Create
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>

  );
}
