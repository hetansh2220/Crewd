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
import { toast } from 'react-toastify' // Import toastify for notifications
import 'react-toastify/dist/ReactToastify.css' // Import toast styles
import { useState } from 'react'

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

  const [loading, setLoading] = useState(false) // Loading state for the button

  const handleSubmit = async (data: ProfileFormValues) => {
    setLoading(true) // Set loading to true when submission starts
    try {
      const users = await GetUser()
      console.log(users)

      // Ensure users is treated as an array
      const usersArray = Array.isArray(users) ? users : [users]
      const existingUser = usersArray.some((user: any) => user.username === data.username)
      if (existingUser) {
        form.setError('username', { message: 'Username is already taken' })
        setLoading(false) // Set loading to false if username is taken
        return
      }

      // Proceed with submitting the form
      await onSubmit(data)
      
      // Show success toast notification
      toast.success('Profile submitted successfully!')
    } catch (err) {
      console.error('Failed to validate username', err)
      form.setError('username', { message: 'Unable to validate username' })
      toast.error('Failed to validate username') // Show error toast
    } finally {
      setLoading(false) // Set loading to false after submission ends
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

        {/* Button with loading state */}
        <Button type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Profile'}
        </Button>
      </form>
    </Form>
  )
}
