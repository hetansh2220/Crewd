'use client';

import { usePrivy } from '@privy-io/react-auth';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';

export default function LoginWithWallet() {
  const { user, login, logout } = usePrivy();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  const handleClick = async () => {
    if (user) {
      await logout();
      router.push('/'); 
    } else {
       login();
    }
  };

  return (
    <Button onClick={handleClick}>
      Login with Wallet
    </Button>
  );
}
