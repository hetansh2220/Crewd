"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Dialog, DialogTrigger , DialogContent} from "@/components/ui/dialog"
import { useLoginWithEmail } from "@privy-io/react-auth"

import { LoginEmailStep } from "./login-email"
import { LoginCodeStep } from "./login-code"
import { LoginProfileStep } from "./login-profile"

export function LoginForm() {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [email, setEmail] = useState("")
  const [code, setCode] = useState("")
  const [stage, setStage] = useState<0 | 1 | 2>(0)

  const { sendCode, loginWithCode } = useLoginWithEmail()

  // STEP 0 — Send Email Code
  const handleSendCode = async () => {
    if (!email) return alert("Please enter your email")
    try {
      await sendCode({ email })
      console.log("Verification code sent")
      setStage(1)
    } catch (err) {
      console.error("Failed to send code", err)
      alert("Failed to send verification code.")
    }
  }

  // STEP 1 — Verify Code
  const handleVerifyCode = async () => {
    if (!code || code.length !== 6) return alert("Please enter a 6-digit code")

    try {
      console.log("Attempting login with code:", code)
      await loginWithCode({ code })
      console.log("Code verified successfully!")

      // Keep the dialog open and go to next step
      setStage(2)
      setIsOpen(true)
    } catch (err) {
      console.error("OTP verification failed", err)
      alert("Invalid code. Try again.")
    }
  }

  // STEP 2 — Complete Profile
  const handleProfileSubmit = (data: {
    username: string
    bio?: string
    avatarUrl: string
  }) => {
    console.log("Profile info:", data)
    alert("Profile completed!")

    // Example redirect
    router.push("/dashboard")

    // Reset
    setStage(0)
    setEmail("")
    setCode("")
    setIsOpen(false)
  }

  return (
   <Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogTrigger asChild>
    <Button>Login</Button>
  </DialogTrigger>

  <DialogContent className="sm:max-w-md">
    {stage === 0 && <LoginEmailStep email={email} setEmail={setEmail} onSubmit={handleSendCode} onCancel={() => setIsOpen(false)} setIsOpen={setIsOpen} />}
    {stage === 1 && <LoginCodeStep code={code} setCode={setCode} onVerify={handleVerifyCode} onCancel={() => setIsOpen(false)} />}
    {stage === 2 && <LoginProfileStep onSubmit={handleProfileSubmit} onCancel={() => setIsOpen(false)} defaultValues={{ username: "", bio: "" }} />}
  </DialogContent>
</Dialog>

  )
}
