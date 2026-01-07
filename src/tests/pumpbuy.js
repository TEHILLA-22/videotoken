import { VersionedTransaction, Connection, Keypair } from '@solana/web3.js';
import bs58 from "bs58";

const RPC_ENDPOINT = "https://api.mainnet-beta.solana.com"; // Or your custom RPC
const web3Connection = new Connection(RPC_ENDPOINT, 'confirmed');

// Wallet setup
const PUBLIC_KEY = ""; // Replace with your wallet public key
const PRIVATE_KEY = ""; // Replace with your private key (bs58 encoded)

// Trade function
async function tradeToken(action, mint, amount, denominatedInSol = true, slippage = 10, priorityFee = 0.00001, pool = "auto") {
    try {
        console.log(`\n➡️ Performing ${action.toUpperCase()}...`);

        const response = await fetch("https://pumpportal.fun/api/trade-local", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                publicKey: PUBLIC_KEY,
                action,                   // "buy" or "sell"
                mint,                     // token contract address
                amount,                   // amount of SOL or tokens
                denominatedInSol: denominatedInSol ? "true" : "false",
                slippage,                 // slippage %
                priorityFee,              // priority fee
                pool                      // trading pool
            })
        });

        if (response.status !== 200) {
            console.error("❌ Error:", response.status, response.statusText);
            return;
        }

        // Deserialize transaction
        const data = await response.arrayBuffer();
        const tx = VersionedTransaction.deserialize(new Uint8Array(data));

        // Sign transaction
        const signerKeyPair = Keypair.fromSecretKey(bs58.decode(PRIVATE_KEY));
        tx.sign([signerKeyPair]);

        // Send transaction
        const signature = await web3Connection.sendTransaction(tx);
        console.log(`✅ Success! View: https://solscan.io/tx/${signature}`);
    } catch (err) {
        console.error("⚠️ Transaction failed:", err);
    }
}

// Example usage
(async () => {
    const TOKEN_MINT = "HridpTJGJMRN5FNt7bwLEBLnVmG9QWJyYeaTC6ErCo1p"; // Example: "9n4nbM75f5Ui33ZbPYXn59EwSgE8CGsHtAeTH5YFeJ9E"

    // Buy example: Spend 0.05 SOL to buy token
   // await tradeToken("buy", TOKEN_MINT, 0.01, true);

    // Sell example: Sell 100% of tokens in wallet
    await tradeToken("sell", TOKEN_MINT, "100%", false);
})();
