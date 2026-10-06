"use client";

import React, { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { PRODUCTS, Product, ShippingClass } from "@/lib/mockData";

interface ZoomItem {
  title: string;
  imageUrl: string;
  botanicalName?: string;
  subtitle?: string;
  shippingClass?: ShippingClass;
  priceSek?: number;
  product?: Product;
}

export default function StorefrontPage() {
  // Cart state
  const [cart, setCart] = useState<{ product: Product; qty: number }[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Filters state
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedZone, setSelectedZone] = useState<string>("all");
  const [selectedSowMonth, setSelectedSowMonth] = useState<string>("all");

  // Bundle selection state (Sensommardröm vid Bryggan)
  const bundleComponentIds = [
    "slojsilja-ammi-majus",
    "zinnia-elandslangtan",
    "pionvallmo-skargardspastell",
    "luktart-morgonbris",
  ];
  const [selectedBundleComponents, setSelectedBundleComponents] = useState<string[]>(bundleComponentIds);

  // Modals state
  const [activeGuideProduct, setActiveGuideProduct] = useState<Product | null>(null);
  const [activeNotifyProduct, setActiveNotifyProduct] = useState<Product | null>(null);
  const [activeZoomProduct, setActiveZoomProduct] = useState<ZoomItem | null>(null);
  const [isZoomMagnified, setIsZoomMagnified] = useState(false);
  const [zoomActiveSide, setZoomActiveSide] = useState<"front" | "back">("front");
  const [notifyEmail, setNotifyEmail] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Keyboard listener for Escape to close open modals
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (activeZoomProduct) {
          setActiveZoomProduct(null);
        } else if (activeGuideProduct) {
          setActiveGuideProduct(null);
        } else if (activeNotifyProduct) {
          setActiveNotifyProduct(null);
        } else if (isCartOpen) {
          setIsCartOpen(false);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeZoomProduct, activeGuideProduct, activeNotifyProduct, isCartOpen]);

  // Toast trigger
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Add to cart
  const addToCart = (product: Product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, qty: item.qty + quantity } : item
        );
      }
      return [...prev, { product, qty: quantity }];
    });
    showToast(`${product.title} lades till i korgen!`);
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  // Bundle price calculation
  const bundleItems = useMemo(() => {
    return PRODUCTS.filter((p) => bundleComponentIds.includes(p.id));
  }, []);

  const bundleSubtotal = useMemo(() => {
    return bundleItems
      .filter((p) => selectedBundleComponents.includes(p.id))
      .reduce((sum, p) => sum + p.priceSek, 0);
  }, [bundleItems, selectedBundleComponents]);

  const isFullBundle = selectedBundleComponents.length === bundleComponentIds.length;
  const bundleFinalPrice = isFullBundle ? 145 : bundleSubtotal; // 145 kr paketpris vs 168 ord.

  const addBundleToCart = () => {
    const selectedItems = bundleItems.filter((p) => selectedBundleComponents.includes(p.id));
    selectedItems.forEach((item) => {
      addToCart(item, 1);
    });
    showToast("Bukettpaketet lades till i varukorgen!");
    setIsCartOpen(true);
  };

  // Cart calculations & shipping awareness
  const cartSubtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.product.priceSek * item.qty, 0);
  }, [cart]);

  const cartItemCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.qty, 0);
  }, [cart]);

  const hasBulkyParcel = useMemo(() => {
    return cart.some((item) => item.product.shippingClass === "BULKY_PARCEL");
  }, [cart]);

  const FREE_SHIPPING_LIMIT = 350;
  const isFreeShipping = cartSubtotal >= FREE_SHIPPING_LIMIT && !hasBulkyParcel;

  const shippingCost = useMemo(() => {
    if (cart.length === 0) return 0;
    if (hasBulkyParcel) return 79;
    return isFreeShipping ? 0 : 29;
  }, [cart, hasBulkyParcel, isFreeShipping]);

  const cartTotal = cartSubtotal + shippingCost;

  // Filtered products
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((p) => {
      if (p.type === "bouquet_bundle") return false; // Shown separately in feature section

      if (selectedCategory !== "all" && p.category !== selectedCategory) {
        return false;
      }

      if (selectedZone !== "all" && p.specs) {
        const zoneNum = parseInt(selectedZone);
        if (!p.specs.zones.includes(zoneNum)) {
          return false;
        }
      }

      if (selectedSowMonth !== "all" && p.specs) {
        const monthNum = parseInt(selectedSowMonth);
        if (!p.specs.sowMonths.includes(monthNum)) {
          return false;
        }
      }

      return true;
    });
  }, [selectedCategory, selectedZone, selectedSowMonth]);

  return (
    <div className="min-h-screen flex flex-col bg-oat text-bark">
      {/* Top Notice Bar */}
      <div className="bg-pine text-oat text-xs py-2 px-4 text-center tracking-wide font-sans border-b border-pine-light">
        <span>
          <strong>Öhlunds Brygga vid Ljusnan (Ljusdal, Zon 5):</strong> Handpackade kulturarvsfröer & snittblommor • Brevfrakt 29 kr (Fri frakt över 350 kr) • EU-växtpass
        </span>
      </div>

      {/* Navigation Header */}
      <header className="sticky top-0 z-40 bg-oat/95 backdrop-blur-md border-b border-sand transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center gap-3.5 group">
            {/* Sprout 'Ö' Logo exactly matching the brown kraft packet */}
            <div className="w-9 h-11 flex items-center justify-center transition-transform group-hover:scale-105">
              <svg viewBox="16 18 73 105" className="w-full h-full text-pine fill-current" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M 29,32 L 32,41 L 36,45 L 38,46 L 48,48 L 48,50 L 49,52 L 47,54 L 44,54 L 32,60 L 26,66 L 22,72 L 19,82 L 19,91 L 22,101 L 26,107 L 30,111 L 34,114 L 40,117 L 46,119 L 59,119 L 63,118 L 74,112 L 81,104 L 84,98 L 86,89 L 86,84 L 84,75 L 80,67 L 73,60 L 61,54 L 58,54 L 50,51 L 49,49 L 49,43 L 45,35 L 44,35 L 40,32 L 36,31 Z M 46,62 L 59,62 L 65,65 L 68,68 L 69,68 L 73,73 L 75,77 L 77,84 L 77,89 L 76,93 L 72,101 L 66,107 L 63,109 L 56,111 L 50,111 L 45,110 L 39,107 L 32,100 L 30,96 L 28,89 L 28,83 L 29,79 L 32,73 L 37,67 L 43,63 Z M 81,22 L 73,22 L 69,23 L 62,27 L 58,32 L 56,40 L 57,46 L 58,41 L 60,38 L 67,34 L 62,40 L 62,42 L 61,44 L 67,44 L 72,42 L 78,36 L 80,33 L 82,26 Z" />
              </svg>
            </div>
            <div>
              <span className="font-serif text-2xl font-semibold tracking-tight text-pine block leading-none">
                ÖHLUNDS FRÖER
              </span>
              <span className="text-[10px] uppercase tracking-[0.2em] font-sans font-semibold text-terracotta mt-1 block">
                Öhlunds Brygga • Ljusdal
              </span>
            </div>
          </a>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-8 font-sans text-sm font-medium">
            <a href="#katalog" className="text-bark hover:text-terracotta transition-colors">
              Fröer
            </a>
            <a href="#bukettpaket" className="text-bark hover:text-terracotta transition-colors">
              Bukettrecept
            </a>
            <a href="#odla-zon5" className="text-bark hover:text-terracotta transition-colors">
              Odla i Zon 5
            </a>
            <a href="/om-oss" className="text-bark hover:text-terracotta transition-colors font-semibold">
              Om oss
            </a>
          </nav>

          {/* Cart button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-2.5 bg-pine hover:bg-pine-light text-oat px-4 py-2.5 rounded-full text-sm font-medium transition-all shadow-sm hover:shadow"
          >
            <span>Varukorg</span>
            <span className="w-5 h-5 rounded-full bg-terracotta text-white text-xs flex items-center justify-center font-bold">
              {cartItemCount}
            </span>
            {cartSubtotal > 0 && <span className="font-bold text-xs">({cartSubtotal} kr)</span>}
          </button>
        </div>
      </header>

      {/* Hero Banner (Showing bright, sunny Stugan & Bryggan at Ljusnan) */}
      <section className="relative overflow-hidden bg-pine text-oat py-20 lg:py-28">
        <div className="absolute inset-0 z-0">
          <Image
            src="/assets/ohlunds_brygga_hero_1791312124759.jpg"
            alt="Öhlunds Brygga och Stugan vid Ljusnans strand i Hälsingland"
            fill
            className="object-cover opacity-80 object-center"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-pine/95 via-pine/70 to-transparent sm:via-pine/50" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-sand-light/15 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase mb-6 border border-sand/30 text-sand-light">
              <span>Från odlingarna vid Stugan i Hälsingland</span>
            </div>
            
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal leading-[1.12] mb-6 tracking-tight">
              SÅ DIN EGEN DRÖM
            </h1>

            <p className="text-lg text-oat/90 font-sans font-normal leading-relaxed mb-8 max-w-xl">
              Utforska vårt noggrant utvalda sortiment av kulturhistoriska fröer, snittblommor och robusta grönsaker. Provodlat och handpackat vid Ljusnans strand.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <a
                href="#katalog"
                className="bg-terracotta hover:bg-clay text-white px-7 py-3.5 rounded-full font-sans font-semibold text-sm tracking-wide transition-all shadow-md hover:shadow-lg inline-flex items-center gap-2"
              >
                UTFORSKA ÅRETS FRÖER
              </a>
              <a
                href="#bukettpaket"
                className="bg-sand-light/20 hover:bg-sand-light/30 text-white backdrop-blur-md border border-sand/40 px-6 py-3.5 rounded-full font-sans font-semibold text-sm transition-all"
              >
                SE BUKETTRECEPTEN
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Feature: Bukettpaket ("Köp buketten") */}
      <section id="bukettpaket" className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-sand-light border border-sand rounded-3xl p-6 sm:p-10 lg:p-14 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* Image (Click to zoom) */}
            <div
              onClick={() => {
                setActiveZoomProduct({
                  title: "Bukettrecept: Sensommardröm vid Bryggan",
                  imageUrl: "/assets/sensommardrom_bukett_1791312135766.jpg",
                  subtitle: "Snittblomsbukett komponerad av Jessica Öhlund • Aprikos zinnia, slöjsilja, pionvallmo & luktärt",
                  priceSek: bundleFinalPrice,
                });
                setIsZoomMagnified(false);
              }}
              className="lg:col-span-5 relative rounded-2xl overflow-hidden shadow-xl aspect-[4/3] lg:aspect-[4/5] cursor-zoom-in group/img"
              role="button"
              tabIndex={0}
              aria-label="Förstora bild för bukettrecept"
            >
              <Image
                src="/assets/sensommardrom_bukett_1791312135766.jpg"
                alt="Snittblomsbukett Sensommardröm vid Bryggan"
                fill
                className="object-cover group-hover/img:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-4 left-4 bg-pine/90 text-oat text-xs font-semibold px-3 py-1.5 rounded-full backdrop-blur-sm tracking-wider uppercase pointer-events-none">
                Bukettrecept #1
              </div>
            </div>

            {/* Content & checklist */}
            <div className="lg:col-span-7 flex flex-col justify-center">
              <span className="text-xs uppercase tracking-[0.2em] font-sans font-bold text-terracotta mb-2">
                Snittblomsrecept av Jessica
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-normal text-pine mb-4 leading-tight">
                Bukettpaket: ”Sensommardröm vid Bryggan”
              </h2>
              <p className="text-bark/80 text-sm sm:text-base leading-relaxed mb-6 font-sans">
                En beprövad snittblomsfavorit framtagen för att ge en sammanhängande, romantisk bukett med aprikos zinnia, skir slöjsilja, silkeslen vallmo och väldoftande luktärt. Blommar från juli till första frosten!
              </p>

              {/* Items checklist */}
              <div className="bg-white rounded-2xl p-5 border border-sand shadow-xs mb-6">
                <div className="text-xs font-semibold uppercase tracking-wider text-bark/60 mb-3 pb-2 border-b border-sand flex justify-between">
                  <span>Ingående frösorter (Klicka för att välja)</span>
                  <span>Ord. pris</span>
                </div>

                <div className="space-y-3">
                  {bundleItems.map((item) => {
                    const isChecked = selectedBundleComponents.includes(item.id);
                    return (
                      <label
                        key={item.id}
                        className="flex items-center justify-between cursor-pointer p-2 rounded-lg hover:bg-oat transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedBundleComponents([...selectedBundleComponents, item.id]);
                              } else {
                                setSelectedBundleComponents(
                                  selectedBundleComponents.filter((id) => id !== item.id)
                                );
                              }
                            }}
                            className="w-4 h-4 rounded text-terracotta focus:ring-terracotta border-sand"
                          />
                          <div>
                            <span className="text-sm font-semibold text-bark block">{item.title}</span>
                            <span className="text-xs text-bark/60 italic">{item.botanicalName}</span>
                          </div>
                        </div>
                        <span className="text-sm font-medium text-pine">{item.priceSek} kr</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Price and CTA */}
              <div className="flex flex-wrap items-baseline gap-4 mb-6">
                <span className="font-serif text-4xl font-medium text-pine">{bundleFinalPrice} kr</span>
                {isFullBundle && (
                  <>
                    <span className="text-lg line-through text-bark/40 font-sans">168 kr</span>
                    <span className="bg-terracotta/15 text-terracotta text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                      Spara 15% (Paketpris)
                    </span>
                  </>
                )}
              </div>

              <div>
                <button
                  onClick={addBundleToCart}
                  disabled={selectedBundleComponents.length === 0}
                  className="bg-pine hover:bg-pine-light disabled:opacity-50 text-oat px-8 py-3.5 rounded-full font-sans font-semibold text-sm transition-all shadow-md hover:shadow-lg inline-flex items-center gap-2"
                >
                  Lägg till buketten i varukorgen ({bundleFinalPrice} kr)
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Catalog Section */}
      <section id="katalog" className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-grow">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs uppercase tracking-[0.2em] font-sans font-bold text-terracotta mb-2 block">
            Vårt sortiment
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-normal text-pine mb-3">
            Handpackade fröer för svenskt klimat
          </h2>
          <p className="text-bark/70 text-sm font-sans">
            Alla våra sorter är provodlade i Ljusdal (Zon 5). Filtrera på din växtzon och såmånad för garanterat resultat.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="bg-white border border-sand rounded-2xl p-4 sm:p-5 mb-10 shadow-xs flex flex-wrap gap-4 items-center justify-between">
          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            {[
              { id: "all", label: "Alla artiklar" },
              { id: "snittblommor", label: "Snittblommor" },
              { id: "kokstradgard", label: "Köksträdgård" },
              { id: "tillbehor", label: "Tillbehör & Vaser" },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all ${
                  selectedCategory === cat.id
                    ? "bg-pine text-oat shadow-xs"
                    : "bg-oat hover:bg-sand text-bark"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Growers Selects: Zone & Sow Month */}
          <div className="flex flex-wrap items-center gap-3 text-xs font-medium">
            <div className="flex items-center gap-2">
              <span className="text-bark/60 font-semibold">Odlingszon:</span>
              <select
                value={selectedZone}
                onChange={(e) => setSelectedZone(e.target.value)}
                className="bg-oat border border-sand rounded-full px-3 py-1.5 text-bark outline-none focus:border-terracotta"
              >
                <option value="all">Alla zoner (1–8)</option>
                <option value="2">Zon 1–2 (Södra)</option>
                <option value="4">Zon 4</option>
                <option value="5">Zon 5 (Ljusdal / Hälsingland)</option>
                <option value="7">Zon 6–8 (Norrland)</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-bark/60 font-semibold">Såmånad:</span>
              <select
                value={selectedSowMonth}
                onChange={(e) => setSelectedSowMonth(e.target.value)}
                className="bg-oat border border-sand rounded-full px-3 py-1.5 text-bark outline-none focus:border-terracotta"
              >
                <option value="all">Alla månader</option>
                <option value="3">Mars (Förkultivering)</option>
                <option value="4">April (Förkultivering/Sådd)</option>
                <option value="5">Maj (Direktsådd)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
          {filteredProducts.map((p) => {
            const isLetter = p.shippingClass === "FLAT_LETTER";

            return (
              <div
                key={p.id}
                className="bg-white border border-sand rounded-2xl overflow-hidden hover:shadow-md transition-all flex flex-col group"
              >
                {/* Image (Click to zoom) */}
                <div
                  onClick={() => {
                    setActiveZoomProduct({
                      title: p.title,
                      imageUrl: p.imageUrl,
                      botanicalName: p.botanicalName,
                      shippingClass: p.shippingClass,
                      priceSek: p.priceSek,
                      product: p,
                    });
                    setIsZoomMagnified(false);
                    setZoomActiveSide("front");
                  }}
                  className="relative aspect-[4/3] bg-sand-light overflow-hidden cursor-zoom-in group/img"
                  role="button"
                  tabIndex={0}
                  aria-label={`Förstora bild för ${p.title}`}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      setActiveZoomProduct({
                        title: p.title,
                        imageUrl: p.imageUrl,
                        botanicalName: p.botanicalName,
                        shippingClass: p.shippingClass,
                        priceSek: p.priceSek,
                        product: p,
                      });
                      setIsZoomMagnified(false);
                      setZoomActiveSide("front");
                    }
                  }}
                >
                  <Image
                    src={p.imageUrl}
                    alt={p.title}
                    fill
                    className="object-cover group-hover/img:scale-105 transition-transform duration-300"
                  />

                  {/* Shipping badge */}
                  <div className="absolute top-3 left-3 pointer-events-none">
                    <span
                      className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full backdrop-blur-sm ${
                        isLetter
                          ? "bg-pine/90 text-oat"
                          : "bg-terracotta/95 text-white"
                      }`}
                    >
                      {isLetter ? "Brev 29 kr" : "Paket 79 kr"}
                    </span>
                  </div>

                  {/* Out of stock badge */}
                  {!p.inStock && (
                    <div className="absolute top-3 right-3 pointer-events-none">
                      <span className="bg-bark/80 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                        Slutsåld
                      </span>
                    </div>
                  )}
                </div>

                {/* Card body */}
                <div className="p-5 flex flex-col flex-grow">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-terracotta mb-1 block">
                    {p.type === "bouquet_bundle"
                      ? "Bukettrecept • Paket"
                      : p.type === "tuber"
                      ? "Knöl & Rotstock"
                      : p.type === "accessory"
                      ? "Trädgårdstillbehör"
                      : p.type === "lifestyle"
                      ? "Keramik & Form"
                      : p.category === "kokstradgard"
                      ? "Köksträdgård"
                      : "Snittblomma"}
                  </span>
                  
                  <h3 className="font-serif text-xl font-medium text-pine mb-1 leading-snug">
                    {p.title}
                  </h3>
                  
                  {p.botanicalName ? (
                    <p className="text-xs italic text-bark/60 mb-3">{p.botanicalName}</p>
                  ) : p.subtitle ? (
                    <p className="text-xs text-bark/60 mb-3">{p.subtitle}</p>
                  ) : (
                    <div className="mb-3" />
                  )}

                  {/* Differentiated Specs Chips based on ProductType */}
                  {p.type === "seed" && p.specs && (
                    <div className="flex flex-wrap gap-1.5 mb-4 text-[11px] text-bark/70">
                      <span className="bg-oat px-2 py-0.5 rounded-md border border-sand/50">
                        Zon {Math.min(...p.specs.zones)}–{Math.max(...p.specs.zones)}
                      </span>
                      {p.specs.heightCm && (
                        <span className="bg-oat px-2 py-0.5 rounded-md border border-sand/50">
                          {p.specs.heightCm} cm
                        </span>
                      )}
                      {p.specs.sowMonths.length > 0 && (
                        <span className="bg-oat px-2 py-0.5 rounded-md border border-sand/50">
                          Så: Månad {p.specs.sowMonths.join("/")}
                        </span>
                      )}
                    </div>
                  )}

                  {p.type === "tuber" && (
                    <div className="flex flex-wrap gap-1.5 mb-4 text-[11px] text-bark/70">
                      <span className="bg-oat px-2 py-0.5 rounded-md border border-sand/50">
                        Zon 1–5
                      </span>
                      <span className="bg-oat px-2 py-0.5 rounded-md border border-sand/50">
                        Höjd 110 cm
                      </span>
                      <span className="bg-oat px-2 py-0.5 rounded-md border border-sand/50">
                        Djup: 10 cm
                      </span>
                    </div>
                  )}

                  {p.type === "accessory" && (
                    <div className="flex flex-wrap gap-1.5 mb-4 text-[11px] text-bark/70">
                      <span className="bg-oat px-2 py-0.5 rounded-md border border-sand/50 font-medium text-pine">
                        10-pack
                      </span>
                      <span className="bg-oat px-2 py-0.5 rounded-md border border-sand/50">
                        15 cm björkträ
                      </span>
                      <span className="bg-oat px-2 py-0.5 rounded-md border border-sand/50">
                        FSC-märkt
                      </span>
                    </div>
                  )}

                  {p.type === "lifestyle" && (
                    <div className="flex flex-wrap gap-1.5 mb-4 text-[11px] text-bark/70">
                      <span className="bg-oat px-2 py-0.5 rounded-md border border-sand/50 font-medium text-pine">
                        Handdrejad
                      </span>
                      <span className="bg-oat px-2 py-0.5 rounded-md border border-sand/50">
                        Stengods
                      </span>
                      <span className="bg-oat px-2 py-0.5 rounded-md border border-sand/50">
                        Havssandglasyr
                      </span>
                    </div>
                  )}

                  {p.type === "bouquet_bundle" && (
                    <div className="flex flex-wrap gap-1.5 mb-4 text-[11px] text-bark/70">
                      <span className="bg-terracotta/10 text-terracotta font-semibold px-2 py-0.5 rounded-md border border-terracotta/20">
                        Paketpris (-15%)
                      </span>
                      <span className="bg-oat px-2 py-0.5 rounded-md border border-sand/50">
                        4 frösorter
                      </span>
                      <span className="bg-oat px-2 py-0.5 rounded-md border border-sand/50">
                        Snittblomsrecept
                      </span>
                    </div>
                  )}

                  {/* Type-Specific Helper or Guide link (NO odlingsguide or QR for accessories/lifestyle) */}
                  {p.type === "seed" && (
                    <button
                      onClick={() => setActiveGuideProduct(p)}
                      className="text-xs text-pine font-medium underline text-left hover:text-terracotta mb-4 flex items-center gap-1.5 py-1"
                    >
                      <span>Se odlingsguide & QR-kod</span>
                    </button>
                  )}

                  {p.type === "tuber" && (
                    <div className="text-xs text-terracotta font-medium mb-4 flex items-center gap-1.5 py-1">
                      <span>{p.shipWindow?.description || "Leverans mars–maj (frostrisk)"}</span>
                    </div>
                  )}

                  {(p.type === "accessory" || p.type === "lifestyle") && (
                    <div className="text-xs text-bark/60 mb-4 py-1">
                      <span>{p.type === "accessory" ? "Väderbeständigt för pallkrage & kruka" : "Formgiven för fylliga buketter"}</span>
                    </div>
                  )}

                  {p.type === "bouquet_bundle" && (
                    <div className="text-xs text-pine font-medium mb-4 py-1">
                      <span>Blomning från juli till september</span>
                    </div>
                  )}

                  {/* Footer & Action button */}
                  <div className="mt-auto pt-3 border-t border-sand/60 flex items-center justify-between">
                    <div>
                      <span className="text-lg font-bold text-pine">{p.priceSek} kr</span>
                    </div>

                    {p.inStock ? (
                      <button
                        onClick={() => addToCart(p, 1)}
                        className="bg-sand hover:bg-pine hover:text-white text-pine text-xs font-semibold px-4 py-2.5 min-h-[44px] rounded-full transition-all flex items-center justify-center"
                      >
                        {p.type === "seed"
                          ? "Köp fröer"
                          : p.type === "tuber"
                          ? "Köp knöl"
                          : p.type === "bouquet_bundle"
                          ? "Köp paketet"
                          : p.type === "lifestyle"
                          ? "Köp vas"
                          : "Köp tillbehör"}
                      </button>
                    ) : (
                      <button
                        onClick={() => setActiveNotifyProduct(p)}
                        className="bg-sand/70 hover:bg-sand text-terracotta text-xs font-semibold px-4 py-2.5 min-h-[44px] rounded-full transition-all flex items-center justify-center"
                      >
                        {p.type === "tuber" ? "Bevaka knöl" : "Bevaka"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Storytelling Section: Om Bryggan vid Ljusnan */}
      <section id="om-bryggan" className="bg-sand-light py-16 sm:py-20 border-t border-sand">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs uppercase tracking-[0.2em] font-sans font-bold text-terracotta mb-2 block">
            Vår plats & filosofi
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-normal text-pine mb-4">
            Öhlunds Brygga vid Ljusnan i Hälsingland
          </h2>
          <p className="text-bark/80 leading-relaxed text-base max-w-3xl mx-auto mb-10 font-sans">
            Vid vår stuga på Ljusnans östra strand i Ljusdal odlar och provar vi blommor och grönsaker härdade för Zon 5. Från vår lilla ”Swish & Grab”-blomsterkiosk vid bryggan har vi vuxit till en modern e-handel där varje fröpåse importeras från EU:s finaste odlare och packas för hand med växtpass och kärlek.
          </p>

          {/* Quick Team Preview Avatars */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto mb-10 text-left">
            <a href="/om-oss" className="group bg-white p-4 rounded-2xl border border-sand hover:border-terracotta transition-all shadow-xs flex items-center gap-3.5">
              <div className="w-14 h-14 relative rounded-full overflow-hidden flex-shrink-0 border-2 border-pine/20">
                <Image src="/assets/team/ville_ohlund.jpg" alt="Ville Öhlund" fill className="object-cover group-hover:scale-105 transition-transform" />
              </div>
              <div>
                <strong className="text-sm font-serif text-pine block group-hover:text-terracotta">Ville Öhlund</strong>
                <span className="text-[11px] text-bark/60 block">VD & Logistik</span>
              </div>
            </a>

            <a href="/om-oss" className="group bg-white p-4 rounded-2xl border border-sand hover:border-terracotta transition-all shadow-xs flex items-center gap-3.5">
              <div className="w-14 h-14 relative rounded-full overflow-hidden flex-shrink-0 border-2 border-pine/20">
                <Image src="/assets/team/jessica_ohlund.jpg" alt="Jessica Öhlund" fill className="object-cover group-hover:scale-105 transition-transform" />
              </div>
              <div>
                <strong className="text-sm font-serif text-pine block group-hover:text-terracotta">Jessica Öhlund</strong>
                <span className="text-[11px] text-bark/60 block">Visionär & Ekoodlare</span>
              </div>
            </a>

            <a href="/om-oss" className="group bg-white p-4 rounded-2xl border border-sand hover:border-terracotta transition-all shadow-xs flex items-center gap-3.5">
              <div className="w-14 h-14 relative rounded-full overflow-hidden flex-shrink-0 border-2 border-pine/20">
                <Image src="/assets/team/magnus_ohlund.jpg" alt="Magnus Öhlund" fill className="object-cover group-hover:scale-105 transition-transform" />
              </div>
              <div>
                <strong className="text-sm font-serif text-pine block group-hover:text-terracotta">Magnus Öhlund</strong>
                <span className="text-[11px] text-bark/60 block">IT-arkitekt & Byggare</span>
              </div>
            </a>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="/om-oss"
              className="bg-pine hover:bg-pine-light text-oat px-6 py-3 rounded-full text-xs font-semibold tracking-wider uppercase transition-all shadow-md inline-flex items-center gap-2"
            >
              <span>Möt familjen bakom Öhlunds</span>
              <span>→</span>
            </a>
            <a
              href="https://www.instagram.com/ohlunds_brygga/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white hover:bg-sand text-pine border border-sand px-5 py-3 rounded-full text-xs font-semibold transition-all inline-flex items-center gap-2"
            >
              <span>Följ @ohlunds_brygga på Instagram</span>
            </a>
          </div>
        </div>
      </section>

      {/* Slide-out Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-bark/40 backdrop-blur-xs transition-opacity"
            onClick={() => setIsCartOpen(false)}
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
              {/* Header */}
              <div className="p-5 border-b border-sand bg-oat flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-2xl font-normal text-pine">Din Varukorg</h3>
                  <span className="text-xs text-bark/60">{cartItemCount} artiklar</span>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-sand text-bark/60"
                >
                  ✕
                </button>
              </div>

              {/* Free shipping progress bar */}
              <div className="p-4 bg-sand-light border-b border-sand">
                <div className="flex justify-between text-xs font-semibold mb-2">
                  <span className="text-pine">
                    {hasBulkyParcel
                      ? "Paketfrakt till ombud (skrymmande)"
                      : isFreeShipping
                      ? "Du har kvalificerat dig för FRI FRAKT!"
                      : `Handla för ${FREE_SHIPPING_LIMIT - cartSubtotal} kr till för fri frakt`}
                  </span>
                  <span className="text-bark/60">Gräns: 350 kr</span>
                </div>
                <div className="h-2 w-full bg-sand rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      hasBulkyParcel ? "bg-terracotta w-full" : "bg-pine"
                    }`}
                    style={{
                      width: hasBulkyParcel
                        ? "100%"
                        : `${Math.min(100, Math.round((cartSubtotal / FREE_SHIPPING_LIMIT) * 100))}%`,
                    }}
                  />
                </div>
              </div>

              {/* Shipping format alert */}
              {cart.length > 0 && (
                <div className="px-4 pt-3">
                  {hasBulkyParcel ? (
                    <div className="bg-terracotta/10 border border-terracotta/30 text-clay rounded-xl p-3 text-xs leading-relaxed">
                      <strong>Paketfrakt (79 kr):</strong> Din order innehåller skrymmande vara (t.ex. vas/knöl) och skickas till PostNord-ombud.
                    </div>
                  ) : (
                    <div className="bg-pine/10 border border-pine/20 text-pine rounded-xl p-3 text-xs leading-relaxed">
                      <strong>Brevfrakt (29 kr):</strong> Din order är lätt och platt och levereras direkt i din brevlåda!
                    </div>
                  )}
                </div>
              )}

              {/* Cart Items list */}
              <div className="flex-grow overflow-y-auto p-4 space-y-4">
                {cart.length === 0 ? (
                  <div className="text-center py-16 text-bark/50 text-sm">
                    Din varukorg är tom.<br />Kika på våra fröer och bukettrecept!
                  </div>
                ) : (
                  cart.map(({ product, qty }) => (
                    <div key={product.id} className="flex gap-3 pb-3 border-b border-sand/60 items-center">
                      <div className="w-14 h-14 relative rounded-lg bg-sand-light overflow-hidden flex-shrink-0">
                        <Image src={product.imageUrl} alt={product.title} fill className="object-cover" />
                      </div>
                      <div className="flex-grow min-w-0">
                        <h4 className="text-sm font-semibold text-pine truncate">{product.title}</h4>
                        <span className="text-xs text-bark/60 block">
                          {qty} st × {product.priceSek} kr ({product.shippingClass === "FLAT_LETTER" ? "Brev" : "Paket"})
                        </span>
                        <span className="text-xs font-bold text-pine">{qty * product.priceSek} kr</span>
                      </div>
                      <button
                        onClick={() => removeFromCart(product.id)}
                        className="text-terracotta hover:text-clay text-xs p-1"
                      >
                        Ta bort
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Fraktsmart merförsäljning */}
              {cart.length > 0 && !hasBulkyParcel && (
                <div className="p-4 bg-sand-light border-t border-sand">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-terracotta mb-2 flex justify-between">
                    <span>Fraktsmart tips</span>
                    <span className="font-normal normal-case text-bark/60">(Samma låga brevfrakt)</span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-sand flex items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold block text-pine">Trämärketiketter (10-pack)</span>
                      <span className="text-[11px] text-bark/60">+35 kr</span>
                    </div>
                    <button
                      onClick={() => {
                        const labelItem = PRODUCTS.find((p) => p.id === "tramarketiketter-10p");
                        if (labelItem) addToCart(labelItem, 1);
                      }}
                      className="bg-pine text-oat text-xs px-3 py-1.5 rounded-full font-medium hover:bg-pine-light"
                    >
                      + Lägg till
                    </button>
                  </div>
                </div>
              )}

              {/* Cart Footer */}
              <div className="p-5 border-t border-sand bg-white space-y-3">
                <div className="flex justify-between text-xs text-bark/70">
                  <span>Delsumma</span>
                  <span>{cartSubtotal} kr</span>
                </div>
                <div className="flex justify-between text-xs text-bark/70">
                  <span>Frakt</span>
                  <span>{shippingCost === 0 ? "Gratis" : `${shippingCost} kr`}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-pine pt-2 border-t border-sand">
                  <span>Totalt att betala</span>
                  <span>{cartTotal} kr</span>
                </div>

                <button
                  onClick={() => {
                    alert(`[Stripe Checkout Mockup]\n\nTotalt belopp: ${cartTotal} kr\nBetalsätt: Swish, Klarna, Kort\n\nI det skarpa systemet initieras en Stripe Checkout Session med 30 minuters TTL och atomisk reservation i Firestore.`);
                  }}
                  disabled={cart.length === 0}
                  className="w-full bg-pine hover:bg-pine-light disabled:opacity-50 text-oat py-3.5 min-h-[44px] rounded-full font-semibold text-sm transition-all shadow-md text-center block"
                >
                  Gå till Kassan ({cartTotal} kr)
                </button>

                <div className="flex justify-center gap-3 text-[11px] text-bark/50 pt-1">
                  <span>✓ Swish</span>
                  <span>✓ Klarna</span>
                  <span>✓ Visa / Mastercard</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Odlingsguide & QR-kod Mockup */}
      {activeGuideProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bark/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative">
            <button
              onClick={() => setActiveGuideProduct(null)}
              className="absolute top-5 right-5 text-bark/50 hover:text-bark text-xl"
            >
              ✕
            </button>

            <div className="text-center mb-6">
              <span className="text-[10px] uppercase font-bold tracking-widest text-terracotta block mb-1">
                Mobilguide • Skannad via påsens QR-kod
              </span>
              <h3 className="font-serif text-2xl font-medium text-pine">
                {activeGuideProduct.title}
              </h3>
              <span className="text-xs italic text-bark/60 block">{activeGuideProduct.botanicalName}</span>
            </div>

            {/* Technical Passport Table (Matching the user's photo!) */}
            <div className="border border-bark/20 rounded-xl overflow-hidden mb-6 text-xs font-mono">
              <div className="bg-sand-light p-2 font-bold text-center border-b border-bark/20">
                ÖHLUNDS FRÖER & ODLA • EST. 2026
              </div>
              <div className="grid grid-cols-2 divide-x divide-bark/20 border-b border-bark/20 p-2">
                <div><strong>SORT:</strong> {activeGuideProduct.title}</div>
                <div><strong>LOT.NR:</strong> {activeGuideProduct.lotNumber || "LOT-2026-X"}</div>
              </div>
              <div className="grid grid-cols-2 divide-x divide-bark/20 p-2 bg-oat/50">
                <div><strong>VÄXTZONER:</strong> {activeGuideProduct.specs?.zones.join(", ") || "1-8"}</div>
                <div><strong>URSPRUNG:</strong> {activeGuideProduct.plantPassport?.originCountry || "EU"}</div>
              </div>
            </div>

            {/* Quick Specs */}
            {activeGuideProduct.specs && (
              <div className="bg-sand-light rounded-xl p-4 text-xs space-y-2 mb-6">
                <div><strong>Sådjup:</strong> {activeGuideProduct.specs.depthCm || "0.5"} cm</div>
                <div><strong>Plantavstånd:</strong> {activeGuideProduct.specs.spacingCm || "25"} cm</div>
                <div><strong>Groddtid:</strong> {activeGuideProduct.specs.germinationDays || "7-14 dagar"}</div>
                {activeGuideProduct.specs.growerAdviceZone5 && (
                  <div className="pt-2 border-t border-sand text-pine">
                    <strong>Jessicas råd för Zon 5 / Ljusdal:</strong> {activeGuideProduct.specs.growerAdviceZone5}
                  </div>
                )}
              </div>
            )}

            <div className="text-center">
              <button
                onClick={() => setActiveGuideProduct(null)}
                className="bg-sand hover:bg-pine hover:text-white text-pine px-6 py-2.5 min-h-[44px] rounded-full text-xs font-semibold transition-all"
              >
                Stäng guiden
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Bevaka i lager */}
      {activeNotifyProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bark/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative">
            <button
              onClick={() => setActiveNotifyProduct(null)}
              className="absolute top-5 right-5 text-bark/50 hover:text-bark text-xl"
            >
              ✕
            </button>

            <div className="text-center mb-6">
              <span className="text-[10px] uppercase font-bold tracking-widest text-terracotta block mb-1">
                Lagerbevakning
              </span>
              <h3 className="font-serif text-2xl font-medium text-pine mb-2">
                Bevaka {activeNotifyProduct.title}
              </h3>
              <p className="text-xs text-bark/70 leading-relaxed">
                Denna sort är tillfälligt slutsåld. Ange din e-post så skickar vi en automatisk avisering via Resend så fort nästa parti packas vid Bryggan!
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (notifyEmail) {
                  showToast(`Tack! Vi meddelar ${notifyEmail} vid inleverans.`);
                  setActiveNotifyProduct(null);
                  setNotifyEmail("");
                }
              }}
              className="space-y-4"
            >
              <input
                type="email"
                required
                placeholder="din.epost@exempel.se"
                value={notifyEmail}
                onChange={(e) => setNotifyEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-full border border-sand bg-oat text-sm outline-none focus:border-terracotta"
              />
              <button
                type="submit"
                className="w-full bg-terracotta hover:bg-clay text-white py-3 min-h-[44px] rounded-full text-sm font-semibold transition-all"
              >
                Meddela mig när den finns i lager
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Bildförstoring & Lightbox */}
      {activeZoomProduct && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-bark/90 backdrop-blur-md"
          onClick={() => setActiveZoomProduct(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden relative border border-sand"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-sand bg-oat flex items-center justify-between">
              <div className="min-w-0 pr-4">
                <span className="text-[10px] uppercase font-bold tracking-widest text-terracotta block">
                  {activeZoomProduct.product?.category === "snittblommor"
                    ? "Snittblomma • Fröpåse"
                    : activeZoomProduct.product?.category === "kokstradgard"
                    ? "Köksträdgård"
                    : activeZoomProduct.product?.category === "tillbehor"
                    ? "Trädgårdstillbehör"
                    : "Detaljvy"}
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-medium text-pine truncate">
                  {activeZoomProduct.title}
                </h3>
                {(activeZoomProduct.botanicalName || activeZoomProduct.subtitle) && (
                  <p className="text-xs italic text-bark/60 truncate">
                    {activeZoomProduct.botanicalName || activeZoomProduct.subtitle}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-3">
                {/* Front / Back Side Toggle (if backImageUrl exists) */}
                {activeZoomProduct.product?.backImageUrl && (
                  <div className="flex bg-sand/60 rounded-full p-1 border border-sand">
                    <button
                      onClick={() => {
                        setZoomActiveSide("front");
                        setIsZoomMagnified(false);
                      }}
                      className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                        zoomActiveSide === "front"
                          ? "bg-pine text-white shadow-xs"
                          : "text-bark/70 hover:text-bark"
                      }`}
                    >
                      Framsida
                    </button>
                    <button
                      onClick={() => {
                        setZoomActiveSide("back");
                        setIsZoomMagnified(false);
                      }}
                      className={`px-3 py-1 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
                        zoomActiveSide === "back"
                          ? "bg-pine text-white shadow-xs"
                          : "text-bark/70 hover:text-bark"
                      }`}
                    >
                      <span>Baksida</span>
                      <span className="text-[10px] bg-terracotta text-white px-1.5 py-0.5 rounded-full font-bold">QR</span>
                    </button>
                  </div>
                )}

                {/* Close Button */}
                <button
                  onClick={() => setActiveZoomProduct(null)}
                  className="w-9 h-9 rounded-full bg-sand/60 hover:bg-pine hover:text-white text-bark flex items-center justify-center text-lg transition-colors"
                  aria-label="Stäng bildvisning"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Modal Image Viewport */}
            <div
              className="relative flex-grow bg-sand-light/50 overflow-auto flex items-center justify-center p-4 min-h-[350px] sm:min-h-[480px] cursor-pointer select-none"
              onClick={() => setIsZoomMagnified((prev) => !prev)}
            >
              <div
                className={`relative transition-all duration-300 ${
                  isZoomMagnified
                    ? "scale-175 cursor-zoom-out w-full max-w-2xl aspect-square"
                    : "scale-100 cursor-zoom-in w-full max-w-xl aspect-[4/3] sm:aspect-[16/10]"
                }`}
              >
                <Image
                  src={
                    zoomActiveSide === "back" && activeZoomProduct.product?.backImageUrl
                      ? activeZoomProduct.product.backImageUrl
                      : activeZoomProduct.imageUrl
                  }
                  alt={`${activeZoomProduct.title} ${zoomActiveSide === "back" ? "baksida med QR-kod" : "framsida"}`}
                  fill
                  className="object-contain drop-shadow-md rounded-xl"
                  priority
                />
              </div>
            </div>

            {/* Modal Footer Bar */}
            <div className="p-4 sm:p-5 border-t border-sand bg-white flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                {activeZoomProduct.priceSek !== undefined && (
                  <span className="font-serif text-2xl font-bold text-pine">
                    {activeZoomProduct.priceSek} kr
                  </span>
                )}
                {activeZoomProduct.shippingClass && (
                  <span
                    className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full ${
                      activeZoomProduct.shippingClass === "FLAT_LETTER"
                        ? "bg-pine/10 text-pine"
                        : "bg-terracotta/15 text-terracotta"
                    }`}
                  >
                    {activeZoomProduct.shippingClass === "FLAT_LETTER"
                      ? "Brevfrakt (29 kr)"
                      : "Paketfrakt (79 kr)"}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3">
                {activeZoomProduct.product?.type === "seed" && activeZoomProduct.product?.specs && (
                  <button
                    onClick={() => {
                      const p = activeZoomProduct.product!;
                      setActiveZoomProduct(null);
                      setActiveGuideProduct(p);
                    }}
                    className="text-xs text-pine font-medium underline hover:text-terracotta px-2 py-2 min-h-[44px] flex items-center"
                  >
                    Se odlingsguide & QR-kod
                  </button>
                )}

                {activeZoomProduct.product && activeZoomProduct.product.inStock && (
                  <button
                    onClick={() => {
                      addToCart(activeZoomProduct.product!, 1);
                      setActiveZoomProduct(null);
                      setIsCartOpen(true);
                    }}
                    className="bg-pine hover:bg-pine-light text-oat text-xs font-semibold px-5 py-2.5 min-h-[44px] rounded-full transition-all shadow-sm hover:shadow flex items-center justify-center"
                  >
                    <span>Lägg i varukorg</span>
                  </button>
                )}

                {activeZoomProduct.product && !activeZoomProduct.product.inStock && (
                  <button
                    onClick={() => {
                      const p = activeZoomProduct.product!;
                      setActiveZoomProduct(null);
                      setActiveNotifyProduct(p);
                    }}
                    className="bg-sand hover:bg-sand-dark text-terracotta text-xs font-semibold px-4 py-2.5 min-h-[44px] rounded-full transition-all flex items-center justify-center"
                  >
                    <span>Bevaka i lager</span>
                  </button>
                )}

                <button
                  onClick={() => setActiveZoomProduct(null)}
                  className="bg-sand hover:bg-sand-dark text-bark text-xs font-semibold px-4 py-2.5 min-h-[44px] rounded-full transition-all"
                >
                  Stäng (Esc)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 bg-pine text-oat px-6 py-3 rounded-full text-sm font-medium shadow-xl flex items-center gap-2 animate-bounce">
          {toastMessage}
        </div>
      )}
    </div>
  );
}
