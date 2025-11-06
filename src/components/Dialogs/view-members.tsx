"use client"

import {useEffect} from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { UserListIcon } from "@phosphor-icons/react"
import Link from "next/link"
import {GetUserByWallet} from "@/server/user"
import React from "react"

interface ViewMembersDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  members: { user_id: string }[]
  ready: boolean
}

export function ViewMembersDialog({ open, onOpenChange, members, ready }: ViewMembersDialogProps) {

  const [loading, setLoading] = React.useState(false)
  const [memberDetails, setMemberDetails] = React.useState<Array<{
    id: string
    username: string
    bio: string | null
    avatar: string | null
  }>>([])
 
  const membersIds = members.map((member) => member.user_id)
  useEffect(() => {
    const fetchMemberDetails = async () => {
      const memberDetailsPromises = membersIds.map(async (walletAddress) => {
        const userDetails = await GetUserByWallet(walletAddress)
        return userDetails
      })
      const memberDetailsResults = await Promise.all(memberDetailsPromises)
      setMemberDetails(memberDetailsResults)
      setLoading(false)
    }

    if (ready && open) {
      fetchMemberDetails()
    }
  }, [ready, open, membersIds])
  
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


        <ul className="mt-6 space-y-3 max-h-96 overflow-y-auto border-t border-border pt-4">
          {memberDetails.map((member) => (
            <Link
              key={member.id}
              href={`/${member.username}`}
              onClick={() => onOpenChange(false)}
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
            </Link>
          ))}
        </ul>
      </DialogContent>
    </Dialog>
  )
}
