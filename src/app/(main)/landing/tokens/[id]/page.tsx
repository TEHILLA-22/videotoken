import TradingModePanel from "@/components/customs/tokens/trading-mode"




export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } =await params;

  return <TradingModePanel tokenMint={id} />;
}
