
import { createClient } from '@supabase/supabase-js'

// Fix: Use process.env for environment variables to resolve TypeScript Property 'env' does not exist error
export const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!
)