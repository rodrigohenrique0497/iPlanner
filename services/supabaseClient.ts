
import { createClient } from '@supabase/supabase-js';

// No ambiente de produção, estas variáveis devem ser configuradas nas "Environment Variables" do seu host
const supabaseUrl = process.env.SUPABASE_URL || 'https://seu-projeto.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'sua-chave-anon-aqui';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
