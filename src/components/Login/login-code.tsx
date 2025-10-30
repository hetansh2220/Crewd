'use client'

import { Button } from '@/components/ui/button'
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/components/ui/input-otp'
import Image from 'next/image'
import Logo from '../../../logo/crewd.png'


interface Props {
  code: string
  setCode: (value: string) => void
  onVerify: () => void
  isLoading: boolean
}

export function LoginCodeStep({ code, setCode, onVerify, isLoading }: Props) {

  return (
    <div className="flex flex-col gap-6">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          onVerify()
        }}
      >
        <FieldGroup>
          <div className="flex flex-col items-center text-center">
            {/* ✅ Logo (same as LoginEmailStep) */}
            <Image
              src={Logo.src}
              width={128}
              height={128}
              alt="Crewd Logo"
              className={`h-28 w-28 cursor-pointer transition-all -mb-4`}
            />

            {/* Heading + description */}
            <h1 className="text-xl font-bold leading-tight -mt-3">
              Enter verification code
            </h1>
            <FieldDescription className="mt-4 text-gray-400">
              We sent a 6-digit code to your email address
            </FieldDescription>
          </div>

          <Field>
            <FieldLabel htmlFor="otp" className="sr-only">
              Verification code
            </FieldLabel>
            <InputOTP
              id="otp"
              maxLength={6}
              value={code}
              onChange={(val) => setCode(val)}
              containerClassName="gap-4"
            >
              <InputOTPGroup className="gap-2.5  *:data-[slot=input-otp-slot]:h-16 *:data-[slot=input-otp-slot]:w-12 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border *:data-[slot=input-otp-slot]:text-xl">
                {[0, 1, 2].map((i) => (
                  <InputOTPSlot
                  className='border-gray-400 dark:border-gray-600'
                   key={i} index={i} />
                ))}
              </InputOTPGroup>

              <InputOTPSeparator />

              <InputOTPGroup className="gap-2.5 *:data-[slot=input-otp-slot]:h-16 *:data-[slot=input-otp-slot]:w-12 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border *:data-[slot=input-otp-slot]:text-xl">
                {[3, 4, 5].map((i) => (
                  <InputOTPSlot
                  className='border-gray-400 dark:border-gray-600'
                  key={i} index={i} />
                ))}
              </InputOTPGroup>
            </InputOTP>
          </Field>

          <Field>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Verifying...' : 'Verify'}
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </div>
  )
}
