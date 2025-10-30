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
import Image from 'next/image'
import Logo from '../../../logo/crewd.png'


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
    <div className={cn("flex flex-col gap-6 ", className)} {...props}>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          onSubmit()
        }}
      >
        <FieldGroup>
          <div className="flex flex-col items-center text-center">
              {/* Logo */}
              <Image
                src={Logo.src}
                width={128}
                height={128}
                alt="Crewd Logo"
                className={`h-28 w-28 cursor-pointer transition-all  -mb-4 `}
          />

      {/* Heading and description */}
      <h1 className="text-xl font-bold leading-tight -mt-3">Welcome to Crewd</h1>
      <FieldDescription className="mt-4 text-gray-400">
        Sign in with your email to continue
      </FieldDescription>
    </div>


          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              className='border-gray-300 dark:border-gray-500'
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
