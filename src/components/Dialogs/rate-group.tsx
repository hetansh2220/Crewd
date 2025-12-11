"use client"

import { useState, useTransition } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { toast, Bounce } from "react-toastify"
import { CreateReview } from "@/server/review"

interface RateGroupDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  reviewer?: string | null
  groupId?: string | null
}

export function RateGroupDialog({ open, onOpenChange, reviewer, groupId }: RateGroupDialogProps) {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState("")
  const [isPending, startTransition] = useTransition()

  const handleSubmitReview = () => {
    if (!reviewer || !groupId) {
      toast.error("Missing reviewer or group ID")
      return
    }

    if (rating < 1 || rating > 5) {
      toast.error("Please select a rating between 1 and 5 stars")
      return
    }

    startTransition(async () => {
      try {
        await CreateReview(reviewer, groupId, rating, comment)
        toast.success("Review submitted successfully!", {
          position: "top-right",
          autoClose: 3000,
          theme: "dark",
          transition: Bounce,
        })
        onOpenChange(false)
        setRating(0)
        setComment("")
      } catch (error) {
        console.error(error)
        toast.error("Failed to submit review.", {
          position: "top-right",
          autoClose: 3000,
          theme: "dark",
          transition: Bounce,
        })
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[90vw] max-w-2xl border-border bg-background p-6 sm:p-8 mx-auto my-auto rounded-2xl">
        <DialogHeader className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="rounded-lg border border-border bg-background/50 p-2">
              <svg
                className="h-6 w-6 text-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.91c.969 0 1.371 1.24.588 1.81l-3.974 2.888a1 1 0 00-.364 1.118l1.518 4.674c.3.921-.755 1.688-1.54 1.118l-3.975-2.888a1 1 0 00-1.175 0l-3.975 2.888c-.784.57-1.838-.197-1.539-1.118l1.518-4.674a1 1 0 00-.364-1.118L2.082 10.1c-.783-.57-.38-1.81.588-1.81h4.91a1 1 0 00.95-.69l1.519-4.674z"
                />
              </svg>
            </div>
            <DialogTitle className="text-2xl font-semibold text-foreground">Rate Group</DialogTitle>
          </div>
          <DialogDescription className="text-muted-foreground text-left">
            Share your experience with this group.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          <div className="flex items-center justify-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={`text-5xl transition ${star <= rating ? "text-yellow-400" : "text-gray-400 dark:text-gray-500"}`}
              >
                ★
              </button>
            ))}
          </div>

          <div className="border-t border-border pt-6">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write your comment..."
              className="w-full min-h-[120px] rounded-xl border border-border bg-background text-foreground p-4 text-base focus:outline-none focus:ring-2 focus:ring-foreground/20 transition"
            />
          </div>

          <Button
            onClick={handleSubmitReview}
            disabled={isPending}
            className="h-12 w-full rounded-xl text-lg font-semibold"
          >
            {isPending ? "Submitting..." : "Submit Review"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
