import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { saveAccountSettings } from '../services/database';

export function useAccountSettings<T>(
  accountId: string,
  settingsType: string,
  defaultValue: T
) {
  const [settings, setSettings] = useState<T>(defaultValue);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadSettings() {
      try {
        const { data, error } = await supabase
          .from('account_settings')
          .select('settings_data')
          .eq('account_id', accountId)
          .eq('settings_type', settingsType)
          .single();

        if (error) throw error;
        setSettings(data?.settings_data as T ?? defaultValue);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    }

    loadSettings();
  }, [accountId, settingsType]);

  const saveSettings = async (newSettings: T) => {
    try {
      await saveAccountSettings(accountId, settingsType, newSettings);
      setSettings(newSettings);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      throw err;
    }
  };

  return { settings, setSettings, saveSettings, loading, error };
}