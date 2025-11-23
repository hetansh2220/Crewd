"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserListIcon } from "@phosphor-icons/react";
import { useChatContext } from "stream-chat-react";
import React from "react";
interface ViewMembersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ViewMembersDialog({ open, onOpenChange,  }: ViewMembersDialogProps) {
  const { channel } = useChatContext();
  const members = channel?.state?.members ? Object.values(channel.state.members) : [];
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[90vw] max-w-2xl border-border bg-background p-6 sm:p-8 mx-auto my-auto rounded-2xl">
        <DialogHeader className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="rounded-lg border border-border bg-background/50 p-2">
              <UserListIcon className="h-6 w-6 text-foreground" />
            </div>
            <DialogTitle className="text-2xl font-semibold text-foreground">Group Members</DialogTitle>
          </div>
          <DialogDescription className="text-muted-foreground text-left">
            View all members in this group.
          </DialogDescription>
        </DialogHeader>

        
        <ul className="mt-6 space-y-3 max-h-96 overflow-y-auto border-t border-border pt-4">
          {members.map((member) => (
            <li key={member.user_id} className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={member.user?.image || ""} alt={member.user?.name || "User Avatar"} />
                <AvatarFallback>{member.user?.name ? member.user.name.charAt(0) : "U"}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-foreground">{member.user?.name || "Unknown User"}</p>
                
              </div>
            </li>
          ))}
        </ul>
      </DialogContent>
    </Dialog>
  );
}
