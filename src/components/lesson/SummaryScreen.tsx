"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { Lesson, LessonProgress } from "@/types";
import {
  Trophy,
  RotateCcw,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import confetti from "canvas-confetti";

interface SummaryScreenProps {
  lesson: Lesson;
  progress: LessonProgress;
  currentAttemptScore: number;
  totalQuizCards: number;
  correctAnswersCount: number;
  onRestartAll: () => void;
  onRetryQuizOnly: () => void;
}

export default function SummaryScreen({
  lesson,
  progress,
  currentAttemptScore,
  totalQuizCards,
  correctAnswersCount,
  onRestartAll,
  onRetryQuizOnly,
}: SummaryScreenProps) {
  const isPassed = currentAttemptScore >= lesson.passingScore;

  useEffect(() => {
    if (isPassed) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#6366f1", "#38bdf8", "#34d399", "#fbbf24", "#f43f5e"],
        });
      } catch (e) {
        console.warn("Confetti error", e);
      }
    }
  }, [isPassed]);

  return (
    <div className="card-chibi p-6 sm:p-10 text-center max-w-2xl mx-auto space-y-8 animate-float">
      {/* Celebration Icon Header */}
      <div className="flex justify-center">
        <div
          className={`w-24 h-24 rounded-3xl flex items-center justify-center border-4 border-white shadow-xl ${
            isPassed
              ? "bg-gradient-to-tr from-amber-400 via-amber-300 to-yellow-200 text-amber-900"
              : "bg-gradient-to-tr from-sky-400 via-indigo-300 to-purple-200 text-indigo-900"
          }`}
        >
          {isPassed ? (
            <Trophy className="w-12 h-12 text-amber-800 animate-bounce" />
          ) : (
            <Sparkles className="w-12 h-12 text-indigo-700" />
          )}
        </div>
      </div>

      {/* Title & Status */}
      <div className="space-y-2">
        <span
          className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-bold shadow-sm ${
            isPassed
              ? "bg-emerald-100 text-emerald-800 border-2 border-emerald-300"
              : "bg-amber-100 text-amber-800 border-2 border-amber-300"
          }`}
        >
          {isPassed ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>สำเร็จบทเรียนแล้ว! 🎉</span>
            </>
          ) : (
            <>
              <AlertCircle className="w-4 h-4 text-amber-600" />
              <span>อีกนิดเดียวนะ! สู้ๆ 🌱</span>
            </>
          )}
        </span>

        <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 pt-2">
          {isPassed
            ? "ยินดีด้วย! คุณเรียนจบเรื่องนี้แล้ว 🌟"
            : "ทบทวนอีกนิด แล้วลองใหม่นะ!"}
        </h2>
        <p className="font-body text-slate-600 text-sm sm:text-base">
          {lesson.title}
        </p>
      </div>

      {/* Score Grid Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 max-w-lg mx-auto">
        {/* Current Score */}
        <div className="bg-sky-50/80 border-2 border-sky-100 p-4 rounded-2xl">
          <div className="text-xs font-semibold text-slate-500 mb-1">
            คะแนนรอบนี้
          </div>
          <div
            className={`font-display font-extrabold text-2xl sm:text-3xl ${
              isPassed ? "text-emerald-600" : "text-amber-600"
            }`}
          >
            {currentAttemptScore}%
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            ({correctAnswersCount}/{totalQuizCards} ข้อ)
          </div>
        </div>

        {/* Best Score */}
        <div className="bg-indigo-50/80 border-2 border-indigo-100 p-4 rounded-2xl">
          <div className="text-xs font-semibold text-slate-500 mb-1">
            คะแนนสูงสุด 🏆
          </div>
          <div className="font-display font-extrabold text-2xl sm:text-3xl text-indigo-600">
            {progress.bestScore ?? currentAttemptScore}%
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            ทำไป {progress.attempts} ครั้ง
          </div>
        </div>

        {/* Passing score criteria */}
        <div className="col-span-2 sm:col-span-1 bg-slate-50 border-2 border-slate-200 p-4 rounded-2xl flex flex-col justify-center">
          <div className="text-xs font-semibold text-slate-500 mb-1">
            เกณฑ์ผ่าน
          </div>
          <div className="font-display font-extrabold text-xl sm:text-2xl text-slate-700">
            ≥ {lesson.passingScore}%
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            {isPassed ? "ผ่านเกณฑ์แล้ว ✅" : "ยังไม่ถึงเกณฑ์ ⏳"}
          </div>
        </div>
      </div>

      {/* Retake Decision Buttons (Principle Q8: Full restart vs Quiz only) */}
      <div className="space-y-3 pt-2">
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          ตัวเลือกการเรียนรู้ต่อ
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md mx-auto">
          <button
            onClick={onRestartAll}
            className="btn-3d btn-3d-white p-3 text-xs sm:text-sm font-bold flex items-center justify-center gap-2"
          >
            <BookOpen className="w-4 h-4 text-indigo-500" />
            <span>เรียนใหม่ทั้งหมด 🔄</span>
          </button>

          <button
            onClick={onRetryQuizOnly}
            className="btn-3d btn-3d-accent p-3 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 text-amber-950"
          >
            <RotateCcw className="w-4 h-4 text-amber-800" />
            <span>ทำแบบทดสอบอีกครั้ง 🎯</span>
          </button>
        </div>

        {/* Return to Dashboard */}
        <div className="pt-4">
          <Link
            href="/dashboard"
            className="btn-3d btn-3d-primary py-3.5 px-8 text-base font-bold inline-flex items-center gap-2"
          >
            <span>ไปที่แดชบอร์ดบทเรียน</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
