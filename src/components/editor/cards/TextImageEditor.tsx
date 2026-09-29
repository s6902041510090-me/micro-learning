"use client";

import React from "react";
import { TextImageCard } from "@/types";
import ImageUploader from "../ImageUploader";

interface TextImageEditorProps {
  card: TextImageCard;
  onChange: (updated: TextImageCard) => void;
}

export default function TextImageEditor({
  card,
  onChange,
}: TextImageEditorProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block font-display font-bold text-xs sm:text-sm text-slate-700 mb-1.5">
          หัวข้อการ์ด (Title) <span className="text-rose-500">*</span>
        </label>
        <input
          type="text"
          value={card.title}
          onChange={(e) => onChange({ ...card, title: e.target.value })}
          placeholder="เช่น พืชกินอาหารอย่างไร? 🍃"
          className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 text-sm focus:outline-none focus:border-indigo-400 font-display font-semibold"
          required
        />
      </div>

      <ImageUploader
        currentUrl={card.imageUrl}
        onUrlChange={(url) => onChange({ ...card, imageUrl: url || undefined })}
        label="รูปภาพประกอบ (ไม่บังคับ)"
      />

      <div>
        <label className="block font-display font-bold text-xs sm:text-sm text-slate-700 mb-1.5">
          เนื้อหาข้อความ (Body) <span className="text-rose-500">*</span>
        </label>
        <textarea
          rows={4}
          value={card.body}
          onChange={(e) => onChange({ ...card, body: e.target.value })}
          placeholder="เขียนอธิบายเนื้อหาให้กระชับ เข้าใจง่าย อ่านจบใน 1-2 นาที..."
          className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 text-sm focus:outline-none focus:border-indigo-400 font-body leading-relaxed"
          required
        />
      </div>
    </div>
  );
}
