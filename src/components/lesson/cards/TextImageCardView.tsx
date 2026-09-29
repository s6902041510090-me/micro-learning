"use client";

import React from "react";
import { TextImageCard } from "@/types";

interface TextImageCardViewProps {
  card: TextImageCard;
}

export default function TextImageCardView({ card }: TextImageCardViewProps) {
  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
          <span>📖 เนื้อหาบทเรียน</span>
        </div>
        <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 leading-tight">
          {card.title}
        </h2>
      </div>

      {/* Image if present */}
      {card.imageUrl && (
        <div className="relative rounded-3xl overflow-hidden shadow-md border-4 border-white bg-slate-100 max-h-80 sm:max-h-96">
          <img
            src={card.imageUrl}
            alt={card.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Body Content */}
      <div className="bg-sky-50/50 border border-sky-100 rounded-3xl p-6 sm:p-8 shadow-xs">
        <p className="font-body text-base sm:text-lg text-slate-800 leading-relaxed whitespace-pre-line">
          {card.body}
        </p>
      </div>
    </div>
  );
}
