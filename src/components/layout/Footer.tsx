import React from "react";
import Link from "next/link";
import { Sparkles, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-16 bg-white/70 border-t-2 border-sky-100 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🌱</span>
              <span className="font-display font-extrabold text-xl text-slate-800">
                Micro Learning Platform
              </span>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed max-w-md font-body">
              เรียนรู้เรื่องเด่นทีละเรื่อง จบใน 3–5 นาที ด้วยสื่อการสอนที่เข้าใจง่าย
              แบบทดสอบประเมินผลทันที และระบบบันทึกความก้าวหน้าที่ออกแบบตามหลักการศึกษา
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 bg-indigo-50 border border-indigo-100 rounded-xl px-3 py-1.5 w-fit">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Cute 3D Pixar-inspired Educational Design System</span>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-display font-bold text-slate-800 text-sm mb-3">
              หมวดหมู่ยอดนิยม
            </h4>
            <ul className="space-y-2 text-sm text-slate-600 font-body">
              <li>
                <Link href="/?category=วิทย์" className="hover:text-indigo-600 transition-colors">
                  🔬 วิทยาศาสตร์น่ารู้
                </Link>
              </li>
              <li>
                <Link href="/?category=เทคโนโลยี" className="hover:text-indigo-600 transition-colors">
                  🤖 ปัญญาประดิษฐ์ & เทคโนโลยี
                </Link>
              </li>
              <li>
                <Link href="/?category=ทักษะชีวิต" className="hover:text-indigo-600 transition-colors">
                  🌱 การเงิน & ทักษะชีวิต
                </Link>
              </li>
              <li>
                <Link href="/?category=ภาษาไทย" className="hover:text-indigo-600 transition-colors">
                  📚 ภาษาไทย & สำนวน
                </Link>
              </li>
            </ul>
          </div>

          {/* Educational Principles */}
          <div>
            <h4 className="font-display font-bold text-slate-800 text-sm mb-3">
              หลักการออกแบบการเรียนรู้
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-500 font-body">
              <li className="flex items-center gap-1.5">
                <span className="text-emerald-500 font-bold">✓</span> Bite-sized (3–5 นาที)
              </li>
              <li className="flex items-center gap-1.5">
                <span className="text-emerald-500 font-bold">✓</span> Instant Feedback Quiz
              </li>
              <li className="flex items-center gap-1.5">
                <span className="text-emerald-500 font-bold">✓</span> Growth Mindset Retake
              </li>
              <li className="flex items-center gap-1.5">
                <span className="text-emerald-500 font-bold">✓</span> Evidence of Learning
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 Micro Learning Platform. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Made with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
            <span>for Lifelong Learners everywhere</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
