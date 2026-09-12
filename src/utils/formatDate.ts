import { format, formatDistanceToNow, parseISO, isValid } from 'date-fns';

export const formatDate = (date: string | Date, formatStr: string = 'MMM d, yyyy'): string => {
  try {
    const parsed = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(parsed)) return 'Invalid date';
    return format(parsed, formatStr);
  } catch {
    return 'Invalid date';
  }
};

export const formatRelativeDate = (date: string | Date): string => {
  try {
    const parsed = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(parsed)) return 'Invalid date';
    return formatDistanceToNow(parsed, { addSuffix: true });
  } catch {
    return 'Invalid date';
  }
};

export const formatDateRange = (startDate: string, endDate: string): string => {
  const start = formatDate(startDate, 'MMM d, yyyy');
  const end = formatDate(endDate, 'MMM d, yyyy');
  return `${start} - ${end}`;
};
