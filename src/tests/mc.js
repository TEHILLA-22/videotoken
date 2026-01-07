import fetch from 'node-fetch';

const API_KEY = 'YOUR_BIRDEYE_API_KEY';
const tokenAddress = '9iEfBGpdX1dpgu3cbZAaKbSh8q6TLsP7qXp8mKWv5hWj';

async function getMarketCap() {
  const url = `https://public-api.birdeye.so/public/token_marketcap?address=${tokenAddress}`;
  const res = await fetch(url, {
    headers: {
      'X-API-KEY': API_KEY,
      accept: 'application/json',
    },
  });

  const data = await res.json();
  if (data.success && data.data) {
    console.log('Market Cap:', data.data.mc);
  } else {
    console.error('⚠️ Failed to fetch token data:', data);
  }
}

getMarketCap();
