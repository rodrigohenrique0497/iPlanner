import { createClient } from '@supabase/supabase-js';

// Credenciais fornecidas para o projeto iPlanner
const SUPABASE_URL = 'https://qzhmybrfxwiocrzdhuet.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_F-w651vMJsA3bdfIN6lsng_Af0U59Fy';

/**
 * Inicializa o cliente do Supabase.
 * Nota: No ambiente de navegador direto (ESM), usamos as constantes 
 * para garantir que o cliente seja criado sem depender de variáveis de processo.
 */
export const supabase = (SUPABASE_URL && SUPABASE_ANON_KEY) 
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) 
  : null;
