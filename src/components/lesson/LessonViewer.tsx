"use client";

import React, { useState, useEffect } from "react";
import { Lesson, LessonProgress } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import {
  updateCardIndex,
  recordQuizAttempt,
  getLessonProgress,
} from "@/lib/firestore/progress";
import TextImageCardView from "./cards/TextImageCardView";
import SlideCardView from "./cards/SlideCardView";
import QuizCardView from "./cards/QuizCardView";
import SummaryScreen from "./SummaryScreen";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  HelpCircle,
  Sparkles,
} from "lucide-react";

interface LessonViewerProps {
  lesson: Lesson;
  initialProgress?: LessonProgress | null;
}

export default function LessonViewer({
  lesson,
  initialProgress,
}: LessonViewerProps) {
  const { appUser } = useAuth();
  const userId = appUser?.uid || "guest-student";

  const [currentCardIndex, setCurrentCardIndex] = useState(
    initialProgress?.lastCardIndex && initialProgress.lastCardIndex < lesson.cards.length
      ? initialProgress.lastCardIndex
      : 0
  );
  const [progress, setProgress] = useState<LessonProgress>(
    initialProgress || {
      userId,
      lessonId: lesson.id,
      bestScore: null,
      lastAttemptScore: null,
      attempts: 0,
      completedAt: null,
      lastCardIndex: 0,
      updatedAt: new Date().toISOString(),
    }
  );

  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [isCompletedState, setIsCompletedState] = useState(false);
  const [latestAttemptScore, setLatestAttemptScore] = useState<number>(0);

  const totalCards = lesson.cards.length;
  const currentCard = lesson.cards[currentCardIndex];
  const quizCards = lesson.cards.filter((c) => c.type === "quiz");
  const totalQuizCount = quizCards.length;

  // Sync bookmark
  useEffect(() => {
    if (!isCompletedState) {
      updateCardIndex(userId, lesson.id, currentCardIndex);
    }
  }, [currentCardIndex, isCompletedState, userId, lesson.id]);

  const handleSelectQuizOption = (optionIndex: number) => {
    if (!currentCard || currentCard.type !== "quiz") return;
    setQuizAnswers((prev) => ({
      ...prev,
      [currentCard.id]: optionIndex,
    }));
  };

  const handleNext = async () => {
    if (currentCardIndex < totalCards - 1) {
      setCurrentCardIndex((prev) => prev + 1);
    } else {
      // Reached the end! Calculate final score
      let correctCount = 0;
      quizCards.forEach((qc) => {
        const studentChoice = quizAnswers[qc.id];
        if (studentChoice === qc.correctIndex) {
          correctCount++;
        }
      });

      const finalScore =
        totalQuizCount > 0 ? Math.round((correctCount / totalQuizCount) * 100) : 100;

      setLatestAttemptScore(finalScore);

      const updatedProgress = await recordQuizAttempt(
        userId,
        lesson.id,
        finalScore,
        lesson.passingScore
      );

      setProgress(updatedProgress);
      setIsCompletedState(true);
    }
  };

  const handlePrev = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex((prev) => prev - 1);
    }
  };

  // Retake option 1: Full restart
  const handleRestartAll = () => {
    setQuizAnswers({});
    setCurrentCardIndex(0);
    setIsCompletedState(false);
  };

  // Retake option 2: Quiz only
  const handleRetryQuizOnly = () => {
    setQuizAnswers({});
    const firstQuizIndex = lesson.cards.findIndex((c) => c.type === "quiz");
    setCurrentCardIndex(firstQuizIndex >= 0 ? firstQuizIndex : 0);
    setIsCompletedState(false);
  };

  // Calculate correct answers for summary
  const getCorrectAnswersCount = () => {
    let count = 0;
    quizCards.forEach((qc) => {
      if (quizAnswers[qc.id] === qc.correctIndex) count++;
    });
    return count;
  };

  if (isCompletedState) {
    return (
      <SummaryScreen
        lesson={lesson}
        progress={progress}
        currentAttemptScore={latestAttemptScore}
        totalQuizCards={totalQuizCount}
        correctAnswersCount={getCorrectAnswersCount()}
        onRestartAll={handleRestartAll}
        onRetryQuizOnly={handleRetryQuizOnly}
      />
    );
  }

  const isCurrentQuizCard = currentCard?.type === "quiz";
  const hasAnsweredCurrentQuiz =
    isCurrentQuizCard && quizAnswers[currentCard.id] !== undefined;

  // Can only advance quiz card if answered
  const canAdvance = !isCurrentQuizCard || hasAnsweredCurrentQuiz;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Top Header: Objective & Lesson Info */}
      <div className="bg-white/90 border-2 border-sky-100 rounded-3xl p-5 shadow-sm space-y-4 backdrop-blur-md">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xl">🌱</span>
            <h1 className="font-display font-extrabold text-lg sm:text-xl text-slate-800">
              {lesson.title}
            </h1>
          </div>
          <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
            การ์ดที่ {currentCardIndex + 1} จาก {totalCards}
          </span>
        </div>

        {/* Learning Objective banner */}
        {lesson.objective && (
          <div className="flex items-center gap-2.5 text-xs sm:text-sm text-indigo-900 bg-indigo-50/90 border border-indigo-100 rounded-2xl px-3.5 py-2 font-body">
            <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
            <span>
              <strong>เป้าหมายการเรียนรู้:</strong> {lesson.objective}
            </span>
          </div>
        )}

        {/* Cute Step Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-bold text-slate-500">
            <span>ความก้าวหน้าในบทเรียนนี้</span>
            <span>{Math.round(((currentCardIndex + 1) / totalCards) * 100)}%</span>
          </div>
          <div className="progress-bar-cute">
            <div
              className="progress-bar-cute-inner"
              style={{
                width: `${((currentCardIndex + 1) / totalCards) * 100}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Main Card Viewer Box */}
      <div className="card-chibi p-6 sm:p-8 min-h-[420px] flex flex-col justify-between">
        <div className="flex-1">
          {currentCard?.type === "text-image" && (
            <TextImageCardView card={currentCard} />
          )}

          {currentCard?.type === "slide" && (
            <SlideCardView card={currentCard} />
          )}

          {currentCard?.type === "quiz" && (
            <QuizCardView
              card={currentCard}
              selectedIndex={quizAnswers[currentCard.id] ?? null}
              onSelectOption={handleSelectQuizOption}
            />
          )}
        </div>

        {/* Bottom Navigation Toolbar */}
        <div className="mt-8 pt-6 border-t-2 border-slate-100 flex items-center justify-between gap-4">
          <button
            onClick={handlePrev}
            disabled={currentCardIndex === 0}
            className={`btn-3d px-5 py-2.5 text-sm font-bold flex items-center gap-2 ${
              currentCardIndex === 0
                ? "opacity-40 cursor-not-allowed bg-slate-100 text-slate-400 border-2 border-slate-200"
                : "btn-3d-white text-slate-700"
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>ย้อนกลับ</span>
          </button>

          {/* Quick step dots indicator */}
          <div className="hidden sm:flex items-center gap-1.5">
            {lesson.cards.map((c, idx) => (
              <div
                key={idx}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  idx === currentCardIndex
                    ? "w-6 bg-indigo-600 shadow-xs"
                    : idx < currentCardIndex
                    ? "bg-emerald-400"
                    : "bg-slate-200"
                }`}
                title={`การ์ดที่ ${idx + 1} (${c.type})`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            disabled={!canAdvance}
            className={`btn-3d px-6 py-2.5 text-sm font-bold flex items-center gap-2 ${
              !canAdvance
                ? "opacity-50 cursor-not-allowed bg-slate-200 text-slate-400 border-2 border-slate-300"
                : currentCardIndex === totalCards - 1
                ? "btn-3d-mint text-white"
                : "btn-3d-primary text-white"
            }`}
          >
            <span>
              {currentCardIndex === totalCards - 1
                ? "ตรวจคำตอบและสรุปผล 🎉"
                : "ถัดไป"}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
