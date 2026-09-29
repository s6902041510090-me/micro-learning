"use client";

import React, { useState, useRef } from "react";
import { uploadLessonImage } from "@/lib/storage";
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";

interface ImageUploaderProps {
  currentUrl?: string;
  onUrlChange: (url: string) => void;
  label?: string;
}

export default function ImageUploader({
  currentUrl,
  onUrlChange,
  label = "รูปภาพประกอบ (ขนาดไม่เกิน 5MB)",
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [manualUrl, setManualUrl] = useState(currentUrl || "");
  const [mode, setMode] = useState<"upload" | "url">("upload");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setError(null);
    setUploading(true);
    const result = await uploadLessonImage(file);
    setUploading(false);
    if (result.error) {
      setError(result.error);
    } else {
      onUrlChange(result.url);
      setManualUrl(result.url);
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="font-display font-bold text-xs sm:text-sm text-slate-700">
          {label}
        </label>
        <div className="flex text-xs font-semibold rounded-lg bg-slate-100 p-0.5 border border-slate-200">
          <button
            type="button"
            onClick={() => setMode("upload")}
            className={`px-2 py-0.5 rounded-md transition-colors ${
              mode === "upload"
                ? "bg-white text-indigo-600 shadow-xs"
                : "text-slate-600"
            }`}
          >
            อัปโหลด
          </button>
          <button
            type="button"
            onClick={() => setMode("url")}
            className={`px-2 py-0.5 rounded-md transition-colors ${
              mode === "url"
                ? "bg-white text-indigo-600 shadow-xs"
                : "text-slate-600"
            }`}
          >
            ระบุ URL
          </button>
        </div>
      </div>

      {currentUrl ? (
        <div className="relative rounded-2xl overflow-hidden border-2 border-sky-100 shadow-xs group bg-slate-50">
          <img
            src={currentUrl}
            alt="Uploaded Preview"
            className="w-full h-44 object-cover"
          />
          <button
            type="button"
            onClick={() => {
              onUrlChange("");
              setManualUrl("");
            }}
            className="absolute top-2 right-2 p-1.5 rounded-xl bg-rose-500 text-white shadow-md hover:bg-rose-600 transition-colors"
            title="ลบรูปภาพ"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : mode === "upload" ? (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={onDrop}
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-sky-200 hover:border-indigo-400 bg-sky-50/50 hover:bg-sky-50 rounded-2xl p-6 text-center cursor-pointer transition-colors"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFile(e.target.files[0]);
              }
            }}
          />

          {uploading ? (
            <div className="flex flex-col items-center justify-center space-y-2 py-2">
              <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
              <span className="text-xs font-bold text-indigo-600">
                กำลังอัปโหลดรูปภาพ...
              </span>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="w-10 h-10 mx-auto rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-bold text-slate-700">
                  คลิกเพื่อเลือกไฟล์ หรือลากรูปภาพมาวางที่นี่
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  รองรับ PNG, JPG, WebP ขนาดไม่เกิน 5MB
                </p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex gap-2">
          <input
            type="url"
            value={manualUrl}
            onChange={(e) => setManualUrl(e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="flex-1 px-3.5 py-2 rounded-xl border-2 border-slate-200 text-sm focus:outline-none focus:border-indigo-400 font-body"
          />
          <button
            type="button"
            onClick={() => onUrlChange(manualUrl)}
            className="btn-3d btn-3d-white px-4 py-2 text-xs font-bold"
          >
            ใช้ URL นี้
          </button>
        </div>
      )}

      {error && (
        <p className="text-xs font-semibold text-rose-600 bg-rose-50 border border-rose-200 rounded-xl px-3 py-1.5">
          ⚠️ {error}
        </p>
      )}
    </div>
  );
}
