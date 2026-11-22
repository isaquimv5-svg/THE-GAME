// Focus App - Notification and iOS Web Push Utility

export interface NotificationStatus {
  isSupported: boolean;
  permission: NotificationPermission | 'unsupported';
  isIOS: boolean;
  isStandalone: boolean;
}

// Check current notification capability and environment
export const checkNotificationSupport = (): NotificationStatus => {
  const isSupported = typeof window !== 'undefined' && 'Notification' in window;
  const userAgent = typeof window !== 'undefined' ? window.navigator.userAgent.toLowerCase() : '';
  const isIOS = /iphone|ipad|ipod/.test(userAgent);
  
  const isStandalone = typeof window !== 'undefined' && (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as unknown as { standalone?: boolean }).standalone === true
  );

  return {
    isSupported,
    permission: isSupported ? Notification.permission : 'unsupported',
    isIOS,
    isStandalone,
  };
};

// Play a gentle notification sound using Web Audio API
export const playNotificationChime = () => {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    const now = ctx.currentTime;
    
    // First pleasant chime tone
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(587.33, now); // D5
    gain1.gain.setValueAtTime(0.12, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.35);

    // Second higher tone
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(880.00, now + 0.12); // A5
    gain2.gain.setValueAtTime(0.12, now + 0.12);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.55);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.12);
    osc2.stop(now + 0.55);
  } catch (err) {
    console.warn('Audio chime error:', err);
  }
};

// Request permission - MUST be called directly from user tap/click on iOS
export const requestNotificationPermission = async (): Promise<NotificationPermission> => {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'denied';
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      playNotificationChime();
    }
    return permission;
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return 'denied';
  }
};

// Send a notification through Service Worker or native Web Notification
export const sendAppNotification = async (
  title: string,
  body: string,
  tag = 'focus-notification'
): Promise<boolean> => {
  playNotificationChime();

  if (typeof window === 'undefined' || !('Notification' in window)) {
    return false;
  }

  if (Notification.permission !== 'granted') {
    return false;
  }

  // 1. Try Service Worker first (preferred for PWA / iOS 16.4+ standalone)
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.ready;
      if (registration && registration.showNotification) {
        await registration.showNotification(title, {
          body,
          icon: '/apple-touch-icon.png',
          badge: '/favicon.png',
          tag,
          vibrate: [200, 100, 200],
          data: { url: '/' },
        } as NotificationOptions);
        return true;
      }
    } catch (e) {
      console.warn('Service worker notification failed, falling back to window.Notification', e);
    }
  }

  // 2. Fallback to standard window Notification
  try {
    new Notification(title, {
      body,
      icon: '/apple-touch-icon.png',
      badge: '/favicon.png',
      tag,
    });
    return true;
  } catch (e) {
    console.warn('Window notification failed:', e);
    return false;
  }
};
