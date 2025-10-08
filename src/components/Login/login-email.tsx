"use client"

import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface Props {
  email: string
  setEmail: (val: string) => void
  onSubmit: () => void
  onCancel: () => void
  setIsOpen: (open: boolean) => void
}

export function LoginEmailStep({ email, setEmail, onSubmit, onCancel }: Props) {
  return (
    <>
      <DialogHeader>
        <DialogTitle>Login to your account</DialogTitle>
        <DialogDescription>
          Enter your email address to receive a login code.
        </DialogDescription>
      </DialogHeader>

      <Field>
        <FieldLabel htmlFor="email">Email</FieldLabel>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.currentTarget.value)}
          required
        />
      </Field>

      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button onClick={onSubmit}>Submit</Button>
      </DialogFooter>
    </>
  )
}
