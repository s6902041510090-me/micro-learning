"use client";

import React from "react";
import { QuizCard } from "@/types";
import { CheckCircle2, XCircle, HelpCircle, Sparkles } from "lucide-react";

interface QuizCardViewProps {
  card: QuizCard;
  selectedIndex: number | null;
  onSelectOption: (optionIndex: number) => void;
}

export default function QuizCardView({
  card,
  selectedIndex,
  onSelectOption,
}: QuizCardViewProps) {
  const isAnswered = selectedIndex !== null;
  const isCorrect = isAnswered && selectedIndex === card.correctIndex;

  return (
    <div className="space-y-6">
      {/* Header Badge */}
      <div className="flex items-center justify-between">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-200">
          <HelpCircle className="w-4 h-4 text-purple-600" />
          <span>แบบทดสอบประเมินความเข้าใจ 🎯</span>
        </div>

        {isAnswered && (
          <div
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
              isCorrect
                ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                : "bg-rose-100 text-rose-800 border border-rose-300"
            }`}
          >
            {isCorrect ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>ถูกต้อง! ยอดเยี่ยมมาก 🎉</span>
              </>
            ) : (
              <>
                <XCircle className="w-4 h-4 text-rose-600" />
                <span>ยังไม่ถูกต้องนะ มาดูเฉลยกัน 👇</span>
              </>
            )}
          </div>
        )}
      </div>

      {/* Question Box */}
      <div className="bg-gradient-to-r from-purple-50 via-indigo-50 to-sky-50 border-2 border-indigo-100 rounded-3xl p-6 sm:p-8 shadow-xs">
        <h3 className="font-display font-extrabold text-xl sm:text-2xl text-slate-900 leading-snug">
          {card.question}
        </h3>
      </div>

      {/* Options List */}
      <div className="grid grid-cols-1 gap-3.5">
        {card.options.map((option, idx) => {
          const isThisSelected = selectedIndex === idx;
          const isThisCorrectAnswer = idx === card.correctIndex;

          let optionStyle =
            "bg-white border-2 border-slate-200 text-slate-800 hover:border-indigo-300 hover:bg-sky-50/50 shadow-xs";

          if (isAnswered) {
            if (isThisCorrectAnswer) {
              optionStyle =
                "bg-emerald-50 border-2 border-emerald-500 text-emerald-950 font-bold shadow-md ring-2 ring-emerald-200";
            } else if (isThisSelected && !isThisCorrectAnswer) {
              optionStyle =
                "bg-rose-50 border-2 border-rose-400 text-rose-950 line-through opacity-80";
            } else {
              optionStyle =
                "bg-slate-50/60 border border-slate-200 text-slate-400 opacity-60";
            }
          }

          const optionLetters = ["ก", "ข", "ค", "ง"];

          return (
            <button
              key={idx}
              disabled={isAnswered}
              onClick={() => onSelectOption(idx)}
              className={`w-full text-left p-4 sm:p-5 rounded-2xl transition-all duration-200 flex items-center justify-between group focus:outline-none ${optionStyle} ${
                !isAnswered ? "cursor-pointer active:scale-[0.99]" : "cursor-default"
              }`}
            >
              <div className="flex items-center gap-3.5">
                <span
                  className={`w-8 h-8 rounded-xl font-display font-bold text-sm flex items-center justify-center shrink-0 ${
                    isAnswered && isThisCorrectAnswer
                      ? "bg-emerald-500 text-white"
                      : isAnswered && isThisSelected
                      ? "bg-rose-500 text-white"
                      : "bg-slate-100 text-slate-700 group-hover:bg-indigo-100 group-hover:text-indigo-700"
                  }`}
                >
                  {optionLetters[idx]}
                </span>
                <span className="font-body text-base sm:text-lg font-medium">
                  {option}
                </span>
              </div>

              {/* Status Icons */}
              {isAnswered && (
                <div className="shrink-0 pl-2">
                  {isThisCorrectAnswer && (
                    <CheckCircle2 className="w-6 h-6 text-emerald-600 animate-bounce" />
                  )}
                  {isThisSelected && !isThisCorrectAnswer && (
                    <XCircle className="w-6 h-6 text-rose-500" />
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Instant Feedback Explanation Box */}
      {isAnswered && card.explanation && (
        <div
          className={`rounded-3xl p-6 sm:p-7 border-2 shadow-sm transition-all duration-300 ${
            isCorrect
              ? "bg-emerald-50/90 border-emerald-200"
              : "bg-amber-50/90 border-amber-200"
          }`}
        >
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <div className="font-display font-bold text-sm text-slate-900 mb-1">
                {isCorrect ? "คำอธิบายความรู้เพิ่มเติม 💡" : "เฉลยและเหตุผล 💡"}
              </div>
              <p className="font-body text-sm sm:text-base text-slate-700 leading-relaxed">
                {card.explanation}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
