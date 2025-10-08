"use client"

import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import Image from "next/image"

import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const profileSchema = z.object({
  username: z.string().min(2, { message: "Username must be at least 2 characters." }),
  bio: z.string().max(200).optional(),
})

type ProfileFormValues = z.infer<typeof profileSchema>

interface Props {
  onSubmit: (data: ProfileFormValues & { avatarUrl: string }) => void
  onCancel: () => void
  defaultValues?: Partial<ProfileFormValues>
}

export function LoginProfileStep({ onSubmit, onCancel, defaultValues }: Props) {
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: defaultValues?.username || "",
      bio: defaultValues?.bio || "",
    },
  })

  const username = form.watch("username")
  const avatarUrl = username
    ? `https://api.dicebear.com/9.x/thumbs/svg?seed=${encodeURIComponent(username)}`
    : "https://api.dicebear.com/9.x/thumbs/svg?seed=default"

  const handleSubmit = (data: ProfileFormValues) => {
    onSubmit({ ...data, avatarUrl })
  }

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Complete Your Profile</DialogTitle>
        <DialogDescription>
          Choose a username and write a short bio. A profile picture will be generated automatically.
        </DialogDescription>
      </DialogHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          {/* Username */}
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="Your username" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Avatar Preview */}
          <div className="flex flex-col items-center space-y-2">
            <Image
              src={avatarUrl}
              alt="Generated avatar"
              width={80}
              height={80}
              className="rounded-full border shadow-sm"
            />
            <p className="text-xs text-muted-foreground text-center">
              This avatar is automatically generated from your username.
            </p>
          </div>

          {/* Bio */}
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bio</FormLabel>
                <FormControl>
                  <Input placeholder="Tell us about yourself" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Buttons */}
          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit">Submit Profile</Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  )
}
