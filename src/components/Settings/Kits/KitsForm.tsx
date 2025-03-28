import React, { useRef, useState, useEffect } from 'react';
import { Kit, KitFormProps, REASONS, TRANSACTION } from './types';
import TextInput from '../../base/TextInput';
import MultiSelectDropdown from '../../base/MultiSelectDropdown';

// Field length constraints based on database schema
const FIELD_MAX_LENGTHS = {
  kit: 10,
  cus: 10,
  class: 10,
  description: 255,
  itemGroup: 20,
  reason: 20,
  from: 50,
  to: 50,
  glaccount: 20,
  lotSec: 20,
  transaction: 20,
  customer: 50
};

const initialState: Kit = {
  kit: '',
  cus: '',
  class: '',
  classVal: '', // Added alternative field
  description: '',
  itemGroup: '',
  quantity: 0,
  price: 0,
  reason: [],
  from: '',
  to: '',
  glaccount: '',
  lotSec: '',
  transaction: [],
  customer: ''
};

const KitsForm: React.FC<KitFormProps> = ({ onSubmit, initialKit }) => {
  const [formData, setFormData] = useState<Kit>(initialKit || initialState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [kitEntered, setKitEntered] = useState(!!initialKit?.kit);
  const formRef = useRef<HTMLDivElement>(null);
  
  // Update form when initialKit changes
  useEffect(() => {
    if (initialKit) {
      console.log('Initializing form with kit:', initialKit);
      // Ensure itemGroup, reason, and transaction are arrays
      setFormData({
        ...initialKit,
        reason: Array.isArray(initialKit.reason)
          ? initialKit.reason
          : typeof initialKit.reason === 'string'
          ? JSON.parse(initialKit.reason || '[]')
          : [],
        transaction: Array.isArray(initialKit.transaction)
          ? initialKit.transaction
          : typeof initialKit.transaction === 'string'
          ? JSON.parse(initialKit.transaction || '[]')
          : [],
      });      
      setKitEntered(!!initialKit.kit);
    } else {
      setFormData(initialState);
      setKitEntered(false);
    }
    setErrors({});
  }, [initialKit]);
  
  // Scroll to form when editing a new kit or switching kits
  useEffect(() => {
    if (initialKit) {
      requestAnimationFrame(() => {
        const formElement = document.getElementById('kits-form-container');

        if (formElement) {
          formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    }
  }, [initialKit]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    if (name === 'price') {
      // Remove non-numeric characters (except for decimal points)
      const numericValue = value.replace(/[^0-9.]/g, '');
  
      setFormData({
        ...formData,
        price: numericValue === '' ? 0 : Number(numericValue)  // Store as a number
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
    if (type === 'checkbox' && (name === 'transaction' || name === 'reason')) {
      const currentData = Array.isArray(formData[name as keyof Kit])
        ? formData[name as keyof Kit]
        : typeof formData[name as keyof Kit] === 'string'
        ? JSON.parse((formData[name as keyof Kit] as string) || '[]')
        : [];
    
      const updatedValue = checked
        ? [...currentData, value]  // Add value to array
        : currentData.filter((item: string) => item !== value);  // Remove unchecked value
    
      setFormData({
        ...formData,
        [name]: updatedValue,
      });    
    
    } else {
      let updatedData: Kit;
      if (type === 'number') {
        updatedData = {
          ...formData,
          [name]: value === '' ? 0 : Number(value),
        };
      } else {
        updatedData = {
          ...formData,
          [name]: value,
        };

        // Handle alternative field names
        if (name === 'class') {
          updatedData.classVal = value;
        } else if (name === 'transaction') {
          updatedData.transaction = value.split(',');  // Ensure it's split into an array
        } else if (name === 'customer') {
          updatedData.customer = value;
        }
      }

      setFormData(updatedData);
    }

    if (name === 'kit') {
      setKitEntered(!!value.trim());
    }

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    // Required fields
    if (!formData.kit.trim()) newErrors.kit = 'Kit is required';
    if (!formData.cus.trim()) newErrors.cus = 'CUS is required';
    if (!formData.class.trim()) newErrors.class = 'Class is required';// Check array length
    if (formData.reason.length === 0) newErrors.reason = 'Reason is required';  // Check array length
    if (formData.transaction.length === 0) newErrors.transaction = 'Transaction is required';  // Check array length
    
    // Quantity must be positive
    if (formData.quantity <= 0) newErrors.quantity = 'Quantity must be greater than 0';
    
    // Check field length constraints
    Object.entries(FIELD_MAX_LENGTHS).forEach(([field, maxLength]) => {
      const value = formData[field as keyof Kit];
      if (typeof value === 'string' && value.length > maxLength) {
        newErrors[field] = `Maximum length is ${maxLength} characters`;
      }
    });
    
    // Show toast for validation errors
    if (Object.keys(newErrors).length > 0) {
      console.error('Please fix the form errors before submitting.');
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);

      // Ensure arrays for itemGroup, reason, transaction
      const reason = Array.isArray(formData.reason) ? formData.reason : JSON.parse(formData.reason || '[]');
      const transaction = Array.isArray(formData.transaction) ? formData.transaction : JSON.parse(formData.transaction || '[]');

      const submissionData = {
        ...formData,
        reason: reason,
        transaction: transaction,
        classVal: formData.class,
        customer: formData.customer,
      };

      if (initialKit?.id) {
        submissionData.id = initialKit.id;
        console.log('Submitting update with ID:', initialKit.id);
      } else {
        console.log('Submitting new kit (no ID)');
      }

      // Log the submission data for debugging
      console.log('Data being submitted:', submissionData);

      // Ensure data is stringified if needed (for example, sending to an API)
      const dataToSubmit = JSON.stringify(submissionData);
      console.log('Stringified submission data:', dataToSubmit);

      await onSubmit(submissionData);

      // Reset form after submission
      if (!initialKit) {
        setFormData(initialState);
        setKitEntered(false);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="kits-form-container" ref={formRef} className="bg-white shadow-lg rounded-lg p-6 border border-gray-100">
      <h2 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-3">
        {initialKit ? 'Edit Kit' : 'Add New Kit'}
      </h2>
      
      {!kitEntered && !initialKit && (
        <div className="mb-4 p-3 bg-blue-50 border-l-4 border-blue-500 text-blue-700 rounded">
          <p className="text-sm">
            <strong>Note:</strong> Please enter a Kit number first. Other fields will be enabled after a Kit number is provided.
          </p>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <TextInput
            label="Kit"
            name="kit"
            value={formData.kit || ''}
            onChange={handleChange}
            required
            error={errors.kit}
            placeholder="Enter kit number first"
            maxLength={FIELD_MAX_LENGTHS.kit}
          />
          
          <TextInput
            label="CUS"
            name="cus"
            value={formData.cus || ''}
            onChange={handleChange}
            required
            error={errors.cus}
            disabled={!kitEntered}
            maxLength={FIELD_MAX_LENGTHS.cus}
          />
          
          <TextInput
            label="Class"
            name="class"
            value={formData.class || ''}
            onChange={handleChange}
            required
            error={errors.class}
            disabled={!kitEntered}
            maxLength={FIELD_MAX_LENGTHS.class}
          />
          
        <TextInput
            label="Item Group"
            name="itemGroup"
            value={formData.itemGroup || ''}
            onChange={handleChange}
            required
            error={errors.itemGroup}
            disabled={!kitEntered}
            maxLength={FIELD_MAX_LENGTHS.itemGroup}
          />

          <TextInput
            label="Quantity"
            name="quantity"
            type="number"
            value={formData.quantity === 0 ? '' : formData.quantity.toString()}
            onChange={handleChange}
            required
            error={errors.quantity}
            disabled={!kitEntered}
          />
          
          <div className="relative">
          <span className="absolute left-3 top-[67.5%] transform -translate-y-[60%] text-gray-500">$</span>
          <TextInput
    label="Price"
    name="price"
    type="number"  // Keep it numeric for proper data handling
    value={formData.price === 0 ? '' : formData.price.toString()}
    onChange={handleChange}
    placeholder="0.00"
    disabled={!kitEntered}
  />
</div>


          
          <MultiSelectDropdown
  label="Reason"
  name="reason"
  value={Array.isArray(formData.reason) ? formData.reason : []} // Safe array check
  onChange={handleChange}
  options={REASONS}
  required
  error={errors.reason}
  disabled={!kitEntered}
/>

<MultiSelectDropdown
  label="Transaction"
  name="transaction"
  value={Array.isArray(formData.transaction) ? formData.transaction : []} // Safe array check
  onChange={handleChange}
  options={TRANSACTION}
  required
  error={errors.transaction}
  disabled={!kitEntered}
/>

          
          <TextInput
            label="From"
            name="from"
            value={formData.from || ''}
            onChange={handleChange}
            disabled={!kitEntered}
            maxLength={FIELD_MAX_LENGTHS.from}
          />
          
          <TextInput
            label="To"
            name="to"
            value={formData.to || ''}
            onChange={handleChange}
            disabled={!kitEntered}
            maxLength={FIELD_MAX_LENGTHS.to}
          />
          
          <TextInput
            label="GL Account"
            name="glaccount"
            value={formData.glaccount || ''}
            onChange={handleChange}
            disabled={!kitEntered}
            maxLength={FIELD_MAX_LENGTHS.glaccount}
          />
          
          <TextInput
            label="Lot/Sec"
            name="lotSec"
            value={formData.lotSec || ''}
            onChange={handleChange}
            disabled={!kitEntered}
            maxLength={FIELD_MAX_LENGTHS.lotSec}
          />
          
          <TextInput
            label="Customer"
            name="customer"
            value={formData.customer || ''}
            onChange={handleChange}
            disabled={!kitEntered}
            maxLength={FIELD_MAX_LENGTHS.customer}
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description || ''}
            onChange={handleChange}
            rows={3}
            disabled={!kitEntered}
            maxLength={FIELD_MAX_LENGTHS.description}
            className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full px-4 py-3 text-base border-gray-300 rounded-md hover:border-indigo-300 transition duration-200 ease-in-out ${!kitEntered ? 'bg-gray-100 cursor-not-allowed opacity-70' : ''}`}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description}</p>
          )}
        </div>
        
        <div className="mt-8">
          <button
            type="submit"
            disabled={isSubmitting || !kitEntered}
            className="w-full inline-flex justify-center py-3 px-6 border border-transparent shadow-md text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 ease-in-out"
          >
            {isSubmitting ? 'Saving...' : initialKit ? 'Update Kit' : 'Add Kit'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default KitsForm;
