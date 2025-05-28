import { createClient } from '@supabase/supabase-js'

// Replace these with your actual Supabase project credentials
// You can find these in your Supabase project settings
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://csnxveuabktfsopkeyne.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNzbnh2ZXVhYmt0ZnNvcGtleW5lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzNjU5MTUsImV4cCI6MjA2Mzk0MTkxNX0.q-lHlBOZKOK10uZYAh8hXllGbFd3-gXz-kMiOOagLww'

// Create a safe client that won't crash if credentials are missing
let supabase: any = null

try {
  if (supabaseUrl !== 'https://csnxveuabktfsopkeyne.supabase.co' && supabaseAnonKey !== 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNzbnh2ZXVhYmt0ZnNvcGtleW5lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzNjU5MTUsImV4cCI6MjA2Mzk0MTkxNX0.q-lHlBOZKOK10uZYAh8hXllGbFd3-gXz-kMiOOagLww') {
    supabase = createClient(supabaseUrl, supabaseAnonKey)
  } else {
    console.warn('Supabase credentials not configured. Please set up your Supabase project.')
    
    // Create a proper chainable mock client for development
    const createMockQuery = () => {
      const mockQuery = {
        select: () => mockQuery,
        insert: () => mockQuery,
        update: () => mockQuery,
        delete: () => mockQuery,
        order: () => mockQuery,
        eq: () => mockQuery,
        single: () => Promise.resolve({ data: null, error: null }),
        then: (resolve: any) => resolve({ data: [], error: null })
      };
      return mockQuery;
    };

    supabase = {
      from: () => createMockQuery(),
      storage: {
        from: () => ({
          upload: () => Promise.resolve({ error: null }),
          getPublicUrl: () => ({ data: { publicUrl: '#' } })
        })
      }
    }
  }
} catch (error) {
  console.error('Failed to initialize Supabase client:', error)
  
  // Fallback chainable mock client
  const createMockQuery = () => {
    const mockQuery = {
      select: () => mockQuery,
      insert: () => mockQuery,
      update: () => mockQuery,
      delete: () => mockQuery,
      order: () => mockQuery,
      eq: () => mockQuery,
      single: () => Promise.resolve({ data: null, error: null }),
      then: (resolve: any) => resolve({ data: [], error: null })
    };
    return mockQuery;
  };

  supabase = {
    from: () => createMockQuery(),
    storage: {
      from: () => ({
        upload: () => Promise.resolve({ error: null }),
        getPublicUrl: () => ({ data: { publicUrl: '#' } })
      })
    }
  }
}

export { supabase }

// Database types
export interface Video {
  id: string
  title: string
  url: string
  description?: string
  uploaded_by?: string
  created_at: string
}

export interface Certificate {
  id: string
  user_id: string
  video_id: string
  cert_url: string
  issued_at: string
}

export interface Progress {
  id: string
  user_id: string
  video_id: string
  completed: boolean
  completed_at?: string
}