/**
 * Formatting utility functions
 */
import { format, formatDistance, parseISO, differenceInDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';

/**
 * Format date to readable string
 */
export const formatDate = (date, formatStr = 'dd/MM/yyyy') => {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, formatStr, { locale: ptBR });
};

/**
 * Format date and time
 */
export const formatDateTime = (date) => {
  return formatDate(date, "dd/MM/yyyy 'at' HH:mm");
};

/**
 * Format time only
 */
export const formatTime = (date) => {
  return formatDate(date, 'HH:mm');
};

/**
 * Format relative time (e.g., "3 days ago")
 */
export const formatRelativeTime = (date) => {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return formatDistance(dateObj, new Date(), { addSuffix: true, locale: ptBR });
};

/**
 * Format price/currency
 */
export const formatCurrency = (amount, currency = 'BRL') => {
  if (amount === null || amount === undefined || amount === '') return '';
  const n = Number(amount);
  if (Number.isNaN(n)) return '';

  // Format as Euro, no grouping (no thousands separators). Keep up to 2 decimals.
  // If value is whole number, drop decimals.
  let formatted = n.toFixed(2);
  // Remove trailing .00 for whole numbers
  formatted = formatted.replace(/\.00$/, '');

  // Ensure there's no grouping commas — toFixed doesn't include grouping
  return `€${formatted}`;
};

/**
 * Format number with thousands separator
 */
export const formatNumber = (number) => {
  return new Intl.NumberFormat('pt-BR').format(number);
};

/**
 * Calculate number of nights between dates
 */
export const calculateNights = (checkIn, checkOut) => {
  const checkInDate = typeof checkIn === 'string' ? parseISO(checkIn) : checkIn;
  const checkOutDate = typeof checkOut === 'string' ? parseISO(checkOut) : checkOut;
  return differenceInDays(checkOutDate, checkInDate);
};

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Format phone number
 */
export const formatPhone = (phone) => {
  if (!phone) return '';
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.length === 11) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
  } else if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
  }
  
  return phone;
};

/**
 * Get initials from name
 */
export const getInitials = (name) => {
  if (!name) return '';
  const words = name.split(' ');
  if (words.length >= 2) {
    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

/**
 * Format file size
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Generate random ID
 */
export const generateId = () => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

