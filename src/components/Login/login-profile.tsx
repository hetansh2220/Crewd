'use client'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { GetUser } from '@/server/user'

const profileSchema = z.object({
  username: z.string().min(2, 'Username must be at least 2 characters'),
  bio: z.string().max(200).optional(),
})

type ProfileFormValues = z.infer<typeof profileSchema>

interface Props {
  onSubmit: (data: ProfileFormValues) => void
}

export function LoginProfileStep({ onSubmit }: Props) {
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { username: '', bio: '' },
  })

  const handleSubmit = async (data: ProfileFormValues) => {
    try {
      const users = await GetUser()
      console.log(users)
      // const existingUser = users.username === data.username
      // if (existingUser) {
      //   // Show error in the form under the username input
      //   form.setError('username', { message: 'Username is already taken' })
      //   return
      // }

      // Proceed with saving profile
      onSubmit(data)
    } catch (err) {
      console.error('Failed to validate username', err)
      form.setError('username', { message: 'Unable to validate username' })
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col gap-4"
      >
        <h2 className="text-xl font-semibold">Complete Your Profile</h2>

        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Username" {...field} />
              </FormControl>
              {/* This will show the error message under the input */}
              <FormMessage />
            </FormItem>
          )}
        />

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

        <Button type="submit">Submit Profile</Button>
      </form>
    </Form>
  )
}
