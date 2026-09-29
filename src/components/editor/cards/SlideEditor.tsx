"use client";

import React from "react";
import { SlideCard } from "@/types";
import ImageUploader from "../ImageUploader";

interface SlideEditorProps {
  card: SlideCard;
  onChange: (updated: SlideCard) => void;
}

export default function SlideEditor({ card, onChange }: SlideEditorProps) {
  return (
    <div className="space-y-4">
      <ImageUploader
        currentUrl={card.imageUrl}
        onUrlChange={(url) => onChange({ ...card, imageUrl: url })}
        label="รูปภาพสไลด์ / อินโฟกราฟิก *"
      />

      <div>
        <label className="block font-display font-bold text-xs sm:text-sm text-slate-700 mb-1.5">
          คำอธิบายสไลด์หรือสรุปใจความ (Caption)
        </label>
        <textarea
          rows={3}
          value={card.caption || ""}
          onChange={(e) => onChange({ ...card, caption: e.target.value })}
          placeholder="เช่น สูตรจำง่าย: น้ำ + ก๊าซ CO2 + แสง = อาหารพืช + ออกซิเจน ✨"
          className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 text-sm focus:outline-none focus:border-indigo-400 font-body leading-relaxed"
        />
      </div>
    </div>
  );
}
