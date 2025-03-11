export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

export const formatDate = (date: Date | string): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(new Date(date));
};

export const formatAddress = (
  address1?: string,
  address2?: string,
  city?: string,
  state?: string,
  zip?: string
): string => {
  const parts = [
    address1,
    address2,
    [city, state, zip].filter(Boolean).join(' ')
  ].filter(Boolean);
  
  return parts.join('\n');
};