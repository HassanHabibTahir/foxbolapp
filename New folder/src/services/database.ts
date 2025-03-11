import { supabase } from '../lib/supabase';
// import type { Database } from '../lib/database.types';

// type AccountSettings = Database['public']['Tables']['account_settings']['Insert'];
// type AccountSettingsUpdate = Database['public']['Tables']['account_settings']['Update'];

export async function saveAccountSettings(
  accountId: string,
  settingsType: string,
  settingsData: unknown
): Promise<void> {
  const { data: existingSettings, error: fetchError } = await supabase
    .from('account_settings')
    .select()
    .eq('account_id', accountId)
    .eq('settings_type', settingsType)
    .single();

  if (fetchError && fetchError.code !== 'PGRST116') {
    throw new Error(`Error fetching settings: ${fetchError.message}`);
  }

  if (existingSettings) {
    const { error: updateError } = await supabase
      .from('account_settings')
      .update({ 
        settings_data: settingsData,
        updated_at: new Date().toISOString()
      } )
      .eq('id', existingSettings.id);

    if (updateError) throw new Error(`Error updating settings: ${updateError.message}`);
  } else {
    const { error: insertError } = await supabase
      .from('account_settings')
      .insert({
        account_id: accountId,
        settings_type: settingsType,
        settings_data: settingsData
      } );

    if (insertError) throw new Error(`Error inserting settings: ${insertError.message}`);
  }
}