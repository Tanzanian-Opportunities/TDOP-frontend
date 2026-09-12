export const formatSalary = (min?: number, max?: number, currency: string = 'USD'): string => {
  if (!min && !max) return 'Negotiable';

  const formattedCurrency = currency === 'USD' ? '$' : currency;

  if (min && max) {
    if (min === max) {
      return `${formattedCurrency}${min.toLocaleString()}`;
    }
    return `${formattedCurrency}${min.toLocaleString()} - ${formattedCurrency}${max.toLocaleString()}`;
  }

  if (min) {
    return `${formattedCurrency}${min.toLocaleString()}+`;
  }

  return `${formattedCurrency}${(max as number).toLocaleString()}`;
};

export const formatSalaryRange = (min: number, max: number): string => {
  return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
};
