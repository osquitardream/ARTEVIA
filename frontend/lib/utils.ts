import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount: number | string): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(num)) return 'S/. 0';

  return `S/. ${new Intl.NumberFormat('es-PE', {
    maximumFractionDigits: 0,
  }).format(num)}`;
}
