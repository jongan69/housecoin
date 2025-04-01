import Image from "next/image";
import ContractAddress from './components/ContractAddress';
import TradingStats from './components/TradingStats';
import LootGame from './components/LootGame';
import InteractiveHouse from './components/InteractiveHouse';

export const dynamic = 'force-dynamic';

const URL = process.env.NEXT_PUBLIC_API_URL!;
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!;
const MOONSHOT_LINK = process.env.MOONSHOT_LINK!;

async function getTokenInfo() {
  try {
    const response = await fetch(`${URL}/api/info`, { cache: 'no-store' });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching token info:', error);
    return { pairs: [] };
  }
}

interface Social {
  type: string;
  url: string;
}

interface Pair {
  dexId: string;
  url: string;
  priceUsd: string;
  liquidity: {
    usd: number;
    base: number;
    quote: number;
  };
  volume: {
    h24: number;
    h6: number;
    h1: number;
    m5: number;
  };
  priceChange: {
    h24: number;
    h6: number;
    h1: number;
    m5: number;
  };
  txns: {
    h24: { buys: number; sells: number };
    h6: { buys: number; sells: number };
    h1: { buys: number; sells: number };
    m5: { buys: number; sells: number };
  };
  marketCap: number;
  fdv: number;
  labels?: string[];
  baseToken: {
    name: string;
    symbol: string;
    address: string;
  };
  info: {
    socials: Social[];
  };
}

interface TokenInfo {
  pairs: Pair[];
  pair: [{
    ti: {
      description: string;
      createdAt: string;
      image: string;
      headerImage: string;
    };
    holders: {
      count: number;
      totalSupply: string;
      holders: Array<{
        id: string;
        balance: string;
        percentage: number;
      }>;
    };
    ll: {
      locks: Array<{
        tag: string;
        address: string;
        amount: string;
        percentage: number;
      }>;
      totalPercentage: number;
    };
  }];
}

export default async function Home() {
  const tokenInfo = await getTokenInfo() as TokenInfo;
  // console.log(tokenInfo)
  // Get the pair with highest liquidity, with fallback for empty data
  const mainPair = tokenInfo.pairs && tokenInfo.pairs.length > 0
    ? tokenInfo.pairs.reduce((max, pair) => {
        // Skip pairs without liquidity data
        if (!pair.liquidity?.usd) return max;
        if (!max.liquidity?.usd) return pair;
        return pair.liquidity.usd > max.liquidity.usd ? pair : max;
      }, tokenInfo.pairs[0])
    : null;
  
  // Get social links from the main pair
  const socialLinks = mainPair?.info?.socials || [];

  // If we don't have main pair data, show a loading state
  if (!mainPair || !mainPair.liquidity?.usd) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-900 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl sm:text-6xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-amber-500">
            Loading...
          </h1>
        </div>
      </div>
    );
  }

  // Get holder information
  const holderCount = tokenInfo.pair?.[0]?.holders?.count || 0;
  const totalSupply = tokenInfo.pair?.[0]?.holders?.totalSupply || '0';
  const topHolders = tokenInfo.pair?.[0]?.holders?.holders.slice(0, 5) || [];
  const description = tokenInfo.pair?.[0]?.ti?.description || '';
  const createdAt = tokenInfo.pair?.[0]?.ti?.createdAt ? new Date(tokenInfo.pair[0].ti.createdAt).toLocaleDateString() : '';
  const headerImage = tokenInfo.pair?.[0]?.ti?.headerImage;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900/90 via-black to-indigo-900/90 text-white overflow-hidden">
      {/* Hero Section with Parallax Effect */}
      <div className="relative w-full h-screen overflow-hidden pb-4 sm:pb-8">
        {/* Animated Background */}
        <div className="absolute inset-0 w-full h-full">
          <div className="relative w-full h-full">
            <Image 
              src={headerImage || '/placeholder-header.jpg'} 
              alt="Token Header"
              fill
              priority
              className="object-cover w-full h-full transform scale-105 animate-subtle-zoom"
              sizes="100vw"
              style={{ objectPosition: 'center 20%' }}
            />
            {/* Enhanced overlay with multiple gradient layers */}
            <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-black/90 via-black/80 to-black/90"></div>
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-emerald-500/20 via-transparent to-indigo-500/20"></div>
            <div className="absolute inset-0 w-full h-full bg-[radial-gradient(circle_at_center,transparent_0%,black_100%)]"></div>
          </div>
        </div>
        
        {/* Animated Grid Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
                             linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
            animation: 'gridMove 20s linear infinite'
          }}></div>
        </div>
        
        {/* Floating Elements - Enhanced */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-20 h-20 bg-emerald-500/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute top-40 right-20 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl animate-float-delayed"></div>
          <div className="absolute bottom-20 left-1/2 w-24 h-24 bg-teal-500/10 rounded-full blur-3xl animate-float-more-delayed"></div>
          <div className="absolute top-1/2 right-1/3 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl animate-float-slow"></div>
          <div className="absolute bottom-1/3 left-1/4 w-36 h-36 bg-blue-500/10 rounded-full blur-3xl animate-float-slower"></div>
        </div>

        {/* Animated Particles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white/20 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `particleFloat ${5 + Math.random() * 10}s infinite`,
                animationDelay: `${Math.random() * 5}s`
              }}
            />
          ))}
        </div>

        {/* Main Content - Enhanced */}
        <div className="relative h-full flex flex-col items-center justify-center px-4 z-10">
          <div className="text-center space-y-3 sm:space-y-8 max-w-4xl mx-auto">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-full blur-2xl animate-pulse-slow"></div>
              <div className="relative mx-auto mb-2 sm:mb-8 w-20 h-20 sm:w-40 sm:h-40 animate-float-subtle">
                {tokenInfo.pair?.[0]?.ti?.image && (
                  <Image 
                    src={tokenInfo.pair?.[0]?.ti?.image} 
                    alt="Token Logo" 
                    fill
                    className="rounded-full object-cover border-4 border-emerald-500/30 shadow-lg shadow-emerald-500/10"
                  />
                )}
              </div>
            </div>
            
            <h1 className="text-3xl sm:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-400 to-indigo-400 animate-title-glow">
              HOUSECOIN 
            </h1>
            
            <div className="space-y-2 sm:space-y-6">
              <p className="text-base sm:text-2xl font-semibold text-emerald-400 animate-fade-in-up">
                Flipping the Housing Market, One $HOUSE at a Time 🏗️
              </p>
              <p className="text-sm sm:text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed animate-fade-in-up-delayed">
                {description}
              </p>
              <div className="text-sm sm:text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed animate-fade-in-up-delayed">
                <ContractAddress address={CONTRACT_ADDRESS} />
              </div>
            </div>

            {/* Price Display - Enhanced */}
            <div className="bg-white/5 backdrop-blur-lg rounded-xl sm:rounded-3xl p-3 sm:p-8 shadow-2xl border border-white/10 transform hover:scale-105 transition-all duration-300 animate-fade-in-up">
              <p className="text-2xl sm:text-5xl font-bold text-emerald-400 mb-1 sm:mb-4 animate-pulse-slow">
                ${Number(mainPair?.priceUsd || 0).toFixed(6)} USD
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-1 sm:gap-6 text-xs sm:text-sm">
                <span className="text-green-400 flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  {mainPair.txns.h24.buys} Buys (24h)
                </span>
                <span className="text-red-400 flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></span>
                  {mainPair.txns.h24.sells} Sells (24h)
                </span>
              </div>
            </div>

            {/* Action Buttons - Enhanced */}
            <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-4 mt-4 sm:mt-12 mb-16 sm:mb-0 animate-fade-in-up">
              <a
                href={`https://raydium.io/swap/?inputMint=sol&outputMint=${CONTRACT_ADDRESS}&referrer=9yA9LPCRv8p8V8ZvJVYErrVGWbwqAirotDTQ8evRxE5N`}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative px-4 sm:px-8 py-2 sm:py-4 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full text-sm sm:text-lg font-bold 
                  hover:opacity-90 transition-all transform hover:scale-105 hover:rotate-1 overflow-hidden w-full sm:w-auto"
              >
                <span className="relative z-10">Buy Your First House 🏠</span>
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-white/20 to-emerald-500/0 
                  translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
              </a>
              <a
                href={`https://t.me/bonkbot_bot?start=ref_jyzn2_ca_${CONTRACT_ADDRESS}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative px-4 sm:px-8 py-2 sm:py-4 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full text-sm sm:text-lg font-bold 
                  hover:opacity-90 transition-all transform hover:scale-105 hover:rotate-1 overflow-hidden w-full sm:w-auto"
              >
                <span className="relative z-10">Quick Flip with BONKbot 🤖</span>
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-white/20 to-indigo-500/0 
                  translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
              </a>
              <a
                href={`https://phantom.app/tokens/solana/${CONTRACT_ADDRESS}?referralId=m0ezk5sfqrs`}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative px-4 sm:px-8 py-2 sm:py-4 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full text-sm sm:text-lg font-bold 
                  hover:opacity-90 transition-all transform hover:scale-105 hover:rotate-1 overflow-hidden w-full sm:w-auto"
              >
                <span className="relative z-10">Store in Your Wallet 👻</span>
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-white/20 to-cyan-500/0 
                  translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
              </a>
              <a
                href={MOONSHOT_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative px-4 sm:px-8 py-2 sm:py-4 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full text-sm sm:text-lg font-bold 
                  hover:opacity-90 transition-all transform hover:scale-105 hover:rotate-1 overflow-hidden w-full sm:w-auto"
              >
                <span className="relative z-10">Moon Shot 🚀</span>
                <div className="absolute inset-0 bg-gradient-to-r from-teal-500/0 via-white/20 to-teal-500/0 
                  translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
              </a>
            </div>
          </div>
        </div>

        {/* Scroll Indicator - Adjusted for mobile */}
        <div className="absolute bottom-2 sm:bottom-3 left-1/2 transform -translate-x-1/2 z-10">
          <div className="flex flex-col items-center gap-1">
            <span className="text-xs text-white/50 animate-pulse z-10">Scroll to explore</span>
            <span className="text-xl sm:text-3xl animate-house-bounce">🏠</span>
          </div>
        </div>
      </div>

      {/* Interactive 3D House - More prominent */}
      <div className="container mx-auto px-4 py-8 sm:py-24 relative z-10">
        <div className="bg-white/5 rounded-xl sm:rounded-3xl p-4 sm:p-12 border border-white/10 shadow-2xl">
          <h2 className="text-2xl sm:text-4xl font-bold text-center mb-3 sm:mb-6 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
            Your Digital Home 🏠
          </h2>
          <p className="text-center text-gray-300 mb-6 sm:mb-12 max-w-2xl mx-auto text-sm sm:text-lg leading-relaxed">
            Take a virtual tour of your future home in the crypto world. Visualize your house flipping journey in 3D!
          </p>
          <div className="relative z-20">
            <InteractiveHouse />
          </div>
        </div>
      </div>

      {/* Stats Section - More elegant */}
      <div className="container mx-auto px-4 py-8 sm:py-24 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-8">
          <div className="group bg-white/5 p-4 sm:p-10 rounded-xl sm:rounded-3xl backdrop-blur-lg hover:bg-white/10 transition-all transform hover:scale-105 
            border border-white/10 shadow-2xl hover:shadow-emerald-500/20">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-full blur-xl opacity-0 
                group-hover:opacity-100 transition-opacity"></div>
              <h3 className="text-2xl sm:text-4xl font-bold text-emerald-400 relative">
                {formatNumber(parseFloat(totalSupply))}
              </h3>
            </div>
            <p className="text-base sm:text-xl mt-1 sm:mt-4">Total Supply</p>
            <p className="text-xs sm:text-base text-gray-400 mt-2 sm:mt-6">Enough for a whole neighborhood! 🏘️</p>
          </div>
          
          <div className="group bg-white/5 p-4 sm:p-10 rounded-xl sm:rounded-3xl backdrop-blur-lg hover:bg-white/10 transition-all transform hover:scale-105 
            border border-white/10 shadow-2xl hover:shadow-indigo-500/20">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-full blur-xl opacity-0 
                group-hover:opacity-100 transition-opacity"></div>
              <h3 className="text-2xl sm:text-4xl font-bold text-indigo-400 relative">
                ${formatNumber(mainPair.liquidity.usd)}
              </h3>
            </div>
            <p className="text-base sm:text-xl mt-1 sm:mt-4">Liquidity</p>
            <p className="text-xs sm:text-base text-gray-400 mt-2 sm:mt-6">Solid foundation! 🏗️</p>
          </div>
          
          <div className="group bg-white/5 p-4 sm:p-10 rounded-xl sm:rounded-3xl backdrop-blur-lg hover:bg-white/10 transition-all transform hover:scale-105 
            border border-white/10 shadow-2xl hover:shadow-cyan-500/20">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-full blur-xl opacity-0 
                group-hover:opacity-100 transition-opacity"></div>
              <h3 className="text-2xl sm:text-4xl font-bold text-cyan-400 relative">
                {holderCount.toLocaleString()}
              </h3>
            </div>
            <p className="text-base sm:text-xl mt-1 sm:mt-4">Total Holders</p>
            <p className="text-xs sm:text-base text-gray-400 mt-2 sm:mt-6">Growing community! 👥</p>
          </div>
        </div>
      </div>

      {/* Trading Stats - More refined */}
      <div className="container mx-auto px-4 py-8 sm:py-24 relative z-10">
        <div className="bg-white/5 rounded-xl sm:rounded-3xl p-4 sm:p-12 border border-white/10 shadow-2xl">
          <TradingStats data={tokenInfo} />
        </div>
      </div>

      {/* Distribution Section - More elegant */}
      <div className="container mx-auto px-4 py-8 sm:py-24 relative z-10">
        <h2 className="text-2xl sm:text-4xl font-bold text-center mb-6 sm:mb-16 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
          HOUSENOMICS
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-12">
          <div className="group bg-white/5 p-4 sm:p-10 rounded-xl sm:rounded-3xl backdrop-blur-lg hover:bg-white/10 transition-all transform hover:scale-105 
            border border-white/10 shadow-2xl">
            <h3 className="text-lg sm:text-2xl font-bold mb-3 sm:mb-8 text-emerald-400">Top Landlords</h3>
            <ul className="space-y-2 sm:space-y-4">
              {topHolders.map((holder, index) => (
                <li key={index} className="group/item flex justify-between items-center p-3 sm:p-6 rounded-lg sm:rounded-2xl bg-white/5 
                  hover:bg-white/10 transition-all transform hover:translate-x-2">
                  <a 
                    href={`https://solscan.io/account/${holder.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs sm:text-base hover:text-emerald-400 transition-colors"
                  >
                    {holder.id === '5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1' ? 
                      'RAYDIUM' : 
                      `${holder.id.slice(0, 8)}...${holder.id.slice(-4)}`
                    }
                  </a>
                  <span className="text-xs sm:text-base text-emerald-400 font-semibold">{holder.percentage.toFixed(2)}%</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="group bg-white/5 p-4 sm:p-10 rounded-xl sm:rounded-3xl backdrop-blur-lg hover:bg-white/10 transition-all transform hover:scale-105 
            border border-white/10 shadow-2xl">
            <h3 className="text-lg sm:text-2xl font-bold mb-3 sm:mb-8 text-emerald-400">Housing Market Analysis</h3>
            <ul className="space-y-2 sm:space-y-4">
              <li className="group/item flex justify-between items-center p-3 sm:p-6 rounded-lg sm:rounded-2xl bg-white/5 
                hover:bg-white/10 transition-all transform hover:translate-x-2">
                <span className="text-xs sm:text-base">Founded</span>
                <span className="text-xs sm:text-base text-emerald-400">{createdAt}</span>
              </li>
              <li className="group/item flex justify-between items-center p-3 sm:p-6 rounded-lg sm:rounded-2xl bg-white/5 
                hover:bg-white/10 transition-all transform hover:translate-x-2">
                <span className="text-xs sm:text-base">Community Size</span>
                <span className="text-xs sm:text-base text-emerald-400">{holderCount.toLocaleString()} members</span>
              </li>
              <li className="group/item flex justify-between items-center p-3 sm:p-6 rounded-lg sm:rounded-2xl bg-white/5 
                hover:bg-white/10 transition-all transform hover:translate-x-2">
                <span className="text-xs sm:text-base">Market Value</span>
                <span className="text-xs sm:text-base text-emerald-400">${formatNumber(mainPair.marketCap)}</span>
              </li>
              <li className="group/item flex justify-between items-center p-3 sm:p-6 rounded-lg sm:rounded-2xl bg-white/5 
                hover:bg-white/10 transition-all transform hover:translate-x-2">
                <span className="text-xs sm:text-base">Future Value</span>
                <span className="text-xs sm:text-base text-emerald-400">${formatNumber(mainPair.fdv)}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Mini Game Section - More prominent */}
      <div className="container mx-auto px-4 py-8 sm:py-24 relative z-10">
        <div className="bg-white/5 rounded-xl sm:rounded-3xl p-4 sm:p-12 border border-white/10 shadow-2xl">
          <LootGame />
        </div>
      </div>

      {/* Footer - More refined */}
      <footer className="container mx-auto px-4 py-6 sm:py-12 relative z-10">
        <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-6">
          {socialLinks.length > 0 ? (
            socialLinks.map((social: Social, index: number) => (
              <a 
                key={index}
                href={social.url} 
                target="_blank"
                rel="noopener noreferrer"
                className="group relative px-4 sm:px-8 py-2 sm:py-4 bg-white/5 rounded-full backdrop-blur-lg hover:bg-white/10 
                  transition-all transform hover:scale-105 hover:rotate-1 border border-white/10 overflow-hidden w-full sm:w-auto"
              >
                <span className="relative z-10 flex items-center justify-center gap-2 text-xs sm:text-base">
                  {social.type === 'twitter' ? (
                    <>
                      <span>𝕏</span>
                      <span>@{social.url.split('/').pop()}</span>
                    </>
                  ) : (
                    <span>{social.type}</span>
                  )}
                  <span>🏠</span>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-white/20 to-emerald-500/0 
                  translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000 opacity-0 group-hover:opacity-100"></div>
              </a>
            ))
          ) : (
            <p className="text-gray-400 text-xs sm:text-base">No social links available</p>
          )}
        </div>
      </footer>
    </div>
  );
}

function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(2)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(2)}K`;
  return num.toFixed(2);
}
