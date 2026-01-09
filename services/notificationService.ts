
import { supabase } from '../lib/supabase';

export const notificationService = {
  // Chave pública VAPID (Exemplo gerado para o iPlanner)
  VAPID_PUBLIC_KEY: 'BEl6zX3n9V_pXxlS_8vW2A-i-W7vH8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X',

  requestPermission: async () => {
    if (!('Notification' in window)) return false;
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  },

  hasPermission: () => {
    return 'Notification' in window && Notification.permission === 'granted';
  },

  subscribeUserToPush: async (userId: string) => {
    try {
      if (!('serviceWorker' in navigator)) return false;

      const registration = await navigator.serviceWorker.ready;
      
      // Converte a chave VAPID de base64 para Uint8Array
      const subscribeOptions = {
        userVisibleOnly: true,
        applicationServerKey: notificationService.VAPID_PUBLIC_KEY
      };

      const subscription = await registration.pushManager.subscribe(subscribeOptions);

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

  // Método para testar a integração imediatamente
  testPushNow: async (userId: string) => {
    const { data, error } = await supabase.functions.invoke('send-reminders', {
      body: { test: true, userId }
    });
    return { data, error };
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
