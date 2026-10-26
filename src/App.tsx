import React, { useState, useEffect, useMemo } from "react";
import {
  Calendar,
  Sparkles,
  Check,
  Clock,
  ShieldCheck,
  ChevronDown,
  Lock,
  ArrowRight,
  BookOpen,
  Coffee,
  Utensils,
  Smartphone,
  Settings as SettingsIcon,
  Eye,
  FileText,
  CheckCircle2,
  X,
} from "lucide-react";
import { IMAGES } from "./assets/images";
import {
  PRODUCT_NAME,
  TIMER_STORAGE_KEY,
  INITIAL_SETTINGS,
  STATS,
  REVIEWS,
  FAQ_LIST,
  COMPARISON_TABLE,
} from "./data/content";
import { SalesAlert } from "./components/SalesAlert";
import { SampleViewerModal } from "./components/SampleViewerModal";
import { CheckoutModal } from "./components/CheckoutModal";
import { SettingsModal } from "./components/SettingsModal";

export default function App() {
  // Settings with LocalStorage persistence
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem("ttt_settings_v2");
      return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
    } catch {
      return INITIAL_SETTINGS;
    }
  });

  // State management
  const [addonSelected, setAddonSelected] = useState(false);
  const [isSampleModalOpen, setIsSampleModalOpen] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isLegalModalOpen, setIsLegalModalOpen] = useState<"privacy" | "terms" | "refund" | null>(null);
  const [selectedReviewTag, setSelectedReviewTag] = useState<string>("All");
  const [expandedFaqIndex, setExpandedFaqIndex] = useState<number | null>(0);
  const [showStickyBar, setShowStickyBar] = useState(false);

  // 43 copies left counter that reduces by 1 every 15 sec till last 1
  const [copiesLeft, setCopiesLeft] = useState(() => {
    try {
      const saved = localStorage.getItem("ttt_copies_left_counter");
      if (saved) {
        const parsed = parseInt(saved, 10);
        if (!isNaN(parsed) && parsed >= 1 && parsed <= 43) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return 43;
  });

  useEffect(() => {
    const copyInterval = setInterval(() => {
      setCopiesLeft((prev) => {
        const nextVal = prev > 1 ? prev - 1 : 1;
        try {
          localStorage.setItem("ttt_copies_left_counter", nextVal.toString());
        } catch (e) {
          console.error(e);
        }
        return nextVal;
      });
    }, 15000); // every 15 sec

    return () => clearInterval(copyInterval);
  }, []);

  // Countdown timer shared via localStorage key "lp_timer_PRODUCT_NAME"
  const [timerDisplay, setTimerDisplay] = useState({
    hours: "00",
    minutes: "30",
    seconds: "00",
  });

  useEffect(() => {
    const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);

    const getOrSetEndTime = () => {
      let endTime: number;
      try {
        const stored = localStorage.getItem(TIMER_STORAGE_KEY);
        if (stored) {
          endTime = parseInt(stored, 10);
          if (isNaN(endTime) || endTime <= Date.now()) {
            // When timer reaches 00:00:00, reset to 00:30:00 and update localStorage
            endTime = Date.now() + 30 * 60 * 1000;
            localStorage.setItem(TIMER_STORAGE_KEY, endTime.toString());
          }
        } else {
          // If not set, set end time = Date.now() + (30 * 60 * 1000)
          endTime = Date.now() + 30 * 60 * 1000;
          localStorage.setItem(TIMER_STORAGE_KEY, endTime.toString());
        }
      } catch {
        endTime = Date.now() + 30 * 60 * 1000;
      }
      return endTime;
    };

    let targetEndTime = getOrSetEndTime();

    const interval = setInterval(() => {
      const now = Date.now();
      let diff = targetEndTime - now;

      if (diff <= 0) {
        // When timer reaches 00:00:00, reset to 00:30:00 and update localStorage
        targetEndTime = Date.now() + 30 * 60 * 1000;
        try {
          localStorage.setItem(TIMER_STORAGE_KEY, targetEndTime.toString());
        } catch (e) {
          console.error(e);
        }
        diff = targetEndTime - Date.now();
      }

      const totalSec = Math.floor(diff / 1000);
      const h = Math.floor(totalSec / 3600);
      const m = Math.floor((totalSec % 3600) / 60);
      const s = totalSec % 60;

      setTimerDisplay({
        hours: pad(h),
        minutes: pad(m),
        seconds: pad(s),
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleManualResetTimer = () => {
    const newEnd = Date.now() + 30 * 60 * 1000;
    try {
      localStorage.setItem(TIMER_STORAGE_KEY, newEnd.toString());
    } catch (e) {
      console.error(e);
    }
  };

  // Mobile sticky bottom bar: appears after scrolling past hero section,
  // disappears within 200px of final CTA.
  useEffect(() => {
    const handleScroll = () => {
      const heroEl = document.getElementById("hero-section");
      const finalCtaEl = document.getElementById("final-cta-section");

      if (!heroEl) return;

      const heroBottom = heroEl.getBoundingClientRect().bottom;
      const pastHero = heroBottom < 0;

      let nearFinalCta = false;
      if (finalCtaEl) {
        const rect = finalCtaEl.getBoundingClientRect();
        // disappears within 200px of final CTA
        if (rect.top <= window.innerHeight + 200 && rect.bottom >= -200) {
          nearFinalCta = true;
        }
      }

      setShowStickyBar(pastHero && !nearFinalCta);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Pricing calculations
  // Rule 1: ORIGINAL_PRICE crossed-out must appear next to SALE_PRICE on every CTA button, every price display, and the sticky bar. Never show SALE_PRICE alone.
  const currentTotalPrice = addonSelected ? settings.promoPrice + settings.addonPrice : settings.promoPrice;
  const originalCrossedPrice = addonSelected ? 2598 : 2499;
  const activeCheckoutUrl = addonSelected ? settings.checkoutUrlCombo : settings.checkoutUrlMain;

  // Review tag filtering
  const filteredReviews = useMemo(() => {
    if (selectedReviewTag === "All") return REVIEWS;
    return REVIEWS.filter((r) => r.tag?.toLowerCase().includes(selectedReviewTag.toLowerCase()));
  }, [selectedReviewTag]);

  const reviewTags = ["All", "First-Time Mom", "Working Mom", "Vegetarian Mom", "2-Month Postpartum"];

  const handleCtaClick = (e: React.MouseEvent) => {
    if (activeCheckoutUrl && activeCheckoutUrl.startsWith("http") && !activeCheckoutUrl.includes("PASTE_RAZORPAY_LINK")) {
      // Direct checkout URL
      return;
    }
    // Open realistic simulated modal if link is placeholder
    e.preventDefault();
    setIsCheckoutModalOpen(true);
  };

  const handleSaveSettings = (newSettings: typeof INITIAL_SETTINGS) => {
    setSettings(newSettings);
    try {
      localStorage.setItem("ttt_settings_v2", JSON.stringify(newSettings));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#1F2937] font-sans antialiased selection:bg-[#E3F4F1] selection:text-[#0B7A6E]">
      {/* =========================================================================
          1. STICKY TOP ANNOUNCEMENT BAR (Desktop & Mobile)
          Contains: Offer text, copies left, and synchronized Countdown Timer #1
      ========================================================================= */}
      <header
        id="ttt-top"
        role="region"
        aria-label="Special offer"
        className="fixed top-0 left-0 right-0 z-[10000] bg-[#14213D] text-white min-h-[52px] py-1.5 px-3.5 text-xs sm:text-sm font-semibold shadow-md flex items-center justify-center gap-2 sm:gap-3.5 flex-wrap text-center border-b border-white/10"
      >
        <div className="flex items-center gap-1.5 sm:gap-2">
          <span>🎉</span>
          <span>
            <strong className="text-[#FFC83D]">SPECIAL OFFER</strong> — Save ₹2,100 on Your 30-Day Meal Plan!
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="bg-[#16A34A] text-white px-2.5 py-0.5 rounded-full text-[11px] font-bold">
            Only {copiesLeft} Copies Left
          </span>

          <span className="inline-flex items-center gap-1 font-mono font-bold text-xs" aria-live="off">
            <span className="text-slate-300 font-sans font-normal text-[11px] mr-0.5">Ends in</span>
            <span className="bg-[#F26B5B] px-1.5 py-0.5 rounded-md text-white min-w-[24px] text-center">
              {timerDisplay.hours}
            </span>
            <span>:</span>
            <span className="bg-[#F26B5B] px-1.5 py-0.5 rounded-md text-white min-w-[24px] text-center">
              {timerDisplay.minutes}
            </span>
            <span>:</span>
            <span className="bg-[#F26B5B] px-1.5 py-0.5 rounded-md text-white min-w-[24px] text-center">
              {timerDisplay.seconds}
            </span>
          </span>
        </div>
      </header>

      {/* Spacer for sticky top bar (52px minimum) */}
      <div className="h-[52px]" />

      {/* =========================================================================
          2. FLOATING SALES ALERT (TOP LEFT)
          Fixed at top-left below sticky bar, z-index 9999, 50 Indian names/cities
      ========================================================================= */}
      <SalesAlert />

      {/* =========================================================================
          3. HERO SECTION
          CTA Rule 1: <s>₹2,499</s> next to ₹399
          CTA Rule 2: Begins with "YES —" and ends with "→"
      ========================================================================= */}
      <section
        id="hero-section"
        className="relative bg-gradient-to-b from-[#F1FAF8] via-[#F8FDFA] to-white pt-8 pb-14 sm:pt-12 sm:pb-20 px-4 sm:px-6"
      >
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-5">
            {/* Eyebrow Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FDECEA] text-[#B23A2C] font-bold text-xs">
                <span>🤱</span> For Indian breastfeeding moms
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF6DA] text-[#8A6100] font-bold text-xs">
                <span>⭐</span> {STATS.rating}/5 · Trusted by {STATS.moms}+ moms
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-bold font-heading text-[#14213D] leading-[1.12]">
              Your <em className="text-[#0B7A6E] not-italic">30-Day Breastfeeding</em> Meal Plan Starts Here
            </h1>

            {/* Subtitles */}
            <p className="text-base sm:text-lg text-slate-800 font-medium leading-relaxed">
              Make everyday meal planning easier with practical food ideas, day-wise menus, and nourishing recipes designed for breastfeeding moms.
            </p>
            <p className="text-sm sm:text-base text-slate-500 leading-relaxed">
              Less guessing about what to eat. More structure for your daily meals. More attention to your own nutrition while caring for your little one.
            </p>

            {/* Green Tick Points */}
            <ul className="space-y-2.5 pt-1">
              {[
                "Plan everyday meals more easily.",
                "Explore varied, nourishing food ideas.",
                "Keep helpful meal-planning resources in one place.",
              ].map((tick, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-sm sm:text-base font-semibold text-slate-800">
                  <div className="w-6 h-6 rounded-full bg-[#16A34A] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span>{tick}</span>
                </li>
              ))}
            </ul>

            {/* Price Display: Rule 1 - crossed out next to sale price */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <span className="text-4xl sm:text-5xl font-extrabold font-heading text-[#14213D]">
                ₹{currentTotalPrice}
              </span>
              <s className="text-xl sm:text-2xl text-[#8A93A3] font-semibold">
                ₹{originalCrossedPrice}
              </s>
              <span className="px-3 py-1 rounded-full bg-[#F26B5B] text-white font-extrabold text-xs tracking-wider">
                84% OFF
              </span>
              <span className="px-3 py-1 rounded-full bg-[#E7F7EC] text-[#16A34A] font-extrabold text-xs">
                You save ₹2,100
              </span>
            </div>

            {/* CTA Block: Rule 1 & Rule 2 applied strictly */}
            <div className="pt-2 space-y-3">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <a
                  href={activeCheckoutUrl}
                  onClick={handleCtaClick}
                  role="button"
                  aria-label={`Get ${PRODUCT_NAME} for ₹${currentTotalPrice}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:max-w-[520px] px-6 py-4 rounded-xl bg-[#0B7A6E] text-white font-extrabold text-base sm:text-lg shadow-[0_8px_0_#075E55,0_14px_30px_rgba(11,122,110,0.28)] hover:translate-y-0.5 active:translate-y-1 transition-all flex items-center justify-center gap-2 cursor-pointer text-center no-underline"
                >
                  YES — Get Lifetime Access @ <s>₹{originalCrossedPrice}</s> ₹{currentTotalPrice} →
                </a>

                <button
                  type="button"
                  onClick={() => setIsSampleModalOpen(true)}
                  className="px-4 py-3.5 rounded-xl bg-white border border-[#0B7A6E]/40 text-[#075E55] font-bold text-xs sm:text-sm hover:bg-[#E3F4F1] transition-colors flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Eye className="w-4 h-4 text-[#0B7A6E]" />
                  <span>Peek Sample Day</span>
                </button>
              </div>

              <p className="text-xs text-slate-500 text-center sm:text-left">
                Digital PDF · One-time payment · Lifetime access subject to terms
              </p>
            </div>

            {/* Creator Badge */}
            <div className="pt-2 flex items-center gap-3">
              <img
                src={IMAGES.tanyaAvatar}
                alt="Tanya Pipri"
                className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-md ring-2 ring-[#0B7A6E]/20"
              />
              <div className="text-xs sm:text-sm text-slate-600">
                Created by <strong className="text-[#14213D]">Tanya Pipri</strong>, Nutritionist · Specialised in Child Nutrition
              </div>
            </div>
          </div>

          {/* Right Column: 3D Book Mockup */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <div
              className="relative cursor-pointer group"
              onClick={() => setIsSampleModalOpen(true)}
            >
              <img
                src={IMAGES.heroBook}
                alt="The 30-day breastfeeding mom's Indian diet plan book by Tanya Pipri, with an Indian thali and a mom breastfeeding her baby on the cover"
                className="w-full max-w-[360px] sm:max-w-[420px] h-auto drop-shadow-[0_26px_40px_rgba(20,33,61,0.25)] rounded-2xl group-hover:scale-[1.01] transition-transform duration-300"
              />
              <div className="text-center mt-2.5">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0B7A6E] bg-white px-3 py-1 rounded-full border border-[#0B7A6E]/30 shadow-xs">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Click book to inspect Day 1-3 menu</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          4. PROBLEM / AGITATION / SOLUTION (PAS Section)
      ========================================================================= */}
      <section className="bg-[#FFF8F5] py-14 sm:py-20 px-4 sm:px-6 border-y border-[#FCE6E2]/60">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <p className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-[#B23A2C]">
              Sound familiar, Mama?
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-heading text-[#14213D]">
              🍯 That Extra Ghee Ladoo Isn't Making More Milk.
            </h2>
            <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto">
              It's just making you heavier, and you're still worried.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* The Problem */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 border-t-4 border-t-[#F26B5B] shadow-sm space-y-3">
              <h3 className="text-lg font-bold font-heading text-[#14213D] flex items-center gap-2">
                <span>😟</span> The problem
              </h3>
              <ul className="space-y-2.5 text-sm text-slate-700">
                <li className="flex items-start gap-2">
                  <span className="text-[#F26B5B] font-extrabold shrink-0">✕</span>
                  <span>You skip meals all day with the baby, then eat everything at night.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#F26B5B] font-extrabold shrink-0">✕</span>
                  <span>Everyone at home says <em>“khao, khao”</em>, but nobody tells you <strong>what</strong> to eat.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#F26B5B] font-extrabold shrink-0">✕</span>
                  <span>You're unsure if you're eating enough, or too much.</span>
                </li>
              </ul>
            </div>

            {/* The Agitation */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 border-t-4 border-t-[#F5A400] shadow-sm space-y-3">
              <h3 className="text-lg font-bold font-heading text-[#14213D] flex items-center gap-2">
                <span>😩</span> What it leads to
              </h3>
              <ul className="space-y-2.5 text-sm text-slate-700">
                <li className="flex items-start gap-2">
                  <span className="text-[#D08A00] font-extrabold shrink-0">!</span>
                  <span>Feeling tired, snappy and low on energy.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#D08A00] font-extrabold shrink-0">!</span>
                  <span>Reaching for biscuits or whatever is around.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#D08A00] font-extrabold shrink-0">!</span>
                  <span>Still worrying whether your baby is getting enough.</span>
                </li>
              </ul>
            </div>

            {/* The Simple Fix */}
            <div className="bg-[#E7F7EC] rounded-2xl p-6 border border-[#16A34A]/30 border-t-4 border-t-[#16A34A] shadow-sm space-y-3">
              <h3 className="text-lg font-bold font-heading text-[#14213D] flex items-center gap-2">
                <span>💛</span> The simple fix
              </h3>
              <ul className="space-y-2.5 text-sm text-slate-800">
                <li className="flex items-start gap-2">
                  <span className="text-[#16A34A] font-extrabold shrink-0">✓</span>
                  <span>Every day for 30 days, already planned.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#16A34A] font-extrabold shrink-0">✓</span>
                  <span>Meals at set times, with clear portions.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#16A34A] font-extrabold shrink-0">✓</span>
                  <span>Simple Indian home food. No superfoods, no powders.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Fact Banner */}
          <div className="bg-[#14213D] text-white rounded-2xl p-5 sm:p-6 shadow-md max-w-4xl mx-auto flex items-start sm:items-center gap-3.5">
            <span className="text-2xl sm:text-3xl shrink-0">🤱</span>
            <div className="text-xs sm:text-sm leading-relaxed">
              <strong className="text-[#FFC83D]">What nobody at home tells you: </strong>
              your milk depends mostly on how often your baby feeds, not on how much ghee you eat. What your body needs is the right food, at the right time, in the right amount.
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          5. PRODUCT SHOWCASE & INSIDE SNEAK PEEK
      ========================================================================= */}
      <section id="showcase-section" className="py-14 sm:py-20 px-4 sm:px-6 bg-white">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-heading text-[#14213D]">
              Everything You Need to Organise Your Everyday Meals
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              One convenient digital resource that brings practical meal-planning ideas together, so you don't have to plan every meal from scratch.
            </p>
          </div>

          {/* 8 Feature Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {[
              {
                icon: <Calendar className="w-6 h-6 text-[#0B7A6E]" />,
                title: "30-Day Meal-Planning Structure",
                desc: "A day-wise framework to help organise everyday meal decisions.",
              },
              {
                icon: <Utensils className="w-6 h-6 text-[#0B7A6E]" />,
                title: "Practical Food Suggestions",
                desc: "Everyday food ideas to help mothers plan varied meals during breastfeeding.",
              },
              {
                icon: <Coffee className="w-6 h-6 text-[#0B7A6E]" />,
                title: "Easy Recipe Ideas",
                desc: "Accessible recipe inspiration for everyday home cooking.",
              },
              {
                icon: <CheckCircle2 className="w-6 h-6 text-[#0B7A6E]" />,
                title: "Portion Guidance",
                desc: "Practical reference guidance to help readers understand the suggested meal structure.",
              },
              {
                icon: <FileText className="w-6 h-6 text-[#0B7A6E]" />,
                title: "Meal-Planning Resources",
                desc: "Useful planning material collected in one convenient digital guide.",
              },
              {
                icon: <Smartphone className="w-6 h-6 text-[#0B7A6E]" />,
                title: "Convenient Digital Format",
                desc: "Keep the guide available on a compatible device for convenient reference.",
              },
              {
                icon: <ShieldCheck className="w-6 h-6 text-[#0B7A6E]" />,
                title: "Lifetime Access",
                desc: "Refer back to the guide whenever needed, subject to the published product terms.",
              },
              {
                icon: <BookOpen className="w-6 h-6 text-[#0B7A6E]" />,
                title: "Optional Recipe Collection",
                desc: "Add “50 Easy Indian Recipes for Breastfeeding Moms” for ₹99 extra at checkout.",
              },
            ].map((feat, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-[#0B7A6E]/40 hover:shadow-md transition-all space-y-2.5"
              >
                <div className="w-12 h-12 rounded-xl bg-[#E3F4F1] flex items-center justify-center">
                  {feat.icon}
                </div>
                <h3 className="font-bold font-heading text-slate-900 text-base sm:text-lg">
                  {feat.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {feat.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Inside Page Gallery Preview */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch pt-4">
            <div
              className="md:col-span-7 bg-[#F7F8FB] border border-slate-200 rounded-2xl p-4 sm:p-5 flex flex-col justify-between cursor-pointer group hover:shadow-lg transition-all"
              onClick={() => setIsSampleModalOpen(true)}
            >
              <div className="overflow-hidden rounded-xl shadow-md border border-slate-200/80 bg-white">
                <img
                  src={IMAGES.galleryPreview}
                  alt="Inside the 30-day breastfeeding diet plan: a Day 3 meal plan with breakfast, lunch, snack and dinner, a moong dal chilla recipe page, and breakfast, lunch, dinner and snack idea pages with Indian food photos"
                  className="w-full h-auto object-cover group-hover:scale-[1.01] transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              <div className="flex items-center justify-between mt-3 text-xs sm:text-sm text-slate-600">
                <span className="font-semibold">Take a look inside: day-wise meal plans, recipes and meal ideas</span>
                <span className="text-[#0B7A6E] font-bold inline-flex items-center gap-1">
                  <span>Inspect Sample</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>

            <div className="md:col-span-5 bg-[#F7F8FB] border border-slate-200 rounded-2xl p-4 sm:p-5 flex flex-col justify-between">
              <div className="overflow-hidden rounded-xl shadow-md border border-slate-200/80 bg-white">
                <img
                  src={IMAGES.recipesBookPreview}
                  alt="The add-on recipe book 50 Easy Indian Recipes for Breastfeeding Moms with its contents page, a moong dal chilla recipe, breakfast ideas and healthy snacks and drinks"
                  className="w-full h-auto object-cover"
                  loading="lazy"
                />
              </div>
              <div className="mt-3 text-xs sm:text-sm text-slate-600 text-center">
                <span className="font-semibold">Optional add-on: 50 Easy Indian Recipes (₹99)</span>
              </div>
            </div>
          </div>

          {/* Upsell Card */}
          <div className="bg-[#FFF9EC] border-2 border-dashed border-[#FFC83D] rounded-2xl p-5 sm:p-6 max-w-2xl mx-auto flex flex-col sm:flex-row items-center gap-5">
            <img
              src={IMAGES.miniBook}
              alt="50 Easy Indian Recipes for Breastfeeding Moms book cover"
              className="w-20 sm:w-24 h-auto rounded-lg shadow-md shrink-0"
              loading="lazy"
            />
            <div className="space-y-2 text-center sm:text-left flex-1">
              <h3 className="text-lg sm:text-xl font-bold font-heading text-[#14213D]">
                Want More Recipe Inspiration?
              </h3>
              <p className="text-xs sm:text-sm text-slate-600">
                Add 50 Easy Indian Recipes for Breastfeeding Moms to your order for just ₹99 extra.
              </p>
              <label className="inline-flex items-center gap-2.5 font-bold text-[#14213D] text-xs sm:text-sm cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={addonSelected}
                  onChange={(e) => setAddonSelected(e.target.checked)}
                  className="w-5 h-5 rounded text-[#0B7A6E] focus:ring-[#0B7A6E] accent-[#0B7A6E] cursor-pointer"
                />
                <span>Yes, add the recipe collection (+₹99)</span>
              </label>
            </div>
          </div>

          {/* CTA Button (Rule 1 & Rule 2 applied) */}
          <div className="text-center pt-2">
            <a
              href={activeCheckoutUrl}
              onClick={handleCtaClick}
              role="button"
              aria-label={`Get ${PRODUCT_NAME} for ₹${currentTotalPrice}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full max-w-md mx-auto py-4 px-6 rounded-xl bg-[#0B7A6E] text-white font-extrabold text-base sm:text-lg shadow-[0_8px_0_#075E55,0_14px_30px_rgba(11,122,110,0.28)] hover:translate-y-0.5 active:translate-y-1 transition-all cursor-pointer block text-center no-underline"
            >
              YES — Get The 30-Day Plan @ <s>₹{originalCrossedPrice}</s> ₹{currentTotalPrice} →
            </a>
          </div>
        </div>
      </section>

      {/* =========================================================================
          6. BENEFITS SECTION
      ========================================================================= */}
      <section className="bg-[#F7F8FB] py-14 sm:py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-heading text-[#14213D]">
              Why Moms Choose Tiny Tummy Talks
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              Practical support for the way you eat every day.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Mom + Thali Image */}
            <div className="lg:col-span-5">
              <div className="overflow-hidden rounded-2xl shadow-xl border-4 border-white">
                <img
                  src={IMAGES.benefitMomThali}
                  alt="A smiling Indian mom breastfeeding her baby next to a balanced thali of dal, sabzi, rice, roti and salad"
                  className="w-full h-auto object-cover"
                  loading="lazy"
                />
              </div>
            </div>

            {/* 3 Core Benefits */}
            <div className="lg:col-span-7 space-y-4">
              <div className="bg-white rounded-2xl p-5 sm:p-6 border-l-4 border-l-[#0B7A6E] border border-slate-200 shadow-sm flex items-start gap-4">
                <div className="text-3xl shrink-0">🗓️</div>
                <div>
                  <h3 className="text-lg font-bold font-heading text-[#14213D] mb-1">
                    No More Guessing
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Open today's page and your meals are ready. A day-wise structure replaces “what should I eat?” every single day.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 sm:p-6 border-l-4 border-l-[#F26B5B] border border-slate-200 shadow-sm flex items-start gap-4">
                <div className="text-3xl shrink-0">🍽️</div>
                <div>
                  <h3 className="text-lg font-bold font-heading text-[#14213D] mb-1">
                    Less Random Eating
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    6 small meals at set times with clear portions, so you stop skipping meals by day and overeating at night.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 sm:p-6 border-l-4 border-l-[#16A34A] border border-slate-200 shadow-sm flex items-start gap-4">
                <div className="text-3xl shrink-0">💛</div>
                <div>
                  <h3 className="text-lg font-bold font-heading text-[#14213D] mb-1">
                    Your Nutrition Gets Attention, Too
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Varied, nourishing Indian home food planned for the breastfeeding period, so someone looks after you while you look after your baby.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          7. HIGHLIGHT BAR
      ========================================================================= */}
      <section className="bg-[#14213D] text-white py-14 px-4 sm:px-6 text-center">
        <div className="max-w-3xl mx-auto space-y-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-heading text-white">
            Your Nutrition Matters, Too.
          </h2>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto">
            While you're caring for your little one, your own nutrition deserves attention. Discover practical meal ideas and day-wise planning designed to make everyday eating more manageable during breastfeeding.
          </p>
          <div className="pt-2">
            <a
              href={activeCheckoutUrl}
              onClick={handleCtaClick}
              role="button"
              aria-label={`Get ${PRODUCT_NAME} for ₹${currentTotalPrice}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-8 py-4 rounded-xl bg-[#FFC83D] text-[#14213D] font-extrabold text-base sm:text-lg shadow-[0_8px_0_#C99A1F,0_14px_30px_rgba(0,0,0,0.25)] hover:translate-y-0.5 active:translate-y-1 transition-all cursor-pointer no-underline"
            >
              YES — Explore Your 30-Day Plan @ <s>₹{originalCrossedPrice}</s> ₹{currentTotalPrice} →
            </a>
          </div>
        </div>
      </section>

      {/* =========================================================================
          8. ABOUT TANYA PIPRI
      ========================================================================= */}
      <section className="py-14 sm:py-20 px-4 sm:px-6 bg-white">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-5 flex justify-center">
            <img
              src={IMAGES.tanyaAbout}
              alt="Tanya Pipri, nutritionist specialised in child nutrition and creator of Tiny Tummy Talks with Tanya"
              className="w-full max-w-[280px] sm:max-w-[320px] h-auto rounded-3xl shadow-xl border-4 border-white outline-4 outline-[#E3F4F1]"
              loading="lazy"
            />
          </div>

          <div className="md:col-span-7 space-y-3.5 text-center md:text-left">
            <p className="text-xs font-extrabold uppercase tracking-widest text-[#0B7A6E]">
              Made by a nutritionist &amp; a mom
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold font-heading text-[#14213D]">
              Hi, I'm Tanya Pipri
            </h2>
            <p className="text-xs sm:text-sm font-bold text-[#0B7A6E]">
              Nutritionist · Specialised in Child Nutrition · Founder, Tiny Tummy Talks with Tanya
            </p>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              I know how it feels when everyone is looking after the baby and nobody is looking after you. Between feeds, sleepless nights and <em>“khao, khao”</em> advice from every side, your own meals are usually the first thing to slip.
            </p>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              That's why I made this plan: simple Indian home food, clear day-wise menus and practical portions, so you can look after yourself while you look after your baby.
            </p>
            <div className="pt-2 font-heading text-lg font-bold text-[#14213D]">
              💛 Tanya · <span className="font-sans text-xs text-slate-500 font-semibold">@tinytummy.talks</span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          9. COST COMPARISON MATRIX
      ========================================================================= */}
      <section className="bg-[#F7F8FB] py-14 sm:py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold font-heading text-[#14213D]">
              How the Cost Compares
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              A simple look at what ₹399 gets you next to other everyday expenses.
            </p>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-md bg-white">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="bg-[#14213D] text-white">
                    <th className="p-3.5 sm:p-4 font-bold">Option</th>
                    <th className="p-3.5 sm:p-4 font-bold">Illustrative Cost</th>
                    <th className="p-3.5 sm:p-4 font-bold">What It Offers</th>
                    <th className="p-3.5 sm:p-4 font-bold text-center">30-Day Meal Plan</th>
                    <th className="p-3.5 sm:p-4 font-bold text-center">Lifetime Access</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {COMPARISON_TABLE.map((row, idx) => (
                    <tr
                      key={idx}
                      className={row.isUs ? "bg-[#E7F7EC] font-bold text-[#14213D]" : "hover:bg-slate-50 text-slate-700"}
                    >
                      <td className="p-3.5 sm:p-4">{row.option}</td>
                      <td
                        className={`p-3.5 sm:p-4 ${row.isUs ? "text-[#16A34A] text-sm sm:text-base font-extrabold" : ""}`}
                        dangerouslySetInnerHTML={{ __html: row.cost }}
                      />
                      <td className="p-3.5 sm:p-4 text-xs">{row.offers}</td>
                      <td className="p-3.5 sm:p-4 text-center text-sm">
                        {row.has30Day ? "✅" : "❌"}
                      </td>
                      <td className="p-3.5 sm:p-4 text-center text-sm">
                        {row.hasLifetime ? "✅" : "❌"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 text-center max-w-2xl mx-auto leading-relaxed">
            Comparison amounts are illustrative and may vary by provider, location, and product. This guide does not replace professional medical care, personalised nutrition advice, or clinically indicated supplements.
          </p>
        </div>
      </section>

      {/* =========================================================================
          10. PRICING SECTION
      ========================================================================= */}
      <section
        id="pricing-section"
        className="py-14 sm:py-20 px-4 sm:px-6 bg-gradient-to-b from-white to-[#F1FAF8]"
      >
        <div className="max-w-xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-heading text-[#14213D]">
              Start Your 30-Day Meal-Planning Journey Today
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              One simple payment. Your digital guide, ready to refer to whenever you need it.
            </p>
          </div>

          <div className="bg-white rounded-3xl border-2 border-[#0B7A6E] shadow-[0_24px_50px_rgba(11,122,110,0.18)] overflow-hidden">
            <div className="bg-[#0B7A6E] text-white py-3 px-4 text-center font-extrabold tracking-wider text-xs sm:text-sm uppercase">
              SPECIAL OFFER · 84% OFF
            </div>

            <div className="p-6 sm:p-8 space-y-5">
              <div className="text-center space-y-1">
                <h3 className="text-xl sm:text-2xl font-bold font-heading text-[#14213D]">
                  The 30-Day Breastfeeding Mom's Diet Plan
                </h3>
                <div className="flex items-center justify-center gap-3 pt-1">
                  <span className="text-4xl sm:text-5xl font-extrabold font-heading text-[#14213D]">
                    ₹{currentTotalPrice}
                  </span>
                  <s className="text-xl text-[#8A93A3] font-semibold">
                    ₹{originalCrossedPrice}
                  </s>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#F26B5B] text-white text-xs font-extrabold">
                    84% OFF
                  </span>
                </div>
              </div>

              {/* Price Breakdown Details */}
              <ul className="divide-y divide-slate-100 text-xs sm:text-sm">
                <li className="py-2.5 flex justify-between">
                  <span className="text-slate-600">You save</span>
                  <span className="font-extrabold text-[#16A34A]">₹2,100</span>
                </li>
                <li className="py-2.5 flex justify-between">
                  <span className="text-slate-600">Payment</span>
                  <span className="font-semibold text-slate-900">One-time payment (UPI, Cards, Netbanking)</span>
                </li>
                <li className="py-2.5 flex justify-between">
                  <span className="text-slate-600">Format</span>
                  <span className="font-semibold text-slate-900">Digital PDF</span>
                </li>
                <li className="py-2.5 flex justify-between">
                  <span className="text-slate-600">Access</span>
                  <span className="font-semibold text-slate-900">Lifetime access subject to the published terms</span>
                </li>
                <li className="py-2.5 flex justify-between">
                  <span className="text-slate-600">Guarantee</span>
                  <span className="font-semibold text-slate-900">7-day money-back for eligible access issues</span>
                </li>
              </ul>

              {/* Addon Selection Box */}
              <label className="flex items-start gap-3 p-3.5 rounded-xl bg-[#FFF9EC] border-2 border-dashed border-[#FFC83D] cursor-pointer">
                <input
                  type="checkbox"
                  checked={addonSelected}
                  onChange={(e) => setAddonSelected(e.target.checked)}
                  className="w-5 h-5 mt-0.5 rounded text-[#0B7A6E] focus:ring-[#0B7A6E] accent-[#0B7A6E]"
                />
                <div className="text-xs">
                  <span className="font-bold text-slate-900 block sm:inline">
                    Add-on: 50 Easy Indian Recipes for Breastfeeding Moms — ₹99
                  </span>
                  <p className="text-slate-500 mt-0.5">
                    Add practical recipe inspiration for just ₹99 extra.
                  </p>
                </div>
              </label>

              {/* Total Calculation Row */}
              <div className="bg-[#F7F8FB] rounded-xl p-4 flex items-center justify-between font-bold text-slate-900">
                <div>
                  <div className="text-base sm:text-lg">Total</div>
                  <div className="text-[11px] text-slate-500 font-normal">
                    {addonSelected ? "30-Day Plan ₹399 + Recipes ₹99" : "The 30-Day Plan only"}
                  </div>
                </div>
                <div className="text-right flex items-baseline gap-2">
                  <s className="text-base text-[#8A93A3] font-semibold">
                    ₹{originalCrossedPrice}
                  </s>
                  <span className="text-2xl sm:text-3xl font-extrabold font-heading text-[#0B7A6E]">
                    ₹{currentTotalPrice}
                  </span>
                </div>
              </div>

              {/* CTA Button inside pricing: Rule 1 & Rule 2 applied strictly */}
              <div className="pt-2">
                <a
                  href={activeCheckoutUrl}
                  onClick={handleCtaClick}
                  role="button"
                  aria-label={`Get ${PRODUCT_NAME} for ₹${currentTotalPrice}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-4 px-6 rounded-xl bg-[#0B7A6E] text-white font-extrabold text-base sm:text-lg shadow-[0_8px_0_#075E55,0_14px_30px_rgba(11,122,110,0.28)] hover:translate-y-0.5 active:translate-y-1 transition-all cursor-pointer block text-center no-underline"
                >
                  YES — Get Lifetime Access @ <s>₹{originalCrossedPrice}</s> ₹{currentTotalPrice} →
                </a>
                <p className="text-[11px] text-slate-500 text-center mt-2.5 flex items-center justify-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-[#16A34A]" />
                  <span>🔒 Secure payment · UPI, Cards, Netbanking · Digital delivery after successful payment</span>
                </p>
              </div>
            </div>
          </div>

          {/* Trust Matrix */}
          <div className="grid grid-cols-2 gap-3 text-xs text-slate-700">
            <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-center gap-2 font-semibold">
              <span className="text-base">📄</span>
              <span>Digital PDF product</span>
            </div>
            <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-center gap-2 font-semibold">
              <span className="text-base">💰</span>
              <span>7-Day Money-Back (access issues)</span>
            </div>
            <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-center gap-2 font-semibold">
              <span className="text-base">🔒</span>
              <span>100% Secure Checkout · SSL</span>
            </div>
            <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-center gap-2 font-semibold truncate">
              <span className="text-base">✉️</span>
              <span className="truncate">Support: {settings.supportEmail}</span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          11. SOCIAL PROOF & TESTIMONIALS (Rule 7 compliant)
      ========================================================================= */}
      <section id="reviews-section" className="py-14 sm:py-20 px-4 sm:px-6 bg-white">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-heading text-[#14213D]">
              Loved by Moms Looking for Simpler Meal Planning
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              What moms shared after using the 30-Day Breastfeeding Mom's Diet Plan.
            </p>
          </div>

          {/* Stat Boxes */}
          <div className="flex flex-wrap justify-center gap-4">
            <div className="bg-[#E3F4F1] rounded-2xl px-6 py-4 text-center min-w-[160px]">
              <b className="block text-3xl font-heading text-[#14213D] leading-none mb-1">
                {STATS.moms}+
              </b>
              <span className="text-xs font-semibold text-slate-600">Moms trust us</span>
            </div>
            <div className="bg-[#E3F4F1] rounded-2xl px-6 py-4 text-center min-w-[160px]">
              <b className="block text-3xl font-heading text-[#14213D] leading-none mb-1">
                {STATS.rating}/5
              </b>
              <span className="text-xs font-semibold text-slate-600">Average rating</span>
            </div>
            <div className="bg-[#E3F4F1] rounded-2xl px-6 py-4 text-center min-w-[160px]">
              <b className="block text-3xl font-heading text-[#14213D] leading-none mb-1">
                {STATS.reviewsCount}
              </b>
              <span className="text-xs font-semibold text-slate-600">Reviews</span>
            </div>
          </div>

          {/* Category filter pills */}
          <div className="flex flex-wrap justify-center gap-2 pt-1">
            {reviewTags.map((tag) => (
              <button
                type="button"
                key={tag}
                onClick={() => setSelectedReviewTag(tag)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  selectedReviewTag === tag
                    ? "bg-[#0B7A6E] text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Testimonial Cards: Rule 7 Compliant (Metric + Name + City) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredReviews.map((r, idx) => (
              <figure
                key={idx}
                className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-[0_10px_26px_rgba(20,33,61,0.07)] flex flex-col justify-between space-y-3.5"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex text-[#F5A400] text-sm tracking-wider" aria-label={`${r.stars} out of 5 stars`}>
                      {"★★★★★".slice(0, r.stars)}
                    </div>
                    {/* Specific Measurable Metric Badge */}
                    <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-[#E7F7EC] text-[#16A34A] border border-[#16A34A]/20">
                      {r.metric}
                    </span>
                  </div>

                  <blockquote className="text-xs sm:text-sm text-[#1F2937] leading-relaxed">
                    “{r.text}”
                  </blockquote>
                </div>

                <figcaption className="flex items-center gap-3 pt-2 border-t border-slate-100">
                  <div className="w-9 h-9 rounded-full bg-[#FDECEA] text-[#B23A2C] font-extrabold flex items-center justify-center text-sm shrink-0">
                    {r.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-bold text-[#14213D]">{r.name}</div>
                    <small className="text-[11px] text-[#5B6474] font-medium block">{r.city}</small>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs font-semibold text-slate-700 pt-2">
            <span className="bg-white border border-slate-200 px-3 py-1.5 rounded-full shadow-xs">🔒 100% Secure Checkout</span>
            <span className="bg-white border border-slate-200 px-3 py-1.5 rounded-full shadow-xs">🛡️ SSL Encrypted Payment</span>
            <span className="bg-white border border-slate-200 px-3 py-1.5 rounded-full shadow-xs">💰 7-Day Money-Back Guarantee (access issues)</span>
            <span className="bg-white border border-slate-200 px-3 py-1.5 rounded-full shadow-xs">📩 Digital PDF Delivery</span>
          </div>

          {/* CTA: Rule 1 & Rule 2 applied strictly */}
          <div className="text-center pt-2">
            <a
              href={activeCheckoutUrl}
              onClick={handleCtaClick}
              role="button"
              aria-label={`Get ${PRODUCT_NAME} for ₹${currentTotalPrice}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block py-3.5 px-8 rounded-xl bg-[#0B7A6E] text-white font-extrabold text-sm sm:text-base shadow-[0_6px_0_#075E55] hover:translate-y-0.5 active:translate-y-1 transition-all cursor-pointer no-underline"
            >
              YES — Get Your 30-Day Plan @ <s>₹{originalCrossedPrice}</s> ₹{currentTotalPrice} →
            </a>
          </div>
        </div>
      </section>

      {/* =========================================================================
          12. FINAL PROMO SECTION (Synchronized Countdown Timer #2)
      ========================================================================= */}
      <section
        id="final-cta-section"
        className="bg-[#14213D] text-white py-14 sm:py-20 px-4 sm:px-6 text-center"
      >
        <div className="max-w-2xl mx-auto space-y-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-heading text-white">
            Make Your Everyday Meal Planning Simpler
          </h2>
          <p className="text-xs sm:text-sm text-white/85 leading-relaxed">
            Get your 30-day digital guide and start organising your food choices with practical meal ideas for your breastfeeding journey.
          </p>

          <div className="flex items-center justify-center gap-3">
            <s className="text-xl text-white/60">₹{originalCrossedPrice}</s>
            <span className="text-4xl sm:text-5xl font-extrabold font-heading text-white">
              ₹{currentTotalPrice}
            </span>
            <span className="px-3 py-0.5 rounded-full bg-[#F26B5B] text-white font-extrabold text-xs">
              84% OFF
            </span>
            <span className="px-3 py-0.5 rounded-full bg-[#16A34A] text-white font-extrabold text-xs">
              Save ₹2,100
            </span>
          </div>

          <div>
            <span className="inline-block bg-[#16A34A] text-white font-bold px-3.5 py-1 rounded-full text-xs sm:text-sm">
              Only {copiesLeft} Copies Left
            </span>
          </div>

          {/* Synchronized Timer #2 */}
          <div className="space-y-1.5 pt-1">
            <p className="text-xs font-bold text-[#FFC83D]">
              ⏳ Your ₹399 offer ends in:
            </p>
            <div className="flex justify-center gap-2">
              <div className="bg-[#F26B5B] text-white rounded-lg p-2 min-w-[56px] text-center">
                <b className="text-xl font-mono block leading-none">{timerDisplay.hours}</b>
                <span className="text-[9px] text-white/80 tracking-wider">HRS</span>
              </div>
              <div className="bg-[#F26B5B] text-white rounded-lg p-2 min-w-[56px] text-center">
                <b className="text-xl font-mono block leading-none">{timerDisplay.minutes}</b>
                <span className="text-[9px] text-white/80 tracking-wider">MIN</span>
              </div>
              <div className="bg-[#F26B5B] text-white rounded-lg p-2 min-w-[56px] text-center">
                <b className="text-xl font-mono block leading-none">{timerDisplay.seconds}</b>
                <span className="text-[9px] text-white/80 tracking-wider">SEC</span>
              </div>
            </div>
          </div>

          {/* Final CTA Button (Rule 1 & Rule 2 applied) */}
          <div className="pt-3">
            <a
              id="ttt-final-cta"
              href={activeCheckoutUrl}
              onClick={handleCtaClick}
              role="button"
              aria-label={`Get ${PRODUCT_NAME} for ₹${currentTotalPrice}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full max-w-md mx-auto py-4 px-6 rounded-xl bg-[#FFC83D] text-[#14213D] font-extrabold text-base sm:text-lg shadow-[0_8px_0_#C99A1F,0_14px_30px_rgba(0,0,0,0.25)] hover:translate-y-0.5 active:translate-y-1 transition-all cursor-pointer block text-center no-underline"
            >
              YES — Get My 30-Day Plan @ <s>₹{originalCrossedPrice}</s> ₹{currentTotalPrice} →
            </a>
            <p className="text-[11px] text-white/75 mt-2">
              Digital PDF · One-time payment · Lifetime access subject to terms
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          13. FAQ ACCORDION
      ========================================================================= */}
      <section className="bg-[#F7F8FB] py-14 sm:py-20 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold font-heading text-[#14213D]">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Everything you need to know before you start.
            </p>
          </div>

          <div className="space-y-3">
            {FAQ_LIST.map((faq, idx) => {
              const isOpen = expandedFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className={`bg-white rounded-2xl border transition-all overflow-hidden ${
                    isOpen ? "border-[#0B7A6E] shadow-md" : "border-slate-200"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setExpandedFaqIndex(isOpen ? null : idx)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-[#14213D] cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-sm transition-transform duration-200 ${
                        isOpen ? "bg-[#0B7A6E] text-white rotate-180" : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </span>
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-4 sm:px-5 sm:pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================================
          14. FOOTER
          No navigation menus taking visitor off page; legal dialogs & support only.
      ========================================================================= */}
      <footer className="bg-[#0D1629] text-white/75 py-12 px-4 sm:px-6 text-center text-xs space-y-4">
        <div className="max-w-4xl mx-auto space-y-3">
          <div className="font-heading text-lg font-bold text-white">
            Tiny Tummy Talks with Tanya
          </div>

          <nav className="flex flex-wrap justify-center gap-4 text-white/85" aria-label="Legal and support">
            <button
              type="button"
              onClick={() => setIsLegalModalOpen("privacy")}
              className="hover:text-white underline cursor-pointer"
            >
              Privacy Policy
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => setIsLegalModalOpen("terms")}
              className="hover:text-white underline cursor-pointer"
            >
              Terms &amp; Conditions
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => setIsLegalModalOpen("refund")}
              className="hover:text-white underline cursor-pointer"
            >
              Refund Policy
            </button>
            <span>•</span>
            <a
              href={`mailto:${settings.supportEmail}`}
              className="hover:text-white underline"
            >
              Contact / Support
            </a>
          </nav>

          <p className="text-[11px] text-white/60">
            Support: {settings.supportEmail}
          </p>

          <p className="text-[11px] text-white/60 max-w-2xl mx-auto leading-relaxed pt-1">
            This digital guide is an educational meal-planning resource. It is not medical advice, a personalised clinical diet prescription, or a guaranteed method for increasing breast milk supply. Individual needs differ; please consult a qualified healthcare professional for advice specific to you.
          </p>

          <div className="flex items-center justify-center gap-3 pt-2 text-[11px] text-white/50">
            <span>© {new Date().getFullYear()} Tiny Tummy Talks with Tanya</span>
            <span>•</span>
            <button
              type="button"
              onClick={() => setIsSettingsModalOpen(true)}
              className="inline-flex items-center gap-1 text-slate-400 hover:text-[#FFC83D] transition-colors cursor-pointer"
            >
              <SettingsIcon className="w-3 h-3" />
              <span>Owner Settings</span>
            </button>
          </div>
        </div>
      </footer>

      {/* =========================================================================
          15. MOBILE STICKY BOTTOM BAR
          - Appears after scrolling past hero section, disappears within 200px of final CTA
          - Top border 0.5px grey (#C9CED8), 64px height, padding 0 16px
          - Elevated bottom clearance so it sits above watermarks & safe area
          - Left: <s>₹2,499</s> grey 13px + ₹399 bold 18px + 43 copies left counter
          - Right: "YES — Get Instant Access @ <s>₹2,499</s> ₹399 →"
      ========================================================================= */}
      {showStickyBar && (
        <div
          id="ttt-sticky"
          style={{
            position: "fixed",
            left: "0",
            right: "0",
            bottom: "0",
            zIndex: 9998,
          }}
          className="sm:hidden block animate-in slide-in-from-bottom duration-300"
        >
          <div
            style={{
              height: "64px",
              padding: "0 16px",
              backgroundColor: "#ffffff",
              borderTop: "0.5px solid #C9CED8",
              boxShadow: "0 -6px 24px rgba(20, 33, 61, 0.16)",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              fontFamily: '"Plus Jakarta Sans", system-ui, -apple-system, sans-serif',
              paddingBottom: "env(safe-area-inset-bottom, 0px)",
            }}
          >
            {/* Left side price + copies left */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                lineHeight: "1.15",
                flexShrink: 0,
              }}
            >
              <s style={{ fontSize: "13px", color: "#8A93A3", fontWeight: 500 }}>
                ₹{originalCrossedPrice}
              </s>
              <b style={{ fontSize: "18px", color: "#0B7A6E", fontWeight: 800 }}>
                ₹{currentTotalPrice}
              </b>
              <small style={{ fontSize: "10px", fontWeight: 700, color: "#16A34A" }}>
                {copiesLeft} copies left
              </small>
            </div>

            {/* Right side CTA button (Rule 1 & Rule 2 applied) */}
            <a
              href={activeCheckoutUrl}
              onClick={handleCtaClick}
              role="button"
              aria-label={`Get ${PRODUCT_NAME} for ₹${currentTotalPrice}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                flex: 1,
                background: "#0B7A6E",
                color: "#ffffff",
                textDecoration: "none",
                fontWeight: 800,
                fontSize: "13px",
                height: "46px",
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                padding: "0 8px",
                boxShadow: "0 3px 0 #075E55",
              }}
            >
              YES — Get Instant Access @ <s>₹{originalCrossedPrice}</s> ₹{currentTotalPrice} →
            </a>
          </div>
        </div>
      )}

      {/* =========================================================================
          16. MODALS
      ========================================================================= */}
      <SampleViewerModal
        isOpen={isSampleModalOpen}
        onClose={() => setIsSampleModalOpen(false)}
        onSelectBuy={() => setIsCheckoutModalOpen(true)}
        addonSelected={addonSelected}
      />

      <CheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
        addonSelected={addonSelected}
        onToggleAddon={() => setAddonSelected(!addonSelected)}
        checkoutUrl={activeCheckoutUrl}
        isOfferExpired={false}
        regularPrice={settings.regularPrice}
      />

      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        settings={settings}
        onSave={handleSaveSettings}
        onResetTimer={handleManualResetTimer}
      />

      {/* Legal Dialogs */}
      {isLegalModalOpen && (
        <div className="fixed inset-0 z-[10004] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 max-h-[85vh] overflow-y-auto border border-slate-200">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-lg text-slate-900 capitalize">
                {isLegalModalOpen === "privacy" && "Privacy Policy"}
                {isLegalModalOpen === "terms" && "Terms & Conditions"}
                {isLegalModalOpen === "refund" && "Refund Policy"}
              </h3>
              <button
                type="button"
                onClick={() => setIsLegalModalOpen(null)}
                className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs sm:text-sm text-slate-600 space-y-3 leading-relaxed">
              {isLegalModalOpen === "privacy" && (
                <>
                  <p>
                    <strong>Tiny Tummy Talks with Tanya</strong> values your privacy. We collect your name, email, and phone number purely to deliver your purchased digital PDF guide and communicate critical purchase updates.
                  </p>
                  <p>
                    We never sell, rent, or lease your private information to third parties. All online payments are handled securely through trusted PCI-compliant payment gateways with 256-bit SSL encryption.
                  </p>
                </>
              )}

              {isLegalModalOpen === "terms" && (
                <>
                  <p>
                    By purchasing <strong>{PRODUCT_NAME}</strong>, you are buying a downloadable digital informational PDF guide intended for personal educational use.
                  </p>
                  <p>
                    This guide does not constitute individual clinical diagnosis or medical prescription. Always consult your obstetrician, pediatrician, or lactation specialist for medical conditions.
                  </p>
                  <p>
                    Redistribution, resale, or unauthorized public sharing of this proprietary material is strictly prohibited.
                  </p>
                </>
              )}

              {isLegalModalOpen === "refund" && (
                <>
                  <p>
                    <strong>7-Day Access Guarantee:</strong> We offer a 7-day money-back policy only for eligible access issues (for instance, if you paid but could not access your download and our support team was unable to fix it).
                  </p>
                  <p>
                    Requests must be emailed to <strong>{settings.supportEmail}</strong> within 7 days of purchase. As this is a digital product, refunds are not available for change of mind once the file has been accessed. All refunds are subject to our published Refund Policy and applicable law.
                  </p>
                </>
              )}
            </div>

            <div className="pt-2 text-right">
              <button
                type="button"
                onClick={() => setIsLegalModalOpen(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
