import connection from '@/lib/connection';
import { LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from '@solana/web3.js';

export default function useTransfer() {

    async function transfer(sender: string, toPubkey: string, amount: number) {
        const transferInstruction = SystemProgram.transfer({
            fromPubkey: new PublicKey(sender),
            toPubkey: new PublicKey(toPubkey),
            lamports: Math.round(amount * LAMPORTS_PER_SOL),
        });

        const { blockhash } = await connection.getLatestBlockhash()
        const tx = new Transaction().add(transferInstruction);
        tx.recentBlockhash = blockhash;
        tx.feePayer = new PublicKey(sender);

        return tx
    }

    return { transfer }
}