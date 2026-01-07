// lib/api.ts
import axios from "axios";
import { OHLCV } from "@/types/ohlcv";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "https://ohlcv.onrender.com";

export async function fetchOHLCV(mint: string): Promise<OHLCV[]> {
  const res = await axios.get<OHLCV[]>(`${API_BASE}/ohlcv/${mint}`);
  return res.data;
}

export async function fetchTokens(): Promise<any[]> {
  const res = await axios.get<any[]>(`${API_BASE}/tokens`);
  return res.data;
}
