"use client";

import React, { useState } from "react";
import { LessonCard, CardType } from "@/types";
import { LESSON_CARD_LIMIT } from "@/lib/constants";
import TextImageEditor from "./cards/TextImageEditor";
import SlideEditor from "./cards/SlideEditor";
import QuizEditor from "./cards/QuizEditor";
import {
  ArrowUp,
  ArrowDown,
  Trash2,
  Plus,
  FileText,
  Image as ImageIcon,
  HelpCircle,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

interface CardEditorProps {
  cards: LessonCard[];
  onChange: (updatedCards: LessonCard[]) => void;
}

export default function CardEditor({ cards, onChange }: CardEditorProps) {
  const [activeCardId, setActiveCardId] = useState<string>(
    cards.length > 0 ? cards[0].id : ""
  );

  const quizCount = cards.filter((c) => c.type === "quiz").length;

  const handleAddCard = (type: CardType) => {
    if (cards.length >= LESSON_CARD_LIMIT) {
      alert(`จำกัดจำนวนการ์ดไม่เกิน ${LESSON_CARD_LIMIT} ใบต่อบทเรียน`);
      return;
    }

    const newId = `card-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    let newCard: LessonCard;

    if (type === "text-image") {
      newCard = {
        id: newId,
        type: "text-image",
        title: "",
        body: "",
      };
    } else if (type === "slide") {
      newCard = {
        id: newId,
        type: "slide",
        imageUrl: "",
        caption: "",
      };
    } else {
      newCard = {
        id: newId,
        type: "quiz",
        question: "",
        options: ["", "", "", ""],
        correctIndex: 0,
        explanation: "",
      };
    }

    const updated = [...cards, newCard];
    onChange(updated);
    setActiveCardId(newId);
  };

  const handleUpdateCard = (updatedCard: LessonCard) => {
    const updated = cards.map((c) =>
      c.id === updatedCard.id ? updatedCard : c
    );
    onChange(updated);
  };

  const handleDeleteCard = (cardId: string) => {
    if (cards.length <= 1) {
      alert("บทเรียนต้องมีการ์ดอย่างน้อย 1 ใบ");
      return;
    }
    const updated = cards.filter((c) => c.id !== cardId);
    onChange(updated);
    if (activeCardId === cardId && updated.length > 0) {
      setActiveCardId(updated[0].id);
    }
  };

  // Reorder with Up/Down buttons (Decision Q20)
  const handleMoveUp = (index: number) => {
    if (index <= 0) return;
    const updated = [...cards];
    const temp = updated[index];
    updated[index] = updated[index - 1];
    updated[index - 1] = temp;
    onChange(updated);
  };

  const handleMoveDown = (index: number) => {
    if (index >= cards.length - 1) return;
    const updated = [...cards];
    const temp = updated[index];
    updated[index] = updated[index + 1];
    updated[index + 1] = temp;
    onChange(updated);
  };

  const activeCardIndex = cards.findIndex((c) => c.id === activeCardId);
  const activeCard = cards[activeCardIndex] || cards[0];

  return (
    <div className="space-y-6">
      {/* Quiz validation alert banner */}
      {quizCount === 0 ? (
        <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 text-xs sm:text-sm text-amber-900 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <strong className="font-display">คำเตือน:</strong> บทเรียนนี้ยังไม่มีการ์ดแบบทดสอบ (Quiz) 
            — ตามมาตรฐาน Micro Learning ต้องมีการ์ดแบบทดสอบอย่างน้อย 1 ใบ จึงจะสามารถกดเผยแพร่ (Publish) ได้ครับ
          </div>
        </div>
      ) : (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl px-4 py-2.5 text-xs font-semibold text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>มีการ์ดแบบทดสอบแล้ว {quizCount} ใบ (ผ่านเกณฑ์การเผยแพร่)</span>
        </div>
      )}

      {/* Card List Horizontal Bar & Add Button */}
      <div className="bg-sky-50/60 border border-sky-200 rounded-3xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-display font-bold text-xs sm:text-sm text-slate-800">
            ลำดับการ์ดในบทเรียน ({cards.length}/{LESSON_CARD_LIMIT} ใบ)
          </span>
          <span className="text-xs text-slate-500 font-medium hidden sm:inline">
            คลิกที่การ์ดเพื่อเลือกแก้ไข หรือกดปุ่มลูกศร ↑ ↓ เพื่อจัดลำดับ
          </span>
        </div>

        {/* Scrollable list of cards */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-1">
          {cards.map((card, idx) => {
            const isActive = card.id === activeCard?.id;
            return (
              <div
                key={card.id}
                onClick={() => setActiveCardId(card.id)}
                className={`shrink-0 cursor-pointer p-3 rounded-2xl border-2 transition-all flex items-center gap-2.5 ${
                  isActive
                    ? "bg-white border-indigo-600 shadow-md ring-2 ring-indigo-200 scale-102"
                    : "bg-white/80 border-slate-200 hover:border-slate-300 hover:bg-white"
                }`}
              >
                {/* Type Icon */}
                <div
                  className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold ${
                    card.type === "quiz"
                      ? "bg-purple-100 text-purple-700"
                      : card.type === "slide"
                      ? "bg-amber-100 text-amber-700"
                      : "bg-sky-100 text-sky-700"
                  }`}
                >
                  {card.type === "quiz" ? "❓" : card.type === "slide" ? "🖼️" : "📄"}
                </div>

                <div className="text-left">
                  <div className="text-xs font-bold text-slate-800">
                    ใบที่ {idx + 1}
                  </div>
                  <div className="text-[11px] text-slate-400 capitalize">
                    {card.type === "quiz"
                      ? "แบบทดสอบ"
                      : card.type === "slide"
                      ? "สไลด์ภาพ"
                      : "เนื้อหา"}
                  </div>
                </div>

                {/* Move Up/Down Controls (Decision Q20) */}
                <div className="flex flex-col gap-0.5 ml-1" onClick={(e) => e.stopPropagation()}>
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => handleMoveUp(idx)}
                    className="p-1 rounded text-slate-400 hover:text-indigo-600 disabled:opacity-20"
                    title="เลื่อนขึ้น"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    disabled={idx === cards.length - 1}
                    onClick={() => handleMoveDown(idx)}
                    className="p-1 rounded text-slate-400 hover:text-indigo-600 disabled:opacity-20"
                    title="เลื่อนลง"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Add Card Type Buttons */}
        <div className="pt-2 border-t border-sky-100 flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-600 mr-1">
            + เพิ่มการ์ดใหม่:
          </span>
          <button
            type="button"
            onClick={() => handleAddCard("text-image")}
            className="btn-3d btn-3d-white px-3 py-1.5 text-xs font-bold flex items-center gap-1.5 text-sky-700"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>เนื้อหา + รูป (Text/Image)</span>
          </button>
          <button
            type="button"
            onClick={() => handleAddCard("slide")}
            className="btn-3d btn-3d-white px-3 py-1.5 text-xs font-bold flex items-center gap-1.5 text-amber-700"
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>สไลด์ / อินโฟกราฟิก (Slide)</span>
          </button>
          <button
            type="button"
            onClick={() => handleAddCard("quiz")}
            className="btn-3d btn-3d-white px-3 py-1.5 text-xs font-bold flex items-center gap-1.5 text-purple-700"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>แบบทดสอบ 4 ตัวเลือก (Quiz)</span>
          </button>
        </div>
      </div>

      {/* Active Card Editor Frame */}
      {activeCard && (
        <div className="card-chibi p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <span className="px-3 py-1 rounded-xl text-xs font-extrabold bg-indigo-100 text-indigo-800">
                แก้ไขการ์ดใบที่ {activeCardIndex + 1}
              </span>
              <span className="text-xs text-slate-500 font-semibold">
                ประเภท:{" "}
                {activeCard.type === "quiz"
                  ? "แบบทดสอบ (Quiz)"
                  : activeCard.type === "slide"
                  ? "สไลด์ภาพ (Slide)"
                  : "ข้อความและรูปภาพ (Text & Image)"}
              </span>
            </div>

            <button
              type="button"
              onClick={() => handleDeleteCard(activeCard.id)}
              disabled={cards.length <= 1}
              className="px-3 py-1.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 border border-rose-200 transition-colors flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>ลบการ์ดนี้</span>
            </button>
          </div>

          {activeCard.type === "text-image" && (
            <TextImageEditor
              card={activeCard}
              onChange={(updated) => handleUpdateCard(updated)}
            />
          )}

          {activeCard.type === "slide" && (
            <SlideEditor
              card={activeCard}
              onChange={(updated) => handleUpdateCard(updated)}
            />
          )}

          {activeCard.type === "quiz" && (
            <QuizEditor
              card={activeCard}
              onChange={(updated) => handleUpdateCard(updated)}
            />
          )}
        </div>
      )}
    </div>
  );
}
