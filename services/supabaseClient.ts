
import { createClient } from '@supabase/supabase-js';

// Credenciais fornecidas pelo usuário
const supabaseUrl = 'https://qzhmybrfxwiocrzdhuet.supabase.co';
const supabaseAnonKey = 'sb_publishable_F-w651vMJsA3bdfIN6lsng_Af0U59Fy';

// Inicializa o cliente apenas se as credenciais existirem para evitar o erro "supabaseUrl is required"
// O uso de 'createClient' exige que os parâmetros não sejam nulos ou vazios.
export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;
