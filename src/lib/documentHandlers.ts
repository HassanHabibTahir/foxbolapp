import { supabase } from './supabase';
import { v4 as uuidv4 } from 'uuid';

export const uploadDocument = async (dispatchId: string, file: File) => {
  try {
    const docId = uuidv4();
    const fileExt = file.name.split('.').pop();
    const fileName = `${docId}.${fileExt}`;
    const filePath = `documents/${dispatchId}/${fileName}`;

    // Upload document
    const { error: uploadError } = await supabase.storage
      .from('dispatch-documents')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('dispatch-documents')
      .getPublicUrl(filePath);

    // Create database record
    const { data: document, error: dbError } = await supabase
      .from('dispatch_documents')
      .insert({
        id: docId,
        dispatch_id: dispatchId,
        file_url: publicUrl,
        file_name: file.name,
        file_type: file.type,
        file_size: file.size
      })
      .select()
      .single();

    if (dbError) throw dbError;

    return { 
      success: true, 
      document: {
        id: docId,
        url: publicUrl,
        name: file.name
      }
    };
  } catch (error) {
    console.error('Document upload error:', error);
    return { success: false, error };
  }
};