"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Lesson, LessonProgress } from "@/types";
import { getPublishedLessons, getLessonById } from "@/lib/firestore/lessons";
import { getAllUserProgress } from "@/lib/firestore/progress";
import { useAuth } from "@/contexts/AuthContext";
import LessonCard from "@/components/lesson/LessonCard";
import {
  GraduationCap,
  Sparkles,
  Trophy,
  BookOpen,
  Clock,
  Compass,
  CheckCircle2,
  PlayCircle,
  Zap,
} from "lucide-react";

export default function StudentDashboard() {
  const { appUser } = useAuth();
  const userId = appUser?.uid || "guest-student";

  const [loading, setLoading] = useState(true);
  const [publishedLessons, setPublishedLessons] = useState<Lesson[]>([]);
  const [progressMap, setProgressMap] = useState<Record<string, LessonProgress>>({});
  const [inProgressLessons, setInProgressLessons] = useState<Lesson[]>([]);
  const [completedLessons, setCompletedLessons] = useState<Lesson[]>([]);
  const [recommendedLessons, setRecommendedLessons] = useState<Lesson[]>([]);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const [allLessons, userProgress] = await Promise.all([
        getPublishedLessons(),
        getAllUserProgress(userId),
      ]);

      setPublishedLessons(allLessons);
      setProgressMap(userProgress);

      const inProg: Lesson[] = [];
      const comp: Lesson[] = [];
      const progLessonIds = new Set(Object.keys(userProgress));

      // Check all lessons in progress
      for (const [lessonId, p] of Object.entries(userProgress)) {
        let lesson = allLessons.find((l) => l.id === lessonId);
        if (!lesson) {
          // If unpublished/deleted, fetch directly by ID to satisfy Decision Q15
          lesson = (await getLessonById(lessonId)) || undefined;
        }

        if (lesson) {
          if (p.completedAt) {
            comp.push(lesson);
          } else if (p.attempts > 0 || p.lastCardIndex > 0) {
            inProg.push(lesson);
          }
        }
      }

      // Recommended: published lessons not yet in progress
      const rec = allLessons.filter((l) => !progLessonIds.has(l.id));

      setInProgressLessons(inProg);
      setCompletedLessons(comp);
      setRecommendedLessons(rec);
      setLoading(false);
    }

    loadData();
  }, [userId]);

  // Student stats calculation
  const totalCompleted = completedLessons.length;
  const totalInProgress = inProgressLessons.length;
  const totalAttempts = Object.values(progressMap).reduce(
    (acc, p) => acc + (p.attempts || 0),
    0
  );
  const scores = Object.values(progressMap)
    .map((p) => p.bestScore)
    .filter((s): s is number => s !== null);
  const avgScore =
    scores.length > 0
      ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
      : 0;

  return (
    <div className="space-y-10">
      {/* Student Welcome & Stats Header */}
      <section className="card-chibi p-6 sm:p-8 bg-gradient-to-r from-sky-50 via-indigo-50 to-emerald-50 border-2 border-sky-200 shadow-md">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-emerald-400 to-sky-400 flex items-center justify-center text-3xl shadow-md border-2 border-white animate-float shrink-0">
              🎓
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 mb-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>แดชบอร์ดผู้เรียน Micro Learning</span>
              </div>
              <h1 className="font-display font-black text-2xl sm:text-3xl text-slate-900">
                สวัสดีครับ, {appUser?.displayName || "น้องต้นกล้า"} 🌱
              </h1>
              <p className="font-body text-xs sm:text-sm text-slate-600 mt-0.5">
                พร้อมเรียนรู้เรื่องใหม่วันนี้แล้วหรือยัง? ใช้เวลาเพียง 3–5 นาทีเท่านั้น!
              </p>
            </div>
          </div>

          <Link
            href="/#catalog"
            className="btn-3d btn-3d-primary px-5 py-2.5 text-sm font-bold flex items-center gap-2 shrink-0"
          >
            <Compass className="w-4 h-4" />
            <span>ค้นหาบทเรียนใหม่</span>
          </Link>
        </div>

        {/* 4 Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mt-6 pt-6 border-t border-sky-100">
          <div className="bg-white/90 p-4 rounded-2xl border border-sky-100 shadow-2xs">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mb-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>เรียนจบแล้ว</span>
            </div>
            <div className="font-display font-black text-2xl text-emerald-600">
              {totalCompleted} <span className="text-xs font-normal text-slate-400">เรื่อง</span>
            </div>
          </div>

          <div className="bg-white/90 p-4 rounded-2xl border border-sky-100 shadow-2xs">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mb-1">
              <PlayCircle className="w-4 h-4 text-sky-500" />
              <span>กำลังเรียนอยู่</span>
            </div>
            <div className="font-display font-black text-2xl text-sky-600">
              {totalInProgress} <span className="text-xs font-normal text-slate-400">เรื่อง</span>
            </div>
          </div>

          <div className="bg-white/90 p-4 rounded-2xl border border-sky-100 shadow-2xs">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mb-1">
              <Trophy className="w-4 h-4 text-amber-500" />
              <span>คะแนนเฉลี่ย</span>
            </div>
            <div className="font-display font-black text-2xl text-amber-600">
              {avgScore}%
            </div>
          </div>

          <div className="bg-white/90 p-4 rounded-2xl border border-sky-100 shadow-2xs">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mb-1">
              <Zap className="w-4 h-4 text-indigo-500" />
              <span>ทำแบบทดสอบ</span>
            </div>
            <div className="font-display font-black text-2xl text-indigo-600">
              {totalAttempts} <span className="text-xs font-normal text-slate-400">รอบ</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 1: กำลังเรียน (In-Progress) — Decision Q18 */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold">
              ⏳
            </span>
            <div>
              <h2 className="font-display font-extrabold text-xl text-slate-900">
                1. บทเรียนที่กำลังเรียนอยู่ (In-Progress)
              </h2>
              <p className="text-xs text-slate-500 font-body">
                บทเรียนที่คุณเริ่มเปิดแล้ว หรือกำลังฝึกทำแบบทดสอบ
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-sky-700 bg-sky-50 border border-sky-200 px-3 py-1 rounded-full">
            {inProgressLessons.length} เรื่อง
          </span>
        </div>

        {loading ? (
          <div className="h-48 rounded-3xl bg-white/50 border border-sky-100 animate-pulse" />
        ) : inProgressLessons.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {inProgressLessons.map((lesson) => (
              <LessonCard
                key={lesson.id}
                lesson={lesson}
                progress={progressMap[lesson.id]}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white/60 border border-dashed border-sky-200 rounded-3xl p-8 text-center space-y-2">
            <p className="text-sm font-semibold text-slate-600">
              ยังไม่มีบทเรียนที่ค้างอยู่ คุณสามารถเลือกบทเรียนใหม่ด้านล่างเพื่อเริ่มเรียนได้เลย! 🚀
            </p>
          </div>
        )}
      </section>

      {/* SECTION 2: เรียนจบแล้ว (Completed) — Decision Q18 */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              ✅
            </span>
            <div>
              <h2 className="font-display font-extrabold text-xl text-slate-900">
                2. บทเรียนที่เรียนจบแล้ว (Completed)
              </h2>
              <p className="text-xs text-slate-500 font-body">
                ผ่านเกณฑ์แบบทดสอบและบันทึกประวัติความสำเร็จเรียบร้อย
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
            {completedLessons.length} เรื่อง
          </span>
        </div>

        {loading ? (
          <div className="h-48 rounded-3xl bg-white/50 border border-sky-100 animate-pulse" />
        ) : completedLessons.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {completedLessons.map((lesson) => (
              <LessonCard
                key={lesson.id}
                lesson={lesson}
                progress={progressMap[lesson.id]}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white/60 border border-dashed border-emerald-200 rounded-3xl p-8 text-center space-y-2">
            <p className="text-sm font-semibold text-slate-600">
              ยังไม่มีบทเรียนที่เรียนจบ ลองเลือกบทเรียนด้านล่างและทำ Quiz ให้ผ่านเกณฑ์นะครับ 🌟
            </p>
          </div>
        )}
      </section>

      {/* SECTION 3: แนะนำสำหรับคุณ (Recommended) — Decision Q18 */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
              💡
            </span>
            <div>
              <h2 className="font-display font-extrabold text-xl text-slate-900">
                3. แนะนำสำหรับคุณ (Recommended)
              </h2>
              <p className="text-xs text-slate-500 font-body">
                บทเรียนใหม่ที่คุณยังไม่เคยเริ่ม ใช้เวลาเพียง 3–5 นาที
              </p>
            </div>
          </div>
          <Link
            href="/#catalog"
            className="text-xs font-bold text-indigo-600 hover:underline"
          >
            ดูทั้งหมด ({publishedLessons.length}) →
          </Link>
        </div>

        {loading ? (
          <div className="h-48 rounded-3xl bg-white/50 border border-sky-100 animate-pulse" />
        ) : recommendedLessons.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendedLessons.slice(0, 6).map((lesson) => (
              <LessonCard
                key={lesson.id}
                lesson={lesson}
                progress={progressMap[lesson.id]}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white/60 border border-dashed border-slate-200 rounded-3xl p-8 text-center space-y-2">
            <p className="text-sm font-semibold text-slate-600">
              คุณได้เริ่มเรียนบทเรียนทั้งหมดในระบบแล้ว! ยอดเยี่ยมมากๆ 🏆
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
