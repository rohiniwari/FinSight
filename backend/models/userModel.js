/**
 * userModel.js
 * Data-access layer for the profiles table.
 * All DB queries for users live here (MVC – Model layer).
 */
import { supabase } from '../config/supabase.js';

export const userModel = {
  /** Get a user's profile by their auth ID */
  async findById(userId) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    if (error) throw new Error(error.message);
    return data;
  },

  /** Create or update a profile */
  async upsert(userId, { full_name, avatar_url }) {
    const { data, error } = await supabase
      .from('profiles')
      .upsert({ id: userId, full_name, avatar_url }, { onConflict: 'id' })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  },

  /** Update profile fields */
  async update(userId, updates) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  },
};
