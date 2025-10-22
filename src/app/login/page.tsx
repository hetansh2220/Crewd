'use client'

import { LoginCodeStep } from '@/components/Login/login-code'
import { LoginEmailStep } from '@/components/Login/login-email'
import { LoginProfileStep } from '@/components/Login/login-profile'
import { CreateUser, GetUserByWallet } from '@/server/user'
import { useLoginWithEmail, usePrivy } from '@privy-io/react-auth'
import { useCreateWallet } from '@privy-io/react-auth/solana'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useState } from 'react'


function LoginPageContent() {
  const router = useRouter()
  const params = useSearchParams()
  const urlStage = params.get('stage')
  const [stage, setStage] = useState<0 | 1 | 2>(urlStage === '2' ? 2 : 0)
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { user } = usePrivy()
  const { createWallet } = useCreateWallet();

  const { sendCode, loginWithCode } = useLoginWithEmail({
    onComplete: async ({ user, isNewUser }) => {
      try {
        if (isNewUser) {
          await createWallet();
          setStage(2);
          return;
        }

        if (!user?.wallet?.address) {
          throw new Error("Wallet not found");
        }

        const existingUser = await GetUserByWallet(user.wallet.address);

        if (!existingUser) {
          setStage(2);
        } else {
          router.push('/dashboard');
        }
      } catch (err) {
        console.error("Login error:", err);
      }
    },
  });



  console.log(user)
  /** STEP 0 — Send OTP */
  const handleSendCode = async () => {
    if (!email) return alert('Please enter your email')
    try {
      setIsLoading(true)
      await sendCode({ email })
      setStage(1)
    } catch (err) {
      console.error(err)
      alert('Failed to send code')
    } finally {
      setIsLoading(false)
    }
  }

  /** STEP 1 — Verify OTP */
  const handleVerifyCode = async () => {
    if (!code || code.length !== 6) return alert('Enter a 6-digit code');
    try {
      setIsLoading(true);
      await loginWithCode({ code });
    } catch (err) {
      console.error(err);
      alert('Invalid code');
    } finally {
      setIsLoading(false);
    }
  }

  /** STEP 2 — Profile */
  const handleProfileSubmit = async (data: { username: string; bio?: string }) => {
    try {
      setIsLoading(true)
      const walletAddress = user?.wallet?.address || ''
      await CreateUser(data.username, data.bio || '', walletAddress)
      router.push('/dashboard')
    } catch (err) {
      console.error(err)
      alert('Failed to save profile')
    } finally {
      setIsLoading(false)
    }
  }


  return (
    <div className="flex min-h-screen items-center justify-center ">
      <div className="w-full max-w-md p-6  space-y-6 ">
        {stage === 0 && (
          <LoginEmailStep
            email={email}
            setEmail={setEmail}
            onSubmit={handleSendCode}
            isLoading={isLoading}
          />
        )}
        {stage === 1 && (
          <LoginCodeStep
            code={code}
            setCode={setCode}
            onVerify={handleVerifyCode}
            isLoading={isLoading}
          />
        )}
        {stage === 2 && <LoginProfileStep onSubmit={handleProfileSubmit} />}
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginPageContent />
    </Suspense>
  )
}