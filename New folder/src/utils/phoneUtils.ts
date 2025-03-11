// Phone number formatting utilities
export const formatUSPhone = (input: string): string => {
  const numbers = input.replace(/\D/g, '').slice(0, 10);
  if (numbers.length >= 6) {
    return `(${numbers.slice(0, 3)}) ${numbers.slice(3, 6)}-${numbers.slice(6)}`;
  } else if (numbers.length >= 3) {
    return `(${numbers.slice(0, 3)}) ${numbers.slice(3)}`;
  }
  return numbers;
};

export const formatInternationalPhone = (input: string): string => {
  const numbers = input.replace(/\D/g, '');
  if (numbers.length > 0) {
    return '+' + numbers.slice(0, 15).replace(/(\d{3})(?=\d)/g, '$1 ').trim();
  }
  return '';
};

export const validatePhone = (phone: string, format: 'US' | 'INTL'): boolean => {
  const numbers = phone.replace(/\D/g, '');
  if (format === 'US') {
    return numbers.length === 10;
  }
  // International numbers can be between 8 and 15 digits
  return numbers.length >= 8 && numbers.length <= 15;
};