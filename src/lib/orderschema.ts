export type OrderSide = 'buy' | 'sell';
export type OrderType = 'market' | 'limit';

export interface OrderPayload {
  userAddress: string;
  tokenMint: string;

  side: OrderSide;
  orderType: OrderType;

  amountSol: number;
  limitPrice?: number;
  executedPrice?: number;

  txSignature: string;
}
