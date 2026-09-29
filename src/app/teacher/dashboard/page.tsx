"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Lesson } from "@/types";
import {
  getLessonsByAuthor,
  softDeleteLesson,
  togglePublishLesson,
} from "@/lib/firestore/lessons";
import { useAuth } from "@/contexts/AuthContext";
import {
  PlusCircle,
  BookOpen,
  Eye,
  Edit,
  Trash2,
  Sparkles,
  CheckCircle2,
  Globe,
  Lock,
  Layers,
} from "lucide-react";

export default function TeacherDashboard() {
  const { appUser } = useAuth();
  const authorId = appUser?.uid || "teacher-1";

  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);

  const loadLessons = async () => {
    setLoading(true);
    const data = await getLessonsByAuthor(authorId);
    setLessons(data);
    setLoading(false);
  };

  useEffect(() => {
    loadLessons();
  }, [authorId]);

  const handleTogglePublish = async (lesson: Lesson) => {
    const quizCount = lesson.cards.filter((c) => c.type === "quiz").length;
    if (!lesson.isPublished && quizCount === 0) {
      alert("ไม่สามารถเผยแพร่ได้: บทเรียนต้องมีการ์ดแบบทดสอบ (Quiz) อย่างน้อย 1 ใบ");
      return;
    }

    await togglePublishLesson(lesson.id, !lesson.isPublished);
    await loadLessons();
  };

  const handleDelete = async (lesson: Lesson) => {
    const confirmDelete = window.confirm(
      `คุณแน่ใจหรือไม่ว่าต้องการลบบทเรียน "${lesson.title}"?\n(ระบบจะใช้ Soft Delete โดยซ่อนบทเรียนจากคลัง แต่ยังคงรักษาประวัติคะแนนของผู้เรียนไว้)`
    );
    if (!confirmDelete) return;

    await softDeleteLesson(lesson.id);
    await loadLessons();
  };

  return (
    <div className="space-y-8">
      {/* Teacher Dashboard Header */}
      <div className="card-chibi p-6 sm:p-8 bg-gradient-to-r from-indigo-50 via-purple-50 to-sky-50 border-2 border-indigo-100 shadow-md">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-indigo-500 to-purple-400 flex items-center justify-center text-3xl shadow-md border-2 border-white animate-float shrink-0">
              👩‍🏫
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800 border border-indigo-200 mb-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>พื้นที่จัดการของคุณครู (Teacher Studio)</span>
              </div>
              <h1 className="font-display font-black text-2xl sm:text-3xl text-slate-900">
                ยินดีต้อนรับ, {appUser?.displayName || "ครูพี่เมฆ"} ☁️
              </h1>
              <p className="font-body text-xs sm:text-sm text-slate-600 mt-0.5">
                สร้างบทเรียน Micro Learning ที่เข้าใจง่าย จบใน 3–5 นาทีเพื่อผู้เรียนทุกคน
              </p>
            </div>
          </div>

          <Link
            href="/teacher/lesson/new"
            className="btn-3d btn-3d-primary px-6 py-3 text-sm font-bold flex items-center gap-2 shrink-0"
          >
            <PlusCircle className="w-5 h-5" />
            <span>+ สร้างบทเรียนใหม่</span>
          </Link>
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-3 gap-3.5 mt-6 pt-6 border-t border-indigo-100/80">
          <div className="bg-white/90 p-4 rounded-2xl border border-indigo-100">
            <div className="text-xs font-bold text-slate-500 mb-1">
              บทเรียนทั้งหมด
            </div>
            <div className="font-display font-black text-2xl text-indigo-600">
              {lessons.length} <span className="text-xs font-normal text-slate-400">เรื่อง</span>
            </div>
          </div>

          <div className="bg-white/90 p-4 rounded-2xl border border-emerald-100">
            <div className="text-xs font-bold text-slate-500 mb-1">
              เผยแพร่อยู่ (Published)
            </div>
            <div className="font-display font-black text-2xl text-emerald-600">
              {lessons.filter((l) => l.isPublished && !l.deletedAt).length}{" "}
              <span className="text-xs font-normal text-slate-400">เรื่อง</span>
            </div>
          </div>

          <div className="bg-white/90 p-4 rounded-2xl border border-slate-100">
            <div className="text-xs font-bold text-slate-500 mb-1">
              แบบร่าง / ซ่อนไว้
            </div>
            <div className="font-display font-black text-2xl text-slate-700">
              {lessons.filter((l) => !l.isPublished && !l.deletedAt).length}{" "}
              <span className="text-xs font-normal text-slate-400">เรื่อง</span>
            </div>
          </div>
        </div>
      </div>

      {/* Lesson List Table / Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display font-extrabold text-xl text-slate-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-600" />
            <span>รายการบทเรียนที่คุณสร้าง</span>
          </h2>
          <span className="text-xs font-semibold text-slate-500">
            ทั้งหมด {lessons.length} รายการ
          </span>
        </div>

        {loading ? (
          <div className="h-64 rounded-3xl bg-white/50 border border-sky-100 animate-pulse" />
        ) : lessons.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {lessons.map((lesson) => {
              const isDeleted = lesson.deletedAt !== null;
              const quizCount = lesson.cards.filter((c) => c.type === "quiz").length;

              return (
                <div
                  key={lesson.id}
                  className={`card-chibi p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                    isDeleted ? "opacity-60 bg-slate-50" : ""
                  }`}
                >
                  {/* Left: Thumbnail & Info */}
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-sky-100 border-2 border-white shadow-xs overflow-hidden shrink-0">
                      {lesson.thumbnailUrl ? (
                        <img
                          src={lesson.thumbnailUrl}
                          alt={lesson.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl">
                          📖
                        </div>
                      )}
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        {isDeleted ? (
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-700 border border-rose-200">
                            ลบแล้ว (Soft Deleted)
                          </span>
                        ) : lesson.isPublished ? (
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                            <Globe className="w-3 h-3" />
                            เผยแพร่อยู่ (Published)
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1">
                            <Lock className="w-3 h-3" />
                            ฉบับร่าง / ซ่อนไว้
                          </span>
                        )}

                        <span className="text-xs font-semibold text-slate-500">
                          หมวด: {lesson.category}
                        </span>
                        <span className="text-xs font-semibold text-slate-400">
                          • {lesson.cards.length} การ์ด (Quiz {quizCount} ข้อ)
                        </span>
                      </div>

                      <h3 className="font-display font-bold text-base sm:text-lg text-slate-900">
                        {lesson.title}
                      </h3>
                      <p className="font-body text-xs text-slate-500 line-clamp-1">
                        {lesson.description}
                      </p>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                    {!isDeleted && (
                      <>
                        <button
                          onClick={() => handleTogglePublish(lesson)}
                          className={`btn-3d px-3.5 py-2 text-xs font-bold ${
                            lesson.isPublished
                              ? "btn-3d-white text-slate-700"
                              : "btn-3d-mint text-white"
                          }`}
                        >
                          {lesson.isPublished ? "ซ่อนบทเรียน" : "เผยแพร่ทันที 🚀"}
                        </button>

                        <Link
                          href={`/teacher/lesson/${lesson.id}/edit`}
                          className="btn-3d btn-3d-white px-3.5 py-2 text-xs font-bold flex items-center gap-1.5 text-indigo-700"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          <span>แก้ไข</span>
                        </Link>

                        <Link
                          href={`/lesson/${lesson.id}`}
                          className="btn-3d btn-3d-white px-3 py-2 text-xs font-bold text-slate-600"
                          title="ดูตัวอย่างแบบผู้เรียน"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Link>

                        <button
                          onClick={() => handleDelete(lesson)}
                          className="p-2 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition-colors"
                          title="ลบบทเรียน (Soft Delete)"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="card-chibi p-12 text-center max-w-md mx-auto space-y-4">
            <div className="text-5xl">✍️</div>
            <h3 className="font-display font-bold text-xl text-slate-800">
              คุณยังไม่มีบทเรียน
            </h3>
            <p className="font-body text-sm text-slate-500">
              สร้างบทเรียนแรกของคุณตอนนี้เลย! ออกแบบการ์ดเนื้อหาและแบบทดสอบง่ายๆ ใน 3 นาที
            </p>
            <Link
              href="/teacher/lesson/new"
              className="btn-3d btn-3d-primary px-6 py-2.5 text-sm font-bold inline-flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>สร้างบทเรียนแรก</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
