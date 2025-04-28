'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Particles from './Particles';
import GridPattern from './GridPattern';
import ContractAddress from './ContractAddress';
import JupiterTerminalPopup from './Jupiter';

interface ParallaxHeaderProps {
    imageUrl: string;
    tokenInfo: {
        pair?: [{
            ti?: {
                image?: string;
                description?: string;
            };
        }];
    };
    mainPair?: {
        priceUsd?: string;
        txns?: {
            h24: {
                buys: number;
                sells: number;
            };
        };
    };
    contractAddress: string;
    moonshotLink: string;
}

export default function ParallaxHeader({
    imageUrl,
    tokenInfo,
    mainPair,
    contractAddress,
    moonshotLink
}: ParallaxHeaderProps) {
    const headerRef = useRef<HTMLDivElement>(null);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const searchSuggestions = [
        "Looking for a house to flip? 🏠",
        "Need a mansion? Just buy more $HOUSE 🏰",
        "1 $HOUSE = 1 House, simple math! 📈",
        "Want to be a real estate mogul? 🎯",
        "Searching for your dream house? 🏡",
        "Need a penthouse? Stack more $HOUSE 🌆",
        "Looking for a fixer-upper? 🛠️",
        "Want to be a landlord? Buy $HOUSE 👑",
        "Need a vacation home? 🏖️",
        "Want to flip houses? Start with $HOUSE 💎"
    ];

    const searchResponses = [
        {
            title: "🚀 To the moon!",
            message: "Your $HOUSE search is being processed...\n\nRemember: 1 $HOUSE = 1 House! 🏠\n\nCurrent price: $${price} USD"
        },
        {
            title: "🏠 House Flipping 101",
            message: "Step 1: Buy $HOUSE\nStep 2: Hold $HOUSE\nStep 3: Moon 🌕\n\nCurrent price: $${price} USD"
        },
        {
            title: "💎 Diamond Hands",
            message: "You're searching for houses? Why not just buy more $HOUSE?\n\nCurrent price: $${price} USD"
        },
        {
            title: "🏗️ Building Wealth",
            message: "Loading house flipping simulation...\n\nTip: The more $HOUSE you buy, the more houses you can flip!\n\nCurrent price: $${price} USD"
        },
        {
            title: "🎯 Target Acquired",
            message: "Scanning for the perfect house to flip...\n\nPro tip: Just buy $HOUSE instead!\n\nCurrent price: $${price} USD"
        },
        {
            title: "🏰 Real Estate Mogul",
            message: "Calculating your future mansion...\n\nFormula: $HOUSE = House\n\nCurrent price: $${price} USD"
        },
        {
            title: "🌆 Penthouse Dreams",
            message: "Searching for luxury properties...\n\nShortcut: Buy $HOUSE and watch it moon!\n\nCurrent price: $${price} USD"
        },
        {
            title: "🏖️ Vacation Home",
            message: "Looking for beachfront properties...\n\nLife hack: Stack $HOUSE and buy the whole beach!\n\nCurrent price: $${price} USD"
        }
    ];

    const getRandomResponse = () => {
        const randomIndex = Math.floor(Math.random() * searchResponses.length);
        const response = searchResponses[randomIndex];
        return {
            title: response.title,
            message: response.message.replace('${price}', Number(mainPair?.priceUsd || 0).toFixed(6))
        };
    };

    useEffect(() => {
        const handleScroll = () => {
            if (!headerRef.current) return;

            const scrolled = window.scrollY;
            const rate = scrolled * 0.5;

            headerRef.current.style.transform = `translateY(${rate}px)`;
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="relative w-full h-screen">
            {/* Parallax Background */}
            <div
                ref={headerRef}
                className="absolute inset-0 w-full h-[120%]"
            >
                <Image
                    src={imageUrl}
                    alt="Parallax Background"
                    fill
                    priority
                    className="object-cover opacity-30"
                    sizes="80vw"
                    style={{ objectPosition: 'center 20%' }}
                />
                {/* Zillow-like gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60"></div>
            </div>

            {/* Animated Grid Pattern */}
            <GridPattern />

            {/* Animated Particles */}
            <Particles />

            {/* Content with Zillow-like styling */}
            <div className="absolute inset-0 flex flex-col items-center justify-center px-4 z-30">
                <div className="text-center space-y-2 sm:space-y-8 max-w-4xl mx-auto pt-16 sm:pt-32">
                    <div className="relative">
                        <div className="relative mx-auto mb-1 sm:mb-8 w-16 h-16 sm:w-40 sm:h-40">
                            {tokenInfo.pair?.[0]?.ti?.image && (
                                <Image
                                    src={tokenInfo.pair[0].ti.image}
                                    alt="Token Logo"
                                    fill
                                    className="rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-lg"
                                />
                            )}
                        </div>
                    </div>

                    <h1 className="text-3xl sm:text-7xl font-bold text-white">
                        HOUSECOIN
                    </h1>

                    <div className="space-y-2 sm:space-y-6">
                        <p className="text-base sm:text-2xl font-semibold text-white">
                            Flipping the Housing Market, One $HOUSE at a Time 🏗️
                        </p>
                        <p className="text-sm sm:text-lg text-gray-200 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
                            {tokenInfo.pair?.[0]?.ti?.description}
                        </p>
                        <div className="text-sm sm:text-lg text-gray-200 dark:text-gray-300 leading-relaxed">
                            <ContractAddress address={contractAddress} />
                        </div>
                    </div>

                    {/* Price Display - Zillow-like */}
                    <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-lg p-4 sm:p-8 shadow-xl">
                        <p className="text-2xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-4">
                            ${Number(mainPair?.priceUsd || 0).toFixed(6)} USD
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-6 text-xs sm:text-sm">
                            <span className="text-green-600 dark:text-green-400 flex items-center gap-2">
                                <span className="w-2 h-2 bg-green-600 dark:bg-green-400 rounded-full"></span>
                                {mainPair?.txns?.h24.buys} Buys (24h)
                            </span>
                            <span className="text-red-600 dark:text-red-400 flex items-center gap-2">
                                <span className="w-2 h-2 bg-red-600 dark:bg-red-400 rounded-full"></span>
                                {mainPair?.txns?.h24.sells} Sells (24h)
                            </span>
                        </div>
                    </div>

                    {/* Search Bar - Moved above action buttons */}
                    <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-lg shadow-xl p-4 flex flex-col space-y-2 relative z-50">
                        <div className="flex items-center space-x-4">
                            <div className="flex-1 relative">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onFocus={() => setShowSuggestions(true)}
                                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                                    placeholder="Search for your dream $HOUSE... (1 $HOUSE = 1 House) 🏠"
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-base sm:text-lg"
                                />
                                {showSuggestions && (
                                    <div className="absolute z-[100] w-full mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 max-h-[60vh] overflow-y-auto">
                                        {searchSuggestions.map((suggestion, index) => (
                                            <div
                                                key={index}
                                                className="px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer active:bg-gray-200 dark:active:bg-gray-600 text-base sm:text-lg"
                                                onClick={() => {
                                                    setSearchQuery(suggestion);
                                                    setShowSuggestions(false);
                                                }}
                                                onTouchStart={(e) => {
                                                    e.preventDefault();
                                                    setSearchQuery(suggestion);
                                                    setShowSuggestions(false);
                                                }}
                                            >
                                                {suggestion}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <button 
                                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-base sm:text-lg whitespace-nowrap"
                                onClick={() => {
                                    const response = getRandomResponse();
                                    alert(`${response.title}\n\n${response.message}`);
                                }}
                            >
                                Search
                            </button>
                        </div>
                    </div>

                    {/* Action Buttons - Zillow-like */}
                    <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-4 mt-4 sm:mt-12 mb-16 sm:mb-0 pb-16">
                        <a
                            href={`https://raydium.io/swap/?inputMint=sol&outputMint=${contractAddress}&referrer=9yA9LPCRv8p8V8ZvJVYErrVGWbwqAirotDTQ8evRxE5N`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 flex justify-center items-center group relative px-6 sm:px-8 py-3 sm:py-4 bg-blue-600 text-white rounded-lg font-bold text-sm sm:text-lg hover:bg-blue-700 transition-all transform hover:scale-105 text-center"
                        >
                            <span className="relative z-10">Buy Your First House 🏠</span>
                        </a>
                        <div className="flex-1 flex justify-center items-center">
                            <JupiterTerminalPopup />
                        </div>
                        <a
                            href={`https://t.me/bonkbot_bot?start=ref_jyzn2_ca_${contractAddress}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 flex justify-center items-center group relative px-6 sm:px-8 py-3 sm:py-4 bg-green-600 text-white rounded-lg font-bold text-sm sm:text-lg hover:bg-green-700 transition-all transform hover:scale-105 text-center"
                        >
                            <span className="relative z-10">Quick Flip with BONKbot 🤖</span>
                        </a>
                        <a
                            href={`https://phantom.app/tokens/solana/${contractAddress}?referralId=m0ezk5sfqrs`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 flex justify-center items-center group relative px-6 sm:px-8 py-3 sm:py-4 bg-purple-600 text-white rounded-lg font-bold text-sm sm:text-lg hover:bg-purple-700 transition-all transform hover:scale-105 text-center"
                        >
                            <span className="relative z-10">Store in Your Wallet 👻</span>
                        </a>
                        <a
                            href={moonshotLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 flex justify-center items-center group relative px-6 sm:px-8 py-3 sm:py-4 bg-orange-600 text-white rounded-lg font-bold text-sm sm:text-lg hover:bg-orange-700 transition-all transform hover:scale-105 text-center"
                        >
                            <span className="relative z-10">Moon Shot 🚀</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
} 