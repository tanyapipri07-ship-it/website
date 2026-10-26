import React, { useState } from "react";
import { X, Calendar, Sparkles, Clock, CheckCircle2, ArrowRight } from "lucide-react";
import { SAMPLE_DAYS } from "../data/content";

interface SampleViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectBuy: () => void;
  addonSelected: boolean;
}

export const SampleViewerModal: React.FC<SampleViewerModalProps> = ({
  isOpen,
  onClose,
  onSelectBuy,
  addonSelected,
}) => {
  const [activeDayIndex, setActiveDayIndex] = useState(0);

  if (!isOpen) return null;

  const currentDay = SAMPLE_DAYS[activeDayIndex];

  return (
    <div className="fixed inset-0 z-[10001] flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-3xl max-h-[90vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#14213D] text-white p-4 sm:p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0B7A6E] flex items-center justify-center text-white shrink-0 shadow-md">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#FFC83D]/20 text-[#FFC83D] text-xs font-bold tracking-wide">
                <Sparkles className="w-3 h-3" />
                SAMPLE MEAL PLAN PREVIEW
              </div>
              <h3 className="text-lg sm:text-xl font-bold font-heading text-white mt-0.5">
                Peek Inside The 30-Day Guide
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Close sample preview"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Day Selector Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-4 pt-2 gap-2 shrink-0 overflow-x-auto">
          {SAMPLE_DAYS.map((day, idx) => (
            <button
              key={day.day}
              onClick={() => setActiveDayIndex(idx)}
              className={`pb-2.5 pt-1.5 px-4 text-sm font-semibold rounded-t-lg transition-all border-b-2 flex items-center gap-2 whitespace-nowrap ${
                activeDayIndex === idx
                  ? "border-[#0B7A6E] text-[#0B7A6E] bg-white shadow-sm"
                  : "border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100"
              }`}
            >
              <span className={`w-5 h-5 rounded-full text-xs flex items-center justify-center font-bold ${
                activeDayIndex === idx ? "bg-[#0B7A6E] text-white" : "bg-slate-200 text-slate-600"
              }`}>
                {day.day}
              </span>
              <span>Day {day.day}: {day.title.split("&")[0]}</span>
            </button>
          ))}
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
          <div className="bg-[#E3F4F1] border border-[#0B7A6E]/30 rounded-xl p-3.5 sm:p-4">
            <h4 className="font-bold text-[#075E55] text-base flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#0B7A6E]" />
              Day {currentDay.day} Theme: {currentDay.title}
            </h4>
            <p className="text-xs sm:text-sm text-slate-700 mt-1">
              {currentDay.focus}
            </p>
          </div>

          <div className="space-y-3">
            {currentDay.meals.map((item, mIdx) => (
              <div
                key={mIdx}
                className="bg-white rounded-xl p-3.5 sm:p-4 border border-slate-200 hover:border-[#0B7A6E]/50 transition-all shadow-xs"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                      <Clock className="w-3 h-3 text-[#0B7A6E]" />
                      {item.time}
                    </span>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#0B7A6E]">
                      {item.meal}
                    </span>
                  </div>
                  <span className="text-xs font-medium text-slate-500 italic bg-amber-50 border border-amber-200/60 px-2 py-0.5 rounded-full">
                    Portion: {item.portion}
                  </span>
                </div>

                <div className="font-bold text-slate-900 text-sm sm:text-base mb-1">
                  {item.dish}
                </div>

                <div className="flex items-start gap-1.5 text-xs text-slate-600 mt-1 bg-slate-50 p-2 rounded-lg">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A] shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-slate-700">Why this helps: </strong>
                    {item.nutritionalHighlight}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-[#FFF9EC] border-2 border-dashed border-[#FFC83D] rounded-xl p-4 text-center text-xs sm:text-sm text-slate-700">
            💡 <strong>This is just 1 of 30 days!</strong> The complete guide includes all 30 day-wise menus, grocery checklists, hydration schedules, and portion cheat sheets for ₹399.
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-600 text-center sm:text-left">
            <span>Instant Digital PDF Access · </span>
            <span className="font-bold text-[#14213D]">
              One-time <s>₹{addonSelected ? "2,598" : "2,499"}</s> ₹{addonSelected ? "498" : "399"}
            </span>
          </div>
          <button
            onClick={() => {
              onClose();
              onSelectBuy();
            }}
            role="button"
            aria-label={`Get The 30-Day Breastfeeding Mom's Diet Plan for ₹${addonSelected ? "498" : "399"}`}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#0B7A6E] text-white font-extrabold text-sm shadow-[0_4px_0_#075E55] hover:translate-y-0.5 active:translate-y-1 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>YES — Get The 30-Day Plan @ <s>₹{addonSelected ? "2,598" : "2,499"}</s> ₹{addonSelected ? "498" : "399"} →</span>
          </button>
        </div>
      </div>
    </div>
  );
};
