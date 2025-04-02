'use client';

import { useState } from 'react';
import Image from 'next/image';
interface TokenInfo {
  name: string;
  symbol: string;
  description: string;
  image: string;
  socials: Array<{ type: string; url: string }>;
  profile: {
    header: boolean;
    website: boolean;
    twitter: boolean;
    discord: boolean;
    linkCount: number;
  };
}

interface TradingStatsProps {
  data: {
    pairs: Array<{
      dexId: string;
      priceUsd: string;
      volume: { h24: number; h6: number; h1: number; m5: number };
      txns: {
        h24: { buys: number; sells: number };
        h6: { buys: number; sells: number };
        h1: { buys: number; sells: number };
        m5: { buys: number; sells: number };
      };
      priceChange: { h24: number; h6: number; h1: number; m5: number };
      liquidity: { usd: number; base: number; quote: number };
      marketCap: number;
      url: string;
      baseToken: {
        address: string;
        name: string;
        symbol: string;
      };
      quoteToken: {
        address: string;
        name: string;
        symbol: string;
      };
    }>;
    ti?: TokenInfo;
    holders?: {
      count: number;
      totalSupply: string;
      holders: Array<unknown>;
    };
    lpHolders?: {
      count: number;
      totalSupply: string;
      holders: Array<unknown>;
    };
  };
}

export default function TradingStats({ data }: TradingStatsProps) {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'m5' | 'h1' | 'h6' | 'h24'>('h24');
  const mainPair = data.pairs[0]; // Using Raydium as main pair
  const tokenInfo = data.ti;
  const contractAddress = mainPair.baseToken.address;
  const pumpSwapUrl = `https://swap.pump.fun/?input=So11111111111111111111111111111111111111112&output=${contractAddress}`;
  const timeframes = [
    { value: 'm5', label: '5M' },
    { value: 'h1', label: '1H' },
    { value: 'h6', label: '6H' },
    { value: 'h24', label: '24H' },
  ] as const;

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `$${(num / 1000000).toFixed(2)}M`;
    if (num >= 1000) return `$${(num / 1000).toFixed(2)}K`;
    return `$${num.toFixed(2)}`;
  };

  const formatSupply = (supply: string) => {
    const num = parseFloat(supply);
    if (num >= 1000000) return `${(num / 1000000).toFixed(2)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(2)}K`;
    return num.toFixed(2);
  };

  return (
    <div className="space-y-6">
      {/* Token Info Section */}
      {tokenInfo && (
        <div className="bg-white/5 p-6 rounded-lg backdrop-blur-sm">
          <div className="flex items-center gap-4 mb-4">
            {tokenInfo.image && (
              <Image 
                src={tokenInfo.image} 
                alt={tokenInfo.name} 
                className="w-12 h-12 rounded-full"
                width={48}
                height={48}
              />
            )}
            <div>
              <h2 className="text-xl font-bold text-yellow-400">{tokenInfo.symbol}</h2>
              <p className="text-sm text-gray-400">{tokenInfo.name}</p>
            </div>
          </div>
          {tokenInfo.description && (
            <p className="text-sm text-gray-300 mb-4">{tokenInfo.description}</p>
          )}
          <div className="flex gap-3">
            {tokenInfo.socials?.map((social, index) => (
              <a
                key={index}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-yellow-400 hover:text-yellow-300 transition-colors"
              >
                {social.type === 'twitter' ? '𝕏 Twitter' : social.type}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Trading Stats Section */}
      <div className="bg-white/5 p-6 rounded-lg backdrop-blur-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-yellow-400">Housing Stats</h3>
          <div className="flex gap-2">
            {timeframes.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setSelectedTimeframe(value)}
                className={`px-3 py-1 rounded-full text-sm transition-all ${
                  selectedTimeframe === value
                    ? 'bg-yellow-500 text-black font-bold'
                    : 'bg-white/10 hover:bg-white/20'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white/10 p-4 rounded-lg hover:bg-white/15 transition-all transform hover:scale-105">
            <h4 className="text-gray-400 mb-2">Volume</h4>
            <p className="text-2xl font-bold text-white">
              {formatNumber(mainPair.volume[selectedTimeframe])}
            </p>
          </div>

          <div className="bg-white/10 p-4 rounded-lg hover:bg-white/15 transition-all transform hover:scale-105">
            <h4 className="text-gray-400 mb-2 text-center">Transactions</h4>
            <div className="flex gap-4 justify-center">
              <p className="text-green-400">
                {mainPair.txns[selectedTimeframe].buys} Buys
              </p>
              <p className="text-red-400">
                {mainPair.txns[selectedTimeframe].sells} Sells
              </p>
            </div>
          </div>

          <div className="bg-white/10 p-4 rounded-lg hover:bg-white/15 transition-all transform hover:scale-105">
            <h4 className="text-gray-400 mb-2">Price Change</h4>
            <p className={`text-2xl font-bold ${
              mainPair.priceChange[selectedTimeframe] >= 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              {mainPair.priceChange[selectedTimeframe].toFixed(2)}%
            </p>
          </div>

          <div className="bg-white/10 p-4 rounded-lg hover:bg-white/15 transition-all transform hover:scale-105">
            <h4 className="text-gray-400 mb-2">Market Cap</h4>
            <p className="text-2xl font-bold text-white">
              {formatNumber(mainPair.marketCap)}
            </p>
          </div>
        </div>

        <div className="w-full py-4">
          <div className="bg-white/10 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="text-gray-400">Liquidity</h4>
                <p className="text-xl font-bold text-white">{formatNumber(mainPair.liquidity.usd)}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-400">Trading on</p>
                <a 
                  href={mainPair.dexId === 'pumpswap' ? pumpSwapUrl : mainPair.url}
                  target="_blank"
                  rel="noopener noreferrer" 
                  className="text-lg font-bold text-yellow-400 capitalize hover:text-yellow-300"
                >
                  {mainPair.dexId} 🔗
                </a>
              </div>
            </div>
          </div>

          {data.holders && (
            <div className="bg-white/10 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-gray-400">Holders</h4>
                  <p className="text-xl font-bold text-white">{data.holders.count.toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-400">Total Supply</p>
                  <p className="text-lg font-bold text-yellow-400">
                    {formatSupply(data.holders.totalSupply)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* {data.pairs.length > 1 && (
          <div className="mt-4">
            <h4 className="text-gray-400 mb-2">Other Trading Pairs</h4>
            <div className="space-y-2">
              {data.pairs.slice(1).map((pair, index) => (
                <a
                  key={index}
                  href={pair.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-white/5 p-3 rounded hover:bg-white/10 transition-all"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-yellow-400 capitalize">{pair.dexId}</span>
                    <span className="text-white">{formatNumber(pair.liquidity.usd)} Liquidity</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )} */}
      </div>
    </div>
  );
} 