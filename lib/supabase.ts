
import { createClient } from '@supabase/supabase-js'

/**
 * Para evitar o erro fatal "Invalid supabaseUrl" caso as variáveis de ambiente 
 * VITE_SUPABASE_URL ou VITE_SUPABASE_ANON_KEY estejam ausentes ou vazias,
 * utilizamos fallbacks de segurança que permitem a inicialização do SDK.
 */
const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL || 'https://placeholder-url.supabase.co'
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY || 'placeholder-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
