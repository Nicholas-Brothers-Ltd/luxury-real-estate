// js/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

// Environment variables
const supabaseUrl = "https://lmbpzxtpqbvnabcbjski.supabase.co";
const supabaseKey = "sb_publishable_h03m5PgrJpcQpMEFjd7MUg_YkbmNaDx";

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey);

// Auto-refresh sessions - Supabase handles this automatically
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_IN') {
    console.log('User signed in:', session?.user?.email);
  } else if (event === 'SIGNED_OUT') {
    console.log('User signed out');
  } else if (event === 'TOKEN_REFRESHED') {
    console.log('Session refreshed');
  }
});
