import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('⚠️ Supabase environment variables are missing!');
  console.error('Make sure you have VITE_SUPABASE_URL and VITE_SUPABASE_KEY in your .env.local file');
}

export const supabase = createClient(supabaseUrl, supabaseKey);
