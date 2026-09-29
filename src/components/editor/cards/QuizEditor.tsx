"use client";

import React from "react";
import { QuizCard } from "@/types";
import { CheckCircle2, AlertCircle } from "lucide-react";

interface QuizEditorProps {
  card: QuizCard;
  onChange: (updated: QuizCard) => void;
}

export default function QuizEditor({ card, onChange }: QuizEditorProps) {
  const handleOptionChange = (idx: number, value: string) => {
    const newOptions = [...card.options] as [string, string, string, string];
    newOptions[idx] = value;
    onChange({ ...card, options: newOptions });
  };

  const handleSetCorrect = (idx: 0 | 1 | 2 | 3) => {
    onChange({ ...card, correctIndex: idx });
  };

  const optionLetters = ["ก", "ข", "ค", "ง"];

  return (
    <div className="space-y-4">
      {/* Question */}
      <div>
        <label className="block font-display font-bold text-xs sm:text-sm text-slate-700 mb-1.5">
          คำถามแบบทดสอบ (Question) <span className="text-rose-500">*</span>
        </label>
        <textarea
          rows={2}
          value={card.question}
          onChange={(e) => onChange({ ...card, question: e.target.value })}
          placeholder="เช่น สารสีเขียวในใบไม้ที่ทำหน้าที่ดูดซับพลังงานแสงคืออะไร?"
          className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 text-sm focus:outline-none focus:border-indigo-400 font-display font-semibold"
          required
        />
      </div>

      {/* Options */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <label className="font-display font-bold text-xs sm:text-sm text-slate-700">
            ตัวเลือกคำตอบ 4 ข้อ (คลิกเลือกข้อที่ถูกต้อง) <span className="text-rose-500">*</span>
          </label>
          <span className="text-xs text-indigo-600 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            ข้อ {optionLetters[card.correctIndex]} คือคำตอบที่ถูกต้อง
          </span>
        </div>

        {card.options.map((opt, idx) => {
          const isCorrect = card.correctIndex === idx;
          return (
            <div
              key={idx}
              className={`flex items-center gap-2 p-2 rounded-2xl border-2 transition-all ${
                isCorrect
                  ? "bg-emerald-50/80 border-emerald-400 ring-2 ring-emerald-200"
                  : "bg-white border-slate-200"
              }`}
            >
              <button
                type="button"
                onClick={() => handleSetCorrect(idx as 0 | 1 | 2 | 3)}
                className={`w-9 h-9 rounded-xl font-display font-bold text-sm flex items-center justify-center shrink-0 transition-colors ${
                  isCorrect
                    ? "bg-emerald-500 text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-emerald-100 hover:text-emerald-700"
                }`}
                title="คลิกเพื่อตั้งเป็นคำตอบที่ถูกต้อง"
              >
                {optionLetters[idx]}
              </button>

              <input
                type="text"
                value={opt}
                onChange={(e) => handleOptionChange(idx, e.target.value)}
                placeholder={`ตัวเลือก ${optionLetters[idx]}...`}
                className="flex-1 px-3 py-1.5 bg-transparent border-0 text-sm focus:outline-none font-body"
                required
              />

              {isCorrect && (
                <span className="text-xs font-bold text-emerald-700 pr-2 shrink-0 hidden sm:inline">
                  (เฉลยถูก)
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Explanation */}
      <div>
        <label className="block font-display font-bold text-xs sm:text-sm text-slate-700 mb-1.5">
          คำอธิบายเฉลย (Explanation)
        </label>
        <textarea
          rows={2}
          value={card.explanation || ""}
          onChange={(e) => onChange({ ...card, explanation: e.target.value })}
          placeholder="อธิบายเหตุผลสั้นๆ เพื่อให้ผู้เรียนเข้าใจลึกซึ้งขึ้นเมื่อตอบเสร็จ..."
          className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 text-sm focus:outline-none focus:border-indigo-400 font-body text-slate-700 leading-relaxed"
        />
      </div>
    </div>
  );
}
