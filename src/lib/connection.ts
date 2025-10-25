import { Connection } from "@solana/web3.js";

// Use NEXT_PUBLIC_HELIUS_API_KEY to avoid committing API keys to source.
const heliusApiKey = process.env.NEXT_PUBLIC_HELIUS_API_KEY;
const rpcUrl = heliusApiKey
    ? `https://mainnet.helius-rpc.com/?api-key=${heliusApiKey}`
    : 'https://api.mainnet-beta.solana.com';

const connection = new Connection(rpcUrl, 'confirmed');

export default connection;