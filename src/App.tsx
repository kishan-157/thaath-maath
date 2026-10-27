/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  Minus,
  Check,
  Copy,
  MapPin,
  Phone,
  Clock,
  ExternalLink,
  Calendar,
  Users,
  Utensils,
  ArrowUpRight,
  MessageSquare,
} from 'lucide-react';
import {
  RESTAURANT_INFO,
  MENU_ITEMS,
  BANQUET_PACKAGES,
  BANQUET_ADDONS,
  GUEST_REVIEWS,
  MenuItem,
  buildWhatsAppUrl,
} from './data/restaurantData';
import { CulinaryArtwork } from './components/CulinaryArtwork';
import {
  ReservationDrawer,
  SelectedDishEntry,
  BanquetDraftConfig,
} from './components/ReservationDrawer';

export default function App() {
  // Hero Interactive Showcase Mode
  const [heroShowcase, setHeroShowcase] = useState<
    'hero-buffet' | 'hero-banquet' | 'hero-live-counter'
  >('hero-buffet');

  // Menu Filter & Search State
  const [activeCategory, setActiveCategory] = useState<
    'all' | MenuItem['category']
  >('all');
  const [jainOnly, setJainOnly] = useState(false);
  const [signatureOnly, setSignatureOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Pre-selected Menu Items for Table / Buffet Pre-Order
  const [selectedDishes, setSelectedDishes] = useState<SelectedDishEntry[]>([
    { itemId: 'tm-buffet-dinner', quantity: 2, jainRequested: false },
  ]);

  // Banquet Configurator State
  const [selectedPkgId, setSelectedPkgId] = useState<string>('pkg-gold');
  const [banquetGuests, setBanquetGuests] = useState<number>(150);
  const [selectedAddonIds, setSelectedAddonIds] = useState<string[]>([
    'addon-jain-counter',
  ]);

  // Drawers
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'table' | 'banquet'>('table');
  const [copiedAddress, setCopiedAddress] = useState(false);

  // Filtered Menu Items
  const filteredMenu = useMemo(() => {
    return MENU_ITEMS.filter((item) => {
      if (activeCategory !== 'all' && item.category !== activeCategory) {
        return false;
      }
      if (jainOnly && !item.jainAvailable) {
        return false;
      }
      if (signatureOnly && !item.isSignature) {
        return false;
      }
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchName = item.name.toLowerCase().includes(q);
        const matchDesc = item.description.toLowerCase().includes(q);
        const matchCat = item.categoryLabel.toLowerCase().includes(q);
        return matchName || matchDesc || matchCat;
      }
      return true;
    });
  }, [activeCategory, jainOnly, signatureOnly, searchQuery]);

  // Dish Pre-Order Handlers
  const handleUpdateDishQty = (itemId: string, delta: number) => {
    setSelectedDishes((prev) => {
      const existing = prev.find((d) => d.itemId === itemId);
      if (!existing) {
        if (delta > 0) {
          return [...prev, { itemId, quantity: delta, jainRequested: jainOnly }];
        }
        return prev;
      }
      const nextQty = existing.quantity + delta;
      if (nextQty <= 0) {
        return prev.filter((d) => d.itemId !== itemId);
      }
      return prev.map((d) =>
        d.itemId === itemId ? { ...d, quantity: nextQty } : d
      );
    });
  };

  const handleToggleDishJain = (itemId: string) => {
    setSelectedDishes((prev) =>
      prev.map((d) =>
        d.itemId === itemId ? { ...d, jainRequested: !d.jainRequested } : d
      )
    );
  };

  const totalSelectedCount = selectedDishes.reduce(
    (sum, d) => sum + d.quantity,
    0
  );

  // Banquet Calculation
  const activeBanquetPkg =
    BANQUET_PACKAGES.find((p) => p.id === selectedPkgId) || BANQUET_PACKAGES[1];

  const handleSelectPackage = (pkgId: string) => {
    setSelectedPkgId(pkgId);
    const pkg = BANQUET_PACKAGES.find((p) => p.id === pkgId);
    if (pkg) {
      if (banquetGuests < pkg.minGuests) setBanquetGuests(pkg.minGuests);
      if (banquetGuests > pkg.maxGuests) setBanquetGuests(pkg.maxGuests);
    }
  };

  const toggleBanquetAddon = (addonId: string) => {
    setSelectedAddonIds((prev) =>
      prev.includes(addonId)
        ? prev.filter((id) => id !== addonId)
        : [...prev, addonId]
    );
  };

  const banquetEstimate = useMemo(() => {
    const baseFoodCost = activeBanquetPkg.pricePerPlate * banquetGuests;
    const addonsCost = selectedAddonIds.reduce((sum, id) => {
      const addon = BANQUET_ADDONS.find((a) => a.id === id);
      if (!addon) return sum;
      return (
        sum +
        (addon.billingType === 'per-guest'
          ? addon.price * banquetGuests
          : addon.price)
      );
    }, 0);
    return baseFoodCost + addonsCost;
  }, [activeBanquetPkg, banquetGuests, selectedAddonIds]);

  const banquetDraft: BanquetDraftConfig = useMemo(() => {
    const addonsList = selectedAddonIds
      .map((id) => BANQUET_ADDONS.find((a) => a.id === id)?.name)
      .filter(Boolean) as string[];
    return {
      packageName: activeBanquetPkg.name,
      pricePerPlate: activeBanquetPkg.pricePerPlate,
      guests: banquetGuests,
      addonsList,
      estimatedTotal: banquetEstimate,
    };
  }, [activeBanquetPkg, banquetGuests, selectedAddonIds, banquetEstimate]);

  const openTableBooking = () => {
    setDrawerMode('table');
    setDrawerOpen(true);
  };

  const openBanquetBooking = () => {
    setDrawerMode('banquet');
    setDrawerOpen(true);
  };

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(RESTAURANT_INFO.fullAddress);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2500);
  };

  return (
    <div id="top" className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#141413]">
      {/* Strict 3-Zone Top Bar Contract */}
      <header className="sticky top-0 z-30 bg-[#FAF8F5]/95 backdrop-blur-sm border-b border-[#E5E0D8]">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-6 py-4">
          {/* Zone 1: Single text element wordmark */}
          <a
            href="#top"
            className="font-display text-2xl font-bold tracking-tight text-[#141413] whitespace-nowrap shrink-0"
          >
            Thaath Maath
          </a>

          {/* Zone 2: 4–5 concise single-line text navigation links */}
          <nav
            aria-label="Primary Navigation"
            className="hidden md:flex items-center gap-7 text-sm font-medium text-[#5C5852]"
          >
            <a
              href="#menu-buffet"
              className="hover:text-[#141413] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Menu & Buffet
            </a>
            <a
              href="#banquet-hall"
              className="hover:text-[#141413] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Banquet Hall
            </a>
            <a
              href="#guest-reviews"
              className="hover:text-[#141413] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Guest Reviews
            </a>
            <a
              href="#location-hours"
              className="hover:text-[#141413] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Location & Hours
            </a>
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={openTableBooking}
              className="px-4 py-2 text-xs font-semibold text-white bg-[#9E2A2B] rounded-lg hover:bg-[#822021] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Reserve Table ({totalSelectedCount})
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* SECTION 1: HERO SPLIT + FULL-WIDTH 4-COLUMN KEY FACTS STRIP */}
        <section className="max-w-7xl mx-auto px-6 pt-8 pb-14 lg:pt-12 lg:pb-16 border-b border-[#E5E0D8]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
            {/* Left Column: Brand Proposition */}
            <div className="lg:col-span-6 flex flex-col justify-between py-2">
              <div className="space-y-5">
                {/* Quiet Unboxed Regional & Dietary Metadata */}
                <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-[#5C5852]">
                  <span className="text-[#1B5E20] font-semibold">
                    100% Pure Vegetarian
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>Dedicated Jain Counter</span>
                  <span aria-hidden="true">·</span>
                  <span>Hilltown Plaza, Nikol, Ahmedabad</span>
                </div>

                <h1
                  className="font-display font-bold tracking-tight text-[#141413] leading-[1.08]"
                  style={{
                    fontSize: 'clamp(2.25rem, 4vw, 3.75rem)',
                    textWrap: 'balance',
                  }}
                >
                  A Royal Multi-Cuisine Feast & Grand Celebration Banquet in Nikol.
                </h1>

                <p className="text-base text-[#5C5852] leading-relaxed max-w-[65ch]">
                  Located on the 3rd Floor of Hilltown Plaza near Amar Jawan Circle,{' '}
                  <strong className="font-semibold text-[#141413]">
                    Thaath Maath
                  </strong>{' '}
                  brings together an expansive 100+ item unlimited pure vegetarian buffet,
                  7 sizzling live counters, and an architectural banquet hall crafted for
                  50 to 350 guests.
                </p>
              </div>

              {/* Action Controls & Curated Highlights */}
              <div className="pt-8 space-y-6">
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={openTableBooking}
                    className="px-6 py-3.5 text-sm font-semibold text-white bg-[#9E2A2B] hover:bg-[#822021] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    Reserve Table or Buffet Pass
                  </button>
                  <a
                    href="#banquet-hall"
                    className="px-5 py-3.5 text-sm font-semibold text-[#141413] bg-[#F2EFE9] hover:bg-[#E5E0D8] border border-[#E5E0D8] rounded-lg transition-colors whitespace-nowrap shrink-0"
                  >
                    Configure Banquet Event
                  </a>
                </div>

                <div className="pt-5 border-t border-[#E5E0D8] flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-[#5C5852]">
                  <span>North Indian Royal</span>
                  <span aria-hidden="true">·</span>
                  <span>Wood-Fired Italian</span>
                  <span aria-hidden="true">·</span>
                  <span>Pan-Asian Sizzlers</span>
                  <span aria-hidden="true">·</span>
                  <span>Mexican Fiesta</span>
                  <span aria-hidden="true">·</span>
                  <span>Live Delhi Chaat & Rabdi</span>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Architectural & Culinary Showcase */}
            <div className="lg:col-span-6 flex flex-col justify-between bg-[#191614] rounded-xl overflow-hidden border border-[#E5E0D8] min-h-[380px] lg:min-h-[460px] relative">
              <CulinaryArtwork
                theme={heroShowcase}
                title={
                  heroShowcase === 'hero-buffet'
                    ? '100+ Item Unlimited Pure Veg Buffet Spread'
                    : heroShowcase === 'hero-banquet'
                    ? 'Thaath Maath Grand Celebration Banquet Hall'
                    : '7 Live Interactive Culinary Counters'
                }
                className="w-full flex-1 min-h-[320px]"
              />

              {/* Overlay Caption & Interactive View Switcher */}
              <div className="relative z-10 p-5 bg-[#141210] border-t border-white/10 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="text-xs text-[#D6C7B2]">
                      {heroShowcase === 'hero-buffet' &&
                        'Daily Lunch (₹549) & Gala Dinner (₹649) Unlimited Spread'}
                      {heroShowcase === 'hero-banquet' &&
                        'Hilltown Plaza 3rd Floor · Pillarless AC Hall for 50–350 Guests'}
                      {heroShowcase === 'hero-live-counter' &&
                        'Fresh Table & Counter Replenishment Every 10 Minutes'}
                    </div>
                    <h2 className="font-display text-xl font-bold text-[#FAF8F5]">
                      {heroShowcase === 'hero-buffet' &&
                        'The Grand 100+ Delicacy Unlimited Buffet'}
                      {heroShowcase === 'hero-banquet' &&
                        'Maharaja Banquet Hall & Reception Suite'}
                      {heroShowcase === 'hero-live-counter' &&
                        'Wood-Fired Pizza, Tawa Chaat & Sizzling Wok'}
                    </h2>
                  </div>
                  <span className="font-mono-num text-xs text-[#F3D088] shrink-0">
                    {heroShowcase === 'hero-buffet' && '85–100+ Dishes'}
                    {heroShowcase === 'hero-banquet' && '50–350 Seating'}
                    {heroShowcase === 'hero-live-counter' && '7 Live Stations'}
                  </span>
                </div>

                {/* Segmented Interactive Switcher */}
                <div className="grid grid-cols-3 gap-1.5 p-1 bg-white/5 rounded-lg">
                  <button
                    type="button"
                    onClick={() => setHeroShowcase('hero-buffet')}
                    className={`py-2 px-3 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 truncate cursor-pointer ${
                      heroShowcase === 'hero-buffet'
                        ? 'bg-[#FAF8F5] text-[#141413] font-semibold'
                        : 'text-[#FAF8F5]/75 hover:text-white'
                    }`}
                  >
                    Grand Buffet
                  </button>
                  <button
                    type="button"
                    onClick={() => setHeroShowcase('hero-banquet')}
                    className={`py-2 px-3 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 truncate cursor-pointer ${
                      heroShowcase === 'hero-banquet'
                        ? 'bg-[#FAF8F5] text-[#141413] font-semibold'
                        : 'text-[#FAF8F5]/75 hover:text-white'
                    }`}
                  >
                    Banquet Hall
                  </button>
                  <button
                    type="button"
                    onClick={() => setHeroShowcase('hero-live-counter')}
                    className={`py-2 px-3 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 truncate cursor-pointer ${
                      heroShowcase === 'hero-live-counter'
                        ? 'bg-[#FAF8F5] text-[#141413] font-semibold'
                        : 'text-[#FAF8F5]/75 hover:text-white'
                    }`}
                  >
                    7 Live Counters
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Full-Width 4-Column Key Facts Strip Below Hero Split */}
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-8 border-t border-[#E5E0D8]">
            <div className="p-4 bg-[#F2EFE9] border border-[#E5E0D8] rounded-xl">
              <div className="text-xs text-[#5C5852]">Verified Guest Rating</div>
              <div className="mt-1 font-mono-num text-xl font-bold text-[#141413]">
                {RESTAURANT_INFO.ratingScore} / 5.0
              </div>
              <div className="mt-1 text-xs text-[#5C5852]">
                Across {RESTAURANT_INFO.reviewCount} Google & EazyDiner diners
              </div>
            </div>

            <div className="p-4 bg-[#F2EFE9] border border-[#E5E0D8] rounded-xl">
              <div className="text-xs text-[#5C5852]">Dining & Buffet Value</div>
              <div className="mt-1 font-mono-num text-xl font-bold text-[#141413]">
                ₹1,250 for Two
              </div>
              <div className="mt-1 text-xs text-[#5C5852]">
                Unlimited Buffet from ₹549 · 100+ Pure Veg Items
              </div>
            </div>

            <div className="p-4 bg-[#F2EFE9] border border-[#E5E0D8] rounded-xl">
              <div className="text-xs text-[#5C5852]">Daily Dining Sessions</div>
              <div className="mt-1 font-mono-num text-base font-bold text-[#141413]">
                11:30 AM – 3:00 PM
              </div>
              <div className="mt-1 font-mono-num text-xs text-[#5C5852]">
                Dinner: 7:00 PM – 11:00 PM (Mon–Sun)
              </div>
            </div>

            <div className="p-4 bg-[#F2EFE9] border border-[#E5E0D8] rounded-xl">
              <div className="text-xs text-[#5C5852]">Nikol Landmark Address</div>
              <div className="mt-1 text-base font-bold text-[#141413] truncate">
                3rd Floor, Hilltown Plaza
              </div>
              <div className="mt-1 text-xs text-[#5C5852] truncate">
                Near Amar Jawan Circle, SP Ring Road, Nikol
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: MULTI-CUISINE MENU & UNLIMITED BUFFET EXPLORER */}
        <section
          id="menu-buffet"
          className="max-w-7xl mx-auto px-6 py-14 lg:py-20 border-b border-[#E5E0D8]"
        >
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
            <div className="space-y-2">
              <div className="text-xs font-medium text-[#5C5852]">
                01. Culinary Spread & Live Stations · 100% Pure Vegetarian
              </div>
              <h2
                className="font-display text-3xl sm:text-4xl font-bold text-[#141413] tracking-tight"
                style={{ textWrap: 'balance' }}
              >
                Explore Our Unlimited Buffets & Signature Multi-Cuisine Dishes
              </h2>
            </div>

            {/* Search & Dietary Toggles */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative min-w-[240px] flex-1 sm:flex-initial">
                <Search className="w-4 h-4 text-[#5C5852] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search paneer, buffet, pizza, kunafa..."
                  className="w-full pl-9 pr-3.5 py-2 text-xs bg-white border border-[#E5E0D8] rounded-lg focus:outline-none focus:border-[#9E2A2B]"
                />
              </div>

              <button
                type="button"
                onClick={() => setJainOnly(!jainOnly)}
                className={`px-3.5 py-2 text-xs font-semibold rounded-lg border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  jainOnly
                    ? 'bg-[#1B5E20] text-white border-[#1B5E20]'
                    : 'bg-white text-[#5C5852] border-[#E5E0D8] hover:text-[#141413]'
                }`}
              >
                {jainOnly ? '✓ Jain Prep Only' : 'Jain Prep Available'}
              </button>

              <button
                type="button"
                onClick={() => setSignatureOnly(!signatureOnly)}
                className={`px-3.5 py-2 text-xs font-semibold rounded-lg border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  signatureOnly
                    ? 'bg-[#141413] text-white border-[#141413]'
                    : 'bg-white text-[#5C5852] border-[#E5E0D8] hover:text-[#141413]'
                }`}
              >
                {signatureOnly ? '✓ Chef Signatures' : 'Chef Signatures'}
              </button>
            </div>
          </div>

          {/* Interactive Category Filter Bar */}
          <div className="flex items-center gap-1.5 p-1.5 bg-[#F2EFE9] border border-[#E5E0D8] rounded-xl overflow-x-auto mb-8">
            {(
              [
                { id: 'all', label: 'All Cuisines (10)' },
                { id: 'buffet', label: 'Grand Buffets & Live Counters' },
                { id: 'north-indian', label: 'North Indian Royal' },
                { id: 'pan-asian-mexican', label: 'Pan-Asian & Mexican' },
                { id: 'continental', label: 'Continental & Wood-Fired' },
                { id: 'desserts', label: 'Artisanal Desserts' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveCategory(tab.id)}
                className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  activeCategory === tab.id
                    ? 'bg-[#FAF8F5] text-[#141413] shadow-xs border border-[#E5E0D8]'
                    : 'text-[#5C5852] hover:text-[#141413]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* 3-Column Featured Menu & Buffet Grid */}
          {filteredMenu.length === 0 ? (
            <div className="p-12 text-center bg-[#F2EFE9] border border-[#E5E0D8] rounded-xl space-y-3">
              <p className="text-base font-semibold text-[#141413]">
                No dishes match your current filter selection.
              </p>
              <p className="text-xs text-[#5C5852]">
                Try clearing the search query or toggling off the Jain / Signature filter.
              </p>
              <button
                type="button"
                onClick={() => {
                  setActiveCategory('all');
                  setJainOnly(false);
                  setSignatureOnly(false);
                  setSearchQuery('');
                }}
                className="px-4 py-2 text-xs font-semibold bg-[#141413] text-white rounded-lg cursor-pointer"
              >
                Reset Menu Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
              {filteredMenu.map((item) => {
                const selectedEntry = selectedDishes.find(
                  (d) => d.itemId === item.id
                );
                const quantity = selectedEntry ? selectedEntry.quantity : 0;

                return (
                  <article
                    key={item.id}
                    className="group bg-white border border-[#E5E0D8] rounded-xl overflow-hidden flex flex-col justify-between transition-transform duration-150 hover:-translate-y-0.5"
                  >
                    <div>
                      {/* 4:3 Dish Artwork Container */}
                      <div className="aspect-[4/3] w-full overflow-hidden border-b border-[#E5E0D8]">
                        <CulinaryArtwork
                          theme={item.artworkTheme}
                          title={item.name}
                          subtitle={`${item.categoryLabel} · ${item.serves}`}
                          className="w-full h-full"
                        />
                      </div>

                      {/* Card Body with Unboxed Metadata */}
                      <div className="p-5 space-y-2.5">
                        {/* Unboxed Metadata Line */}
                        <div className="flex flex-wrap items-center gap-1.5 text-xs text-[#5C5852]">
                          <span className="text-[#1B5E20] font-medium">Pure Veg</span>
                          <span aria-hidden="true">·</span>
                          <span>{item.jainAvailable ? 'Jain Option' : 'Standard Prep'}</span>
                          <span aria-hidden="true">·</span>
                          <span>{item.spiceLevel}</span>
                          {item.isSignature && (
                            <>
                              <span aria-hidden="true">·</span>
                              <span className="text-[#9E2A2B] font-medium">
                                House Signature
                              </span>
                            </>
                          )}
                        </div>

                        <h3 className="text-base font-semibold text-[#141413] leading-snug">
                          {item.name}
                        </h3>

                        <p className="text-xs text-[#5C5852] leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    {/* Price & Interactive Pre-Order Control */}
                    <div className="px-5 py-4 bg-[#FAF8F5] border-t border-[#E5E0D8] flex items-center justify-between gap-4">
                      <div>
                        <span className="font-mono-num text-base font-bold text-[#141413]">
                          ₹{item.price}
                        </span>
                        <span className="text-xs text-[#5C5852] ml-1">
                          / {item.unitLabel}
                        </span>
                      </div>

                      {quantity > 0 ? (
                        <div className="flex items-center gap-2 bg-white border border-[#9E2A2B] rounded-lg px-2 py-1">
                          <button
                            type="button"
                            onClick={() => handleUpdateDishQty(item.id, -1)}
                            className="p-1 text-[#9E2A2B] hover:bg-[#F2EFE9] rounded cursor-pointer"
                            aria-label={`Remove one ${item.name}`}
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="font-mono-num text-xs font-bold text-[#141413] px-1.5">
                            {quantity} in Booking
                          </span>
                          <button
                            type="button"
                            onClick={() => handleUpdateDishQty(item.id, 1)}
                            className="p-1 text-[#9E2A2B] hover:bg-[#F2EFE9] rounded cursor-pointer"
                            aria-label={`Add one more ${item.name}`}
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleUpdateDishQty(item.id, 1)}
                          className="px-3.5 py-2 text-xs font-semibold text-[#141413] bg-[#F2EFE9] hover:bg-[#9E2A2B] hover:text-white rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                        >
                          Add to Table Booking
                        </button>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        {/* SECTION 3: INTERACTIVE BANQUET HALL & EVENT PACKAGE CONFIGURATOR */}
        <section
          id="banquet-hall"
          className="max-w-7xl mx-auto px-6 py-14 lg:py-20 border-b border-[#E5E0D8]"
        >
          <div className="max-w-3xl space-y-2 mb-10">
            <div className="text-xs font-medium text-[#5C5852]">
              02. Grand Banquet Hall & Celebrations · 50 to 350 Guests Capacity
            </div>
            <h2
              className="font-display text-3xl sm:text-4xl font-bold text-[#141413] tracking-tight"
              style={{ textWrap: 'balance' }}
            >
              Plan Your Ring Ceremony, Family Reception, or Corporate Gala at Hilltown Plaza
            </h2>
            <p className="text-sm text-[#5C5852] leading-relaxed">
              Select a curated banquet package below, adjust your expected guest count, and
              customize stage or Jain kitchen arrangements for an instant transparent event
              estimate.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left 7 Columns: Package Selector & Course Breakdown */}
            <div className="lg:col-span-7 space-y-6">
              {/* 3 Package Tier Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {BANQUET_PACKAGES.map((pkg) => {
                  const isSelected = pkg.id === selectedPkgId;
                  return (
                    <button
                      key={pkg.id}
                      type="button"
                      onClick={() => handleSelectPackage(pkg.id)}
                      className={`text-left p-4 rounded-xl border transition-colors cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'bg-[#141413] text-[#FAF8F5] border-[#141413]'
                          : 'bg-white text-[#141413] border-[#E5E0D8] hover:bg-[#F2EFE9]'
                      }`}
                    >
                      <div>
                        <div
                          className={`text-[11px] font-medium ${
                            isSelected ? 'text-[#D6C7B2]' : 'text-[#5C5852]'
                          }`}
                        >
                          {pkg.tierIndex}
                        </div>
                        <div className="font-display text-lg font-bold mt-1">
                          {pkg.name}
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-current/10 flex items-baseline justify-between">
                        <span className="font-mono-num text-lg font-bold">
                          ₹{pkg.pricePerPlate}
                        </span>
                        <span
                          className={`text-[11px] font-mono-num ${
                            isSelected ? 'text-[#D6C7B2]' : 'text-[#5C5852]'
                          }`}
                        >
                          {pkg.minGuests}–{pkg.maxGuests} pax
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Selected Package Course & Hall Inclusion Details */}
              <div className="p-6 bg-white border border-[#E5E0D8] rounded-xl space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#E5E0D8]">
                  <div>
                    <div className="text-xs text-[#5C5852]">
                      {activeBanquetPkg.tierIndex} · {activeBanquetPkg.includedSummary}
                    </div>
                    <h3 className="font-display text-2xl font-bold text-[#141413] mt-0.5">
                      {activeBanquetPkg.name} — Menu & Hall Inclusions
                    </h3>
                  </div>
                  <div className="font-mono-num text-lg font-bold text-[#9E2A2B] shrink-0">
                    ₹{activeBanquetPkg.pricePerPlate} / plate
                  </div>
                </div>

                <div className="space-y-2.5">
                  <div className="text-xs font-semibold text-[#141413]">
                    Included Culinary Courses:
                  </div>
                  <ul className="space-y-2 text-xs text-[#5C5852]">
                    {activeBanquetPkg.courses.map((course, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <span className="font-mono-num text-[#9E2A2B] font-semibold">
                          0{idx + 1}.
                        </span>
                        <span>{course}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t border-[#E5E0D8] space-y-2">
                  <div className="text-xs font-semibold text-[#141413]">
                    Banquet Hall Privileges:
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-[#5C5852]">
                    {activeBanquetPkg.hallFeatures.map((feat, idx) => (
                      <React.Fragment key={idx}>
                        {idx > 0 && <span aria-hidden="true">·</span>}
                        <span>{feat}</span>
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right 5 Columns: Live Guest Count & Estimate Calculator */}
            <div className="lg:col-span-5 p-6 bg-[#F2EFE9] border border-[#E5E0D8] rounded-xl space-y-6">
              <div>
                <h3 className="font-display text-2xl font-bold text-[#141413]">
                  Instant Event Cost Calculator
                </h3>
                <p className="text-xs text-[#5C5852] mt-0.5">
                  Customize guest count and event add-ons for transparent Hilltown Plaza
                  banquet pricing.
                </p>
              </div>

              {/* Guest Count Stepper & Range */}
              <div className="p-4 bg-white border border-[#E5E0D8] rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="banquet-guest-slider"
                    className="text-xs font-semibold text-[#141413]"
                  >
                    Expected Guests ({activeBanquetPkg.minGuests}–{activeBanquetPkg.maxGuests})
                  </label>
                  <span className="font-mono-num text-base font-bold text-[#9E2A2B]">
                    {banquetGuests} Guests
                  </span>
                </div>

                <input
                  id="banquet-guest-slider"
                  type="range"
                  min={activeBanquetPkg.minGuests}
                  max={activeBanquetPkg.maxGuests}
                  step={5}
                  value={banquetGuests}
                  onChange={(e) => setBanquetGuests(Number(e.target.value))}
                  className="w-full accent-[#9E2A2B] cursor-pointer"
                />

                <div className="flex items-center justify-between text-[11px] font-mono-num text-[#5C5852]">
                  <span>Min: {activeBanquetPkg.minGuests} Pax</span>
                  <span>Mid: 200 Pax</span>
                  <span>Max: {activeBanquetPkg.maxGuests} Pax</span>
                </div>
              </div>

              {/* Optional Event Add-ons */}
              <div className="space-y-2.5">
                <div className="text-xs font-semibold text-[#141413]">
                  Celebration Arrangements & Add-Ons:
                </div>
                <div className="space-y-2">
                  {BANQUET_ADDONS.map((addon) => {
                    const checked = selectedAddonIds.includes(addon.id);
                    return (
                      <div
                        key={addon.id}
                        onClick={() => toggleBanquetAddon(addon.id)}
                        className={`p-3 rounded-lg border transition-colors cursor-pointer flex items-start justify-between gap-3 ${
                          checked
                            ? 'bg-white border-[#141413]'
                            : 'bg-[#FAF8F5] border-[#E5E0D8] hover:bg-white'
                        }`}
                      >
                        <div className="space-y-0.5">
                          <div className="text-xs font-semibold text-[#141413]">
                            {checked ? '✓ ' : '+ '}
                            {addon.name}
                          </div>
                          <div className="text-[11px] text-[#5C5852]">
                            {addon.description}
                          </div>
                        </div>
                        <div className="font-mono-num text-xs font-semibold text-[#141413] shrink-0">
                          {addon.price === 0
                            ? 'Complimentary'
                            : addon.billingType === 'per-guest'
                            ? `₹${addon.price}/guest`
                            : `₹${addon.price.toLocaleString('en-IN')}`}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Total Breakdown */}
              <div className="p-4 bg-[#141413] text-[#FAF8F5] rounded-lg space-y-2">
                <div className="flex items-center justify-between text-xs text-[#D6C7B2]">
                  <span>
                    Catering ({banquetGuests} plates × ₹{activeBanquetPkg.pricePerPlate})
                  </span>
                  <span className="font-mono-num">
                    ₹{(banquetGuests * activeBanquetPkg.pricePerPlate).toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="pt-2 border-t border-white/15 flex items-baseline justify-between">
                  <span className="text-xs font-semibold">
                    Estimated Total Package
                  </span>
                  <span className="font-mono-num text-xl font-bold text-[#F3D088]">
                    ₹{banquetEstimate.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div className="space-y-2.5">
                <button
                  type="button"
                  onClick={openBanquetBooking}
                  className="w-full py-3.5 px-5 bg-[#9E2A2B] hover:bg-[#822021] text-white text-sm font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  Lock Banquet Quote & Check Hall Availability
                </button>
                <a
                  href={buildWhatsAppUrl(
                    `*THAATH MAATH — BANQUET QUOTE INQUIRY*\nPackage: ${activeBanquetPkg.name} (₹${activeBanquetPkg.pricePerPlate}/plate)\nExpected Guests: ${banquetGuests} Guests\nAdd-Ons: ${
                      banquetDraft.addonsList.length > 0
                        ? banquetDraft.addonsList.join(', ')
                        : 'Standard Inclusions'
                    }\nEstimated Total: ₹${banquetEstimate.toLocaleString(
                      'en-IN'
                    )}\nVenue: Hilltown Plaza, Nikol, Ahmedabad`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 bg-[#1B5E20] hover:bg-[#144718] text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  Send Banquet Quote on WhatsApp (9724852137)
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4: PROOF OF IMPACT & ATTRIBUTABLE GUEST REVIEWS */}
        <section
          id="guest-reviews"
          className="max-w-7xl mx-auto px-6 py-14 lg:py-20 border-b border-[#E5E0D8]"
        >
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div className="space-y-2">
              <div className="text-xs font-medium text-[#5C5852]">
                03. Verified Patron Stories · Nikol, Vastral & SP Ring Road Families
              </div>
              <h2
                className="font-display text-3xl sm:text-4xl font-bold text-[#141413] tracking-tight"
                style={{ textWrap: 'balance' }}
              >
                Why East Ahmedabad Trusts Thaath Maath for Family Buffets & Celebrations
              </h2>
            </div>

            <div className="text-xs text-[#5C5852] font-mono-num shrink-0">
              4.4 ★ Average · 1,280+ Verified Reviews
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {GUEST_REVIEWS.map((rev) => (
              <article
                key={rev.id}
                className="p-6 bg-white border border-[#E5E0D8] rounded-xl flex flex-col justify-between space-y-5"
              >
                <div className="space-y-3">
                  {/* Unboxed Metadata */}
                  <div className="flex items-center justify-between text-xs text-[#5C5852]">
                    <span className="font-mono-num font-semibold text-[#141413]">
                      Rated {rev.rating}
                    </span>
                    <span>{rev.visitDate}</span>
                  </div>

                  <p className="text-sm text-[#141413] leading-relaxed">
                    “{rev.quote}”
                  </p>
                </div>

                <div className="pt-4 border-t border-[#E5E0D8] space-y-2">
                  <div className="text-xs font-semibold text-[#1B5E20]">
                    {rev.outcomeHighlight}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-[#141413]">
                      {rev.guestName}
                    </div>
                    <div className="text-xs text-[#5C5852]">
                      {rev.occasion} · {rev.location}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* SECTION 5: LOCATION, HOURS & DIRECT DIRECTIONS IN NIKOL, AHMEDABAD */}
        <section
          id="location-hours"
          className="max-w-7xl mx-auto px-6 py-14 lg:py-20"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Left 6 Columns: Venue Address, Timings & Contact */}
            <div className="lg:col-span-6 p-7 bg-white border border-[#E5E0D8] rounded-xl flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="text-xs font-medium text-[#5C5852]">
                  04. Visit Us at Hilltown Plaza · Sardar Patel Ring Road, Nikol
                </div>
                <h2 className="font-display text-3xl font-bold text-[#141413] tracking-tight">
                  Location, Dining Hours & Direct Reception Lines
                </h2>
                <p className="text-xs text-[#5C5852] leading-relaxed">
                  Conveniently situated on the 3rd Floor of Hilltown Plaza at the Amar
                  Jawan Circle Cross Road on Sardar Patel Ring Road, with dedicated basement
                  & surface parking for buffet diners and banquet guests.
                </p>

                <div className="pt-2 space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-[#9E2A2B] shrink-0 mt-1" />
                    <div className="text-xs space-y-1">
                      <div className="font-semibold text-[#141413]">
                        Official Venue Address
                      </div>
                      <div className="text-[#5C5852] leading-relaxed">
                        {RESTAURANT_INFO.fullAddress}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="w-4 h-4 text-[#9E2A2B] shrink-0 mt-1" />
                    <div className="text-xs space-y-1">
                      <div className="font-semibold text-[#141413]">
                        Daily Lunch & Dinner Timings (Monday – Sunday)
                      </div>
                      <div className="font-mono-num text-[#5C5852]">
                        Lunch Buffet & À La Carte: {RESTAURANT_INFO.lunchHours}
                      </div>
                      <div className="font-mono-num text-[#5C5852]">
                        Dinner Buffet & Live Counters: {RESTAURANT_INFO.dinnerHours}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="w-4 h-4 text-[#9E2A2B] shrink-0 mt-1" />
                    <div className="text-xs space-y-1">
                      <div className="font-semibold text-[#141413]">
                        Table Reservations & Banquet Desk
                      </div>
                      <div className="font-mono-num text-[#5C5852]">
                        Table Desk: {RESTAURANT_INFO.phonePrimary} · Banquet Desk:{' '}
                        {RESTAURANT_INFO.phoneBanquet}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#E5E0D8] flex flex-wrap items-center gap-3">
                <a
                  href={buildWhatsAppUrl(
                    `Hello Thaath Maath (Hilltown Plaza, Nikol)! I would like to inquire about a Table / Buffet / Banquet reservation.`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold bg-[#1B5E20] text-white rounded-lg hover:bg-[#144718] transition-colors whitespace-nowrap shrink-0"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  WhatsApp Inquiry (9724852137)
                </a>

                <a
                  href={RESTAURANT_INFO.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold bg-[#141413] text-white rounded-lg hover:bg-[#2C2A28] transition-colors whitespace-nowrap shrink-0"
                >
                  Open in Google Maps
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <button
                  type="button"
                  onClick={handleCopyAddress}
                  className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold bg-[#F2EFE9] text-[#141413] border border-[#E5E0D8] rounded-lg hover:bg-[#E5E0D8] transition-colors cursor-pointer whitespace-nowrap shrink-0"
                >
                  {copiedAddress ? (
                    <Check className="w-3.5 h-3.5 text-[#1B5E20]" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  {copiedAddress ? 'Address Copied' : 'Copy Full Address'}
                </button>
              </div>
            </div>

            {/* Right 6 Columns: Interactive Architectural Location Map Visual & Quick Booking Card */}
            <div className="lg:col-span-6 p-7 bg-[#F2EFE9] border border-[#E5E0D8] rounded-xl flex flex-col justify-between space-y-6">
              {/* Custom Vector Map Schematic of Amar Jawan Circle / SP Ring Road Nikol */}
              <div className="relative bg-[#191614] text-[#FAF8F5] rounded-lg overflow-hidden border border-[#E5E0D8] p-5 min-h-[230px] flex flex-col justify-between">
                <svg
                  viewBox="0 0 600 240"
                  className="absolute inset-0 w-full h-full object-cover opacity-80"
                  preserveAspectRatio="xMidYMid slice"
                >
                  <rect width="600" height="240" fill="#181614" />
                  {/* Grid roads */}
                  <g stroke="#332E2A" strokeWidth="1.5">
                    <line x1="0" y1="60" x2="600" y2="60" />
                    <line x1="0" y1="180" x2="600" y2="180" />
                    <line x1="140" y1="0" x2="140" y2="240" />
                    <line x1="460" y1="0" x2="460" y2="240" />
                  </g>
                  {/* Sardar Patel Ring Road Highway */}
                  <path
                    d="M -20 190 Q 280 120 620 70"
                    fill="none"
                    stroke="#C8963E"
                    strokeWidth="8"
                    strokeOpacity="0.45"
                  />
                  {/* Nikol Cross Road */}
                  <path
                    d="M 220 0 L 360 240"
                    fill="none"
                    stroke="#D6C7B2"
                    strokeWidth="5"
                    strokeOpacity="0.35"
                  />
                  {/* Amar Jawan Circle Junction */}
                  <circle
                    cx="305"
                    cy="128"
                    r="24"
                    fill="#181614"
                    stroke="#C8963E"
                    strokeWidth="3"
                  />
                  {/* Hilltown Plaza Pin */}
                  <circle cx="348" cy="102" r="10" fill="#9E2A2B" />
                  <circle
                    cx="348"
                    cy="102"
                    r="18"
                    fill="none"
                    stroke="#F3D088"
                    strokeWidth="1.5"
                  />
                </svg>

                <div className="relative z-10 flex items-center justify-between text-xs">
                  <span className="font-mono-num text-[#F3D088] font-semibold">
                    23.0402° N, 72.6796° E · Nikol Cross Road
                  </span>
                  <span className="text-[#D6C7B2]">3rd Floor Elevator Access</span>
                </div>

                <div className="relative z-10 bg-black/75 backdrop-blur-xs p-3.5 rounded-lg border border-white/10">
                  <div className="text-xs font-semibold text-white">
                    Hilltown Plaza · Near Amar Jawan Circle
                  </div>
                  <div className="text-[11px] text-[#D6C7B2] mt-0.5">
                    Direct connectivity from Sardar Patel Ring Road, Nikol Gam Road, Vastral
                    Metro, and Odhav Ring Road Circle.
                  </div>
                </div>
              </div>

              {/* Instant Reservation Callout */}
              <div className="p-5 bg-white border border-[#E5E0D8] rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="text-sm font-bold text-[#141413]">
                    Ready to dine or host a family function?
                  </div>
                  <div className="text-xs text-[#5C5852]">
                    Reserve your table or download an instant banquet package estimate.
                  </div>
                </div>
                <button
                  type="button"
                  onClick={openTableBooking}
                  className="px-5 py-3 text-xs font-semibold bg-[#9E2A2B] hover:bg-[#822021] text-white rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  Open Booking Desk
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* QUIET FOOTER */}
      <footer className="bg-[#141413] text-[#FAF8F5] border-t border-[#E5E0D8]">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-8 border-b border-white/10">
            <div className="space-y-1.5">
              <div className="font-display text-2xl font-bold tracking-tight text-white">
                Thaath Maath — A Pure Veg MultiCuisine Restaurant & Banquet
              </div>
              <p className="text-xs text-[#D6C7B2]">
                3rd Floor, Hilltown Plaza, Near Amar Jawan Circle, Sardar Patel Ring Road,
                Nikol, Ahmedabad, Gujarat 380049
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-xs text-[#D6C7B2]">
              <a href="#menu-buffet" className="hover:text-white transition-colors">
                Menu & Buffet
              </a>
              <a href="#banquet-hall" className="hover:text-white transition-colors">
                Banquet Packages
              </a>
              <a href="#guest-reviews" className="hover:text-white transition-colors">
                Guest Reviews
              </a>
              <a href="#location-hours" className="hover:text-white transition-colors">
                Directions
              </a>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-[#D6C7B2]/80">
            <div>
              © {new Date().getFullYear()} Thaath Maath Restaurant & Banquet, Nikol,
              Ahmedabad. 100% Pure Vegetarian Kitchen.
            </div>
            <div className="font-mono-num">
              Lunch: 11:30 AM – 3:00 PM · Dinner: 7:00 PM – 11:00 PM
            </div>
          </div>
        </div>
      </footer>

      {/* Interactive Table & Banquet Reservation Drawer */}
      <ReservationDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        initialMode={drawerMode}
        selectedDishes={selectedDishes}
        onUpdateDishQty={handleUpdateDishQty}
        onToggleDishJain={handleToggleDishJain}
        onClearDishes={() => setSelectedDishes([])}
        banquetDraft={banquetDraft}
      />
    </div>
  );
}
