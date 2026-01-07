
import { createClient } from '@supabase/supabase-js'

// No Vite, usamos import.meta.env. 
// Certifique-se de que as variáveis no Vercel começam com VITE_
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || '',
  import.meta.env.VITE_SUPABASE_ANON_KEY || ''
)
