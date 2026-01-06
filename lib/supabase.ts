
import { createClient } from '@supabase/supabase-js'

// No ambiente do iPlanner, as variáveis de ambiente são injetadas em process.env.
// O uso de import.meta.env é específico do Vite e não está disponível neste contexto de módulos ES puro.
const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://eyofokqspzrkzvkaaznx.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_icauM1LwnlP6BAs4V3LeRQ_pwG-eD3u';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Supabase: URL ou Anon Key não configuradas no process.env.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
