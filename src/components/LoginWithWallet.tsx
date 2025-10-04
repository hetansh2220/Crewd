import { useState } from "react"
import { LoginForm } from "./login-form"

export default function LoginWithWallet() {
  const [loginOpen, setLoginOpen] = useState(false)
  const [otpOpen, setOtpOpen] = useState(false)

  return (
    <>
      <LoginForm  />
    </>
  )
}
