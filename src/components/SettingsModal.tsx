import React, { useState } from "react";
import { X, Settings, Link, Clock, Mail, Save, RotateCcw, Check } from "lucide-react";
import { INITIAL_SETTINGS } from "../data/content";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: typeof INITIAL_SETTINGS;
  onSave: (newSettings: typeof INITIAL_SETTINGS) => void;
  onResetTimer: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSave,
  onResetTimer,
}) => {
  const [formData, setFormData] = useState(settings);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-[10003] flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-[#14213D] text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[#FFC83D] text-[#14213D]">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg text-white">
                Page &amp; Payment Settings
              </h3>
              <p className="text-xs text-slate-300">
                Update payment links, prices, and contact details
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 overflow-y-auto space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
              <Link className="w-3.5 h-3.5 text-[#0B7A6E]" />
              Razorpay / Payment Link (Main Plan ₹399)
            </label>
            <input
              type="text"
              value={formData.checkoutUrlMain}
              onChange={(e) => setFormData({ ...formData, checkoutUrlMain: e.target.value })}
              placeholder="https://pages.razorpay.com/pl_yourlink399/view"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm font-mono focus:ring-2 focus:ring-[#0B7A6E] focus:outline-none"
            />
            <span className="text-[11px] text-slate-500 mt-0.5 block">
              When set, clicking checkout buttons will take visitors directly to this Razorpay payment page.
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
              <Link className="w-3.5 h-3.5 text-[#0B7A6E]" />
              Razorpay / Payment Link (Combo: Plan + 50 Recipes ₹498)
            </label>
            <input
              type="text"
              value={formData.checkoutUrlCombo}
              onChange={(e) => setFormData({ ...formData, checkoutUrlCombo: e.target.value })}
              placeholder="https://pages.razorpay.com/pl_yourlink498/view"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm font-mono focus:ring-2 focus:ring-[#0B7A6E] focus:outline-none"
            />
            <span className="text-[11px] text-slate-500 mt-0.5 block">
              Used when the visitor checks the ₹99 recipe add-on box.
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#0B7A6E]" />
                Special Offer Price (₹)
              </label>
              <input
                type="number"
                min="99"
                max="9999"
                value={formData.promoPrice}
                onChange={(e) => setFormData({ ...formData, promoPrice: parseInt(e.target.value) || 399 })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#0B7A6E] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Regular Price (₹)
              </label>
              <input
                type="number"
                min="99"
                max="9999"
                value={formData.regularPrice}
                onChange={(e) => setFormData({ ...formData, regularPrice: parseInt(e.target.value) || 2499 })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#0B7A6E] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Recipe Addon Price (₹)
              </label>
              <input
                type="number"
                min="1"
                max="999"
                value={formData.addonPrice}
                onChange={(e) => setFormData({ ...formData, addonPrice: parseInt(e.target.value) || 99 })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#0B7A6E] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Initial Copies Counter
              </label>
              <input
                type="number"
                min="1"
                max="999"
                value={formData.initialCopies}
                onChange={(e) => setFormData({ ...formData, initialCopies: parseInt(e.target.value) || 43 })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#0B7A6E] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-[#0B7A6E]" />
              Support Email Address
            </label>
            <input
              type="email"
              value={formData.supportEmail}
              onChange={(e) => setFormData({ ...formData, supportEmail: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#0B7A6E] focus:outline-none"
            />
          </div>

          <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                onResetTimer();
                alert("Offer timer has been reset to 00:30:00 for your browser!");
              }}
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 p-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Countdown Timer (30 mins)
            </button>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#0B7A6E] text-white font-bold text-xs sm:text-sm hover:bg-[#075E55] transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4 text-[#FFC83D]" />
                  <span>Saved!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Settings</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
