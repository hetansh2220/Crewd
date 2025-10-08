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
import { Button } from "@/components/ui/button"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"

interface Props {
  code: string
  setCode: (val: string) => void
  onVerify: () => void
  onCancel: () => void
}

export function LoginCodeStep({ code, setCode, onVerify, onCancel }: Props) {
  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Enter Verification Code</DialogTitle>
        <DialogDescription>
          Enter the 6-digit code sent to your email.
        </DialogDescription>
      </DialogHeader>
      <Field>
        <FieldLabel htmlFor="otp">Verification code</FieldLabel>
        <InputOTP
          id="otp"
          maxLength={6}
          value={code}
          onChange={(newValue: string) => setCode(newValue)}
          required
        >
          <InputOTPGroup className="gap-2.5 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border">
            {[...Array(6)].map((_, i) => (
              <InputOTPSlot key={i} index={i} />
            ))}
          </InputOTPGroup>
        </InputOTP>
      </Field>
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </DialogClose>
        <Button onClick={onVerify}>Verify Code</Button>
      </DialogFooter>
    </DialogContent>
  )
}
