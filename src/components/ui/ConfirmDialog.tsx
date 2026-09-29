"use client";

import React from "react";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Description,
} from "@headlessui/react";
import { AlertTriangle, X } from "lucide-react";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "warning" | "info";
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel = "ยืนยัน",
  cancelLabel = "ยกเลิก",
  variant = "danger",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const variantStyles = {
    danger: {
      icon: "🗑️",
      iconBg: "bg-rose-100 text-rose-600",
      confirmBtn: "btn-3d bg-rose-500 text-white hover:bg-rose-600 shadow-[0_4px_0_0_#b91c1c]",
    },
    warning: {
      icon: "⚠️",
      iconBg: "bg-amber-100 text-amber-600",
      confirmBtn: "btn-3d bg-amber-500 text-white hover:bg-amber-600 shadow-[0_4px_0_0_#b45309]",
    },
    info: {
      icon: "ℹ️",
      iconBg: "bg-sky-100 text-sky-600",
      confirmBtn: "btn-3d btn-3d-primary",
    },
  };

  const styles = variantStyles[variant];

  return (
    <Dialog
      open={isOpen}
      onClose={onCancel}
      className="relative z-50"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
        aria-hidden="true"
      />

      {/* Dialog position */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="card-chibi w-full max-w-md p-6 sm:p-8 space-y-5 animate-in fade-in zoom-in-95 duration-200">
          {/* Close button */}
          <button
            onClick={onCancel}
            className="absolute top-4 right-4 p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label="ปิด"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Icon + Title */}
          <div className="flex items-center gap-4">
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0 ${styles.iconBg}`}
            >
              {styles.icon}
            </div>
            <div>
              <DialogTitle className="font-display font-extrabold text-lg text-slate-900 leading-tight">
                {title}
              </DialogTitle>
              <Description className="font-body text-sm text-slate-500 mt-0.5 leading-relaxed">
                {message}
              </Description>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
            <button
              onClick={onCancel}
              className="btn-3d btn-3d-white px-5 py-2.5 text-sm font-bold text-slate-700"
            >
              {cancelLabel}
            </button>
            <button
              onClick={() => {
                onConfirm();
                onCancel();
              }}
              className={`px-5 py-2.5 text-sm font-bold rounded-2xl transition-all active:translate-y-1 ${styles.confirmBtn}`}
            >
              {confirmLabel}
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
