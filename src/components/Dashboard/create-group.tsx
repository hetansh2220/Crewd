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
import { UploadImage } from "@/hooks/upload-image";
import { CreateGroup as CreateGroupDB } from "@/server/group";
import { usePrivy } from "@privy-io/react-auth";
import { Plus, Users } from "lucide-react";
import Image from "next/image";
import React, { useRef, useState } from "react";
import client from "@/lib/stream";

interface CreateGroupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CreateGroup({
  open,
  onOpenChange,
}: CreateGroupProps) {
  const { user } = usePrivy();

  const [groupName, setGroupName] = useState("");
  const [groupBio, setGroupBio] = useState("");
  const [groupImage, setGroupImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [maxMembers, setMaxMembers] = useState<number>(10);
  const [entryFee, setEntryFee] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Inline Errors
  const [errors, setErrors] = useState({
    name: "",
    bio: "",
    image: "",
    maxMembers: "",
    entryFee: "",
  });

  const handleCreateGroup = async () => {
    setLoading(true);

    const newErrors: any = {};

    if (!groupName.trim()) newErrors.name = "Group name is required";
    if (!groupBio.trim()) newErrors.bio = "Group bio is required";
    if (!groupImage) newErrors.image = "Group image is required";
    if (!maxMembers || maxMembers <= 0)
      newErrors.maxMembers = "Max members must be greater than 0";
    if (entryFee === null || entryFee === undefined || entryFee < 0)
      newErrors.entryFee = "Entry fee cannot be negative";

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      setLoading(false);
      return;
    }

    let imageUrl = previewUrl;

    try {
      if (groupImage) {
        imageUrl = await UploadImage(groupImage);
      }
    } catch (err) {
      setErrors((prev) => ({
        ...prev,
        image: "Failed to upload image",
      }));
      setLoading(false);
      return;
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

    try {
      if (user?.wallet && imageUrl) {
        await CreateGroupDB({
          id,
          name: groupName,
          description: groupBio,
          image: imageUrl,
          maxMembers,
          entryFee: entryFee.toString(),
          owner: user?.wallet?.address,
        });
      }
    } catch (err) {
      console.error("DB Error:", err);
    }

    // Reset and close
    setGroupName("");
    setGroupBio("");
    setGroupImage(null);
    setPreviewUrl(null);
    setMaxMembers(10);
    setEntryFee(0);

    setLoading(false);
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
      if (errors.image) setErrors((prev) => ({ ...prev, image: "" }));
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

          {/* Image Upload */}
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
          {errors.image && (
            <p className="text-red-500 text-sm text-center">{errors.image}</p>
          )}

          <div className="space-y-4 border-t border-border pt-6">

            {/* Group Name */}
            <Input
              placeholder="Group Name"
              value={groupName}
              onChange={(e) => {
                setGroupName(e.target.value);
                if (errors.name)
                  setErrors((prev) => ({ ...prev, name: "" }));
              }}
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name}</p>
            )}

            {/* Group Bio */}
            <Textarea
              placeholder="Group Bio"
              value={groupBio}
              onChange={(e) => {
                setGroupBio(e.target.value);
                if (errors.bio)
                  setErrors((prev) => ({ ...prev, bio: "" }));
              }}
            />
            {errors.bio && (
              <p className="text-red-500 text-sm">{errors.bio}</p>
            )}

            {/* Max Members */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Maximum Members
              </label>
              <Input
                type="number"
                value={maxMembers}
                min={1}
                onChange={(e) => {
                  setMaxMembers(Number(e.target.value));
                  if (errors.maxMembers)
                    setErrors((prev) => ({ ...prev, maxMembers: "" }));
                }}
              />
              {errors.maxMembers && (
                <p className="text-red-500 text-sm">{errors.maxMembers}</p>
              )}
            </div>

            {/* Entry Fee */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Entry Fee (SOL)
              </label>
              <Input
                type="number"
                value={entryFee}
                min={0}
                onChange={(e) => {
                  setEntryFee(Number(e.target.value));
                  if (errors.entryFee)
                    setErrors((prev) => ({ ...prev, entryFee: "" }));
                }}
              />
              {errors.entryFee && (
                <p className="text-red-500 text-sm">{errors.entryFee}</p>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-border">
            <Button
              onClick={handleCreateGroup}
              disabled={loading}
              className="w-full text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating..." : "Create"}
            </Button>

          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
