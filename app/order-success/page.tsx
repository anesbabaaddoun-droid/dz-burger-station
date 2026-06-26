'use client';

import Link from 'next/link';
import { Flame } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { useEffect, useState } from 'react';

export default function OrderSuccessPage() {
  const { clearCart } = useCart();
  const [orderNumber] = useState(() => Math.random().toString(36).substr(2, 6).toUpperCase());
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => clearCart(), 3000);
    return () => clearTimeout(timer);
  }, [clearCart]);

  return (
    <div className="min-h-screen bg-[#161210] flex flex-col items-center justify-center px-4 py-12">
      <div className="max-w-md w-full text-center">
        <div className={`flex justify-center mb-6 transition-all duration-500 ${isLoaded ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}>
          <div className="relative">
            <div className="absolute inset-0 animate-pulse bg-[#E8A33D] rounded-full blur-xl opacity-40" />
            <div className="relative h-20 w-20 rounded-full bg-[#B91C1C] flex items-center justify-center ring-2 ring-[#E8A33D]/40">
              <Flame className="h-10 w-10 text-[#F3EDE3]" strokeWidth={2.5} />
            </div>
          </div>
        </div>

        <h1 className="font-display text-4xl uppercase tracking-wide text-[#F3EDE3] mt-4">Order Placed!</h1>
        <p className="mt-3 text-[#A89A8C]">We&apos;ll call you shortly to confirm your order.</p>

        <div className="mt-8 p-5 bg-[#1F1812] rounded-xl border border-[#3A2C22]">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#6B6358]">Order Number</p>
          <p className="font-mono text-3xl font-bold text-[#E8A33D] mt-2">#{orderNumber}</p>
        </div>

        <div className="mt-10">
          <Link href="/">
            <button className="w-full bg-[#B91C1C] text-[#F3EDE3] font-bold py-3.5 rounded-full hover:bg-[#991B1B] transition-colors">
              Back to Menu
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
