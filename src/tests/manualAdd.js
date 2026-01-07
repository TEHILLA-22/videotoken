// manualAdd.ts
const fetch = require('node-fetch');

async function addToken() {
  const response = await fetch("http://localhost:3000/api/saveToken", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      mint: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
      name: "USDT",
      symbol: "USDT",
      amount: 2389926732,
      decimals: 9,
      videoUri: "https://gateway.pinata.cloud/ipfs/Qme7m1opF7WWDGu55nQCgR8ghW6gvYfGJjo5u2Ejy4gVAE",
      imageUri: "https://amaranth-advanced-gerbil-6.mypinata.cloud/ipfs/bafkreiepq2k4zxdrkern4m5iae7r47mfpuftpdmeyve5k3qu7sowa7qarq",
      description: "USD Tether is a token pegged to United State Dollar",
      telegram: "https://t.me/mytoken",
      instagram: "https://instagram.com/mytoken",
      website: "https://tether.to/en/",
      other_socials: "https://twitter.com/mytoken",
      createdAt: new Date().toISOString()
    })
  });

  const result = await response.json();
  console.log(result);
}

addToken();
