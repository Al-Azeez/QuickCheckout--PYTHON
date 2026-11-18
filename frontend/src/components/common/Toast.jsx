import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export const Toast = () => {
  const { notification, showToast } = useCart();

  if (!notification) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />,
    info: <Info className="w-5 h-5 text-blue-500 shrink-0" />,
  };

  const borderStyles = {
    success: 'border-emerald-200 dark:border-emerald-800 bg-white dark:bg-slate-900',
    error: 'border-rose-200 dark:border-rose-800 bg-white dark:bg-slate-900',
    info: 'border-blue-200 dark:border-blue-800 bg-white dark:bg-slate-900',
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 pointer-events-none">
      <AnimatePresence>
        <motion.div
          key={notification.id}
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl border shadow-xl max-w-md ${borderStyles[notification.type] || borderStyles.info}`}
        >
          {icons[notification.type] || icons.info}
          <p className="text-sm font-medium text-slate-800 dark:text-slate-100 flex-1">
            {notification.message}
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Toast;
