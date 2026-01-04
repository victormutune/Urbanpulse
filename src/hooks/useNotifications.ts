import { useEffect, useState, useCallback } from 'react';

interface NotificationPermission {
  permission: NotificationPermission | 'default';
  requestPermission: () => Promise<NotificationPermission>;
  showNotification: (title: string, options?: NotificationOptions) => void;
}

export function useNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = useCallback(async (): Promise<NotificationPermission> => {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return 'denied';
    }

    if (Notification.permission === 'granted') {
      setPermission('granted');
      return 'granted';
    }

    if (Notification.permission !== 'denied') {
      const result = await Notification.requestPermission();
      setPermission(result);
      return result;
    }

    return 'denied';
  }, []);

  const showNotification = useCallback(
    (title: string, options?: NotificationOptions) => {
      if (!('Notification' in window)) {
        console.warn('This browser does not support notifications');
        return;
      }

      if (Notification.permission === 'granted') {
        new Notification(title, {
          icon: '/favicon.ico',
          badge: '/favicon.ico',
          ...options,
        });
      } else if (Notification.permission === 'default') {
        requestPermission().then((perm) => {
          if (perm === 'granted') {
            new Notification(title, {
              icon: '/favicon.ico',
              badge: '/favicon.ico',
              ...options,
            });
          }
        });
      }
    },
    [requestPermission]
  );

  return {
    permission,
    requestPermission,
    showNotification,
  };
}

