// Standard field size definitions based on content type
export const fieldSizes = {
  // Basic sizes in characters
  dispatch: '8ch',    // e.g., "12345678"
  vin: '20ch',        // 17 chars + some padding
  plate: '10ch',      // e.g., "ABC-1234"
  phone: '14ch',      // e.g., "(123) 456-7890"
  zip: '7ch',         // e.g., "12345"
  state: '4ch',       // e.g., "TX"
  time: '7ch',        // e.g., "13:45"
  date: '10ch',       // e.g., "01/31/2024"
  money: '12ch',      // e.g., "$12,345.00"
  year: '6ch',        // e.g., "2024"
  
  // Specific field sizes
  memberNum: '12ch',  // Member numbers
  poNumber: '15ch',   // Purchase order numbers
  name: '30ch',       // Names
  address: '40ch',    // Street addresses
  city: '20ch',       // City names
  notes: '50ch',      // General notes/comments
  xl: '24rem',
  // Special cases
  full: '100%',       // Full width
  auto: 'auto'        // Auto width
};

// Convert size to Tailwind class
export const getSizeClass = (size: keyof typeof fieldSizes) => {
  const width = fieldSizes[size];
  return `w-[${width}]`;
};