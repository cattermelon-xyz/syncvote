import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL as string;
const supabaseAnonKey = process.env.SUPABASE_KEY as string;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export { supabase };
