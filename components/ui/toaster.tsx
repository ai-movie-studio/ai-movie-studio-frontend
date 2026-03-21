"use client";

import { useToastStore, ToastType } from "@/app/store/toast-store";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

const toastIcons = {
  success: <CheckCircle2 className="w-5 h-5 text-green-500" />,
  error: <AlertCircle className="w-5 h-5 text-red-500" />,
  info: <Info className="w-5 h-5 text-blue-500" />,
  warning: <AlertCircle className="w-5 h-5 text-amber-500" />,
};

const toastStyles = {
  success: "bg-green-50 border-green-100 text-green-900",
  error: "bg-red-50 border-red-100 text-red-900",
  info: "bg-blue-50 border-blue-100 text-blue-900",
  warning: "bg-amber-50 border-amber-100 text-amber-900",
};

export const Toaster = () => {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="fixed top-6 right-6 z-[100] flex flex-col-reverse gap-3 min-w-[320px] max-w-md pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, scale: 0.9, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className={cn(
              "pointer-events-auto flex items-start gap-3 p-4 rounded-2xl border shadow-lg backdrop-blur-xl",
              toastStyles[toast.type]
            )}
          >
            <div className="flex-shrink-0 mt-0.5">{toastIcons[toast.type]}</div>
            <div className="flex-1 text-sm font-medium pr-4 leading-normal">
              {toast.message}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="flex-shrink-0 hover:opacity-70 transition-opacity"
            >
              <X className="w-4 h-4 opacity-50" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
