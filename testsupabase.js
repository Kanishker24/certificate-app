// testSupabase.js
import { createClient } from '@supabase/supabase-js';

// Replace these with your actual Supabase project URL and anon key
const SUPABASE_URL = 'https://csnxveuabktfsopkeyne.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNzbnh2ZXVhYmt0ZnNvcGtleW5lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzNjU5MTUsImV4cCI6MjA2Mzk0MTkxNX0.q-lHlBOZKOK10uZYAh8hXllGbFd3-gXz-kMiOOagLww';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function testConnection() {
  try {
    // Example: fetch some data from a public table
    const { data, error } = await supabase.from('your_table_name').select('*').limit(1);

    if (error) {
      console.error('Error fetching data:', error);
    } else {
      console.log('Connection successful, sample data:', data);
    }
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

testConnection();