/*
import { z } from "zod";
import {
  Keypair,
  SystemProgram,
  Transaction,
  PublicKey,
  Connection,
} from "@solana/web3.js";
import {
  createInitializeMintInstruction,
  getAssociatedTokenAddress,
  createMintToInstruction,
  TOKEN_2022_PROGRAM_ID,
} from "@solana/spl-token";

export const CreateTokenSchema = z.object({
  token_name: z
    .string()
    .min(2, "Token name must be at least 2 characters")
    .max(50, "Token name is too long"),
  token_symbol: z
    .string()
    .min(1, "Token symbol must be at least 1 character")
    .max(10, "Token symbol is too long"),
  initial_supply: z.number().min(1, "Supply must be greater than 0"),
  decimals: z.number().min(1, "Decimals typically range from 0 to 18"),
  description: z.string().max(500, "Description is too long").optional(),
  instagram_url: z.string().url("Enter a valid Instagram URL").optional(),
  website_url: z.string().url("Enter a valid Website URL").optional(),
  Telegram_url: z.string().url("Enter a valid Telegram URL").optional(),
  other_socials: z.string().optional(),
  token_photo: z.any().optional(),
  token_video: z.any().optional(),
});

export type CreateTokenSchemaType = z.infer<typeof CreateTokenSchema>;

export async function createTokenOnSolana({
  connection,
  wallet,
  name,
  symbol,
  decimals,
  amount,
  metadataUri,
}: {
  connection: Connection;
  wallet: any;
  name: string;
  symbol: string;
  decimals: number;
  amount: number;
  metadataUri: string;
}) {
  const mintKeypair = Keypair.generate();

  const associatedToken = await getAssociatedTokenAddress(
    mintKeypair.publicKey,
    wallet.publicKey,
    false,
    TOKEN_2022_PROGRAM_ID
  );

  const space = 82;
  const lamports = await connection.getMinimumBalanceForRentExemption(space);

  const transaction = new Transaction().add(
    SystemProgram.createAccount({
      fromPubkey: wallet.publicKey,
      newAccountPubkey: mintKeypair.publicKey,
      lamports,
      space,
      programId: TOKEN_2022_PROGRAM_ID,
    }),
    createInitializeMintInstruction(
      mintKeypair.publicKey,
      decimals,
      wallet.publicKey,
      wallet.publicKey,
      TOKEN_2022_PROGRAM_ID
    ),
    createMintToInstruction(
      mintKeypair.publicKey,
      associatedToken,
      wallet.publicKey,
      amount,
      [],
      TOKEN_2022_PROGRAM_ID
    )
  );

  const signature = await wallet.sendTransaction(transaction, connection, {
    signers: [mintKeypair],
  });

  await connection.confirmTransaction(signature, "confirmed");
  console.log("Token created at:", mintKeypair.publicKey.toBase58());
}
*/

import { z } from "zod";

export const CreateTokenSchema = z.object({
  token_name: z
    .string()
    .min(2, "Token name must be at least 2 characters")
    .max(50, "Token name is too long"),
  token_symbol: z
    .string()
    .min(1, "Token symbol must be at least 1 character")
    .max(10, "Token symbol is too long"),
  initial_supply: z.coerce.number().min(1, "Supply must be greater than 0"),
  decimals: z.coerce.number().min(1, "Decimals typically range from 0 to 18"),
  description: z.string().max(500, "Description is too long").optional(),
  instagram_url: z.string().url("Enter a valid Instagram URL").optional(),
  website_url: z.string().url("Enter a valid Website URL").optional(),
  telegram_url: z.string().url("Enter a valid Telegram URL").optional(),
  other_socials: z.string().optional(),
  token_photo: z.any().optional(),
  token_video: z.any().optional(),
  //token_photo: z.instanceof(File, {message: "Token is required"}).optional(),
  //token_video: z.instanceof(File, {message: "Token video is required"}).optional(),
});

export type CreateTokenSchemaType = z.infer<typeof CreateTokenSchema>;
    