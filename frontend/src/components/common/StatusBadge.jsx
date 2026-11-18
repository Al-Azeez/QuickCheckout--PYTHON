import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';

export const StatusBadge = ({ status = 'in_stock', stock = null, showIcon = true, size = 'sm' }) => {
  let colorClasses = 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800';
  let label = 'In Stock';
  let Icon = CheckCircle2;

  if (status === 'low_stock' || (stock !== null && stock > 0 && stock <= 5)) {
    colorClasses = 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800';
    label = stock ? `Low Stock (${stock} left)` : 'Low Stock';
    Icon = AlertTriangle;
  } else if (status === 'out_of_stock' || (stock !== null && stock <= 0)) {
    colorClasses = 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800';
    label = 'Out of Stock';
    Icon = XCircle;
  } else if (stock !== null) {
    label = `In Stock (${stock})`;
  }

  const sizeClasses = size === 'xs' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs md:text-sm';

  return (
    <span className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${colorClasses} ${sizeClasses}`}>
      {showIcon && <Icon className="w-3.5 h-3.5 shrink-0" />}
      <span>{label}</span>
    </span>
  );
};

export default StatusBadge;
