import { useState } from 'react';

export interface FormState {
  dispatch: any;
  invoice: any;
  driver: any;
  items: any;
}

const initialState: FormState = {
  dispatch: {
  },
  driver: {

  },
  invoice: {
},
  items: []
};

export const useFormState = () => {
  const [formState, setFormState] = useState<FormState>(initialState);

  const updateDispatch = (updates: Partial<FormState['dispatch']>) => {
    console.log(updates,":updates")
    setFormState(prev => ({
      ...prev,
      dispatch: { ...prev.dispatch, ...updates }
    }));
  };

  const updateInvoice = (updates: Partial<FormState['invoice']>) => {
    setFormState(prev => ({
      ...prev,
      invoice: { ...prev.invoice, ...updates }
    }));
  };

  const updateItems = (items: FormState['items']) => {
    setFormState(prev => ({
      ...prev,
      items
    }));
  };

  const resetForm = () => {
    setFormState(initialState);
  };

  const updateDriver = (updates: Partial<FormState['driver']>) => {
    setFormState(prev => ({
      ...prev,
      driver: { ...prev.driver, ...updates }
    }));
  }

  return {
    formState,
    updateDispatch,
    updateInvoice,
    updateItems,
    resetForm,
    updateDriver
  };
};