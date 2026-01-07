import { VersionedTransaction, Connection } from '@solana/web3.js';

const RPC_ENDPOINT = 'https://mainnet.helius-rpc.com/?api-key=77aae9b3-ad37-4523-8caf-dea409d5519e';
const connection = new Connection(RPC_ENDPOINT, 'confirmed');

export const performSwap = async ({
  action,
  mint,
  amount,
  publicKey,
  signTransaction,
  denominatedInSol = true,
  slippage = 10,
  priorityFee = 0.00001,
  pool = 'auto',
}: {
  action: 'buy' | 'sell';
  mint: string;
  amount: number | string;
  publicKey: string;
  signTransaction: (tx: VersionedTransaction) => Promise<VersionedTransaction>;
  denominatedInSol?: boolean;
  slippage?: number;
  priorityFee?: number;
  pool?: string;
}) => {
  try {
    const response = await fetch('https://pumpportal.fun/api/trade-local', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        publicKey,
        action,
        mint,
        amount,
        denominatedInSol,
        slippage,
        priorityFee,
        pool,
      }),
    });

    if (response.status !== 200) {
      throw new Error(`Pump API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.arrayBuffer();
    const tx = VersionedTransaction.deserialize(new Uint8Array(data));

    const signedTx = await signTransaction(tx);

    const sig = await connection.sendRawTransaction(signedTx.serialize(), {
      skipPreflight: true,
      maxRetries: 3,
    });

    await connection.confirmTransaction(sig, 'confirmed');

    return {
      success: true,
      signature: sig,
      link: `https://solscan.io/tx/${sig}`,
    };
  } catch (err: any) {
    console.error('Pump Swap Error:', err);
    return { success: false, error: err.message };
  }
};

/*
import { VersionedTransaction, Connection, Keypair } from '@solana/web3.js';
import bs58 from 'bs58';

const RPC_ENDPOINT = 'https://mainnet.helius-rpc.com/?api-key=77aae9b3-ad37-4523-8caf-dea409d5519e';
const connection = new Connection(RPC_ENDPOINT, 'confirmed');

export const performSwap = async ({
  action, // "buy" | "sell"
  mint, // token address
  amount, // number | string (e.g. "100%" for sell all)
  publicKey, // wallet pubkey
  signTransaction, // phantom / backpack signer
  denominatedInSol = true,
  slippage = 10,
  priorityFee = 0.00001,
  pool = 'auto',
}: {
  action: 'buy' | 'sell';
  mint: string;
  amount: number | string;
  publicKey: string;
  signTransaction: (tx: VersionedTransaction) => Promise<VersionedTransaction>;
  denominatedInSol?: boolean;
  slippage?: number;
  priorityFee?: number;
  pool?: string;
}) => {
  try {
    const response = await fetch('https://pumpportal.fun/api/trade-local', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        publicKey,
        action,
        mint,
        amount,
        denominatedInSol,
        slippage,
        priorityFee,
        pool,
      }),
    });

    if (response.status !== 200) {
      throw new Error(`Pump API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.arrayBuffer();
    const tx = VersionedTransaction.deserialize(new Uint8Array(data));

    const signedTx = await signTransaction(tx);

    const sig = await connection.sendRawTransaction(signedTx.serialize(), {
      skipPreflight: true,
      maxRetries: 3,
    });

    await connection.confirmTransaction(sig, 'confirmed');

    return {
      success: true,
      signature: sig,
      link: `https://solscan.io/tx/${sig}`,
    };
  } catch (err: any) {
    console.error('Pump Swap Error:', err);
    return { success: false, error: err.message };
  }
};


*/
