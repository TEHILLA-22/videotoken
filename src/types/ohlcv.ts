// types/index.ts
export interface OHLCV {
  timestamp: number; // in ms from API
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}
