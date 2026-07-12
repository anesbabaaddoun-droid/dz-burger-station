'use client';

import { useCart } from '@/lib/cart-context';
import { useApiMutation } from '@/hooks/useApiMutation';
import { formatDA } from '@/lib/format';
import { X, Minus, Plus, ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

type OrderPayload = {
  customerName: string;
  customerPhone: string;
  orderType: 'Delivery' | 'Pickup';
  source: 'Website';
  items: { itemId: string; name: string; price: number; quantity: number }[];
  deliveryAddress: string | null;
  notes: string | null;
  deliveryFee: number;
};

export const CartSidebar: React.FC<CartSidebarProps> = ({ isOpen, onClose }) => {
  const { items, removeItem, updateQuantity, getTotal, clearCart } = useCart();
  const router = useRouter();
  const [isCheckout, setIsCheckout] = useState(false);
  const [orderType, setOrderType] = useState<'delivery' | 'pickup'>('delivery');

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [addressDetails, setAddressDetails] = useState('');
  const [notes, setNotes] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const [deliveryFee, setDeliveryFee] = useState(250);
  const [settingsFetched, setSettingsFetched] = useState(false);

  const { mutate, isLoading } = useApiMutation<OrderPayload>('/api/orders', 'POST');

  const subtotal = getTotal();

  // Fetch the fixed delivery fee once when checkout opens
  useEffect(() => {
    if (isCheckout && !settingsFetched) {
      fetch('/api/settings')
        .then((r) => r.json())
        .then((res) => {
          if (res.success && res.data && typeof res.data.deliveryFee === 'number') {
            setDeliveryFee(res.data.deliveryFee);
          }
        })
        .catch(() => { /* silently keep default */ })
        .finally(() => setSettingsFetched(true));
    }
  }, [isCheckout, settingsFetched]);

  const computedDeliveryFee = orderType === 'delivery' ? deliveryFee : 0;
  const grandTotal = subtotal + computedDeliveryFee;

  if (!isOpen) return null;

  const isFormValid = () => {
    if (!customerName.trim() || !customerPhone.trim()) return false;
    if (orderType === 'delivery' && !neighborhood.trim()) return false;
    return true;
  };

  const handlePlaceOrder = async () => {
    setFormError(null);

    if (!customerName.trim() || !customerPhone.trim()) {
      setFormError('Please enter your name and phone number.');
      return;
    }
    if (orderType === 'delivery' && !neighborhood.trim()) {
      setFormError('Please enter your neighborhood for delivery.');
      return;
    }

    const deliveryAddress =
      orderType === 'delivery'
        ? [neighborhood, addressDetails].filter(Boolean).join(', ') || null
        : null;

    const orderItems = items.map((item) => ({
      itemId: item.menuItemId,
      name: item.variantName ? `${item.name} (${item.variantName})` : item.name,
      price: item.variantPrice + item.selectedExtras.reduce((sum, e) => sum + e.price, 0),
      quantity: item.quantity,
    }));

    const payload: OrderPayload = {
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      orderType: orderType === 'delivery' ? 'Delivery' : 'Pickup',
      source: 'Website',
      items: orderItems,
      deliveryAddress,
      notes: notes.trim() || null,
      deliveryFee: computedDeliveryFee,
    };

    const success = await mutate(payload);

    if (success) {
      clearCart();
      setIsCheckout(false);
      onClose();
      router.push('/order-success');
    } else {
      setFormError('Something went wrong placing your order. Please try again.');
    }
  };

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
                      className={`py-2.5 rounded-full font-semibold text-sm capitalize border transition-colors ${orderType === t
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
                <label className="block text-sm font-semibold text-[#F3EDE3] mb-2">
                  Full Name <span className="text-[#B91C1C]">*</span>
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full px-4 py-2.5 bg-[#1F1812] border border-[#3A2C22] text-[#F3EDE3] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B91C1C]"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#F3EDE3] mb-2">
                  Phone Number <span className="text-[#B91C1C]">*</span>
                </label>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="+213 555 123 456"
                  className="w-full px-4 py-2.5 bg-[#1F1812] border border-[#3A2C22] text-[#F3EDE3] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B91C1C]"
                />
              </div>

              {orderType === 'delivery' && (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-[#F3EDE3] mb-2">
                      Neighborhood <span className="text-[#B91C1C]">*</span>
                    </label>
                    <input
                      type="text"
                      value={neighborhood}
                      onChange={(e) => setNeighborhood(e.target.value)}
                      placeholder="e.g. Bab Ezzouar"
                      className="w-full px-4 py-2.5 bg-[#1F1812] border border-[#3A2C22] text-[#F3EDE3] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B91C1C]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#F3EDE3] mb-2">Address Details (optional)</label>
                    <input
                      type="text"
                      value={addressDetails}
                      onChange={(e) => setAddressDetails(e.target.value)}
                      placeholder="Street, building, floor…"
                      className="w-full px-4 py-2.5 bg-[#1F1812] border border-[#3A2C22] text-[#F3EDE3] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B91C1C]"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-semibold text-[#F3EDE3] mb-2">Notes (optional)</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any special requests?"
                  rows={2}
                  className="w-full px-4 py-2.5 bg-[#1F1812] border border-[#3A2C22] text-[#F3EDE3] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B91C1C]"
                />
              </div>

              {formError && (
                <p className="text-sm text-[#EF4444] bg-[#EF4444]/10 border border-[#EF4444]/30 rounded-lg px-3 py-2">
                  {formError}
                </p>
              )}
            </div>
          </div>

          <div className="border-t border-[#3A2C22] p-6 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#A89A8C]">Subtotal</span>
              <span className="font-mono text-[#F3EDE3]">{formatDA(subtotal)}</span>
            </div>
            {orderType === 'delivery' ? (
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#A89A8C]">Delivery fee</span>
                <span className="font-mono text-[#E8A33D]">{formatDA(computedDeliveryFee)}</span>
              </div>
            ) : (
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#A89A8C]">Pickup</span>
                <span className="font-mono text-[#22C55E]">Free</span>
              </div>
            )}
            <div className="flex items-center justify-between pt-1">
              <span className="font-semibold text-[#F3EDE3]">Total</span>
              <span className="font-mono text-xl font-bold text-[#E8A33D]">{formatDA(grandTotal)}</span>
            </div>
            <button
              onClick={handlePlaceOrder}
              disabled={isLoading || !isFormValid()}
              className="w-full mt-2 bg-[#B91C1C] text-[#F3EDE3] font-bold py-3 rounded-full hover:bg-[#991B1B] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Placing Order…' : 'Place Order (COD)'}
            </button>
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
                <span className="font-mono text-[#F3EDE3]">{formatDA(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#A89A8C]">Delivery</span>
                <span className="font-mono text-[#E8A33D]">Calculated at checkout</span>
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