import React, { useEffect, useState, useMemo } from 'react';
import { Loader2 } from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';
import { supabase } from '../../../lib/supabase';
import countryList from 'react-select-country-list';

interface CompanySetup {
  company: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  timezone: string;
  country: string;
  email: string;
  phone: string;
  fax: string;
  ca_number: string;
  usdot: string;
  vehicle_locator_enabled: boolean;
  include_price: boolean;
  hostname: string;
  notes: string;
}

interface ValidationErrors {
  id?: string;
  company?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  timezone?: string;
  country?: string;
  email?: string;
  phone?: string;
  fax?: string;
  hostname?: string;
  ca_number?: string;
  usdot?: string;
  notes?: string;
}

const initialState: CompanySetup = {
  company: '',
  address: '',
  city: '',
  state: '',
  zip: '',
  timezone: '',
  country: '',
  email: '',
  phone: '',
  fax: '',
  ca_number: '',
  usdot: '',
  vehicle_locator_enabled: false,
  include_price: false,
  hostname: '',
  notes: ''
};

const timezones = [
  { value: 'GMT-12:00', label: '(GMT-12:00) International Date Line West' },
  { value: 'GMT-11:00', label: '(GMT-11:00) Midway Island, Samoa' },
  { value: 'GMT-10:00', label: '(GMT-10:00) Hawaii' },
  { value: 'GMT-09:00', label: '(GMT-09:00) Alaska' },
  { value: 'GMT-08:00', label: '(GMT-08:00) Pacific Time (US & Canada)' },
  { value: 'GMT-07:00', label: '(GMT-07:00) Mountain Time (US & Canada)' },
  { value: 'GMT-06:00', label: '(GMT-06:00) Central Time (US & Canada)' },
  { value: 'GMT-05:00', label: '(GMT-05:00) Eastern Time (US & Canada)' },
  { value: 'GMT-04:00', label: '(GMT-04:00) Atlantic Time (Canada)' },
  { value: 'GMT-03:30', label: '(GMT-03:30) Newfoundland' },
  { value: 'GMT-03:00', label: '(GMT-03:00) Brasilia' },
  { value: 'GMT-02:00', label: '(GMT-02:00) Mid-Atlantic' },
  { value: 'GMT-01:00', label: '(GMT-01:00) Azores' },
  { value: 'GMT+00:00', label: '(GMT+00:00) London, Dublin, Edinburgh' },
  { value: 'GMT+01:00', label: '(GMT+01:00) Paris, Amsterdam, Berlin' },
  { value: 'GMT+02:00', label: '(GMT+02:00) Cairo, Jerusalem' },
  { value: 'GMT+03:00', label: '(GMT+03:00) Moscow, Baghdad' },
  { value: 'GMT+03:30', label: '(GMT+03:30) Tehran' },
  { value: 'GMT+04:00', label: '(GMT+04:00) Abu Dhabi, Dubai' },
  { value: 'GMT+04:30', label: '(GMT+04:30) Kabul' },
  { value: 'GMT+05:00', label: '(GMT+05:00) Islamabad, Karachi' },
  { value: 'GMT+05:30', label: '(GMT+05:30) New Delhi, Mumbai' },
  { value: 'GMT+05:45', label: '(GMT+05:45) Kathmandu' },
  { value: 'GMT+06:00', label: '(GMT+06:00) Dhaka' },
  { value: 'GMT+06:30', label: '(GMT+06:30) Yangon' },
  { value: 'GMT+07:00', label: '(GMT+07:00) Bangkok, Jakarta' },
  { value: 'GMT+08:00', label: '(GMT+08:00) Hong Kong, Singapore' },
  { value: 'GMT+09:00', label: '(GMT+09:00) Tokyo, Seoul' },
  { value: 'GMT+09:30', label: '(GMT+09:30) Adelaide, Darwin' },
  { value: 'GMT+10:00', label: '(GMT+10:00) Sydney, Melbourne' },
  { value: 'GMT+11:00', label: '(GMT+11:00) Solomon Islands' },
  { value: 'GMT+12:00', label: '(GMT+12:00) Auckland, Wellington' }
];

const CompanyProfilePage = () => {
  const [formData, setFormData] = useState<CompanySetup>(initialState);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const countries = useMemo(() => countryList().getData(), []);

  useEffect(() => {
    fetchCompanySetup();
  }, []);

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    // Required fields validation
    if (!formData.company.trim()) {
      newErrors.company = 'Company name is required';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }

    if (!formData.state.trim()) {
      newErrors.state = 'State is required';
    }

    if (!formData.zip.trim()) {
      newErrors.zip = 'ZIP code is required';
    } else if (!/^\d{5}(-\d{4})?$/.test(formData.zip)) {
      newErrors.zip = 'Invalid ZIP code format';
    }

    if (!formData.timezone) {
      newErrors.timezone = 'Timezone is required';
    }

    if (!formData.country) {
      newErrors.country = 'Country is required';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    // Phone validation
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?[\d\s-()]{10,}$/.test(formData.phone)) {
      newErrors.phone = 'Invalid phone number format';
    }

    // Fax validation
    if (!formData.fax.trim()) {
      newErrors.fax = 'Fax number is required';
    } else if (!/^\+?[\d\s-()]{10,}$/.test(formData.fax)) {
      newErrors.fax = 'Invalid fax number format';
    }

    // CA number validation
    if (!formData.ca_number.trim()) {
      newErrors.ca_number = 'CA number is required';
    }

    // USDOT validation
    if (!formData.usdot.trim()) {
      newErrors.usdot = 'USDOT number is required';
    }

    // Notes validation
    if (!formData.notes.trim()) {
      newErrors.notes = 'Notes are required';
    }

    // Hostname validation
    if (formData.vehicle_locator_enabled && !formData.hostname.trim()) {
      newErrors.hostname = 'Hostname is required when vehicle locator is enabled';
    } else if (formData.hostname.trim() && !/^[a-zA-Z0-9-]+$/.test(formData.hostname)) {
      newErrors.hostname = 'Hostname can only contain letters, numbers, and hyphens';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const fetchCompanySetup = async () => {
    try {
      const companyId = localStorage.getItem('foxtow_id');
      
      if (!companyId) {
        throw new Error('Company ID not found');
      }

      const { data, error } = await supabase
        .from('setup')
        .select('*')
        .eq('company', companyId)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setFormData(data);
      }
    } catch (error) {
      console.error('Error fetching company setup:', error);
      toast.error('Failed to load company data');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const newValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));

    // Clear error when user starts typing
    if (errors[name as keyof ValidationErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the errors before submitting');
      return;
    }

    setSaving(true);

    try {
      const companyId = localStorage.getItem('foxtow_id');
      
      if (!companyId) {
        throw new Error('Company ID not found');
      }

      const { error } = await supabase
        .from('setup')
        .upsert({
          ...formData,
          company: companyId,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
      toast.success('Company profile updated successfully');
    } catch (error) {
      console.error('Error saving company setup:', error);
      toast.error('Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  const inputClassName = (fieldName: keyof ValidationErrors) => `
    mt-1 block w-full rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500
    ${errors[fieldName] ? 'border-red-300' : 'border-gray-300'}
  `;

  return (
    <div className="bg-white rounded-lg shadow p-6 max-w-7xl mx-auto my-8">
      <Toaster position="top-right" />
      <h1 className="text-xl font-semibold mb-2">Company Profile</h1>
      <p className="text-gray-600 mb-6">Please fill out your company's basic information such as Name, Address etc.</p>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Company Information Section */}
          <div className="space-y-4">
            <div>
              <label htmlFor="company" className="block text-sm font-medium text-gray-700">
                Company Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="company"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                className={inputClassName('company')}
                required
              />
              {errors.company && (
                <p className="mt-1 text-sm text-red-600">{errors.company}</p>
              )}
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                Address <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className={inputClassName('address')}
                required
              />
              {errors.address && (
                <p className="mt-1 text-sm text-red-600">{errors.address}</p>
              )}
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className={inputClassName('city')}
                  required
                />
                {errors.city && (
                  <p className="mt-1 text-sm text-red-600">{errors.city}</p>
                )}
              </div>
              <div>
                <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                  State <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  className={inputClassName('state')}
                  required
                />
                {errors.state && (
                  <p className="mt-1 text-sm text-red-600">{errors.state}</p>
                )}
              </div>
              <div>
                <label htmlFor="zip" className="block text-sm font-medium text-gray-700">
                  ZIP <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="zip"
                  name="zip"
                  value={formData.zip}
                  onChange={handleInputChange}
                  className={inputClassName('zip')}
                  required
                />
                {errors.zip && (
                  <p className="mt-1 text-sm text-red-600">{errors.zip}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="timezone" className="block text-sm font-medium text-gray-700">
                  Time zone <span className="text-red-500">*</span>
                </label>
                <select
                  id="timezone"
                  name="timezone"
                  value={formData.timezone}
                  onChange={handleInputChange}
                  className={inputClassName('timezone')}
                  required
                >
                  <option value="">Select timezone</option>
                  {timezones.map(({ value, label }) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
                {errors.timezone && (
                  <p className="mt-1 text-sm text-red-600">{errors.timezone}</p>
                )}
              </div>
              <div>
                <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                  Country <span className="text-red-500">*</span>
                </label>
                <select
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className={inputClassName('country')}
                  required
                >
                  <option value="">Select country</option>
                  {countries.map(({ value, label }: { value: any, label: any }) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
                {errors.country && (
                  <p className="mt-1 text-sm text-red-600">{errors.country}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={inputClassName('email')}
                required
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Phone <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={inputClassName('phone')}
                  required
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                )}
              </div>
              <div>
                <label htmlFor="fax" className="block text-sm font-medium text-gray-700">
                  Fax <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  id="fax"
                  name="fax"
                  value={formData.fax}
                  onChange={handleInputChange}
                  className={inputClassName('fax')}
                  required
                />
                {errors.fax && (
                  <p className="mt-1 text-sm text-red-600">{errors.fax}</p>
                )}
              </div>
            </div>
          </div>

          {/* License Information and Vehicle Locator Section */}
          <div className="space-y-8">
            {/* License Information */}
            <div>
              <h2 className="text-lg font-semibold mb-4">License Information</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="ca_number" className="block text-sm font-medium text-gray-700">
                    CA# <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="ca_number"
                    name="ca_number"
                    value={formData.ca_number}
                    onChange={handleInputChange}
                    className={inputClassName('ca_number')}
                    required
                  />
                  {errors.ca_number && (
                    <p className="mt-1 text-sm text-red-600">{errors.ca_number}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="usdot" className="block text-sm font-medium text-gray-700">
                    USDOT <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="usdot"
                    name="usdot"
                    value={formData.usdot}
                    onChange={handleInputChange}
                    className={inputClassName('usdot')}
                    required
                  />
                  {errors.usdot && (
                    <p className="mt-1 text-sm text-red-600">{errors.usdot}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Vehicle Locator */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Vehicle Locator</h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-8">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="vehicle_locator_enabled"
                      checked={formData.vehicle_locator_enabled}
                      onChange={handleInputChange}
                      className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Enable Vehicle Locator</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="include_price"
                      checked={formData.include_price}
                      onChange={handleInputChange}
                      className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Include Price</span>
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <div className="flex-1">
                    <label htmlFor="hostname" className="block text-sm font-medium text-gray-700">
                      Hostname
                      {formData.vehicle_locator_enabled && <span className="text-red-500">*</span>}
                    </label>
                    <input
                      type="text"
                      id="hostname"
                      name="hostname"
                      value={formData.hostname}
                      onChange={handleInputChange}
                      className={inputClassName('hostname')}
                      required={formData.vehicle_locator_enabled}
                    />
                    {errors.hostname && (
                      <p className="mt-1 text-sm text-red-600">{errors.hostname}</p>
                    )}
                  </div>
                  <span className="mt-7 text-gray-500">.towbook.net</span>
                </div>

                <div>
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                    Notes <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    rows={4}
                    value={formData.notes}
                    onChange={handleInputChange}
                    className={inputClassName('notes')}
                    required
                  />
                  {errors.notes && (
                    <p className="mt-1 text-sm text-red-600">{errors.notes}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>{saving ? 'Saving...' : 'Save changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default CompanyProfilePage;