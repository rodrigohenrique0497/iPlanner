
export const notificationService = {
  requestPermission: async () => {
    if (!('Notification' in window)) return false;
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  },

  hasPermission: () => {
    return 'Notification' in window && Notification.permission === 'granted';
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
        // Verifica se a tarefa ainda existe e não foi concluída (lógica controlada no App.tsx)
        notificationService.sendLocalNotification(title, {
          body: 'Lembrete do iPlanner: Sua tarefa está agendada para agora.',
          tag: taskId
        });
      }, diff);
    }
  }
};
