
import { supabase } from '../lib/supabase';

export const notificationService = {
  // Solicita permissão e retorna se foi concedida
  requestPermission: async () => {
    if (!('Notification' in window)) return false;
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  },

  hasPermission: () => {
    return 'Notification' in window && Notification.permission === 'granted';
  },

  // Gera a assinatura de Push do navegador
  subscribeUserToPush: async (userId: string) => {
    try {
      if (!('serviceWorker' in navigator)) return null;

      const registration = await navigator.serviceWorker.ready;
      
      // Nota: Para Push real, você precisaria de uma VAPID_PUBLIC_KEY gerada no backend
      // Aqui estamos preparando o terreno para a assinatura
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: 'BEl6zX3n9V_pXxlS_8vW2A-i-W7vH8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X' // Placeholder
      });

      // Salva no Supabase
      const { error } = await supabase
        .from('push_subscriptions')
        .upsert({
          user_id: userId,
          subscription: subscription.toJSON()
        }, { onConflict: 'user_id' });

      if (error) throw error;
      return true;
    } catch (err) {
      console.error('Erro ao assinar Push:', err);
      return false;
    }
  },

  sendLocalNotification: (title: string, options?: NotificationOptions) => {
    if (notificationService.hasPermission()) {
      new Notification(title, {
        icon: '/icon-192.png',
        badge: '/icon-192.png',
        ...options
      });
    }
  },

  scheduleNotification: (title: string, date: Date, taskId: string) => {
    const now = new Date().getTime();
    const target = date.getTime();
    const diff = target - now;

    if (diff > 0) {
      // Usando timeout para notificações locais (app aberto/background)
      setTimeout(() => {
        notificationService.sendLocalNotification(title, {
          body: 'Lembrete do iPlanner: Sua tarefa está agendada para agora.',
          tag: taskId,
          requireInteraction: true
        });
      }, diff);
    }
  }
};
