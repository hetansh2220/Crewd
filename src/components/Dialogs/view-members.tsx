"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserListIcon } from "@phosphor-icons/react";
import { useGroupMembers } from "@/hooks/use-group-user";
import { useChatContext } from "stream-chat-react";
interface ViewMembersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ViewMembersDialog({ open, onOpenChange,  }: ViewMembersDialogProps) {
  const { channel } = useChatContext();
  const { members, loading, error } = useGroupMembers(channel?.id);
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

        {loading && <p className="text-muted-foreground">Loading members...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {!loading && members.length === 0 && (
          <p className="text-muted-foreground text-center">No members found.</p>
        )}

        <ul className="mt-6 space-y-3 max-h-96 overflow-y-auto border-t border-border pt-4">
          {members.map((member) => (
            <li
              key={member.id}
              className="flex items-center gap-3 rounded border bg-background/50 p-3 transition hover:bg-accent/50"
            >
              <Avatar>
                <AvatarImage src={member.avatar || ""} alt={member.username} />
                <AvatarFallback>{member.username?.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-foreground font-medium">{member.username}</span>
                {member.bio && (
                  <span className="text-sm text-muted-foreground truncate max-w-[200px]">{member.bio}</span>
                )}
              </div>
            </li>
          ))}
        </ul>
      </DialogContent>
    </Dialog>
  );
}
