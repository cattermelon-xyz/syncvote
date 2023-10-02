const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_KEY;

const supabaseClient = {
  supabase: createClient(supabaseUrl, supabaseAnonKey),
};

const { supabase } = supabaseClient;

module.exports = {
  supabase,
};
