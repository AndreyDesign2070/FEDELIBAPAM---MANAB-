import React from "react";
import { X, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDanger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  isOpen,
  title,
  message,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  isDanger = true,
  onConfirm,
  onCancel
}: ConfirmModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", duration: 0.3 }}
            className="relative bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl w-full max-w-md border border-slate-100 dark:border-slate-800 z-10 overflow-hidden"
          >
            {/* Design header decorator */}
            <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-red-500 via-amber-500 to-emerald-500" />

            {/* Close Button top-right */}
            <button
              onClick={onCancel}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex gap-4 pt-1">
              {/* Alert Icon */}
              <div className={`p-3 rounded-2xl h-fit ${isDanger ? 'bg-red-50 text-red-600 dark:bg-red-950/30' : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30'}`}>
                <AlertTriangle className="w-6 h-6" />
              </div>

              {/* Text content details */}
              <div className="flex-1">
                <h3 className="text-base font-display font-extrabold text-slate-900 dark:text-white uppercase tracking-tight mb-2">
                  {title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-sans font-medium">
                  {message}
                </p>
              </div>
            </div>

            {/* Bottom Actions footer */}
            <div className="flex gap-3 justify-end mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={onCancel}
                className="py-2 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer"
              >
                {cancelLabel}
              </button>
              
              <button
                type="button"
                onClick={() => {
                  onConfirm();
                }}
                className={`py-2 px-4 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md cursor-pointer active:scale-95 ${
                  isDanger
                    ? 'bg-red-600 hover:bg-red-700 shadow-red-100 dark:shadow-none'
                    : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-100 dark:shadow-none'
                }`}
              >
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
