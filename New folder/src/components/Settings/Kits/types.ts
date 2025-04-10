export interface Kit {
    id?: number;
    kit: string;
    cus: string;
    class: string;
    description: string;
    itemGroup: string;
    quantity: number;
    price: number;
    reason: string[];
    from: string;
    to: string;
    glaccount: string;
    lotSec: string;
    transaction: string[];
    customer: string;
    classVal?: string; // Added as alternative field name
    created_at?: string;
    updated_at?: string;
  }
  
  export interface KitFormProps {
    onSubmit: (kit: Kit) => Promise<void>;
    initialKit?: Kit;
  }
  
  export interface KitsListProps {
    kits: Kit[];
    onEdit: (kit: Kit) => void;
    onDelete: (id: string) => void;
  }
  
  export interface KitsSearchProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    onClearSearch: () => void;
  }
  
  // Constants for select options
  export const ITEM_GROUPS = [
    'Electrical',
    'Plumbing',
    'HVAC',
    'Structural',
    'Finishing',
    'Roofing',
    'Flooring',
    'Appliances',
    'Fixtures',
    'Hardware'
  ];
  
  export const REASONS = [
    'Autoinvdate',
    'Callactnumisbill',
    'Poisinvnum',
    'Autoacctmonth',
    'Autoinvnum',
    'Other'
  ];
  
  export const TRANSACTION = [
    'Transport',
    'Use Reason',
    'Autorelease',
    'Taxable',
    'Autoinsert',
    'Commision'    
  ];
  
  