'use client';

import { useCart } from '@/lib/cart-context';
import { formatDA } from '@/lib/format';
import { X, Minus, Plus, ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartSidebar: React.FC<CartSidebarProps> = ({ isOpen, onClose }) => {
  const { items, removeItem, updateQuantity, getTotal } = useCart();
  const [isCheckout, setIsCheckout] = useState(false);
  const [orderType, setOrderType] = useState<'delivery' | 'pickup'>('delivery');

  const total = getTotal();

  if (!isOpen) return null;

  if (isCheckout) {
    return (
      <div className="fixed inset-0 z-50 overflow-hidden bg-black/70">
        <div className="fixed inset-y-0 right-0 flex h-full w-full max-w-md flex-col bg-[#1B1410] border-l border-[#3A2C22] shadow-xl">
          <div className="flex items-center justify-between border-b border-[#3A2C22] p-6">
            <h2 className="font-display text-2xl uppercase tracking-wide text-[#F3EDE3]">Checkout</h2>
            <button
              onClick={() => {
                setIsCheckout(false);
                onClose();
              }}
              className="p-2 hover:bg-[#241B16] rounded-lg"
            >
              <X className="h-5 w-5 text-[#A89A8C]" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-6">
              <div className="bg-[#1F1812] border border-[#3A2C22] p-4 rounded-lg">
                <h3 className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#6B6358] mb-3">
                  Order Summary
                </h3>
                <div className="space-y-2 text-sm">
                  {items.map((item, idx) => (
                    <div key={idx} className="flex justify-between">
                      <span className="text-[#A89A8C]">
                        {item.quantity}x {item.name}
                        {item.variantName ? ` (${item.variantName})` : ''}
                      </span>
                      <span className="font-mono text-[#F3EDE3]">
                        {formatDA(
                          (item.variantPrice + item.selectedExtras.reduce((sum, e) => sum + e.price, 0)) *
                            item.quantity
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-mono text-[10px] uppercase tracking-[0.2em] text-[#6B6358] mb-3">
                  Order Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(['delivery', 'pickup'] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setOrderType(t)}
                      className={`py-2.5 rounded-full font-semibold text-sm capitalize border transition-colors ${
                        orderType === t
                          ? 'bg-[#B91C1C] text-[#F3EDE3] border-[#B91C1C]'
                          : 'bg-[#1F1812] text-[#A89A8C] border-[#3A2C22]'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#F3EDE3] mb-2">Full Name</label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  className="w-full px-4 py-2.5 bg-[#1F1812] border border-[#3A2C22] text-[#F3EDE3] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B91C1C]"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#F3EDE3] mb-2">Phone Number</label>
                <input
                  type="tel"
                  placeholder="+213 555 123 456"
                  className="w-full px-4 py-2.5 bg-[#1F1812] border border-[#3A2C22] text-[#F3EDE3] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B91C1C]"
                />
              </div>

              {orderType === 'delivery' && (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-[#F3EDE3] mb-2">Neighborhood</label>
                    <input
                      type="text"
                      placeholder="e.g. Bab Ezzouar"
                      className="w-full px-4 py-2.5 bg-[#1F1812] border border-[#3A2C22] text-[#F3EDE3] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B91C1C]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#F3EDE3] mb-2">Street</label>
                    <input
                      type="text"
                      placeholder="Street name"
                      className="w-full px-4 py-2.5 bg-[#1F1812] border border-[#3A2C22] text-[#F3EDE3] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B91C1C]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#F3EDE3] mb-2">Landmark</label>
                    <input
                      type="text"
                      placeholder="Nearby landmark"
                      className="w-full px-4 py-2.5 bg-[#1F1812] border border-[#3A2C22] text-[#F3EDE3] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B91C1C]"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-semibold text-[#F3EDE3] mb-2">Notes (optional)</label>
                <textarea
                  placeholder="Any special requests?"
                  rows={2}
                  className="w-full px-4 py-2.5 bg-[#1F1812] border border-[#3A2C22] text-[#F3EDE3] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B91C1C]"
                />
              </div>
            </div>
          </div>

          <div className="border-t border-[#3A2C22] p-6 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#A89A8C]">Subtotal</span>
              <span className="font-mono text-[#F3EDE3]">{formatDA(total)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#A89A8C]">Delivery</span>
              <span className="font-mono text-[#E8A33D]">Confirmed by phone</span>
            </div>
            <div className="flex items-center justify-between pt-1">
              <span className="font-semibold text-[#F3EDE3]">Total</span>
              <span className="font-mono text-xl font-bold text-[#E8A33D]">{formatDA(total)}</span>
            </div>
            <Link href="/order-success">
              <button className="w-full mt-2 bg-[#B91C1C] text-[#F3EDE3] font-bold py-3 rounded-full hover:bg-[#991B1B] transition-colors">
                Place Order (COD)
              </button>
            </Link>
            <button
              onClick={() => setIsCheckout(false)}
              className="w-full bg-[#241B16] text-[#A89A8C] font-semibold py-2.5 rounded-full hover:bg-[#2A2018] transition-colors border border-[#3A2C22]"
            >
              Back to Cart
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/70">
      <div className="fixed inset-y-0 right-0 flex h-full w-full max-w-md flex-col bg-[#1B1410] border-l border-[#3A2C22] shadow-xl">
        <div className="flex items-center justify-between border-b border-[#3A2C22] p-6">
          <h2 className="font-display text-2xl uppercase tracking-wide text-[#F3EDE3]">Your Order</h2>
          <button onClick={onClose} className="p-2 hover:bg-[#241B16] rounded-lg">
            <X className="h-5 w-5 text-[#A89A8C]" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center p-6">
            <ShoppingCart className="h-14 w-14 text-[#3A2C22] mb-4" />
            <p className="font-display text-lg uppercase tracking-wide text-[#F3EDE3] mb-2">Cart is empty</p>
            <p className="text-sm text-[#A89A8C] text-center mb-6">Add something from the menu to get started</p>
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-[#B91C1C] text-[#F3EDE3] font-semibold rounded-full hover:bg-[#991B1B] transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-6 space-y-3">
              {items.map((item, idx) => (
                <div key={idx} className="flex gap-3 bg-[#1F1812] border border-[#3A2C22] rounded-lg p-3">
                  <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded">
                    <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-[#F3EDE3] text-sm">{item.name}</h4>
                    {item.variantName && <p className="text-xs text-[#6B6358]">{item.variantName}</p>}
                    {item.selectedExtras.length > 0 && (
                      <p className="text-xs text-[#6B6358] mt-1">+{item.selectedExtras.map((e) => e.name).join(', ')}</p>
                    )}
                    <div className="mt-2 flex items-center justify-between">
                      <span className="font-mono font-bold text-[#E8A33D] text-sm">
                        {formatDA(
                          (item.variantPrice + item.selectedExtras.reduce((sum, e) => sum + e.price, 0)) * item.quantity
                        )}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => updateQuantity(item.menuItemId, item.quantity - 1, item.variantId)}
                          className="p-1 hover:bg-[#2A2018] rounded"
                        >
                          <Minus className="h-3.5 w-3.5 text-[#A89A8C]" />
                        </button>
                        <span className="w-6 text-center font-semibold text-sm text-[#F3EDE3]">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.menuItemId, item.quantity + 1, item.variantId)}
                          className="p-1 hover:bg-[#2A2018] rounded"
                        >
                          <Plus className="h-3.5 w-3.5 text-[#A89A8C]" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => removeItem(item.menuItemId, item.variantId)}
                    className="self-start p-1 hover:bg-[#2A2018] rounded"
                  >
                    <X className="h-4 w-4 text-[#6B6358]" />
                  </button>
                </div>
              ))}
            </div>

            <div className="border-t border-[#3A2C22] p-6 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#A89A8C]">Subtotal</span>
                <span className="font-mono text-[#F3EDE3]">{formatDA(total)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#A89A8C]">Delivery</span>
                <span className="font-mono text-[#E8A33D]">Confirmed by phone</span>
              </div>
              <button
                onClick={() => setIsCheckout(true)}
                className="w-full mt-2 bg-[#B91C1C] text-[#F3EDE3] font-bold py-3 rounded-full hover:bg-[#991B1B] transition-colors"
              >
                Proceed to Checkout
              </button>
              <button
                onClick={onClose}
                className="w-full border border-[#3A2C22] text-[#A89A8C] font-semibold py-2.5 rounded-full hover:bg-[#241B16] transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
