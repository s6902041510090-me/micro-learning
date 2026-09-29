"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Lesson, Category } from "@/types";
import { CATEGORIES, CATEGORY_COLORS } from "@/lib/constants";
import { getPublishedLessons } from "@/lib/firestore/lessons";
import LessonCard from "@/components/lesson/LessonCard";
import { useAuth } from "@/contexts/AuthContext";
import {
  Sparkles,
  Search,
  BookOpen,
  Zap,
  Award,
  GraduationCap,
  Flame,
} from "lucide-react";

export default function HomePage() {
  const { appUser } = useAuth();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await getPublishedLessons();
      setLessons(data);
      setLoading(false);
    }
    load();
  }, []);

  const filteredLessons = useMemo(() => {
    return lessons.filter((lesson) => {
      const matchCat =
        selectedCategory === "all" || lesson.category === selectedCategory;
      const matchSearch =
        searchQuery.trim() === "" ||
        lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lesson.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (lesson.tags &&
          lesson.tags.some((t) =>
            t.toLowerCase().includes(searchQuery.toLowerCase())
          ));
      return matchCat && matchSearch;
    });
  }, [lessons, selectedCategory, searchQuery]);

  return (
    <div className="space-y-12">
      {/* Cute Pixar/Chibi Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-500 via-sky-400 to-emerald-300 p-8 sm:p-12 text-white shadow-xl border-4 border-white">
        {/* Soft floating background lights */}
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-white/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-80 h-80 bg-amber-300/30 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-6">
          {/* Cute Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/25 backdrop-blur-md text-white font-display font-bold text-xs sm:text-sm border border-white/40 shadow-xs animate-float">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>แนวคิดใหม่: เรียนหนึ่งเรื่องให้จบใน 3–5 นาที ⚡</span>
          </div>

          {/* Heading with Visual Hierarchy */}
          <h1 className="font-display font-black text-3xl sm:text-5xl lg:text-6xl tracking-tight leading-tight drop-shadow-sm">
            เก่งขึ้นวันละนิด <br className="hidden sm:inline" />
            เข้าใจเรื่องยากให้ง่ายใน 3 นาที 🌱✨
          </h1>

          <p className="font-body text-base sm:text-xl text-white/95 leading-relaxed max-w-2xl font-medium">
            คัดสรรเนื้อหาคุณภาพแบบ Bite-sized สำหรับผู้เรียนยุคใหม่ 
            อ่านสไลด์สรุปเนื้อหา → ทดสอบความเข้าใจด้วย Quiz ทันที → สะสมความก้าวหน้า
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            {appUser ? (
              <Link
                href={appUser.role === "teacher" ? "/teacher/dashboard" : "/dashboard"}
                className="btn-3d btn-3d-accent px-7 py-3.5 text-base font-bold flex items-center gap-2"
              >
                <GraduationCap className="w-5 h-5 text-amber-900" />
                <span>
                  {appUser.role === "teacher"
                    ? "ไปที่ห้องจัดการของคุณครู"
                    : "ไปที่แดชบอร์ดบทเรียนของฉัน"}
                </span>
              </Link>
            ) : (
              <>
                <Link
                  href="/register"
                  className="btn-3d btn-3d-accent px-7 py-3.5 text-base font-bold flex items-center gap-2"
                >
                  <Flame className="w-5 h-5 text-amber-900" />
                  <span>สมัครเรียนฟรีใน 1 นาที</span>
                </Link>
                <a
                  href="#catalog"
                  className="btn-3d btn-3d-white px-6 py-3.5 text-base font-bold text-slate-800 flex items-center gap-2"
                >
                  <BookOpen className="w-5 h-5 text-indigo-600" />
                  <span>เลือกดูบทเรียน</span>
                </a>
              </>
            )}
          </div>

          {/* 3 Pillars of Micro Learning */}
          <div className="pt-6 grid grid-cols-3 gap-3 text-center sm:text-left border-t border-white/20">
            <div>
              <div className="font-display font-extrabold text-xl sm:text-2xl">3–5 นาที</div>
              <div className="text-xs text-white/80 font-body">ต่อหนึ่งบทเรียน</div>
            </div>
            <div>
              <div className="font-display font-extrabold text-xl sm:text-2xl">Quiz ทันที</div>
              <div className="text-xs text-white/80 font-body">เช็คผลพร้อมเฉลย</div>
            </div>
            <div>
              <div className="font-display font-extrabold text-xl sm:text-2xl">100% ฟรี</div>
              <div className="text-xs text-white/80 font-body">เข้าถึงได้ทุกคน</div>
            </div>
          </div>
        </div>
      </section>

      {/* Catalog & Filter Section */}
      <section id="catalog" className="space-y-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 font-display font-bold text-sm">
              <BookOpen className="w-4 h-4" />
              <span>คลังบทเรียน Micro Lessons</span>
            </div>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-slate-900 mt-1">
              เลือกหัวข้อที่คุณสนใจวันนี้ 🎯
            </h2>
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ค้นหาชื่อเรื่อง, คีย์เวิร์ด, แท็ก..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl border-2 border-sky-100 bg-white shadow-xs text-sm focus:outline-none focus:border-indigo-400 font-body"
            />
          </div>
        </div>

        {/* Category Pills Bar (Grid / Alignment) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-display font-bold whitespace-nowrap transition-all ${
              selectedCategory === "all"
                ? "bg-indigo-600 text-white shadow-md scale-102"
                : "bg-white text-slate-700 hover:bg-sky-50 border border-slate-200"
            }`}
          >
            🌟 ทั้งหมด ({lessons.length})
          </button>

          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            const catMeta = CATEGORY_COLORS[cat];
            const count = lessons.filter((l) => l.category === cat).length;

            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-display font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? "bg-indigo-600 text-white shadow-md scale-102"
                    : `bg-white text-slate-700 hover:bg-sky-50 border border-slate-200`
                }`}
              >
                <span>{catMeta.icon}</span>
                <span>{cat}</span>
                <span className="text-[11px] opacity-75">({count})</span>
              </button>
            );
          })}
        </div>

        {/* Lesson Cards Grid (Grid System & Visual Hierarchy) */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-80 rounded-3xl bg-white/60 border-2 border-sky-100 animate-pulse p-4"
              />
            ))}
          </div>
        ) : filteredLessons.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLessons.map((lesson) => (
              <LessonCard key={lesson.id} lesson={lesson} />
            ))}
          </div>
        ) : (
          <div className="card-chibi p-12 text-center max-w-md mx-auto space-y-4">
            <div className="text-5xl animate-float">🔍</div>
            <h3 className="font-display font-bold text-xl text-slate-800">
              ไม่พบบทเรียนที่ตรงกับคำค้นหา
            </h3>
            <p className="font-body text-sm text-slate-500">
              ลองเปลี่ยนคำค้นหาหรือเลือกหมวดหมู่อื่นเพื่อสำรวจบทเรียนใหม่ๆ นะครับ
            </p>
            <button
              onClick={() => {
                setSelectedCategory("all");
                setSearchQuery("");
              }}
              className="btn-3d btn-3d-white px-4 py-2 text-xs font-bold"
            >
              ดูบทเรียนทั้งหมด
            </button>
          </div>
        )}
      </section>

      {/* Guest Callout Banner */}
      {!appUser && (
        <section className="rounded-3xl bg-gradient-to-r from-amber-100 via-sky-100 to-indigo-100 border-2 border-sky-200 p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="space-y-2 text-center sm:text-left">
            <h3 className="font-display font-black text-2xl text-slate-900">
              พร้อมที่จะเริ่มสะสมความรู้แล้วหรือยัง? 🚀
            </h3>
            <p className="font-body text-slate-700 text-sm sm:text-base max-w-xl">
              สมัครสมาชิกฟรีเพื่อบันทึกประวัติการเรียน วัดคะแนนความรู้ และท้าทายตัวเองด้วยแบบทดสอบทุกวัน
            </p>
          </div>
          <Link
            href="/register"
            className="btn-3d btn-3d-primary px-8 py-3.5 font-bold text-base whitespace-nowrap shrink-0"
          >
            เริ่มเรียนเลย ฟรี! ✨
          </Link>
        </section>
      )}
    </div>
  );
}
