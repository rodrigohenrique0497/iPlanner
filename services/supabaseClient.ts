import { createClient } from '@supabase/supabase-js';

// Prioriza variáveis de ambiente do Netlify/Vite, cai no fallback se não existirem
// Fix: use process.env instead of import.meta.env to resolve 'Property env does not exist on type ImportMeta' errors
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://qzhmybrfxwiocrzdhuet.supabase.co';
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_F-w651vMJsA3bdfIN6lsng_Af0U59Fy';

export const supabase = (SUPABASE_URL && SUPABASE_ANON_KEY) 
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) 
  : null;
