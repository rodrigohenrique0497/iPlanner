// NOTA: Estas variáveis devem ser configuradas no seu ambiente de deployment.
// Se estiver usando localmente, substitua pelos valores do seu projeto Supabase.

import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
)

