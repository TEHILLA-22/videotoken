import fetch from 'node-fetch';

async function getTokenData(mintAddress) {
  const url = `https://lite-api.jup.ag/ultra/v1/search?query=${mintAddress}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.length === 0) {
      console.log('Token not found.');
      return;
    }

    const token = data[0];
    const { name, symbol, mcap, holderCount, liquidity, usdPrice } = token;

    console.log(`🪙 Token: ${name} (${symbol})`);
    console.log(`💰 Market Cap: $${mcap.toLocaleString()}`);
    console.log(`👥 Holders: ${holderCount.toLocaleString()}`);
    console.log(`💧 Liquidity: $${liquidity.toLocaleString()}`);
    console.log(`💵 Price: $${usdPrice}`);

    return { name, symbol, mcap, holderCount, liquidity, usdPrice };
  } catch (err) {
    console.error('Error fetching token data:', err);
  }
}

getTokenData('DMwbVy48dWVKGe9z1pcVnwF3HLMLrqWdDLfbvx8RchhK');
