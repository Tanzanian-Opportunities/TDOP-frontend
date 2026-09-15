export const formatSalary = (min?: number, max?: number, currency: string = 'TZS'): string => {
  if (!min && !max) return 'Negotiable';

  const currencySymbol: Record<string, string> = {
    TZS: 'TZS',
    USD: '$',
    EUR: '€',
    GBP: '£',
  };
  const symbol = currencySymbol[currency] || currency;

  const format = (val: number) => {
    if (currency === 'TZS') return `TZS ${val.toLocaleString()}`;
    return `${symbol}${val.toLocaleString()}`;
  };

  if (min && max) {
    if (min === max) return format(min);
    return `${format(min)} - ${format(max)}`;
  }

  if (min) return `${format(min)}+`;
  return format(max as number);
};

export const formatSalaryRange = (min: number, max: number, currency: string = 'TZS'): string => {
  return formatSalary(min, max, currency);
};
