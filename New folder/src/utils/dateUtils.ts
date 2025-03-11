// Date formatting and validation utilities
export const formatShortDate = (input: string): string => {
  const numbers = input.replace(/\D/g, '').slice(0, 6);
  if (numbers.length >= 4) {
    const month = numbers.slice(0, 2);
    const day = numbers.slice(2, 4);
    const year = numbers.slice(4);
    return `${month}/${day}/${year}`;
  } else if (numbers.length >= 2) {
    const month = numbers.slice(0, 2);
    const rest = numbers.slice(2);
    return `${month}/${rest}`;
  }
  return numbers;
};

export const validateDate = (month: number, day: number): boolean => {
  if (month < 1 || month > 12) return false;
  if (day < 1 || day > 31) return false;
  
  // Check days in month
  const daysInMonth = new Date(2000, month, 0).getDate();
  return day <= daysInMonth;
};

export const getCurrentCentury = (): string => {
  return Math.floor(new Date().getFullYear() / 100) * 100;
};