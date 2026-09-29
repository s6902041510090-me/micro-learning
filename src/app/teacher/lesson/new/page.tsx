"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lesson, LessonCard, Category } from "@/types";
import { CATEGORIES, DEFAULT_PASSING_SCORE } from "@/lib/constants";
import { saveLesson } from "@/lib/firestore/lessons";
import { useAuth } from "@/contexts/AuthContext";
import CardEditor from "@/components/editor/CardEditor";
import ImageUploader from "@/components/editor/ImageUploader";
import {
  ArrowLeft,
  ArrowRight,
  Save,
  CheckCircle2,
  Sparkles,
  Layers,
  BookOpen,
  Award,
  Clock,
  Tag,
  AlertCircle,
} from "lucide-react";

export default function NewLessonPage() {
  const router = useRouter();
  const { appUser } = useAuth();
  const authorId = appUser?.uid || "teacher-1";
  const authorName = appUser?.displayName || "คุณครูผู้สอน";

  // Stepper state
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Lesson State
  const [title, setTitle] = useState("");
  const [objective, setObjective] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<Category>("วิทย์");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [estimatedMinutes, setEstimatedMinutes] = useState<number>(3);
  const [passingScore, setPassingScore] = useState<number>(DEFAULT_PASSING_SCORE);
  const [thumbnailUrl, setThumbnailUrl] = useState<string>("");

  // Default initial card template
  const [cards, setCards] = useState<LessonCard[]>([
    {
      id: "card-1",
      type: "text-image",
      title: "บทนำเรื่อง...",
      body: "เขียนเนื้อหาส่วนแรกที่เข้าใจง่ายและน่าสนใจ...",
    },
    {
      id: "card-2",
      type: "quiz",
      question: "คำถามทดสอบความเข้าใจ?",
      options: ["ตัวเลือก ก", "ตัวเลือก ข", "ตัวเลือก ค", "ตัวเลือก ง"],
      correctIndex: 0,
      explanation: "คำอธิบายเหตุผลของข้อที่ถูกต้อง...",
    },
  ]);

  const [saving, setSaving] = useState(false);

  // Tag helper
  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const quizCount = cards.filter((c) => c.type === "quiz").length;

  const handleSave = async (publish: boolean) => {
    if (!title.trim()) {
      alert("กรุณาระบุชื่อบทเรียน");
      setCurrentStep(1);
      return;
    }

    if (publish && quizCount === 0) {
      alert("ไม่สามารถเผยแพร่ได้: ต้องมีการ์ดแบบทดสอบ (Quiz) อย่างน้อย 1 ใบ");
      setCurrentStep(2);
      return;
    }

    setSaving(true);

    const newLesson: Lesson = {
      id: `lesson-${Date.now()}`,
      title: title.trim(),
      objective: objective.trim(),
      description: description.trim(),
      thumbnailUrl: thumbnailUrl || undefined,
      authorId,
      authorName,
      estimatedMinutes,
      category,
      tags,
      passingScore,
      isPublished: publish,
      deletedAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      cards,
    };

    await saveLesson(newLesson);
    setSaving(false);
    router.push("/teacher/dashboard");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/teacher/dashboard"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>กลับไปยังแดชบอร์ดคุณครู</span>
        </Link>

        <span className="text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-3 py-1 rounded-full">
          ✨ Lesson Studio
        </span>
      </div>

      {/* 3-Step Wizard Navigation Indicator */}
      <div className="card-chibi p-4 sm:p-6 bg-white shadow-xs">
        <div className="grid grid-cols-3 gap-2">
          {/* Step 1 */}
          <button
            type="button"
            onClick={() => setCurrentStep(1)}
            className={`p-3 rounded-2xl text-left border-2 transition-all ${
              currentStep === 1
                ? "bg-indigo-50 border-indigo-600 text-indigo-900 shadow-xs ring-2 ring-indigo-200"
                : "bg-slate-50 border-slate-200 text-slate-500"
            }`}
          >
            <div className="flex items-center gap-2 font-display font-extrabold text-xs sm:text-sm">
              <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs">
                1
              </span>
              <span>ข้อมูลพื้นฐาน</span>
            </div>
            <p className="text-[11px] text-slate-500 font-body hidden sm:block mt-0.5">
              ชื่อ, วัตถุประสงค์, หมวดหมู่
            </p>
          </button>

          {/* Step 2 */}
          <button
            type="button"
            onClick={() => setCurrentStep(2)}
            className={`p-3 rounded-2xl text-left border-2 transition-all ${
              currentStep === 2
                ? "bg-indigo-50 border-indigo-600 text-indigo-900 shadow-xs ring-2 ring-indigo-200"
                : "bg-slate-50 border-slate-200 text-slate-500"
            }`}
          >
            <div className="flex items-center gap-2 font-display font-extrabold text-xs sm:text-sm">
              <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs">
                2
              </span>
              <span>จัดการการ์ด ({cards.length})</span>
            </div>
            <p className="text-[11px] text-slate-500 font-body hidden sm:block mt-0.5">
              เนื้อหา, รูปภาพ & แบบทดสอบ
            </p>
          </button>

          {/* Step 3 */}
          <button
            type="button"
            onClick={() => setCurrentStep(3)}
            className={`p-3 rounded-2xl text-left border-2 transition-all ${
              currentStep === 3
                ? "bg-indigo-50 border-indigo-600 text-indigo-900 shadow-xs ring-2 ring-indigo-200"
                : "bg-slate-50 border-slate-200 text-slate-500"
            }`}
          >
            <div className="flex items-center gap-2 font-display font-extrabold text-xs sm:text-sm">
              <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs">
                3
              </span>
              <span>เผยแพร่บทเรียน</span>
            </div>
            <p className="text-[11px] text-slate-500 font-body hidden sm:block mt-0.5">
              ตรวจสอบความถูกต้อง & Publish
            </p>
          </button>
        </div>
      </div>

      {/* STEP 1: Metadata Form */}
      {currentStep === 1 && (
        <div className="card-chibi p-6 sm:p-8 space-y-6 shadow-md">
          <div className="space-y-1">
            <h2 className="font-display font-extrabold text-xl text-slate-900 flex items-center gap-2">
              <span>🌱</span>
              <span>ขั้นตอนที่ 1: กำหนดข้อมูลบทเรียน</span>
            </h2>
            <p className="font-body text-xs sm:text-sm text-slate-500">
              กำหนดชื่อเรื่อง วัตถุประสงค์ และหมวดหมู่ให้ชัดเจนเพื่อให้ผู้เรียนเข้าใจเป้าหมายใน 3–5 นาที
            </p>
          </div>

          <div className="space-y-4">
            {/* Title */}
            <div>
              <label className="block font-display font-bold text-xs sm:text-sm text-slate-700 mb-1.5">
                ชื่อบทเรียน (Lesson Title) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="เช่น การสังเคราะห์ด้วยแสงใน 3 นาที! 🌱☀️"
                className="w-full px-4 py-2.5 rounded-2xl border-2 border-slate-200 text-base font-display font-bold focus:outline-none focus:border-indigo-400"
              />
            </div>

            {/* Objective (Educational principle) */}
            <div>
              <label className="block font-display font-bold text-xs sm:text-sm text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>เป้าหมายการเรียนรู้ (Learning Objective)</span>
              </label>
              <input
                type="text"
                value={objective}
                onChange={(e) => setObjective(e.target.value)}
                placeholder="เช่น สามารถบอกสมการการสังเคราะห์แสงและผลผลิตที่ได้จากพืชได้ถูกต้อง"
                className="w-full px-4 py-2.5 rounded-2xl border-2 border-slate-200 text-sm font-body focus:outline-none focus:border-indigo-400"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block font-display font-bold text-xs sm:text-sm text-slate-700 mb-1.5">
                คำอธิบายโดยย่อ (Description)
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="อธิบายสรุปสั้นๆ ว่าบทเรียนนี้เกี่ยวกับอะไร เหมาะกับใคร..."
                className="w-full px-4 py-2.5 rounded-2xl border-2 border-slate-200 text-sm font-body focus:outline-none focus:border-indigo-400 leading-relaxed"
              />
            </div>

            {/* Grid 2 Columns for Category & Duration */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Category (Decision Q10/Q13) */}
              <div>
                <label className="block font-display font-bold text-xs sm:text-sm text-slate-700 mb-1.5">
                  หมวดหมู่วิชา (Category) <span className="text-rose-500">*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as Category)}
                  className="w-full px-4 py-2.5 rounded-2xl border-2 border-slate-200 text-sm font-display font-semibold bg-white focus:outline-none focus:border-indigo-400"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Estimated Minutes (3–5 min promise) */}
              <div>
                <label className="block font-display font-bold text-xs sm:text-sm text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-amber-500" />
                  <span>ระยะเวลาโดยประมาณ (นาที)</span>
                </label>
                <select
                  value={estimatedMinutes}
                  onChange={(e) => setEstimatedMinutes(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-2xl border-2 border-slate-200 text-sm font-display font-semibold bg-white focus:outline-none focus:border-indigo-400"
                >
                  <option value={3}>3 นาที (แนะนำ - กระชับ)</option>
                  <option value={4}>4 นาที</option>
                  <option value={5}>5 นาที (สูงสุดของ Micro Lesson)</option>
                </select>
              </div>
            </div>

            {/* Passing Score (Decision Q6/Q11: default 70%, 0-100% range) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="font-display font-bold text-xs sm:text-sm text-slate-700 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-amber-500" />
                  <span>เกณฑ์คะแนนสำหรับผ่านบทเรียน (Passing Score)</span>
                </label>
                <span className="font-display font-black text-indigo-600 text-sm bg-indigo-50 px-2.5 py-0.5 rounded-lg border border-indigo-200">
                  {passingScore}%
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                step={5}
                value={passingScore}
                onChange={(e) => setPassingScore(Number(e.target.value))}
                className="w-full accent-indigo-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-400 mt-1 font-body">
                <span>0% (ดูจบผ่านทันที)</span>
                <span>70% (เกณฑ์มาตรฐาน)</span>
                <span>100% (ต้องถูกทุกข้อ)</span>
              </div>
            </div>

            {/* Thumbnail Image Uploader (Decision Q19) */}
            <ImageUploader
              currentUrl={thumbnailUrl}
              onUrlChange={(url) => setThumbnailUrl(url)}
              label="รูปภาพหน้าปกบทเรียน (Thumbnail)"
            />

            {/* Tags (Decision Q10: Free-form tags) */}
            <div>
              <label className="block font-display font-bold text-xs sm:text-sm text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Tag className="w-4 h-4 text-slate-400" />
                <span>แท็กคีย์เวิร์ด (Tags)</span>
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                  placeholder="พิมพ์แท็ก เช่น วิทยาศาสตร์, ม.ต้น แล้วกดเพิ่ม"
                  className="flex-1 px-4 py-2 rounded-2xl border-2 border-slate-200 text-sm font-body focus:outline-none focus:border-indigo-400"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="btn-3d btn-3d-white px-4 py-2 text-xs font-bold"
                >
                  + เพิ่ม
                </button>
              </div>

              {tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {tags.map((t) => (
                    <span
                      key={t}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200"
                    >
                      #{t}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(t)}
                        className="text-indigo-400 hover:text-rose-500 font-bold ml-1"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="button"
              onClick={() => {
                if (!title.trim()) {
                  alert("กรุณาระบุชื่อบทเรียนก่อนไปต่อครับ");
                  return;
                }
                setCurrentStep(2);
              }}
              className="btn-3d btn-3d-primary px-6 py-2.5 text-sm font-bold flex items-center gap-2"
            >
              <span>ไปขั้นตอนที่ 2: จัดการการ์ด</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Cards & Quiz Editor */}
      {currentStep === 2 && (
        <div className="space-y-6">
          <div className="card-chibi p-6 sm:p-8 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display font-extrabold text-xl text-slate-900 flex items-center gap-2">
                  <span>🃏</span>
                  <span>ขั้นตอนที่ 2: ลำดับการ์ดและแบบทดสอบ</span>
                </h2>
                <p className="font-body text-xs sm:text-sm text-slate-500">
                  เพิ่มการ์ดเนื้อหา สไลด์ภาพ และแบบทดสอบอย่างน้อย 1 ใบ (เรียนจบใน 3–5 นาที)
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="btn-3d btn-3d-white px-4 py-2 text-xs font-bold"
                >
                  ย้อนกลับ
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="btn-3d btn-3d-primary px-5 py-2 text-xs font-bold flex items-center gap-1.5"
                >
                  <span>ตรวจทานและเผยแพร่</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <CardEditor cards={cards} onChange={setCards} />
          </div>
        </div>
      )}

      {/* STEP 3: Preview & Publish */}
      {currentStep === 3 && (
        <div className="card-chibi p-6 sm:p-8 space-y-6 shadow-md">
          <div className="space-y-1">
            <h2 className="font-display font-extrabold text-xl text-slate-900 flex items-center gap-2">
              <span>🚀</span>
              <span>ขั้นตอนที่ 3: ตรวจสอบความถูกต้องและบันทึก</span>
            </h2>
            <p className="font-body text-xs sm:text-sm text-slate-500">
              ตรวจสอบรายละเอียดก่อนเผยแพร่สู่คลังบทเรียนให้ผู้เรียนเข้าถึงได้
            </p>
          </div>

          {/* Validation Checklist */}
          <div className="bg-sky-50/70 border-2 border-sky-200 rounded-3xl p-5 space-y-3">
            <h3 className="font-display font-bold text-sm text-sky-900">
              📋 รายการตรวจสอบคุณภาพบทเรียน:
            </h3>

            <div className="space-y-2 text-xs sm:text-sm font-body">
              <div className="flex items-center gap-2">
                {title ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-500" />
                )}
                <span>
                  ชื่อบทเรียน: <strong>{title || "ยังไม่ได้ระบุ"}</strong>
                </span>
              </div>

              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>
                  หมวดหมู่: <strong>{category}</strong> ({estimatedMinutes} นาที, เกณฑ์ผ่าน {passingScore}%)
                </span>
              </div>

              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>
                  จำนวนการ์ดทั้งหมด: <strong>{cards.length} ใบ</strong>
                </span>
              </div>

              <div className="flex items-center gap-2">
                {quizCount > 0 ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-500" />
                )}
                <span>
                  การ์ดแบบทดสอบ (Quiz): <strong>{quizCount} ใบ</strong>{" "}
                  {quizCount === 0 && (
                    <span className="text-rose-600 font-bold">
                      (ต้องมีอย่างน้อย 1 ใบเพื่อเผยแพร่)
                    </span>
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="btn-3d btn-3d-white px-5 py-2.5 text-xs sm:text-sm font-bold w-full sm:w-auto"
            >
              ย้อนกลับไปแก้ไขการ์ด
            </button>

            <div className="flex gap-2.5 w-full sm:w-auto">
              <button
                type="button"
                disabled={saving}
                onClick={() => handleSave(false)}
                className="flex-1 sm:flex-none btn-3d btn-3d-white px-5 py-2.5 text-xs sm:text-sm font-bold text-slate-700"
              >
                บันทึกเป็นฉบับร่าง (Draft)
              </button>

              <button
                type="button"
                disabled={saving || quizCount === 0 || !title.trim()}
                onClick={() => handleSave(true)}
                className="flex-1 sm:flex-none btn-3d btn-3d-mint px-6 py-2.5 text-xs sm:text-sm font-bold text-white flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? "กำลังบันทึก..." : "เผยแพร่ทันที (Publish) 🚀"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
