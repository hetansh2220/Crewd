'use client'

import { Button } from '@/components/ui/button'
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel
} from "@/components/ui/field"
import { Input } from '@/components/ui/input'
import { cn } from "@/lib/utils"
import { GalleryVerticalEnd } from "lucide-react"

interface LoginEmailStepProps extends React.HTMLAttributes<HTMLDivElement> {
  email: string
  setEmail: (value: string) => void
  onSubmit: () => void
  isLoading: boolean
}

export function LoginEmailStep({
  email,
  setEmail,
  onSubmit,
  isLoading,
  className,
  ...props
}: LoginEmailStepProps) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          onSubmit()
        }}
      >
        <FieldGroup>
          <div className="flex flex-col items-center gap-2 text-center">
            <a href="#" className="flex flex-col items-center gap-2 font-medium">
              <div className="flex size-8 items-center justify-center rounded-md">
                <GalleryVerticalEnd className="size-6" />
              </div>
              <span className="sr-only">Acme Inc.</span>
            </a>
            <h1 className="text-xl font-bold">Welcome to Chat-App</h1>
            <FieldDescription>
              Sign in with your email to continue
            </FieldDescription>
          </div>

          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Field>

          <Field>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Loading..." : "Login"}
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </div>
  )
}
