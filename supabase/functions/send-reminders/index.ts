// Supabase Edge Function: send-reminders
// Deploy com: supabase functions deploy send-reminders

import { serve } from "https://deno.land/std@0.131.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

// IMPORTANTE: Em um cenário real, use uma biblioteca como 'ext-web-push' 
// ou chame a API de Push do Google/Apple diretamente.
// Este código ilustra a lógica de verificação de horários.

serve(async (req) => {
  try {
    const supabase = createClient(
      // Fix: Access Deno through globalThis to resolve "Cannot find name 'Deno'" on line 15
      (globalThis as any).Deno.env.get('SUPABASE_URL') ?? '',
      // Fix: Access Deno through globalThis to resolve "Cannot find name 'Deno'" on line 16
      (globalThis as any).Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // 1. Obter hora atual (Brasília)
    const now = new Date();
    const nowStr = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', hour12: false });
    const todayStr = now.toISOString().split('T')[0];

    // 2. Buscar assinaturas de push
    const { data: subscriptions } = await supabase
      .from('push_subscriptions')
      .select('user_id, subscription')

    if (!subscriptions) return new Response("Sem assinaturas", { status: 200 })

    for (const sub of subscriptions) {
      // 3. Buscar tarefas do usuário
      const { data: userData } = await supabase
        .from('user_data')
        .select('payload')
        .eq('user_id', sub.user_id)
        .eq('data_type', 'tasks')
        .single()

      if (!userData) continue;

      const tasks = userData.payload;
      const tasksToNotify = tasks.filter((t: any) => 
        !t.completed && 
        t.dueDate === todayStr && 
        t.reminder === nowStr &&
        !t.notified
      );

      for (const task of tasksToNotify) {
        // 4. Enviar Push (Aqui você dispararia para o endpoint da sub.subscription)
        console.log(`Enviando notificação para ${sub.user_id}: ${task.title}`);
        
        // Simulação de envio bem sucedido - Marcar como notificado para não repetir
        // No mundo real, você usaria web-push-js aqui.
      }
    }

    return new Response(JSON.stringify({ message: "Processado com sucesso" }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    })
  }
})