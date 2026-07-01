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

const FEATURED_IDS = ['bbq-bacon-burger', 'pepperoni', 'quattro-formaggi', 'chicken-wings'];

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({});
  const [slide, setSlide] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMenuDropdownOpen, setIsMenuDropdownOpen] = useState(false);
  const [isAIListening, setIsAIListening] = useState(false);
  const [showAITooltip, setShowAITooltip] = useState(false);
  const { getItemCount, addItem } = useCart();
  const { theme, toggleTheme } = useTheme();

  const itemCount = getItemCount();
  const featured = useMemo(
    () => FEATURED_IDS.map((id) => menuItems.find((m) => m.id === id)).filter(Boolean) as typeof menuItems,
    []
  );

  useEffect(() => {
    const t = setInterval(() => setSlide((s) => (s + 1) % featured.length), 5000);
    return () => clearInterval(t);
  }, [featured.length]);

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

  const activeFeatured = featured[slide];

  return (
    <div className="min-h-screen bg-[#161210] flex w-full max-w-full box-border overflow-x-hidden">
      {/* Left Sidebar — logo + categories, no top header bar */}
      <aside className="hidden sm:flex w-60 flex-col border-r border-[#3A2C22] bg-[#1B1410] sticky top-0 h-screen">
        <div className="flex items-center gap-3 px-5 py-6 border-b border-[#3A2C22]">
          <BrandLogo size="md" />
          <div>
            <h1 className="font-display text-xl tracking-wide text-[#F3EDE3] leading-none">
              {settings.restaurantName}
            </h1>
            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#A89A8C]">Flame-fast · Algiers</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#A89A8C] mb-3 px-2">
            Menu sections
          </p>
          <div className="space-y-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-r-full rounded-l-md border-l-4 transition-colors ${
                  selectedCategory === category.id
                    ? 'border-l-[#E8A33D] bg-[#B91C1C] text-[#F3EDE3]'
                    : 'border-l-transparent text-[#A89A8C] hover:bg-[#241B16] hover:border-l-[#3A2C22]'
                }`}
              >
                <div className="relative w-10 h-10 rounded-lg bg-[#241B16] flex-shrink-0 overflow-hidden">
                  <Image src={category.imageUrl} alt={category.name} fill className="object-cover" />
                </div>
                <span className="text-sm font-semibold text-left">{category.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Theme toggle — tucked away from primary interactions */}
        <div className="border-t border-[#3A2C22] p-4">
          <button
            onClick={toggleTheme}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-[#6B6358] hover:text-[#A89A8C] hover:bg-[#241B16] transition-colors text-xs font-mono uppercase tracking-wider"
          >
            {theme === 'dark' ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
            {theme === 'dark' ? 'Light mode' : 'Dark mode'}
          </button>
        </div>
      </aside>

      {/* Mobile-only top mini bar */}
      <div className="sm:hidden fixed top-0 inset-x-0 z-30 flex items-center justify-between px-4 py-3 bg-[#1B1410]/95 backdrop-blur border-b border-[#3A2C22]">
        <div className="flex items-center gap-2">
          <BrandLogo size="sm" />
          <span className="font-display text-lg tracking-wide text-[#F3EDE3]">{settings.restaurantName}</span>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(true)}
          className="p-2 text-[#F3EDE3] hover:bg-[#241B16] rounded-lg transition-colors"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Mobile Off-canvas Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 sm:hidden flex">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
          <aside className="relative w-72 bg-[#1B1410] h-full flex flex-col shadow-2xl animate-in slide-in-from-left duration-300">
            <div className="flex items-center justify-between p-4 border-b border-[#3A2C22]">
              <div className="flex items-center gap-2">
                <BrandLogo size="sm" />
                <span className="font-display text-lg tracking-wide text-[#F3EDE3]">Menu</span>
              </div>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 text-[#A89A8C] hover:text-[#F3EDE3] hover:bg-[#241B16] rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setSelectedCategory(null);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full text-left px-4 py-3 text-[#F3EDE3] font-bold text-lg rounded-lg hover:bg-[#241B16] transition-colors flex items-center justify-between"
              >
                <span>Home</span>
                <span className="text-[#A89A8C] text-sm font-normal">الرئيسية</span>
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
                  <span className="text-[#A89A8C] text-sm font-normal">المينيو</span>
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
                <span className="text-[#A89A8C] text-sm font-normal">السلة</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 sm:pl-0 pt-14 sm:pt-0 overflow-x-hidden w-full max-w-full box-border">
        {/* Hero Slider */}
        {activeFeatured && (
          <section className="hero-section relative overflow-hidden border-b border-[#3A2C22] bg-[#1B1410]">
            <div className="relative h-80 sm:h-96">
              {featured.map((item, index) => (
                <div 
                  key={item.id} 
                  className={`absolute inset-0 transition-opacity duration-[800ms] ease-in-out ${index === slide ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'}`}
                >
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    fill
                    className="object-cover object-center"
                    priority={index === 0}
                    sizes="100vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#161210]/80 via-transparent to-transparent" />
                  <div className="absolute inset-0 flex flex-col items-start justify-end px-8 py-8 sm:px-14 sm:py-10">
                    <p className="hero-label font-mono text-[11px] uppercase tracking-[0.3em] text-[#E8A33D] mb-2">
                      Signature Collection
                    </p>
                    <h1 className="hero-title font-display text-4xl sm:text-6xl uppercase tracking-wide text-[#F3EDE3] leading-tight max-w-lg mb-2">
                      DZ Burger Station
                    </h1>
                    <p className="text-base sm:text-lg text-[#F3EDE3]/90 mb-6 max-w-md">
                      Experience the ultimate taste with our handcrafted <span className="text-[#E8A33D] font-bold">{item.name}</span>, made fresh to order.
                    </p>
                    <button 
                      onClick={() => document.getElementById('menu-section')?.scrollIntoView({ behavior: 'smooth' })}
                      className="hero-btn inline-flex items-center gap-2.5 bg-[#B91C1C] hover:bg-[#991B1B] text-white font-mono text-sm tracking-widest uppercase px-8 py-3.5 border border-[#E8A33D]/40 hover:border-[#E8A33D] transition-all rounded-full shadow-md cursor-pointer"
                    >
                      Order Now <Flame className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}

              {/* Slider controls */}
              <button
                onClick={() => setSlide((s) => (s - 1 + featured.length) % featured.length)}
                className="hero-arrow absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 hover:bg-black/50 text-white z-20"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={() => setSlide((s) => (s + 1) % featured.length)}
                className="hero-arrow absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 hover:bg-black/50 text-white z-20"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
                {featured.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setSlide(i)}
                    className={`h-1.5 rounded-full transition-all duration-[800ms] ease-in-out ${
                      i === slide ? 'w-6 bg-[#E8A33D]' : 'w-1.5 bg-white/40'
                    }`}
                  />
                ))}
              </div>
            </div>
          </section>
        )}

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

      {/* AI Voice Ordering FAB */}
      <div className="fixed bottom-24 right-6 z-40 flex flex-col items-end gap-2">
        {/* Tooltip */}
        {showAITooltip && !isAIListening && (
          <div className="bg-[#1B1410] text-[#F3EDE3] text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg whitespace-nowrap mr-1 animate-in fade-in slide-in-from-right-2 duration-200">
            🎙️ Order by voice
          </div>
        )}
        {/* Listening label */}
        {isAIListening && (
          <div className="bg-violet-600 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg whitespace-nowrap mr-1 animate-in fade-in duration-200">
            Listening…
          </div>
        )}
        <button
          id="ai-voice-fab"
          onClick={() => setIsAIListening((v) => !v)}
          onMouseEnter={() => setShowAITooltip(true)}
          onMouseLeave={() => setShowAITooltip(false)}
          aria-label="AI voice ordering"
          className={`relative w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 hover:scale-110 active:scale-95 ${
            isAIListening
              ? 'bg-violet-600 shadow-violet-500/50'
              : 'bg-gradient-to-br from-violet-500 to-purple-700 shadow-purple-900/60'
          }`}
        >
          {/* Pulse rings when listening */}
          {isAIListening && (
            <>
              <span className="absolute inset-0 rounded-full bg-violet-500 animate-ping opacity-40" />
              <span className="absolute -inset-2 rounded-full border-2 border-violet-400/40 animate-pulse" />
            </>
          )}
          {isAIListening
            ? <MicOff className="h-6 w-6 text-white relative z-10" />
            : <Mic className="h-6 w-6 text-white relative z-10" />
          }
        </button>
      </div>

      {/* Floating Cart Button */}
      <button
        onClick={() => setIsCartOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-[#B91C1C] hover:bg-[#991B1B] text-[#F3EDE3] px-5 py-3.5 shadow-xl shadow-black/40 transition-all hover:scale-105"
      >
        <ShoppingCart className="h-5 w-5" />
        {itemCount > 0 && (
          <span className="inline-flex h-5 min-w-5 px-1 items-center justify-center rounded-full bg-[#E8A33D] font-mono text-[11px] font-bold text-[#1B1410]">
            {itemCount}
          </span>
        )}
      </button>

      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
}
