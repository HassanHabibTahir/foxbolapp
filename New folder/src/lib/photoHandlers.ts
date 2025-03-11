import { supabase } from './supabase';
import { v4 as uuidv4 } from 'uuid';

export const uploadPhoto = async (dispatchId: string, photoBlob: Blob) => {
  try {
    const photoId = uuidv4();
    const photoPath = `photos/${dispatchId}/${photoId}.jpg`;
    const thumbnailPath = `photos/${dispatchId}/${photoId}_thumb.jpg`;

    // Upload original photo
    const { error: uploadError } = await supabase.storage
      .from('vehicle-photos')
      .upload(photoPath, photoBlob);

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: { publicUrl: photoUrl } } = supabase.storage
      .from('vehicle-photos')
      .getPublicUrl(photoPath);

    // Create database record
    const { data: photo, error: dbError } = await supabase
      .from('vehicle_photos')
      .insert({
        id: photoId,
        dispatch_id: dispatchId,
        photo_url: photoUrl,
        order: 0
      })
      .select()
      .single();

    if (dbError) throw dbError;

    return { success: true, photo };
  } catch (error) {
    console.error('Photo upload error:', error);
    return { success: false, error };
  }
};

export const deletePhoto = async (photoId: string) => {
  try {
    const { error } = await supabase
      .from('vehicle_photos')
      .delete()
      .eq('id', photoId);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Photo delete error:', error);
    return { success: false, error };
  }
};