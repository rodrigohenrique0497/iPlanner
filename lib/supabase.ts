
import { createClient } from '@supabase/supabase-js'

// Fix: Use process.env instead of import.meta.env to resolve TypeScript 'ImportMeta' errors
export const supabase = createClient(
import.meta.env.VITE_SUPABASE_URL!,
import.meta.env.VITE_SUPABASE_ANON_KEY!
)

