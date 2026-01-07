const { VersionedTransaction, Connection, Keypair } = require('@solana/web3.js');
const bs58 = require("bs58");
const { readFile } = require("fs/promises");
const { Blob } = require("buffer");
const FormData = require("form-data"); 
const fetch = require("node-fetch");   

const RPC_ENDPOINT = "https://mainnet.helius-rpc.com/?api-key=77aae9b3-ad37-4523-8caf-dea409d5519e";

const web3Connection = new Connection(
    RPC_ENDPOINT,
    'confirmed',
);

async function sendLocalCreateTx(){
    try {
        console.log("🔑 Decoding signer keypair...");
        const signerKeyPair = Keypair.fromSecretKey(
            bs58.decode("")
        );
        console.log("✅ Signer pubkey:", signerKeyPair.publicKey.toBase58());

        const mintKeypair = Keypair.generate(); 
        console.log("✅ Generated mint pubkey:", mintKeypair.publicKey.toBase58());

        console.log("📂 Reading image file...");
        const fileBuffer = await readFile("./example.jpg");
        console.log("✅ File loaded, size:", fileBuffer.length, "bytes");

        const formData = new FormData();

       formData.append("file", fileBuffer, {
  filename: "example.jpg",
  contentType: "image/jpeg"
});



        formData.append("name", "jobinson");
        formData.append("symbol", "JBX");
        formData.append("description", "This is an example token created via PumpPortal.fun");
       formData.append("twitter", "https://x.com/a1lon9/status/1812970586420994083");
       formData.append("telegram", "https://x.com/a1lon9/status/1812970586420994083");
       formData.append("website", "https://pumpportal.fun");
       formData.append("showName", "true");

        console.log("🌐 Uploading metadata to pump.fun...");
        const metadataResponse = await fetch("https://pump.fun/api/ipfs", {
            method: "POST",
            body: formData,
            headers: formData.getHeaders()
        });
        console.log("📡 Metadata upload status:", metadataResponse.status);

        if (!metadataResponse.ok) {
            console.error("❌ Metadata upload failed:", await metadataResponse.text());
            return;
        }

        const metadataResponseJSON = await metadataResponse.json();
        console.log("✅ Metadata uploaded:", metadataResponseJSON);

        // Create transaction
        console.log("🌐 Requesting create transaction from trade-local...");
        const response = await fetch(`https://pumpportal.fun/api/trade-local`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                publicKey: signerKeyPair.publicKey.toBase58(),
                action: "create",
                tokenMetadata: {
                    name: metadataResponseJSON.metadata.name,
                    symbol: metadataResponseJSON.metadata.symbol,
                    uri: metadataResponseJSON.metadataUri
                },
                mint: mintKeypair.publicKey.toBase58(),
                denominatedInSol: "true",
                amount: 0.001, // dev buy
                slippage: 10, 
                priorityFee: 0.0005,
                pool: "pump"
            })
        });
        console.log("📡 Trade-local status:", response.status);

        if(response.status !== 200){ 
            console.error("❌ Trade-local failed:", response.status, await response.text());
            return;
        }

        console.log("📦 Deserializing transaction...");
        const data = await response.arrayBuffer();
        const tx = VersionedTransaction.deserialize(new Uint8Array(data));

        console.log("✍️  Signing transaction...");
        tx.sign([mintKeypair, signerKeyPair]);

        console.log("🚀 Sending transaction to Solana...");
        const signature = await web3Connection.sendTransaction(tx);
        console.log("✅ Transaction sent:", "https://solscan.io/tx/" + signature);

    } catch (err) {
        console.error("🔥 Error in sendLocalCreateTx:", err);
    }
}

sendLocalCreateTx();