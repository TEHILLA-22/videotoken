'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { ReusableFormField } from '@/components/shared/form/Input';
import { Form } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateTokenSchema, CreateTokenSchemaType } from '@/constants/validations/create-token';
import { UploadPhoto, UploadVideo } from './uploads';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import axios from 'axios';
import { VersionedTransaction, Connection, PublicKey, Keypair } from '@solana/web3.js';
import { useAppKitAccount, useAppKitProvider } from '@reown/appkit/react';
import { useAppKitConnection, type Provider } from '@reown/appkit-adapter-solana/react';

const OHLCV_URL = 'https://ohlcv.onrender.com';

const PINATA_API_KEY = 'd9805c7dc7dfcc3b8b32';
const PINATA_API_SECRET = 'dbc9a55e0c0d2c4f01ad3d0ffc62fb4996eb5afe4a65a85b112d0dce05b7d383';
const HELIUS_API_KEY = '77aae9b3-ad37-4523-8caf-dea409d5519e';
const HELIUS_RPC_URL = `https://mainnet.helius-rpc.com/?api-key=${HELIUS_API_KEY}`;

const defaultConnection = new Connection(HELIUS_RPC_URL, 'confirmed');

function CreateToken() {
  const [loading, setLoading] = useState(false);
  const [transactionStatus, setTransactionStatus] = useState<
    'idle' | 'signing' | 'sending' | 'success' | 'error'
  >('idle');
  const [errorDetails, setErrorDetails] = useState<string>('');

  const { address, isConnected } = useAppKitAccount();
  const { walletProvider } = useAppKitProvider<Provider>('solana');
  const { connection: appKitConnection } = useAppKitConnection();
  const connection = appKitConnection || defaultConnection;

  const form = useForm<CreateTokenSchemaType>({
    resolver: zodResolver(CreateTokenSchema),
    mode: 'onChange',
    defaultValues: {
      token_name: '',
      description: '',
      decimals: 9,
      initial_supply: undefined,
      instagram_url: '',
      other_socials: '',
      telegram_url: '',
      token_photo: '',
      token_symbol: '',
      token_video: '',
      website_url: '',
    },
  });

  const handleVideoUpload = (file: File) => {
    form.setValue('token_video', file, { shouldValidate: true });
  };

  const handlePhotoUpload = (file: File) => {
    form.setValue('token_photo', file, { shouldValidate: true });
  };

  const uploadToPinata = async (file: File) => {
    const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
    const data = new FormData();
    data.append('file', file);

    const res = await axios.post(url, data, {
      maxBodyLength: Infinity,
      headers: {
        'Content-Type': 'multipart/form-data',
        pinata_api_key: PINATA_API_KEY,
        pinata_secret_api_key: PINATA_API_SECRET,
      },
    });
    return `https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`;
  };

  const uploadMetadataToPinata = async (metadata: any) => {
    const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
    const res = await axios.post(url, metadata, {
      headers: {
        pinata_api_key: PINATA_API_KEY,
        pinata_secret_api_key: PINATA_API_SECRET,
      },
    });
    return `https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`;
  };

  async function onSubmit(values: CreateTokenSchemaType) {
    setLoading(true);
    setTransactionStatus('signing');
    setErrorDetails('');

    try {
      if (!isConnected || !address || !walletProvider) {
        throw new Error('Wallet not connected');
      }

      // 1️⃣ Upload assets
      const [imageUri, videoUri] = await Promise.all([
        uploadToPinata(values.token_photo as File),
        uploadToPinata(values.token_video as File),
      ]);

      const metadataUri = await uploadMetadataToPinata({
        name: values.token_name,
        symbol: values.token_symbol,
        description: values.description,
        image: imageUri,
        animation_url: videoUri,
        external_url: values.website_url,
      });

      // 2️⃣ Mint keypair
      const mintKeypair = Keypair.generate();

      // 3️⃣ Request unsigned tx from Pump
      const response = await fetch('https://pumpportal.fun/api/trade-local', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          publicKey: address,
          action: 'create',
          tokenMetadata: {
            name: values.token_name,
            symbol: values.token_symbol,
            uri: metadataUri,
          },
          mint: mintKeypair.publicKey.toString(),
          denominatedInSol: 'true',
          amount: 0.005,
          slippage: 10,
          priorityFee: 0.0005,
          pool: 'pump',
        }),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      // 4️⃣ Deserialize tx
      const txBuffer = await response.arrayBuffer();
      const tx = VersionedTransaction.deserialize(new Uint8Array(txBuffer));

      // 5️⃣ Sign with mint keypair FIRST
      tx.sign([mintKeypair]);

      // 6️⃣ Wallet signs (Reown)
      const signedTx = await walletProvider.signTransaction(tx);

      // 7️⃣ Send
      setTransactionStatus('sending');
      if (!connection) {
        throw new Error('Connection not available');
      }
      const sig = await connection.sendRawTransaction(signedTx.serialize(), {
        skipPreflight: false,
      });

      await connection.confirmTransaction(sig, 'confirmed');

      setTransactionStatus('success');
      alert(`✅ Token Created!\nhttps://solscan.io/tx/${sig}`);
    } catch (err: any) {
      console.error(err);
      setTransactionStatus('error');
      setErrorDetails(err.message || 'Failed to create token');
    } finally {
      setLoading(false);
    }
  }

  /*
  async function onSubmit(values: CreateTokenSchemaType) {
    setLoading(true);
    setTransactionStatus('signing');
    setErrorDetails('');

    try {
      if (!connected || !publicKey || !signTransaction) {
        throw new Error('Wallet not connected. Please connect your wallet first.');
      }

      // Upload image and video
      setTransactionStatus('signing');
      const [imageUri, videoUri] = await Promise.all([
        uploadToPinata(values.token_photo as File),
        uploadToPinata(values.token_video as File),
      ]);

      // Upload metadata
      const metadata = {
        name: values.token_name,
        symbol: values.token_symbol,
        description: values.description,
        image: imageUri,
        animation_url: videoUri,
        external_url: values.website_url,
      };
      const metadataUri = await uploadMetadataToPinata(metadata);

      // Generate a random keypair for the token mint
      const mintKeypair = Keypair.generate();

      // Prepare transaction
      const response = await fetch('https://pumpportal.fun/api/trade-local', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          publicKey: publicKey.toString(),
          action: 'create',
          tokenMetadata: {
            name: values.token_name,
            symbol: values.token_symbol,
            uri: metadataUri,
          },
          mint: mintKeypair.publicKey.toString(),
          denominatedInSol: 'true',
          amount: 0.005,
          slippage: 10,
          priorityFee: 0.0005,
          pool: 'pump',
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API Error: ${errorText}`);
      }

      const txBuffer = await response.arrayBuffer();
      const tx = VersionedTransaction.deserialize(new Uint8Array(txBuffer));

      // Sign transaction with both mint keypair and wallet
      // First, sign with the mint keypair
      tx.sign([mintKeypair]);

      // Then, have the wallet sign it
      const signedTx = await signTransaction(tx);

      // Send transaction
      setTransactionStatus('sending');
      const sig = await connection.sendRawTransaction(signedTx.serialize(), {
        skipPreflight: false,
        preflightCommitment: 'processed',
      });

      // Save token info
      await axios.post('/api/token', {
        mint: mintKeypair.publicKey.toString(),
        name: values.token_name,
        symbol: values.token_symbol,
        amount: values.initial_supply,
        decimals: values.decimals ?? 9,
        videoUri: videoUri,
        imageUri: imageUri,
        description: values.description,
        telegram: values.telegram_url,
        instagram: values.instagram_url,
        website: values.website_url,
        other_socials: values.other_socials,
        createdAt: new Date().toISOString(),
      });

      // sending to ohlcv database
      try {
        await axios.post(`${OHLCV_URL}/add-token`, {
          mint: mintKeypair.publicKey.toString(),
          name: values.token_name,
          symbol: values.token_symbol,
        });
        console.log('✅ Token saved to local DB');
      } catch (saveErr: any) {
        console.error('❌ Failed to save token locally:', saveErr.message);
      }

      setTransactionStatus('success');
      alert(`✅ Token Created!\nTx: https://solscan.io/tx/${sig}?cluster=mainnet`);
    } catch (err: any) {
      console.error('Full error:', err);
      setTransactionStatus('error');

      // Enhanced error handling
      if (err.message.includes('simulation failed')) {
        setErrorDetails(
          'Transaction simulation failed. This might be due to insufficient funds, network congestion, or an issue with the token parameters.',
        );
      } else if (err.message.includes('signature verification failed')) {
        setErrorDetails(
          'Signature verification failed. Please ensure your wallet is properly connected and try again.',
        );
      } else {
        setErrorDetails(err.message || 'An unknown error occurred');
      }

      alert(`❌ Error creating token: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }
  */

  const socials = [
    { name: 'instagram_url', label: 'Instagram', placeholder: 'Enter the URL' },
    { name: 'website_url', label: 'Website', placeholder: 'Enter Link URL' },
    { name: 'telegram_url', label: 'Telegram', placeholder: 'Enter the Link' },
  ];

  return (
    <div className="flex flex-col w-full 2xl:max-w-[90%] mx-auto h-full pb-10">
      <h1 className="text-3xl font-semibold text-white mb-2">Create Video Token</h1>
      <p className="text-white/70 mb-6">Create your own token with custom video and metadata</p>

      {/* Status Indicators */}
      {transactionStatus === 'signing' && (
        <div className="bg-blue-500/20 text-blue-200 p-3 rounded-lg mb-4 flex items-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
          Signing transaction...
        </div>
      )}

      {transactionStatus === 'sending' && (
        <div className="bg-blue-500/20 text-blue-200 p-3 rounded-lg mb-4 flex items-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
          Sending transaction to network...
        </div>
      )}

      {transactionStatus === 'error' && (
        <div className="bg-red-500/20 text-red-200 p-3 rounded-lg mb-4">
          <div className="font-bold">Error creating token</div>
          <div className="text-sm mt-1">{errorDetails}</div>
        </div>
      )}

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 flex flex-col w-full relative z-10"
        >
          {/* Name + Symbol */}
          <div className="flex flex-col lg:flex-row items-center w-full mt-5 gap-5">
            <ReusableFormField
              control={form.control}
              name="token_name"
              label="Token Name"
              placeholder="Token"
              className="focus:border-[#FFEA00] text-white placeholder:text-white/50 border-white/25 w-full"
            />
            <ReusableFormField
              control={form.control}
              name="token_symbol"
              label="Token Symbol"
              placeholder="TKN"
              className="focus:border-[#FFEA00] text-white placeholder:text-white/50 border-white/25 w-full"
            />
          </div>

          {/* Video */}
          <div>
            <Label className="text-white urbanist pb-2">Video Token</Label>
            <UploadVideo onUpload={handleVideoUpload} />
          </div>

          {/* Supply + Decimals */}
          <div className="flex flex-col lg:flex-row items-center w-full gap-5">
            <ReusableFormField
              control={form.control}
              name="initial_supply"
              label="Initial Supply"
              type="number"
              placeholder="1,000,000"
              className="focus:border-[#FFEA00] text-white placeholder:text-white/50 border-white/25 w-full"
            />
            <ReusableFormField
              control={form.control}
              name="decimals"
              label="Decimals"
              type="number"
              placeholder="9"
              className="focus:border-[#FFEA00] text-white placeholder:text-white/50 border-white/25 w-full"
            />
          </div>

          {/* Description */}
          <ReusableFormField
            control={form.control}
            name="description"
            label="Description"
            placeholder="Enter a description"
            fieldType="textarea"
            className="focus:border-[#FFEA00] text-white min-h-36 resize-none placeholder:text-white/50 border-white/25 w-full"
          />

          {/* Immutable checkbox */}
          <div className="flex items-center space-x-2">
            <Checkbox id="mutate_meta_data" className="text-white" />
            <label htmlFor="mutate_meta_data" className="text-sm font-light urbanist text-white">
              Make metadata immutable
            </label>
          </div>

          {/* Socials */}
          <div className="grid grid-cols-1 sm:grid-cols-2 w-full gap-5">
            {socials.map(({ name, label, placeholder }) => (
              <ReusableFormField
                key={name}
                control={form.control}
                name={name}
                label={label}
                type="url"
                placeholder={placeholder}
                className="focus:border-[#FFEA00] text-white placeholder:text-sm placeholder:text-white/50 border-white/25 w-full"
              />
            ))}
            <ReusableFormField
              control={form.control}
              name="other_socials"
              label="Other Socials"
              type="url"
              placeholder="Enter link"
              className="focus:border-[#FFEA00] text-white placeholder:text-white/50 border-white/25 w-full"
            />
          </div>

          {/* Photo */}
          <div>
            <Label className="text-white urbanist pb-2">Token Photo</Label>
            <UploadPhoto onUpload={handlePhotoUpload} />
          </div>

          <Button
            type="submit"
            disabled={loading || !isConnected}
            className="w-full py-3 bg-amber-400 hover:bg-amber-600 text-black font-bold"
          >
            {!isConnected ? 'Connect Wallet First' : loading ? 'Creating Token...' : 'Create Token'}
          </Button>
        </form>
      </Form>
    </div>
  );
}

export default CreateToken;
