import { useState } from 'react';
import { invoiceSchema, type InvoiceFormData } from '../lib/validation/invoiceValidation';

export const useInvoiceForm = (initialData?: Partial<InvoiceFormData>) => {
  const [formData, setFormData] = useState<Partial<InvoiceFormData>>(initialData || {});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    try {
      invoiceSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof Error) {
        const validationErrors = JSON.parse(error.message);
        setErrors(validationErrors);
      }
      return false;
    }
  };

  const handleChange = (field: keyof InvoiceFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when field is modified
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return {
    formData,
    errors,
    validate,
    handleChange
  };
};