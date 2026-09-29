"use client";

import React from "react";
import { SlideCard } from "@/types";

interface SlideCardViewProps {
  card: SlideCard;
}

export default function SlideCardView({ card }: SlideCardViewProps) {
  return (
    <div className="space-y-6">
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
        <span>🖼️ สไลด์ภาพสรุปใจความ</span>
      </div>

      {/* Slide Image */}
      <div className="relative rounded-3xl overflow-hidden shadow-lg border-4 border-white bg-slate-900/5 aspect-video sm:aspect-16/10 flex items-center justify-center">
        <img
          src={card.imageUrl}
          alt={card.caption || "Slide Image"}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Caption Banner */}
      {card.caption && (
        <div className="bg-amber-50/80 border-2 border-amber-200 rounded-3xl p-6 sm:p-7 shadow-xs">
          <div className="flex items-start gap-3">
            <span className="text-2xl">💡</span>
            <p className="font-body font-semibold text-base sm:text-lg text-amber-950 leading-relaxed">
              {card.caption}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
