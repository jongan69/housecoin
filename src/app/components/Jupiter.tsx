"use client";
import { useState, useEffect } from "react";
import { PublicKey } from "@solana/web3.js";


export default function JupiterTerminalPopup() {
    const [isOpen, setIsOpen] = useState(false);
    const [isJupiterReady, setIsJupiterReady] = useState(false);

    // Example: SOL → HOUSE
    const initialInputMint = "So11111111111111111111111111111111111111112"; // SOL mint address
    const initialOutputMint = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ?? "DitHyRMQiSDhn5cnKMJV2CDDt6sVct96YrECiM49pump";

    const PLATFORM_FEE_AND_ACCOUNTS = {
        referralAccount: new PublicKey("552wiXYmw4HHeLQVFFcrUiwd5FD1XAsiYskLzdv8uiMx"),
        feeBps: 100,
      };

    useEffect(() => {
        if (!window.Jupiter) {
            const script = document.createElement("script");
            script.src = "https://terminal.jup.ag/main-v3.js";
            script.async = true;
            script.setAttribute("data-preload", "true");

            script.onload = () => {
                console.log("Jupiter script loaded");
                setIsJupiterReady(true);
            };

            script.onerror = () => {
                console.error("Failed to load Jupiter script");
            };

            document.body.appendChild(script);
        } else {
            setIsJupiterReady(true);
        }
    }, []);

    useEffect(() => {
        if (isOpen && isJupiterReady && window.Jupiter) {
            window.Jupiter.init({
                displayMode: "integrated",
                integratedTargetId: "integrated-terminal",
                endpoint: "https://christiane-z5lsaw-fast-mainnet.helius-rpc.com", // <-- replace with your real endpoint
                formProps: {
                    fixedOutputMint: false,
                    initialInputMint,
                    initialOutputMint,
                    swapMode: "ExactOut", // optional: user enters how much to swap *from*
                    initialAmount: "1000000000",
                    strictTokenList: false,
                    platformFeeAndAccounts: PLATFORM_FEE_AND_ACCOUNTS
                },
            });
        }
    }, [isOpen, isJupiterReady]);

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="group relative flex-1 px-6 sm:px-8 py-3 sm:py-4 bg-blue-600 text-white rounded-lg font-bold text-sm sm:text-lg shadow-lg hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 flex justify-center items-center focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
            >
                <span className="relative z-10 flex items-center gap-2">
                    🏡
                    Open Jupiter Swap
                </span>
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm transition-all duration-300">
                    <div className="relative flex items-center justify-center w-full h-full">
                        <div className="relative bg-white/80 dark:bg-gray-900/90 rounded-2xl shadow-2xl p-0 sm:p-8 w-full max-w-3xl border border-white/20 dark:border-gray-700 backdrop-blur-lg overflow-hidden animate-fade-in flex flex-col items-center justify-center">
                            <button
                                onClick={() => setIsOpen(false)}
                                className="absolute top-4 right-4 text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white bg-white/60 dark:bg-gray-800/60 rounded-full p-2 shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900 z-10"
                                aria-label="Close Jupiter Swap"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                            <div className="w-full h-[600px] flex items-center justify-center">
                                <div id="integrated-terminal" className="w-full h-full" />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
