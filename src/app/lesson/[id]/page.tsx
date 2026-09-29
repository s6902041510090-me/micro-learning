"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Lesson, LessonProgress } from "@/types";
import { getLessonById } from "@/lib/firestore/lessons";
import { getLessonProgress } from "@/lib/firestore/progress";
import { useAuth } from "@/contexts/AuthContext";
import LessonViewer from "@/components/lesson/LessonViewer";
import { ArrowLeft, AlertCircle, Loader2 } from "lucide-react";

export default function LessonDetailPage() {
  const params = useParams();
  const router = useRouter();
  const lessonId = params?.id as string;
  const { appUser } = useAuth();
  const userId = appUser?.uid || "guest-student";

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [progress, setProgress] = useState<LessonProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      if (!lessonId) return;
      setLoading(true);
      const data = await getLessonById(lessonId);

      if (!data) {
        setError("ไม่พบบทเรียนนี้ หรือบทเรียนอาจถูกลบไปแล้ว");
        setLoading(false);
        return;
      }

      const prog = await getLessonProgress(userId, lessonId);
      setLesson(data);
      setProgress(prog);
      setLoading(false);
    }

    load();
  }, [lessonId, userId]);

  if (loading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
        <p className="font-display font-bold text-slate-600">
          กำลังเตรียมบทเรียนแสนสนุก... 🌱
        </p>
      </div>
    );
  }

  if (error || !lesson) {
    return (
      <div className="card-chibi p-10 text-center max-w-md mx-auto space-y-4">
        <div className="text-5xl">⚠️</div>
        <h2 className="font-display font-bold text-xl text-slate-800">
          {error || "ไม่พบบทเรียน"}
        </h2>
        <p className="font-body text-sm text-slate-500">
          ขออภัย บทเรียนที่คุณค้นหาอาจไม่มีอยู่ หรือคุณครูกำลังปรับปรุงเนื้อหา
        </p>
        <Link
          href="/"
          className="btn-3d btn-3d-primary px-6 py-2.5 text-sm font-bold inline-flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>กลับสู่หน้าหลัก</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb / Return */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors px-3 py-1.5 rounded-xl hover:bg-white/80"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>ย้อนกลับ</span>
        </button>

        <span className="text-xs font-semibold text-slate-500 bg-sky-50 border border-sky-100 px-3 py-1 rounded-full">
          หมวด: {lesson.category} • {lesson.estimatedMinutes} นาที
        </span>
      </div>

      {/* Interactive Lesson Viewer */}
      <LessonViewer lesson={lesson} initialProgress={progress} />
    </div>
  );
}
