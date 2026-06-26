'use client';

import { menuItems } from '@/lib/mock-data';
import { useCart, CartItem } from '@/lib/cart-context';
import { formatDA } from '@/lib/format';
import Image from 'next/image';
import { useState, use } from 'react';
import { ChevronLeft, Plus, Minus } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const item = menuItems.find((m) => m.id === id);
  const { addItem } = useCart();

  const [quantity, setQuantity] = useState(1);
  // Default selected size is always the cheapest (variants[0] = "L")
  const [selectedVariant, setSelectedVariant] = useState(item?.variants[0]);
  const [isAdding, setIsAdding] = useState(false);

  if (!item) {
    return (
      <div className="min-h-screen bg-[#161210] p-4 sm:p-6 lg:p-8">
        <div className="text-center">
          <h1 className="font-display text-2xl text-[#F3EDE3]">Product not found</h1>
          <Link href="/" className="mt-4 inline-block text-[#E8A33D] hover:text-[#B91C1C]">
            ← Back to Menu
          </Link>
        </div>
      </div>
    );
  }

  const variantPrice = selectedVariant ? item.basePrice + selectedVariant.priceModifier : item.basePrice;
  const itemTotal = variantPrice * quantity;

  const handleAddToCart = async () => {
    setIsAdding(true);
    await new Promise((resolve) => setTimeout(resolve, 300));
    const cartItem: CartItem = {
      menuItemId: item.id,
      name: item.name,
      basePrice: item.basePrice,
      variantId: selectedVariant?.id,
      variantName: selectedVariant?.name,
      variantPrice,
      quantity,
      selectedExtras: [],
      imageUrl: item.imageUrl,
    };
    addItem(cartItem);
    setIsAdding(false);
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-[#161210]">
      <div className="sticky top-0 z-40 border-b border-[#3A2C22] bg-[#1F1812]/95 backdrop-blur px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="inline-flex items-center text-[#A89A8C] hover:text-[#E8A33D] font-semibold text-sm">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Menu
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-8 px-4 py-8 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-12 max-w-5xl mx-auto">
        <div className="flex items-center justify-center">
          <div className="relative h-80 w-full sm:h-96 sm:w-96 overflow-hidden rounded-xl bg-[#1F1812] border border-[#3A2C22]">
            <Image src={item.imageUrl} alt={item.name} fill className="object-cover" priority />
          </div>
        </div>

        <div className="flex flex-col">
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#6B6358]">
            {item.categoryId}
          </span>
          <h1 className="font-display text-4xl uppercase tracking-wide text-[#F3EDE3] mt-1">{item.name}</h1>
          <p className="mt-3 text-[#A89A8C]">{item.description}</p>

          <div className="mt-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#6B6358] mb-1.5">Ingredients</p>
            <p className="text-sm text-[#A89A8C]">{item.ingredients.join(' · ')}</p>
          </div>

          {item.variants.length > 0 && (
            <div className="mt-6">
              <h3 className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#6B6358] mb-2">Size</h3>
              <div className="flex gap-2">
                {item.variants.map((variant) => {
                  const finalPrice = item.basePrice + variant.priceModifier;
                  return (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariant(variant)}
                      className={`px-4 py-2.5 rounded-full font-semibold text-sm transition-colors border ${
                        selectedVariant?.id === variant.id
                          ? 'bg-[#B91C1C] text-[#F3EDE3] border-[#B91C1C]'
                          : 'bg-[#1F1812] text-[#A89A8C] border-[#3A2C22] hover:border-[#B91C1C]'
                      }`}
                    >
                      {variant.name} <span className="font-mono">{formatDA(finalPrice)}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-[#3A2C22]">
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-[#3A2C22] rounded-lg">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2 hover:bg-[#241B16]">
                  <Minus className="h-4 w-4 text-[#A89A8C]" />
                </button>
                <span className="px-5 font-semibold text-[#F3EDE3]">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="p-2 hover:bg-[#241B16]">
                  <Plus className="h-4 w-4 text-[#A89A8C]" />
                </button>
              </div>
              <div className="text-right flex-1">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#6B6358]">Total</p>
                <p className="font-mono text-2xl font-bold text-[#E8A33D]">{formatDA(itemTotal)}</p>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={isAdding}
              className={`mt-6 w-full py-4 rounded-full font-bold text-[#F3EDE3] transition-all ${
                isAdding ? 'bg-[#3A2C22] cursor-not-allowed' : 'bg-[#B91C1C] hover:bg-[#991B1B]'
              }`}
            >
              {isAdding ? 'Adding…' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
