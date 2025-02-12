import { z } from 'zod';

export const invoiceSchema = z.object({
  invoice_number: z.string().min(1, 'Invoice number is required'),
  customer: z.object({
    name: z.string().min(1, 'Customer name is required'),
    address: z.string().min(1, 'Address is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().length(2, 'State must be 2 characters'),
    zip: z.string().regex(/^\d{5}(-\d{4})?$/, 'Invalid zip code')
  }),
  items: z.array(z.object({
    description: z.string().min(1, 'Description is required'),
    quantity: z.number().positive('Quantity must be positive'),
    unit_price: z.number().nonnegative('Price must be non-negative')
  })).min(1, 'At least one item is required')
});

export type InvoiceFormData = z.infer<typeof invoiceSchema>;