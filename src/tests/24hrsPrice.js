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
    const { name, symbol, mcap, holderCount, liquidity, usdPrice, stats24h } = token;

    const priceChange24h = stats24h?.priceChange ?? 0;

    console.log(`🪙 Token: ${name} (${symbol})`);
    console.log(`💰 Market Cap: $${mcap.toLocaleString()}`);
    console.log(`👥 Holders: ${holderCount.toLocaleString()}`);
    console.log(`💧 Liquidity: $${liquidity.toLocaleString()}`);
    console.log(`💵 Price: $${usdPrice}`);
    console.log(`📈 24h Change: ${priceChange24h}%`);

    return {
      name,
      symbol,
      mcap,
      holderCount,
      liquidity,
      usdPrice,
      priceChange24h,
    };
  } catch (err) {
    console.error('Error fetching token data:', err);
  }
}

getTokenData('DMwbVy48dWVKGe9z1pcVnwF3HLMLrqWdDLfbvx8RchhK');

/*


[
  {
    id: '<string>',
    name: '<string>',
    symbol: '<string>',
    icon: '<string>',
    decimals: 123,
    twitter: '<string>',
    telegram: '<string>',
    website: '<string>',
    dev: '<string>',
    circSupply: 123,
    totalSupply: 123,
    tokenProgram: '<string>',
    launchpad: '<string>',
    partnerConfig: '<string>',
    graduatedPool: '<string>',
    graduatedAt: '<string>',
    holderCount: 123,
    fdv: 123,
    mcap: 123,
    usdPrice: 123,
    priceBlockId: 123,
    liquidity: 123,
    stats5m: {
      priceChange: 123,
      holderChange: 123,
      liquidityChange: 123,
      volumeChange: 123,
      buyVolume: 123,
      sellVolume: 123,
      buyOrganicVolume: 123,
      sellOrganicVolume: 123,
      numBuys: 123,
      numSells: 123,
      numTraders: 123,
      numOrganicBuyers: 123,
      numNetBuyers: 123,
    },
    stats1h: {
      priceChange: 123,
      holderChange: 123,
      liquidityChange: 123,
      volumeChange: 123,
      buyVolume: 123,
      sellVolume: 123,
      buyOrganicVolume: 123,
      sellOrganicVolume: 123,
      numBuys: 123,
      numSells: 123,
      numTraders: 123,
      numOrganicBuyers: 123,
      numNetBuyers: 123,
    },
    stats6h: {
      priceChange: 123,
      holderChange: 123,
      liquidityChange: 123,
      volumeChange: 123,
      buyVolume: 123,
      sellVolume: 123,
      buyOrganicVolume: 123,
      sellOrganicVolume: 123,
      numBuys: 123,
      numSells: 123,
      numTraders: 123,
      numOrganicBuyers: 123,
      numNetBuyers: 123,
    },
    stats24h: {
      priceChange: 123,
      holderChange: 123,
      liquidityChange: 123,
      volumeChange: 123,
      buyVolume: 123,
      sellVolume: 123,
      buyOrganicVolume: 123,
      sellOrganicVolume: 123,
      numBuys: 123,
      numSells: 123,
      numTraders: 123,
      numOrganicBuyers: 123,
      numNetBuyers: 123,
    },
    firstPool: {
      id: '<string>',
      createdAt: '<string>',
    },
    audit: {
      isSus: true,
      mintAuthorityDisabled: true,
      freezeAuthorityDisabled: true,
      topHoldersPercentage: 123,
      devBalancePercentage: 123,
      devMigrations: 123,
    },
    organicScore: 123,
    organicScoreLabel: 'high',
    isVerified: true,
    cexes: ['<string>'],
    tags: ['<string>'],
    updatedAt: '2023-11-07T05:31:56Z',
  },
];


*/
