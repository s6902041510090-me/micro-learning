"use client";

import React from "react";
import Link from "next/link";
import { Lesson, LessonProgress } from "@/types";
import { CATEGORY_COLORS } from "@/lib/constants";
import { Clock, Award, CheckCircle2, Play, Lock, AlertTriangle } from "lucide-react";

interface LessonCardProps {
  lesson: Lesson;
  progress?: LessonProgress | null;
  isTeacherView?: boolean;
}

export default function LessonCard({
  lesson,
  progress,
  isTeacherView = false,
}: LessonCardProps) {
  const catColor =
    CATEGORY_COLORS[lesson.category] || CATEGORY_COLORS["อื่นๆ"];

  const isCompleted = progress?.completedAt !== null && progress?.completedAt !== undefined;
  const isInProgress = !isCompleted && ((progress?.attempts || 0) > 0 || (progress?.lastCardIndex || 0) > 0);
  const isUnavailable = !lesson.isPublished || lesson.deletedAt !== null;

  return (
    <div
      className={`card-chibi flex flex-col h-full overflow-hidden transition-all duration-300 relative group ${
        isUnavailable ? "opacity-75 border-slate-300" : ""
      }`}
    >
      {/* Thumbnail Banner */}
      <div className="relative h-48 w-full overflow-hidden bg-gradient-to-tr from-sky-100 to-indigo-100">
        {lesson.thumbnailUrl ? (
          <img
            src={lesson.thumbnailUrl}
            alt={lesson.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl">
            {catColor.icon}
          </div>
        )}

        {/* Overlay gradient for text contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          {/* Category Badge */}
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold shadow-sm backdrop-blur-md border ${catColor.badge} ${catColor.border}`}
          >
            <span>{catColor.icon}</span>
            <span>{lesson.category}</span>
          </span>

          {/* Duration Badge */}
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-white/95 text-slate-800 shadow-sm border border-white">
            <Clock className="w-3.5 h-3.5 text-amber-500" />
            <span>{lesson.estimatedMinutes} นาที</span>
          </span>
        </div>

        {/* Status Overlay Banner for Unavailable */}
        {isUnavailable && (
          <div className="absolute inset-x-0 bottom-0 bg-rose-600/90 backdrop-blur-xs text-white py-1 px-3 text-xs font-bold flex items-center justify-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>บทเรียนนี้ไม่พร้อมใช้งานชั่วคราว</span>
          </div>
        )}

        {/* Completed Check Badge on Thumbnail */}
        {isCompleted && !isUnavailable && (
          <div className="absolute bottom-3 right-3 bg-emerald-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>ผ่านแล้ว ({progress?.bestScore}%)</span>
          </div>
        )}
      </div>

      {/* Card Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div className="space-y-2.5">
          {/* Author info */}
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>โดย {lesson.authorName}</span>
            <span className="flex items-center gap-1 text-slate-400">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              เกณฑ์ผ่าน: {lesson.passingScore}%
            </span>
          </div>

          {/* Title */}
          <h3 className="font-display font-bold text-lg text-slate-900 leading-snug line-clamp-2 group-hover:text-indigo-600 transition-colors">
            {lesson.title}
          </h3>

          {/* Description */}
          <p className="font-body text-sm text-slate-600 line-clamp-2 leading-relaxed">
            {lesson.description}
          </p>

          {/* Tags */}
          {lesson.tags && lesson.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {lesson.tags.slice(0, 3).map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-lg text-xs font-medium bg-slate-100 text-slate-600"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Progress & Action Footer */}
        <div className="mt-5 pt-4 border-t border-slate-100 space-y-3">
          {/* In-progress status message */}
          {isInProgress && !isUnavailable && (
            <div className="flex items-center justify-between text-xs font-semibold text-sky-700 bg-sky-50 px-3 py-1.5 rounded-xl border border-sky-100">
              <span>กำลังเรียน (ทำแบบทดสอบ {progress?.attempts || 0} ครั้ง)</span>
              {progress?.bestScore !== null && (
                <span className="text-amber-600 font-bold">
                  คะแนนสูงสุด: {progress?.bestScore}%
                </span>
              )}
            </div>
          )}

          {/* Action Buttons */}
          {isTeacherView ? (
            <div className="flex gap-2">
              <Link
                href={`/teacher/lesson/${lesson.id}/edit`}
                className="flex-1 text-center py-2.5 rounded-xl font-display font-bold text-sm bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 transition-colors"
              >
                ✏️ แก้ไขบทเรียน
              </Link>
              <Link
                href={`/lesson/${lesson.id}`}
                className="px-3.5 py-2.5 rounded-xl font-bold text-sm bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                title="ดูตัวอย่าง"
              >
                👁️
              </Link>
            </div>
          ) : isUnavailable ? (
            <button
              disabled
              className="w-full py-2.5 rounded-xl text-center font-display font-bold text-sm bg-slate-100 text-slate-400 cursor-not-allowed flex items-center justify-center gap-1.5"
            >
              <Lock className="w-4 h-4" />
              ไม่สามารถเข้าเรียนได้
            </button>
          ) : (
            <Link
              href={`/lesson/${lesson.id}`}
              className={`w-full py-2.5 text-center font-display font-bold text-sm flex items-center justify-center gap-2 btn-3d ${
                isCompleted
                  ? "btn-3d-mint text-white"
                  : isInProgress
                  ? "btn-3d-accent text-amber-950"
                  : "btn-3d-primary text-white"
              }`}
            >
              <Play className="w-4 h-4 fill-current" />
              {isCompleted
                ? "ทบทวนบทเรียนนี้ 🌟"
                : isInProgress
                ? "เรียนต่อให้จบ 🚀"
                : "เริ่มเรียนรู้ (3-5 นาที) 🌱"}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
