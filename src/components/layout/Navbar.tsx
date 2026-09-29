"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import {
  BookOpen,
  Sparkles,
  User,
  LogOut,
  PlusCircle,
  Menu,
  X,
  GraduationCap,
  Compass,
} from "lucide-react";

export default function Navbar() {
  const { appUser, signOut, quickDemoLogin } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b-2 border-sky-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Disclosure>
          {({ open, close }) => (
            <>
              <div className="flex items-center justify-between h-20">
                {/* Logo */}
                <Link
                  href="/"
                  className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-2xl"
                >
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 via-sky-400 to-amber-300 flex items-center justify-center shadow-md border-2 border-white group-hover:scale-105 transition-transform">
                    <span className="text-2xl animate-float">🌱</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-display font-extrabold text-2xl tracking-tight bg-gradient-to-r from-indigo-600 via-sky-600 to-amber-600 bg-clip-text text-transparent">
                        Micro Learning
                      </span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
                        3-5 min
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 font-medium hidden sm:block">
                      เรียนรู้เรื่องเด่น กระชับ สนุก ทันใจ ✨
                    </p>
                  </div>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-2">
                  <Link
                    href="/"
                    className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:text-indigo-600 hover:bg-sky-50 transition-colors flex items-center gap-2"
                  >
                    <Compass className="w-4 h-4 text-sky-500" />
                    สำรวจบทเรียน
                  </Link>

                  {appUser?.role === "student" && (
                    <Link
                      href="/dashboard"
                      className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:text-indigo-600 hover:bg-sky-50 transition-colors flex items-center gap-2"
                    >
                      <GraduationCap className="w-4 h-4 text-emerald-500" />
                      แดชบอร์ดของฉัน
                    </Link>
                  )}

                  {appUser?.role === "teacher" && (
                    <>
                      <Link
                        href="/teacher/dashboard"
                        className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:text-indigo-600 hover:bg-sky-50 transition-colors flex items-center gap-2"
                      >
                        <BookOpen className="w-4 h-4 text-indigo-500" />
                        บทเรียนของฉัน
                      </Link>
                      <Link
                        href="/teacher/lesson/new"
                        className="px-4 py-2 rounded-xl text-sm font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition-colors flex items-center gap-2"
                      >
                        <PlusCircle className="w-4 h-4 text-indigo-600" />
                        สร้างบทเรียนใหม่
                      </Link>
                    </>
                  )}
                </nav>

                {/* Auth & Profile Actions (Desktop) */}
                <div className="hidden md:flex items-center gap-3">
                  {appUser ? (
                    <div className="flex items-center gap-3 bg-sky-50/80 border border-sky-200/80 px-3.5 py-1.5 rounded-2xl shadow-sm">
                      <div className="w-9 h-9 rounded-xl bg-white border border-sky-200 flex items-center justify-center overflow-hidden shadow-inner">
                        {appUser.photoURL ? (
                          <img
                            src={appUser.photoURL}
                            alt={appUser.displayName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="w-5 h-5 text-indigo-500" />
                        )}
                      </div>
                      <div className="text-left pr-1">
                        <div className="text-sm font-bold text-slate-800 leading-tight">
                          {appUser.displayName}
                        </div>
                        <div className="text-xs font-semibold">
                          {appUser.role === "teacher" ? (
                            <span className="text-purple-600">👩‍🏫 ครูผู้สอน</span>
                          ) : (
                            <span className="text-emerald-600">🎓 ผู้เรียน</span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => signOut()}
                        className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-white rounded-lg transition-colors"
                        title="ออกจากระบบ"
                      >
                        <LogOut className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2.5">
                      {/* Quick Demo Switcher for convenience */}
                      <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 rounded-xl px-2 py-1 text-xs font-semibold text-amber-800">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        <span>ทดลองสวมบท:</span>
                        <button
                          onClick={() => quickDemoLogin("student")}
                          className="px-2 py-0.5 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors shadow-xs"
                        >
                          นักเรียน
                        </button>
                        <button
                          onClick={() => quickDemoLogin("teacher")}
                          className="px-2 py-0.5 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors shadow-xs"
                        >
                          คุณครู
                        </button>
                      </div>

                      <Link
                        href="/login"
                        className="px-4 py-2 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-100 transition-colors"
                      >
                        เข้าสู่ระบบ
                      </Link>
                      <Link
                        href="/register"
                        className="btn-3d btn-3d-primary px-4 py-2 text-sm font-bold flex items-center gap-1.5"
                      >
                        สมัครสมาชิก
                      </Link>
                    </div>
                  )}
                </div>

                {/* Mobile Menu Button — HeadlessUI DisclosureButton */}
                <div className="md:hidden flex items-center gap-2">
                  <DisclosureButton className="p-2.5 rounded-xl bg-sky-50 text-slate-700 hover:bg-sky-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400">
                    <span className="sr-only">
                      {open ? "ปิดเมนู" : "เปิดเมนู"}
                    </span>
                    {open ? (
                      <X className="w-6 h-6" aria-hidden="true" />
                    ) : (
                      <Menu className="w-6 h-6" aria-hidden="true" />
                    )}
                  </DisclosureButton>
                </div>
              </div>

              {/* Mobile Menu Drawer — HeadlessUI DisclosurePanel */}
              <DisclosurePanel className="md:hidden bg-white/95 border-b border-sky-100 px-4 pt-2 pb-6 space-y-3">
                <Link
                  href="/"
                  onClick={() => close()}
                  className="block px-3 py-2 rounded-xl text-base font-semibold text-slate-700 hover:bg-sky-50"
                >
                  🧭 สำรวจบทเรียนทั้งหมด
                </Link>

                {appUser?.role === "student" && (
                  <Link
                    href="/dashboard"
                    onClick={() => close()}
                    className="block px-3 py-2 rounded-xl text-base font-semibold text-slate-700 hover:bg-sky-50"
                  >
                    🎓 แดชบอร์ดของฉัน
                  </Link>
                )}

                {appUser?.role === "teacher" && (
                  <>
                    <Link
                      href="/teacher/dashboard"
                      onClick={() => close()}
                      className="block px-3 py-2 rounded-xl text-base font-semibold text-slate-700 hover:bg-sky-50"
                    >
                      📚 จัดการบทเรียน
                    </Link>
                    <Link
                      href="/teacher/lesson/new"
                      onClick={() => close()}
                      className="block px-3 py-2 rounded-xl text-base font-semibold text-indigo-600 bg-indigo-50"
                    >
                      ➕ สร้างบทเรียนใหม่
                    </Link>
                  </>
                )}

                {appUser ? (
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-800">
                        {appUser.displayName}
                      </div>
                      <div className="text-xs text-slate-500">
                        บทบาท: {appUser.role === "teacher" ? "คุณครู" : "ผู้เรียน"}
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        signOut();
                        close();
                      }}
                      className="btn-3d btn-3d-white px-3 py-1.5 text-xs font-bold text-rose-600"
                    >
                      ออกจากระบบ
                    </button>
                  </div>
                ) : (
                  <div className="pt-3 border-t border-slate-100 space-y-2">
                    <div className="flex gap-2">
                      <Link
                        href="/login"
                        onClick={() => close()}
                        className="flex-1 text-center py-2.5 rounded-xl border-2 border-slate-200 font-bold text-slate-700"
                      >
                        เข้าสู่ระบบ
                      </Link>
                      <Link
                        href="/register"
                        onClick={() => close()}
                        className="flex-1 text-center py-2.5 btn-3d btn-3d-primary text-white font-bold"
                      >
                        สมัครสมาชิก
                      </Link>
                    </div>

                    <div className="pt-2 text-center">
                      <span className="text-xs text-slate-500 block mb-1">
                        ทดลองสลับบทบาท:
                      </span>
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => {
                            quickDemoLogin("student");
                            close();
                          }}
                          className="px-3 py-1 bg-emerald-500 text-white rounded-lg text-xs font-bold"
                        >
                          🎓 น้องต้นกล้า (Student)
                        </button>
                        <button
                          onClick={() => {
                            quickDemoLogin("teacher");
                            close();
                          }}
                          className="px-3 py-1 bg-indigo-500 text-white rounded-lg text-xs font-bold"
                        >
                          👩‍🏫 ครูพี่เมฆ (Teacher)
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </DisclosurePanel>
            </>
          )}
        </Disclosure>
      </div>
    </header>
  );
}
