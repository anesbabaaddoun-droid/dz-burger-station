'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { ShoppingCart, Search, X, Flame, Moon, Sun, ChevronLeft, ChevronRight, Menu, ChevronDown, Mic, MicOff } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { categories, menuItems, settings } from '@/lib/mock-data';
import { CartSidebar } from '@/components/cart-sidebar';
import { useCart } from '@/lib/cart-context';
import { useTheme } from '@/lib/theme-context';
import { BrandLogo } from '@/components/brand-logo';
import { formatDA } from '@/lib/format';



export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({});
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMenuDropdownOpen, setIsMenuDropdownOpen] = useState(false);
  const [isAIListening, setIsAIListening] = useState(false);
  const { getItemCount, addItem } = useCart();
  const { theme, toggleTheme } = useTheme();

  const itemCount = getItemCount();

  const displayedItems = useMemo(() => {
    let filtered = menuItems;
    if (selectedCategory) {
      filtered = filtered.filter((item) => item.categoryId === selectedCategory);
    }
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query)
      );
    }
    return filtered;
  }, [selectedCategory, searchQuery]);

  const getSelectedVariant = useCallback(
    (item: (typeof menuItems)[0]) => {
      if (item.variants.length === 0) return null;
      const selectedId = selectedSizes[item.id] ?? item.variants[0].id; // default = cheapest size
      return item.variants.find((v) => v.id === selectedId) ?? item.variants[0];
    },
    [selectedSizes]
  );

  const handleQuickAdd = (e: React.MouseEvent<HTMLButtonElement>, item: (typeof menuItems)[0]) => {
    e.preventDefault();
    e.stopPropagation();
    const variant = getSelectedVariant(item);
    addItem({
      menuItemId: item.id,
      name: item.name,
      basePrice: item.basePrice,
      variantId: variant?.id,
      variantName: variant?.name,
      variantPrice: variant ? item.basePrice + variant.priceModifier : item.basePrice,
      quantity: 1,
      selectedExtras: [],
      imageUrl: item.imageUrl,
    });
  };

  return (
    <div className="min-h-screen bg-[#161210] flex w-full max-w-full box-border overflow-x-hidden">
      {/* Left Sidebar removed in favor of universal header and drawer */}

      {/* Universal Top Navigation Bar */}
      <div className={`fixed top-0 inset-x-0 z-30 flex items-center justify-between px-4 py-3 backdrop-blur border-b transition-colors ${theme === 'dark' ? 'bg-black border-white/10 text-white' : 'bg-white border-black/10 shadow-sm text-black'}`}>
        <div className="flex items-center gap-2">
          <BrandLogo size="sm" />
          <span className="font-display text-lg tracking-wide hidden sm:inline">{settings.restaurantName}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 rounded-lg transition-colors hover:bg-black/10 dark:hover:bg-white/10"
            aria-label="Cart"
          >
            <ShoppingCart className="h-6 w-6" />
            {itemCount > 0 && (
              <span className={`absolute top-0 right-0 inline-flex h-4 min-w-4 px-1 items-center justify-center rounded-full font-mono text-[10px] font-bold translate-x-1 -translate-y-1 shadow-md ${theme === 'dark' ? 'bg-white text-black' : 'bg-black text-white'}`}>
                {itemCount}
              </span>
            )}
          </button>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg transition-colors hover:bg-black/10 dark:hover:bg-white/10"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 rounded-lg transition-colors hover:bg-black/10 dark:hover:bg-white/10"
            aria-label="Menu"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Universal Off-canvas Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
          <aside className="relative w-80 max-w-[85vw] bg-[#1B1410] h-full flex flex-col shadow-2xl animate-in slide-in-from-left duration-300">
            <div className="flex items-center justify-between p-4 border-b border-[#3A2C22]">
              <div className="flex items-center gap-2">
                <BrandLogo size="sm" />
                <span className="font-display text-lg tracking-wide text-[#F3EDE3]">Action Hub</span>
              </div>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 text-[#A89A8C] hover:text-[#F3EDE3] hover:bg-[#241B16] rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto flex flex-col">
              {/* AI Voice Order Card removed from here */}
              {/* Navigation */}
              <div className="p-4 flex flex-col gap-2">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setSelectedCategory(null);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                className="w-full text-left px-4 py-3 text-[#F3EDE3] font-bold text-lg rounded-lg hover:bg-[#241B16] transition-colors flex items-center justify-between"
              >
                <span>Home</span>
              </button>
              
              <div className="w-full">
                <button
                  onClick={() => setIsMenuDropdownOpen(!isMenuDropdownOpen)}
                  className="w-full text-left px-4 py-3 text-[#F3EDE3] font-bold text-lg rounded-lg hover:bg-[#241B16] transition-colors flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <span>Menu</span>
                    <ChevronDown className={`h-4 w-4 transition-transform ${isMenuDropdownOpen ? 'rotate-180' : ''}`} />
                  </div>
                </button>
                {isMenuDropdownOpen && (
                  <div className="pl-4 pr-2 py-2 space-y-1 bg-[#161210] rounded-b-lg border border-[#3A2C22] border-t-0 mx-2 mb-2">
                    {categories.map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => {
                          setSelectedCategory(cat.id);
                          setIsMobileMenuOpen(false);
                          document.getElementById('menu-section')?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="w-full text-left px-4 py-2.5 text-[#F3EDE3] text-sm rounded-md hover:bg-[#241B16] transition-colors flex items-center gap-3"
                      >
                        <div className="relative w-6 h-6 rounded bg-[#241B16] flex-shrink-0 overflow-hidden">
                          <Image src={cat.imageUrl} alt={cat.name} fill className="object-cover" />
                        </div>
                        {cat.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsCartOpen(true);
                }}
                className="w-full text-left px-4 py-3 text-[#F3EDE3] font-bold text-lg rounded-lg hover:bg-[#241B16] transition-colors flex items-center justify-between"
              >
                <span>Cart</span>
              </button>
            </div>
            </div>
          </aside>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 pt-[68px] overflow-x-hidden w-full max-w-full box-border">
        <section className="hero-section relative w-full h-[85vh] sm:h-[70vh] lg:h-[80vh] bg-[#161210] bg-[url('/images/hero_banner.png')] bg-cover bg-right bg-no-repeat border-b border-[#3A2C22] flex items-center justify-start overflow-hidden">
          {/* Subtle dark gradient overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent pointer-events-none" />
          
          <div className="w-full px-6 sm:px-12 lg:px-20 max-w-7xl mx-auto box-border relative z-10 flex flex-col items-start justify-center text-left">
            <p className="font-mono text-xs sm:text-base uppercase tracking-widest text-[#FDE047] font-bold mb-4 drop-shadow-md">
              Signature Collection
            </p>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-7xl uppercase tracking-wide text-white leading-[1.1] mb-6 font-black drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)]">
              Order Fast Food<br />in Minutes
            </h1>
            <p className="text-base sm:text-lg text-white mb-8 max-w-sm sm:max-w-md font-medium drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] leading-snug">
              Experience the ultimate taste with our handcrafted special, made fresh to order.
            </p>
            <button 
              onClick={() => document.getElementById('menu-section')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-[#FDE047] hover:bg-[#FACC15] text-[#B91C1C] font-black uppercase text-sm sm:text-base tracking-widest px-8 py-3.5 sm:py-4 rounded-full shadow-xl transition-colors shrink-0"
            >
              Order Now
            </button>
          </div>
        </section>

        {/* Integrated AI Voice Section */}
        <section className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-5xl mx-auto box-border">
          <div className={`relative overflow-hidden rounded-[32px] p-8 sm:p-12 flex flex-col items-center justify-center text-center transition-colors duration-300 border-2 ${
            isAIListening 
              ? 'bg-violet-900/40 border-violet-500/50 shadow-[0_0_50px_rgba(124,58,237,0.3)]' 
              : 'bg-[#1F1812] border-[#3A2C22] shadow-xl'
          }`}>
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5 mix-blend-overlay pointer-events-none" />
            <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-[200%] h-full bg-gradient-to-b from-violet-600/10 to-transparent pointer-events-none transition-opacity duration-300 ${isAIListening ? 'opacity-100' : 'opacity-0'}`} />
            
            <button
              onClick={() => setIsAIListening((v) => !v)}
              className="relative z-10 flex flex-col items-center justify-center gap-4"
            >
              <div className={`w-24 h-24 sm:w-32 sm:h-32 rounded-full flex items-center justify-center relative transition-colors duration-300 ${
                isAIListening ? 'bg-violet-600' : 'bg-black border-2 border-violet-600 shadow-[0_0_15px_rgba(124,58,237,0.5)]'
              }`}>
                {isAIListening && (
                  <>
                    <span className="absolute inset-0 rounded-full bg-violet-500 animate-ping opacity-60" />
                    <span className="absolute -inset-4 rounded-full border border-violet-400/50 animate-pulse" />
                    <span className="absolute -inset-8 rounded-full border border-violet-400/20 animate-pulse" style={{ animationDelay: '200ms' }} />
                  </>
                )}
                {isAIListening ? <MicOff className="h-10 w-10 sm:h-12 sm:w-12 text-white relative z-10 animate-pulse" /> : <Mic className="h-10 w-10 sm:h-12 sm:w-12 text-white relative z-10" />}
              </div>
            </button>
            
            <div className="mt-8 relative z-10 max-w-lg">
              <h2 className="font-display text-3xl sm:text-4xl uppercase tracking-wide text-[#F3EDE3] mb-3">
                {isAIListening ? 'Listening...' : 'Order with Voice AI'}
              </h2>
              <p className="text-[#A89A8C] text-base sm:text-lg">
                {isAIListening 
                  ? 'Speak clearly into your microphone. Tell us what you are craving.' 
                  : 'Tap the microphone and tell our smart assistant what you want to order. Hands-free and fast.'}
              </p>
            </div>
          </div>
        </section>

        <div id="menu-section" className="px-4 py-8 sm:px-6 lg:px-8 w-full box-border">
          {selectedCategory === null ? (
            <div className="py-4">
              <div className="text-center mb-10">
                <h2 className="font-display text-3xl uppercase tracking-wide text-[#F3EDE3] mb-2">
                  Explore Our Menu
                </h2>
                <p className="text-[#A89A8C]">Select a category to view our delicious options</p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 max-w-5xl mx-auto">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => {
                      setSelectedCategory(category.id);
                      document.getElementById('menu-section')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="group relative flex flex-col items-center justify-center bg-[#1F1812] border border-[#3A2C22] rounded-2xl p-6 hover:border-[#B91C1C] hover:bg-[#241B16] transition-all aspect-square shadow-lg"
                  >
                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 mb-4 rounded-full overflow-hidden bg-[#161210] group-hover:scale-110 transition-transform duration-300 ring-4 ring-[#161210] group-hover:ring-[#3A2C22]">
                      <Image src={category.imageUrl} alt={category.name} fill className="object-cover" />
                    </div>
                    <span className="font-display tracking-wider text-[#F3EDE3] group-hover:text-[#E8A33D] transition-colors">{category.name}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="w-full box-border">
              {/* Back to Categories Button */}
              <button 
                onClick={() => setSelectedCategory(null)}
                className="mb-6 inline-flex items-center gap-2 text-[#A89A8C] hover:text-[#E8A33D] transition-colors font-mono text-sm uppercase tracking-wider"
              >
                <ChevronLeft className="h-4 w-4" /> Back to Categories
              </button>

              {/* Search */}
              <div className="mb-8 max-w-2xl">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#A89A8C]" />
                  <input
                    type="text"
                    placeholder="Search the menu…"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-[#3A2C22] bg-[#1F1812] text-[#F3EDE3] placeholder-[#6B6358] focus:outline-none focus:ring-2 focus:ring-[#B91C1C] focus:border-transparent box-border"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A89A8C] hover:text-[#F3EDE3]"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>

              <div className="mb-6 flex items-baseline gap-3 flex-wrap">
                <h2 className="font-display text-2xl uppercase tracking-wide text-[#F3EDE3]">
                  {categories.find((c) => c.id === selectedCategory)?.name}
                </h2>
                <span className="font-mono text-xs text-[#6B6358]">{displayedItems.length} items</span>
              </div>

              {/* List */}
              <div className="space-y-3">
                {displayedItems.length > 0 ? (
                  displayedItems.map((item, idx) => {
                    const hasSizes = item.variants.length > 0;
                    const selectedVariant = getSelectedVariant(item);
                    const displayPrice = selectedVariant
                      ? item.basePrice + selectedVariant.priceModifier
                      : item.basePrice;

                    return (
                      <Link key={item.id} href={`/product/${item.id}`} className="block w-full">
                        <div className="group flex flex-wrap sm:flex-nowrap gap-4 p-3 bg-[#1F1812] rounded-lg border border-[#3A2C22] border-l-[3px] border-l-[#3A2C22] hover:border-l-[#B91C1C] hover:bg-[#241B16] transition-all cursor-pointer box-border">
                          <div className="relative w-24 h-24 bg-[#241B16] rounded-md flex-shrink-0 overflow-hidden">
                            <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                            {(item.availability as string) === 'out_of_stock' && (
                              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                <span className="font-mono text-[9px] uppercase tracking-wide text-[#F3EDE3] border border-[#F3EDE3]/50 rounded px-1.5 py-0.5">
                                  Sold out
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="flex-1 flex flex-col justify-between min-w-0 w-full">
                            <div>
                              <span className="font-mono text-[10px] text-[#6B6358]">
                                {String(idx + 1).padStart(2, '0')}
                              </span>
                              <h3 className="font-semibold text-[#F3EDE3] group-hover:text-[#E8A33D] transition-colors truncate">
                                {item.name}
                              </h3>
                              <p className="text-sm text-[#A89A8C] line-clamp-1">{item.description}</p>
                            </div>

                            {hasSizes && (
                              <div className="flex flex-wrap gap-1.5 mt-2" onClick={(e) => e.stopPropagation()}>
                                {item.variants.map((v) => (
                                  <button
                                    key={v.id}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      setSelectedSizes((prev) => ({ ...prev, [item.id]: v.id }));
                                    }}
                                    className={`px-2.5 py-1 rounded-full text-[11px] font-semibold font-mono border transition-colors ${
                                      (selectedSizes[item.id] ?? item.variants[0].id) === v.id
                                        ? 'bg-[#B91C1C] text-[#F3EDE3] border-[#B91C1C]'
                                        : 'bg-transparent text-[#A89A8C] border-[#3A2C22] hover:border-[#E8A33D]/50'
                                    }`}
                                  >
                                    {v.name} {formatDA(item.basePrice + v.priceModifier)}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>

                          <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 w-full sm:w-auto pl-0 sm:pl-2 mt-2 sm:mt-0">
                            <span className="font-mono text-base font-bold text-[#E8A33D]">
                              {formatDA(displayPrice)}
                            </span>
                            <button
                              onClick={(e) => handleQuickAdd(e, item)}
                              className="rounded-full bg-[#B91C1C] hover:bg-[#991B1B] text-[#F3EDE3] text-xs font-bold px-3.5 py-1.5 transition-colors whitespace-nowrap"
                            >
                              + Add
                            </button>
                          </div>
                        </div>
                      </Link>
                    );
                  })
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center w-full">
                    <p className="text-lg text-[#A89A8C] mb-4">No items found</p>
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedCategory(null);
                      }}
                      className="text-[#E8A33D] hover:text-[#B91C1C] font-semibold"
                    >
                      Clear filters
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
}
