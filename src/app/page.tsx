import Image from "next/image";
import ContractAddress from './components/ContractAddress';
import TradingStats from './components/TradingStats';
import LootGame from './components/LootGame';
import InteractiveHouse from './components/InteractiveHouse';
import ThemeToggle from './components/ThemeToggle';
import ParallaxHeader from './components/ParallaxHeader';

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
  quoteToken: {
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
    baseToken: {
      address: string;
      name: string;
      symbol: string;
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
  const createdAt = tokenInfo.pair?.[0]?.ti?.createdAt ? new Date(tokenInfo.pair[0].ti.createdAt).toLocaleDateString() : '';
  const headerImage = tokenInfo.pair?.[0]?.ti?.headerImage;

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-gray-900 dark:text-gray-100">
      <div className="relative overflow-hidden">
        <ThemeToggle />
        
        {/* Hero Section with Parallax Effect */}
        <ParallaxHeader 
          imageUrl={headerImage}
          tokenInfo={tokenInfo}
          mainPair={mainPair}
          contractAddress={CONTRACT_ADDRESS}
          moonshotLink={MOONSHOT_LINK}
        />

        {/* Resources Section - Zillow-like */}
        <div className="container mx-auto px-4 py-20 sm:py-20 relative z-10">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-4xl font-bold text-center mb-4 sm:mb-8 text-gray-900 dark:text-white">
              Resources & Community
            </h2>
            <p className="text-center text-gray-700 dark:text-gray-200 mb-8 sm:mb-12 max-w-2xl mx-auto text-sm sm:text-lg leading-relaxed">
              Join our growing community and explore our comprehensive resources
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
              <div className="group bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 mb-4 sm:mb-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                    <span className="text-2xl sm:text-3xl">📊</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-4 text-gray-900 dark:text-white">
                    Investor Pitch
                  </h3>
                  <p className="text-sm sm:text-base text-gray-700 dark:text-gray-200 mb-4 sm:mb-6">
                    Explore our comprehensive pitch deck and learn about our vision for revolutionizing the housing market
                  </p>
                  <a
                    href="https://slidesgpt.com/presentation/8Lmiwtw8hoLE9QyJaWOm?d=8Lmiwtw8hoLE9QyJaWOm"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/btn relative px-6 sm:px-8 py-3 sm:py-4 bg-blue-600 text-white rounded-lg font-bold text-sm sm:text-lg 
                      hover:bg-blue-700 transition-all transform hover:scale-105"
                  >
                    <span className="relative z-10">View Pitch Deck</span>
                  </a>
                </div>
              </div>

              <div className="group bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 mb-4 sm:mb-6 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                    <span className="text-2xl sm:text-3xl">🏘️</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-4 text-gray-900 dark:text-white">
                    Join Our Community
                  </h3>
                  <p className="text-sm sm:text-base text-gray-700 dark:text-gray-200 mb-4 sm:mb-6">
                    Connect with fellow investors and stay updated with the latest news and developments
                  </p>
                  <a
                    href="https://x.com/i/communities/1906719518350569767"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/btn relative px-6 sm:px-8 py-3 sm:py-4 bg-green-600 text-white rounded-lg font-bold text-sm sm:text-lg 
                      hover:bg-green-700 transition-all transform hover:scale-105"
                  >
                    <span className="relative z-10">Join Now</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive 3D House - Zillow-like */}
        <div className="container mx-auto px-4 relative z-10">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-12 shadow-lg">
            <h2 className="text-2xl sm:text-4xl font-bold text-center mb-3 sm:mb-6 text-gray-900 dark:text-white">
              Your Digital Home 🏠
            </h2>
            <p className="text-center text-gray-700 dark:text-gray-200 mb-6 sm:mb-12 max-w-2xl mx-auto text-sm sm:text-lg leading-relaxed">
              Take a virtual tour of your future home in the crypto world. Visualize your house flipping journey in 3D!
            </p>
            <div className="relative z-20">
              <InteractiveHouse />
            </div>
          </div>
        </div>

        {/* Stats Section - Zillow-like */}
        <div className="container mx-auto px-4 py-8 sm:py-24 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-8">
            <div className="group bg-white dark:bg-gray-800 p-4 sm:p-10 rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
              <div className="relative">
                <h3 className="text-2xl sm:text-4xl font-bold text-gray-900 dark:text-white relative">
                  {formatNumber(parseFloat(totalSupply))}
                </h3>
              </div>
              <p className="text-base sm:text-xl mt-1 sm:mt-4 text-gray-700 dark:text-gray-200">Total Supply</p>
              <p className="text-xs sm:text-base text-gray-600 dark:text-gray-300 mt-2 sm:mt-6">Enough for a whole neighborhood! 🏘️</p>
            </div>
            
            <div className="group bg-white dark:bg-gray-800 p-4 sm:p-10 rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
              <div className="relative">
                <h3 className="text-2xl sm:text-4xl font-bold text-gray-900 dark:text-white relative">
                  ${formatNumber(mainPair.liquidity.usd)}
                </h3>
              </div>
              <p className="text-base sm:text-xl mt-1 sm:mt-4 text-gray-700 dark:text-gray-200">Liquidity</p>
              <p className="text-xs sm:text-base text-gray-600 dark:text-gray-300 mt-2 sm:mt-6">Solid foundation! 🏗️</p>
            </div>
            
            <div className="group bg-white dark:bg-gray-800 p-4 sm:p-10 rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
              <div className="relative">
                <h3 className="text-2xl sm:text-4xl font-bold text-gray-900 dark:text-white relative">
                  {holderCount.toLocaleString()}
                </h3>
              </div>
              <p className="text-base sm:text-xl mt-1 sm:mt-4 text-gray-700 dark:text-gray-200">Total Holders</p>
              <p className="text-xs sm:text-base text-gray-600 dark:text-gray-300 mt-2 sm:mt-6">Growing community! 👥</p>
            </div>
          </div>
        </div>

        {/* Trading Stats - Zillow-like */}
        <div className="container mx-auto px-4 py-8 sm:py-24 relative z-10">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-12 shadow-lg">
            <TradingStats data={tokenInfo} />
          </div>
        </div>

        {/* Distribution Section - Zillow-like */}
        <div className="container mx-auto px-4 py-8 sm:py-24 relative z-10">
          <h2 className="text-2xl sm:text-4xl font-bold text-center mb-6 sm:mb-16 text-gray-900 dark:text-white">
            HOUSENOMICS
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-12">
            <div className="group bg-white dark:bg-gray-800 p-4 sm:p-10 rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
              <h3 className="text-lg sm:text-2xl font-bold mb-3 sm:mb-8 text-gray-900 dark:text-white">Top Landlords</h3>
              <ul className="space-y-2 sm:space-y-4">
                {topHolders.map((holder, index) => (
                  <li key={index} className="group/item flex justify-between items-center p-3 sm:p-6 rounded-lg bg-gray-50 dark:bg-gray-700 
                    hover:bg-gray-100 dark:hover:bg-gray-600 transition-all transform hover:translate-x-2">
                    <a 
                      href={`https://solscan.io/account/${holder.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs sm:text-base text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      {holder.id === '5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1' ? 
                        'RAYDIUM' : 
                        holder.id === 'Gj5t6KjTw3gWW7SrMHEi1ojCkaYHyvLwb17gktf96HNH' ?
                        'Pump.fun AMM' :
                        `${holder.id.slice(0, 8)}...${holder.id.slice(-4)}`
                      }
                    </a>
                    <span className="text-xs sm:text-base text-gray-900 dark:text-white font-semibold">{holder.percentage.toFixed(2)}%</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="group bg-white dark:bg-gray-800 p-4 sm:p-10 rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
              <h3 className="text-lg sm:text-2xl font-bold mb-3 sm:mb-8 text-gray-900 dark:text-white">Housing Market Analysis</h3>
              <ul className="space-y-2 sm:space-y-4">
                <li className="group/item flex justify-between items-center p-3 sm:p-6 rounded-lg bg-gray-50 dark:bg-gray-700 
                  hover:bg-gray-100 dark:hover:bg-gray-600 transition-all transform hover:translate-x-2">
                  <span className="text-xs sm:text-base text-gray-700 dark:text-gray-200">Founded</span>
                  <span className="text-xs sm:text-base text-gray-900 dark:text-gray-100">{createdAt}</span>
                </li>
                <li className="group/item flex justify-between items-center p-3 sm:p-6 rounded-lg bg-gray-50 dark:bg-gray-700 
                  hover:bg-gray-100 dark:hover:bg-gray-600 transition-all transform hover:translate-x-2">
                  <span className="text-xs sm:text-base text-gray-700 dark:text-gray-200">Community Size</span>
                  <span className="text-xs sm:text-base text-gray-900 dark:text-gray-100">{holderCount.toLocaleString()} members</span>
                </li>
                <li className="group/item flex justify-between items-center p-3 sm:p-6 rounded-lg bg-gray-50 dark:bg-gray-700 
                  hover:bg-gray-100 dark:hover:bg-gray-600 transition-all transform hover:translate-x-2">
                  <span className="text-xs sm:text-base text-gray-700 dark:text-gray-200">Market Value</span>
                  <span className="text-xs sm:text-base text-gray-900 dark:text-gray-100">${formatNumber(mainPair.marketCap)}</span>
                </li>
                <li className="group/item flex justify-between items-center p-3 sm:p-6 rounded-lg bg-gray-50 dark:bg-gray-700 
                  hover:bg-gray-100 dark:hover:bg-gray-600 transition-all transform hover:translate-x-2">
                  <span className="text-xs sm:text-base text-gray-700 dark:text-gray-200">Future Value</span>
                  <span className="text-xs sm:text-base text-gray-900 dark:text-gray-100">$50T MC</span>
                </li>
                <li className="group/item flex justify-between items-center p-3 sm:p-6 rounded-lg bg-gray-50 dark:bg-gray-700 
                  hover:bg-gray-100 dark:hover:bg-gray-600 transition-all transform hover:translate-x-2">
                  <span className="text-xs sm:text-base text-gray-700 dark:text-gray-200">Price Per $HOUSE at $50T MC</span>
                  <span className="text-xs sm:text-base text-gray-900 dark:text-gray-100">${formatNumber(50000000000000 / parseFloat(totalSupply))}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Mini Game Section - Zillow-like */}
        <div className="container mx-auto px-4 py-8 sm:py-24 relative z-10">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-12 shadow-lg">
            <LootGame />
          </div>
        </div>

        {/* Footer - Zillow-like */}
        <footer className="container mx-auto px-4 py-6 sm:py-12 relative z-10">
          <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-6">
            {socialLinks.length > 0 ? (
              socialLinks.map((social: Social, index: number) => (
                <a 
                  key={index}
                  href={social.url} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative px-4 sm:px-8 py-2 sm:py-4 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg font-medium text-sm sm:text-base 
                    hover:bg-gray-200 dark:hover:bg-gray-700 transition-all transform hover:scale-105"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
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
                </a>
              ))
            ) : (
              <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-base">No social links available</p>
            )}
          </div>
        </footer>
      </div>
    </div>
  );
}

function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(2)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(2)}K`;
  return num.toFixed(2);
}
