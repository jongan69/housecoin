"use client";

import { useState } from "react";
import Image from 'next/image';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  variants: Array<{
    id: string;
    name: string;
    options: Array<{
      id: string;
      value: string;
    }>;
  }>;
  variant_prices: Record<string, number>;
}

interface ProductCardProps {
  product: Product;
}

function ProductCard({ product }: ProductCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  const handleSizeSelect = (e: React.MouseEvent, value: string) => {
    e.preventDefault();
    setSelectedSize(value);
  };

  const sizeVariant = product.variants.find((v) => v.name === 'Size');

  return (
    <Link
      href="https://store.fun/housecoin"
      className="block bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-transform hover:scale-[1.02] cursor-pointer"
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className="relative aspect-square">
        <Image
          src={product.images[currentImageIndex]}
          alt={product.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {product.images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 dark:bg-white/50 dark:hover:bg-white/70 z-10"
              aria-label="Previous image"
            >
              ←
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 dark:bg-white/50 dark:hover:bg-white/70 z-10"
              aria-label="Next image"
            >
              →
            </button>
          </>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{product.name}</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">{product.description}</p>
        <div className="flex justify-between items-center mb-4">
          <span className="text-2xl font-bold text-gray-900 dark:text-white">{product.price} SOL</span>
        </div>
        {/* {sizeVariant && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Size</label>
            <div className="flex gap-2 flex-wrap">
              {sizeVariant.options.map((option) => (
                <button
                  key={option.id}
                  onClick={(e) => handleSizeSelect(e, option.value)}
                  className={`px-4 py-2 rounded-md border ${
                    selectedSize === option.value
                      ? 'border-black bg-black text-white dark:border-white dark:bg-white dark:text-black'
                      : 'border-gray-300 hover:border-gray-400 dark:border-gray-600 dark:hover:border-gray-500'
                  }`}
                >
                  {option.value}
                </button>
              ))}
            </div>
          </div>
        )} */}
        <button
          onClick={(e) => e.preventDefault()}
          className="mt-4 w-full bg-black text-white dark:bg-white dark:text-black py-3 px-4 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
          disabled={sizeVariant && !selectedSize}
        >
          Buy Now on store.fun
        </button>
      </div>
    </Link>
  );
}

export default function ProductClientGrid({ products }: { products: Product[] }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Our Products</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
