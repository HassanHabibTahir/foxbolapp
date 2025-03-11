import { useState, useCallback } from 'react';

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unit_price: number;
  amount: number;
}

export const useInvoiceItems = (initialItems: InvoiceItem[] = []) => {
  const [items, setItems] = useState<InvoiceItem[]>(initialItems);

  const addItem = useCallback((item: Omit<InvoiceItem, 'id' | 'amount'>) => {
    const amount = item.quantity * item.unit_price;
    setItems(prev => [...prev, {
      ...item,
      id: crypto.randomUUID(),
      amount
    }]);
  }, []);

  const updateItem = useCallback((id: string, updates: Partial<InvoiceItem>) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        const updated = { ...item, ...updates };
        // Recalculate amount if quantity or price changed
        if ('quantity' in updates || 'unit_price' in updates) {
          updated.amount = updated.quantity * updated.unit_price;
        }
        return updated;
      }
      return item;
    }));
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  }, []);

  const calculateTotals = useCallback(() => {
    const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
    return {
      subtotal,
      tax: subtotal * 0.0825, // 8.25% tax rate
      total: subtotal * 1.0825
    };
  }, [items]);

  return {
    items,
    addItem,
    updateItem,
    removeItem,
    calculateTotals
  };
};