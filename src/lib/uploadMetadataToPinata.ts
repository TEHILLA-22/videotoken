// lib/pinata.ts
import axios from "axios";

const PINATA_JWT = process.env.NEXT_PUBLIC_PINATA_JWT; // store securely in .env file

export async function uploadMetadataToPinata(metadata: {
  name: string;
  symbol: string;
  description?: string;
  image: string;
  video?: string;
}) {
  const pinataUrl = "https://api.pinata.cloud/pinning/pinJSONToIPFS";

  const body = {
    pinataContent: {
      name: metadata.name,
      symbol: metadata.symbol,
      description: metadata.description || "",
      image: metadata.image,
      video: metadata.video || "",
    },
    pinataMetadata: {
      name: `${metadata.name}-metadata`,
    },
  };

  const response = await axios.post(pinataUrl, body, {
    headers: {
      Authorization: `Bearer ${PINATA_JWT}`,
      "Content-Type": "application/json",
    },
  });

  return `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
}
