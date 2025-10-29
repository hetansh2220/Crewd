'use client';

import { PrivyProvider } from '@privy-io/react-auth';
import { createSolanaRpc, createSolanaRpcSubscriptions } from '@solana/kit';

const heliusApiKey = process.env.NEXT_PUBLIC_HELIUS_API_KEY;
const heliusRpc = heliusApiKey
  ? `https://mainnet.helius-rpc.com/?api-key=${heliusApiKey}`
  : 'https://api.mainnet-beta.solana.com';
const heliusWs = heliusApiKey
  ? `wss://mainnet.helius-rpc.com/?api-key=${heliusApiKey}`
  : 'wss://api.mainnet-beta.solana.com';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
      clientId={process.env.NEXT_PUBLIC_PRIVY_CLIENT_ID!}
      config={{
        solana: {
          rpcs: {
            'solana:mainnet': {
              rpc: createSolanaRpc(heliusRpc),
              rpcSubscriptions: createSolanaRpcSubscriptions(heliusWs),
            },
          }
        },
        embeddedWallets: {
          solana: {
            createOnLogin: 'users-without-wallets',
          },
        },
      }}
    >
      {children}
    </PrivyProvider>
  );
}
