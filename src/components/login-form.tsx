"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useLoginWithEmail } from "@privy-io/react-auth"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "./ui/input-otp"

export function LoginForm() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [stage, setStage] = useState(0);
  const { sendCode, loginWithCode } = useLoginWithEmail();

  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [image, setImage] = useState<File | null>(null);

  const handleSendCode = async () => {
    if (!email) return alert("Please enter your email")
    try {
      await sendCode({ email })
      setStage(1)
    } catch (err) {
      console.error("Failed to send code", err)
    }
  }

  const handleVerifyCode = async () => {
    if (!code || code.length !== 6) return alert("Please enter a 6-digit code")
    try {
      await loginWithCode({ code })
      setStage(2)
    } catch (err) {
      console.error("OTP verification failed", err)
      alert("Invalid code. Try again.")
    }
  }

  const handleProfileSubmit = () => {
    if (!username) return alert("Please enter a username")
    console.log("Profile info:", { username, bio, image })
    alert("Profile completed!")

    setStage(0)
    setEmail("")
    setCode("")
    setUsername("")
    setBio("")
    setImage(null)
    setIsOpen(false);
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={setIsOpen}
      modal={true} // ensures overlay click won't close automatically
    >
      <DialogTrigger asChild>
        <Button>Login</Button>
      </DialogTrigger>

      {stage === 0 && (
        <DialogContent className="sm:max-w-md">
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
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleSendCode}>Submit</Button>
          </DialogFooter>
        </DialogContent>
      )}

      {stage === 1 && (
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
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </Field>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleVerifyCode}>Verify Code</Button>
          </DialogFooter>
        </DialogContent>
      )}

      {stage === 2 && (
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Complete Your Profile</DialogTitle>
            <DialogDescription>
              Add a username, bio, and profile image.
            </DialogDescription>
          </DialogHeader>

          <Field>
            <FieldLabel htmlFor="username">Username</FieldLabel>
            <Input
              id="username"
              type="text"
              placeholder="Your username"
              value={username}
              onChange={(e) => setUsername(e.currentTarget.value)}
              required
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="bio">Bio</FieldLabel>
            <Input
              id="bio"
              type="text"
              placeholder="Tell us about yourself"
              value={bio}
              onChange={(e) => setBio(e.currentTarget.value)}
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="image">Profile Image</FieldLabel>
            <input
              id="image"
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files?.[0] || null)}
            />
          </Field>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleProfileSubmit}>Submit Profile</Button>
          </DialogFooter>
        </DialogContent>
      )}
    </Dialog>
  )
}
