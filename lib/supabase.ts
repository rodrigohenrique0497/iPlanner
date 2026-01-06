
import { createClient } from '@supabase/supabase-js';

// NOTA: Estas variáveis devem ser configuradas no seu ambiente de deployment.
// Se estiver usando localmente, substitua pelos valores do seu projeto Supabase.
const supabaseUrl = process.env.SUPABASE_URL || 'https://sua-url-do-supabase.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'sua-chave-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
