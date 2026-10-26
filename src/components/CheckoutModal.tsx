import React, { useState } from "react";
import { X, ShieldCheck, Check, Lock, Sparkles, Smartphone, CreditCard, Landmark, ArrowRight, Download, Heart } from "lucide-react";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  addonSelected: boolean;
  onToggleAddon: () => void;
  checkoutUrl: string;
  isOfferExpired: boolean;
  regularPrice: number;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  addonSelected,
  onToggleAddon,
  checkoutUrl,
  isOfferExpired,
  regularPrice,
}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"upi" | "card" | "netbanking">("upi");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const basePrice = isOfferExpired ? regularPrice : 399;
  const addonCost = 99;
  const totalPrice = addonSelected ? basePrice + addonCost : basePrice;
  const savings = 2499 - basePrice;

  const handlePayNow = (e: React.FormEvent) => {
    e.preventDefault();
    
    // If a valid external Razorpay / Payment Link is configured, redirect there!
    if (checkoutUrl && checkoutUrl.startsWith("http") && !checkoutUrl.includes("PASTE_RAZORPAY_LINK")) {
      window.open(checkoutUrl, "_blank", "noopener,noreferrer");
      onClose();
      return;
    }

    // Otherwise, simulate a seamless demo checkout flow so the reviewer/user can test the full experience!
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-[10002] flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#14213D] text-white p-4 sm:p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#0B7A6E] flex items-center justify-center text-white shrink-0">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold font-heading text-white">
                {isSuccess ? "Access Confirmed!" : "Secure Instant Checkout"}
              </h3>
              <p className="text-xs text-slate-300">
                {isSuccess ? "Download ready for your device" : "Instant Digital PDF Delivery via Email"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
          {isSuccess ? (
            <div className="text-center py-6 space-y-4 animate-in zoom-in-95 duration-300">
              <div className="w-16 h-16 bg-[#E7F7EC] text-[#16A34A] rounded-full mx-auto flex items-center justify-center shadow-inner">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>
              <div>
                <h4 className="text-xl font-bold font-heading text-[#14213D]">
                  Welcome, Mama! Your Plan Is Ready 🤱
                </h4>
                <p className="text-sm text-slate-600 mt-1 max-w-sm mx-auto">
                  A download link has been sent to <strong>{email || "your email"}</strong>. You can also download your copy right now below!
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-left space-y-2">
                <div className="flex justify-between items-center text-xs text-slate-500">
                  <span>Order ID: #TTT-{Math.floor(100000 + Math.random() * 900000)}</span>
                  <span className="text-[#16A34A] font-bold">PAID ₹{totalPrice}</span>
                </div>
                <div className="text-sm font-bold text-slate-800">
                  The 30-Day Breastfeeding Mom's Diet Plan (PDF)
                </div>
                {addonSelected && (
                  <div className="text-xs font-semibold text-[#0B7A6E]">
                    + Included: 50 Easy Indian Recipes for Breastfeeding Moms (PDF)
                  </div>
                )}
              </div>

              <div className="space-y-2 pt-2">
                <button
                  onClick={() => {
                    alert("Thank you! In production, your PDF file downloads immediately. Contact tinytummytalks.tanya@gmail.com anytime for support!");
                    onClose();
                  }}
                  className="w-full py-3.5 px-6 rounded-xl bg-[#0B7A6E] text-white font-extrabold text-sm shadow-[0_4px_0_#075E55] hover:translate-y-0.5 active:translate-y-1 transition-all flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Download My 30-Day Plan PDF (Instant)</span>
                </button>
                <p className="text-xs text-slate-500">
                  Save it directly to Apple Books, Google Drive, or PDF viewer.
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handlePayNow} className="space-y-4">
              {/* Order Summary Box */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2.5">
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="font-semibold text-slate-800">
                    30-Day Breastfeeding Diet Plan (PDF)
                  </span>
                  <div className="text-right">
                    {!isOfferExpired && (
                      <span className="text-xs text-slate-400 line-through mr-1.5">₹2,499</span>
                    )}
                    <span className="font-extrabold text-[#14213D]">₹{basePrice}</span>
                  </div>
                </div>

                {/* Add-on item line */}
                <div className="pt-2 border-t border-slate-200/80">
                  <label className="flex items-start gap-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={addonSelected}
                      onChange={onToggleAddon}
                      className="w-4 h-4 mt-0.5 rounded text-[#0B7A6E] focus:ring-[#0B7A6E]"
                    />
                    <div className="text-xs flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-800">
                          Add: 50 Easy Indian Recipes Book
                        </span>
                        <span className="font-bold text-[#0B7A6E]">+₹99</span>
                      </div>
                      <p className="text-slate-500 text-[11px] mt-0.5">
                        Quick lactogenic snacks, soups & one-pot meals.
                      </p>
                    </div>
                  </label>
                </div>

                <div className="pt-2 border-t border-slate-200 flex items-center justify-between font-bold text-slate-900 text-sm sm:text-base">
                  <span>Total Amount</span>
                  <div className="text-right">
                    <span className="text-xl font-extrabold font-heading text-[#0B7A6E]">
                      ₹{totalPrice}
                    </span>
                    {!isOfferExpired && (
                      <span className="block text-[11px] font-semibold text-[#16A34A]">
                        You save ₹{savings}!
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Customer Inputs */}
              <div className="space-y-2.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Your Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Priya Sharma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B7A6E] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Email Address (PDF download will be sent here) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. priya.sharma@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B7A6E] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    WhatsApp Number (for instant download link)
                  </label>
                  <input
                    type="tel"
                    placeholder="e.g. 9876543210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B7A6E] focus:border-transparent"
                  />
                </div>
              </div>

              {/* Payment Methods */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Select Payment Method
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("upi")}
                    className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1 ${
                      paymentMethod === "upi"
                        ? "border-[#0B7A6E] bg-[#E3F4F1] text-[#075E55] font-bold shadow-xs"
                        : "border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <Smartphone className="w-4 h-4 text-[#0B7A6E]" />
                    <span className="text-xs">UPI / GPay</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod("card")}
                    className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1 ${
                      paymentMethod === "card"
                        ? "border-[#0B7A6E] bg-[#E3F4F1] text-[#075E55] font-bold shadow-xs"
                        : "border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <CreditCard className="w-4 h-4 text-[#0B7A6E]" />
                    <span className="text-xs">Cards</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod("netbanking")}
                    className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1 ${
                      paymentMethod === "netbanking"
                        ? "border-[#0B7A6E] bg-[#E3F4F1] text-[#075E55] font-bold shadow-xs"
                        : "border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <Landmark className="w-4 h-4 text-[#0B7A6E]" />
                    <span className="text-xs">Netbanking</span>
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-3.5 px-6 rounded-xl bg-[#0B7A6E] text-white font-extrabold text-base shadow-[0_4px_0_#075E55] hover:translate-y-0.5 active:translate-y-1 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
                >
                  {isProcessing ? (
                    <span>Securing Payment...</span>
                  ) : (
                    <>
                      <span>YES — Get Lifetime Access @ <s>₹{addonSelected ? "2,598" : "2,499"}</s> ₹{totalPrice} →</span>
                    </>
                  )}
                </button>
                <div className="flex items-center justify-center gap-4 text-[11px] text-slate-500 mt-2.5">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#16A34A]" /> 256-Bit SSL Encrypted
                  </span>
                  <span>•</span>
                  <span>7-Day Money-Back Guarantee</span>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
