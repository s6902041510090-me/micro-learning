"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Lesson, LessonCard, Category } from "@/types";
import { CATEGORIES } from "@/lib/constants";
import { getLessonById, saveLesson } from "@/lib/firestore/lessons";
import CardEditor from "@/components/editor/CardEditor";
import ImageUploader from "@/components/editor/ImageUploader";
import {
  ArrowLeft,
  ArrowRight,
  Save,
  CheckCircle2,
  Sparkles,
  Award,
  Clock,
  Tag,
  AlertCircle,
  Loader2,
} from "lucide-react";

export default function EditLessonPage() {
  const params = useParams();
  const router = useRouter();
  const lessonId = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Lesson State
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [title, setTitle] = useState("");
  const [objective, setObjective] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<Category>("วิทย์");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [estimatedMinutes, setEstimatedMinutes] = useState<number>(3);
  const [passingScore, setPassingScore] = useState<number>(70);
  const [thumbnailUrl, setThumbnailUrl] = useState<string>("");
  const [cards, setCards] = useState<LessonCard[]>([]);
  const [isPublished, setIsPublished] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      if (!lessonId) return;
      setLoading(true);
      const data = await getLessonById(lessonId);
      if (data) {
        setLesson(data);
        setTitle(data.title);
        setObjective(data.objective || "");
        setDescription(data.description);
        setCategory(data.category);
        setTags(data.tags || []);
        setEstimatedMinutes(data.estimatedMinutes || 3);
        setPassingScore(data.passingScore || 70);
        setThumbnailUrl(data.thumbnailUrl || "");
        setCards(data.cards || []);
        setIsPublished(data.isPublished);
      }
      setLoading(false);
    }
    load();
  }, [lessonId]);

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

    const updatedLesson: Lesson = {
      id: lessonId,
      title: title.trim(),
      objective: objective.trim(),
      description: description.trim(),
      thumbnailUrl: thumbnailUrl || undefined,
      authorId: lesson?.authorId || "teacher-1",
      authorName: lesson?.authorName || "คุณครูผู้สอน",
      estimatedMinutes,
      category,
      tags,
      passingScore,
      isPublished: publish,
      deletedAt: lesson?.deletedAt || null,
      createdAt: lesson?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      cards,
    };

    await saveLesson(updatedLesson);
    setSaving(false);
    router.push("/teacher/dashboard");
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
        <p className="font-display font-bold text-slate-600">กำลังโหลดบทเรียน...</p>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="card-chibi p-10 text-center max-w-md mx-auto space-y-4">
        <div className="text-5xl">⚠️</div>
        <h2 className="font-display font-bold text-xl text-slate-800">ไม่พบบทเรียน</h2>
        <Link href="/teacher/dashboard" className="btn-3d btn-3d-primary px-6 py-2 text-sm font-bold">
          กลับสู่แดชบอร์ด
        </Link>
      </div>
    );
  }

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
          ✏️ แก้ไขบทเรียน: {lesson.title}
        </span>
      </div>

      {/* Stepper */}
      <div className="card-chibi p-4 sm:p-6 bg-white shadow-xs">
        <div className="grid grid-cols-3 gap-2">
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
          </button>

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
          </button>

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
              <span>บันทึกการแก้ไข</span>
            </div>
          </button>
        </div>
      </div>

      {/* STEP 1: Metadata */}
      {currentStep === 1 && (
        <div className="card-chibi p-6 sm:p-8 space-y-6 shadow-md">
          <div className="space-y-4">
            <div>
              <label className="block font-display font-bold text-xs sm:text-sm text-slate-700 mb-1.5">
                ชื่อบทเรียน (Lesson Title) *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl border-2 border-slate-200 text-base font-display font-bold focus:outline-none focus:border-indigo-400"
              />
            </div>

            <div>
              <label className="block font-display font-bold text-xs sm:text-sm text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>เป้าหมายการเรียนรู้ (Learning Objective)</span>
              </label>
              <input
                type="text"
                value={objective}
                onChange={(e) => setObjective(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl border-2 border-slate-200 text-sm font-body focus:outline-none focus:border-indigo-400"
              />
            </div>

            <div>
              <label className="block font-display font-bold text-xs sm:text-sm text-slate-700 mb-1.5">
                คำอธิบายโดยย่อ
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl border-2 border-slate-200 text-sm font-body focus:outline-none focus:border-indigo-400 leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-display font-bold text-xs sm:text-sm text-slate-700 mb-1.5">
                  หมวดหมู่วิชา *
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

              <div>
                <label className="block font-display font-bold text-xs sm:text-sm text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-amber-500" />
                  <span>ระยะเวลา (นาที)</span>
                </label>
                <select
                  value={estimatedMinutes}
                  onChange={(e) => setEstimatedMinutes(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-2xl border-2 border-slate-200 text-sm font-display font-semibold bg-white focus:outline-none focus:border-indigo-400"
                >
                  <option value={3}>3 นาที</option>
                  <option value={4}>4 นาที</option>
                  <option value={5}>5 นาที</option>
                </select>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="font-display font-bold text-xs sm:text-sm text-slate-700 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-amber-500" />
                  <span>เกณฑ์คะแนนสำหรับผ่านบทเรียน</span>
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
            </div>

            <ImageUploader
              currentUrl={thumbnailUrl}
              onUrlChange={(url) => setThumbnailUrl(url)}
              label="รูปภาพหน้าปกบทเรียน (Thumbnail)"
            />

            <div>
              <label className="block font-display font-bold text-xs sm:text-sm text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Tag className="w-4 h-4 text-slate-400" />
                <span>แท็กคีย์เวิร์ด</span>
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
                  placeholder="พิมพ์แท็ก แล้วกดเพิ่ม"
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
              onClick={() => setCurrentStep(2)}
              className="btn-3d btn-3d-primary px-6 py-2.5 text-sm font-bold flex items-center gap-2"
            >
              <span>ไปขั้นตอนที่ 2: จัดการการ์ด</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Cards */}
      {currentStep === 2 && (
        <div className="space-y-6">
          <div className="card-chibi p-6 sm:p-8 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display font-extrabold text-xl text-slate-900">
                  ขั้นตอนที่ 2: ลำดับการ์ดและแบบทดสอบ
                </h2>
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
                  <span>ตรวจทานและบันทึก</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <CardEditor cards={cards} onChange={setCards} />
          </div>
        </div>
      )}

      {/* STEP 3: Save */}
      {currentStep === 3 && (
        <div className="card-chibi p-6 sm:p-8 space-y-6 shadow-md">
          <h2 className="font-display font-extrabold text-xl text-slate-900">
            ขั้นตอนที่ 3: บันทึกการแก้ไขบทเรียน
          </h2>

          <div className="bg-sky-50/70 border-2 border-sky-200 rounded-3xl p-5 space-y-2 text-sm font-body">
            <div>
              ชื่อบทเรียน: <strong>{title}</strong>
            </div>
            <div>
              หมวดหมู่: <strong>{category}</strong> ({estimatedMinutes} นาที, เกณฑ์ผ่าน {passingScore}%)
            </div>
            <div>
              จำนวนการ์ด: <strong>{cards.length} ใบ</strong> (แบบทดสอบ {quizCount} ข้อ)
            </div>
          </div>

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
                บันทึกเป็นฉบับร่าง (ซ่อน)
              </button>

              <button
                type="button"
                disabled={saving || quizCount === 0 || !title.trim()}
                onClick={() => handleSave(true)}
                className="flex-1 sm:flex-none btn-3d btn-3d-mint px-6 py-2.5 text-xs sm:text-sm font-bold text-white flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? "กำลังบันทึก..." : "บันทึกและเผยแพร่ (Publish) 🚀"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
