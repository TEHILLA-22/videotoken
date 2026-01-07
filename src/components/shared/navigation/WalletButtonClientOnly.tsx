"use client"
import dynamic from "next/dynamic";

// Dynamically import WalletMultiButton with SSR disabled
const WalletMultiButton = dynamic(
  () => import("@solana/wallet-adapter-react-ui").then(mod => mod.WalletMultiButton),
  { ssr: false }
);

export default function WalletButtonClientOnly(props: any) {
  return <WalletMultiButton {...props} />;
}