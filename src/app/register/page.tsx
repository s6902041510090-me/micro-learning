"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types";
import { Mail, Lock, User, GraduationCap, BookOpen, Loader2, ArrowRight } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const { signUp, signInGoogle } = useAuth();

  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("student");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      setError("รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร");
      return;
    }

    setError(null);
    setLoading(true);

    const res = await signUp(email, password, displayName, role);
    setLoading(false);

    if (res.success) {
      router.push(role === "teacher" ? "/teacher/dashboard" : "/dashboard");
    } else {
      setError(res.error || "สมัครสมาชิกไม่สำเร็จ");
    }
  };

  const handleGoogle = async () => {
    setError(null);
    setLoading(true);
    const res = await signInGoogle(role);
    setLoading(false);
    if (res.success) {
      router.push(role === "teacher" ? "/teacher/dashboard" : "/dashboard");
    } else {
      setError(res.error || "เข้าสู่ระบบด้วย Google ไม่สำเร็จ");
    }
  };

  return (
    <div className="max-w-md mx-auto py-8">
      <div className="card-chibi p-8 space-y-6 shadow-xl">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-tr from-emerald-400 to-sky-400 flex items-center justify-center text-3xl shadow-md border-2 border-white animate-float">
            🎒
          </div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-slate-900">
            สร้างบัญชีใหม่ ✨
          </h1>
          <p className="font-body text-sm text-slate-500">
            เริ่มต้นเรียนรู้หรือสร้างสรรค์บทเรียน Micro Learning
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-rose-50 border-2 border-rose-200 text-rose-700 p-3 rounded-2xl text-xs font-semibold">
            ⚠️ {error}
          </div>
        )}

        {/* Role Selector Card */}
        <div className="space-y-2">
          <label className="block font-display font-bold text-xs sm:text-sm text-slate-700">
            เลือกบทบาทของคุณ <span className="text-rose-500">*</span>
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setRole("student")}
              className={`p-3.5 rounded-2xl border-2 text-left transition-all ${
                role === "student"
                  ? "bg-emerald-50 border-emerald-500 ring-2 ring-emerald-200 shadow-sm"
                  : "bg-white border-slate-200 hover:bg-slate-50"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <GraduationCap className={`w-5 h-5 ${role === "student" ? "text-emerald-600" : "text-slate-400"}`} />
                <span className="font-display font-bold text-sm text-slate-900">ผู้เรียน</span>
              </div>
              <p className="text-[11px] text-slate-500 font-body">
                เรียนบทเรียน ทำ Quiz สะสมสถิติ
              </p>
            </button>

            <button
              type="button"
              onClick={() => setRole("teacher")}
              className={`p-3.5 rounded-2xl border-2 text-left transition-all ${
                role === "teacher"
                  ? "bg-indigo-50 border-indigo-500 ring-2 ring-indigo-200 shadow-sm"
                  : "bg-white border-slate-200 hover:bg-slate-50"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <BookOpen className={`w-5 h-5 ${role === "teacher" ? "text-indigo-600" : "text-slate-400"}`} />
                <span className="font-display font-bold text-sm text-slate-900">คุณครู</span>
              </div>
              <p className="text-[11px] text-slate-500 font-body">
                สร้าง & เผยแพร่บทเรียน
              </p>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-display font-bold text-xs sm:text-sm text-slate-700 mb-1.5">
              ชื่อแสดงในระบบ (Display Name) <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="เช่น น้องต้นกล้า 🌱"
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl border-2 border-slate-200 focus:outline-none focus:border-indigo-400 text-sm font-body"
              />
            </div>
          </div>

          <div>
            <label className="block font-display font-bold text-xs sm:text-sm text-slate-700 mb-1.5">
              อีเมล (Email) <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl border-2 border-slate-200 focus:outline-none focus:border-indigo-400 text-sm font-body"
              />
            </div>
          </div>

          <div>
            <label className="block font-display font-bold text-xs sm:text-sm text-slate-700 mb-1.5">
              รหัสผ่าน (Password) <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="อย่างน้อย 6 ตัวอักษร"
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl border-2 border-slate-200 focus:outline-none focus:border-indigo-400 text-sm font-body"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-3d btn-3d-primary py-3 text-sm font-bold flex items-center justify-center gap-2"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <span>สมัครสมาชิกเลย</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative flex items-center justify-center">
          <div className="border-t border-slate-200 w-full" />
          <span className="bg-white px-3 text-xs font-bold text-slate-400 uppercase">
            หรือ
          </span>
        </div>

        {/* Google Register */}
        <button
          type="button"
          onClick={handleGoogle}
          disabled={loading}
          className="w-full btn-3d btn-3d-white py-2.5 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 text-slate-700"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>สมัครด้วย Google</span>
        </button>

        {/* Footer link */}
        <p className="text-center text-xs text-slate-500 font-body">
          มีบัญชีอยู่แล้ว?{" "}
          <Link
            href="/login"
            className="text-indigo-600 font-bold hover:underline"
          >
            เข้าสู่ระบบที่นี่
          </Link>
        </p>
      </div>
    </div>
  );
}
