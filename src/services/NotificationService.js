/**
 * NotificationService
 * Handles browser push notifications for transit alerts and daily horoscopes.
 */

class NotificationService {
  static async requestPermission() {
    if (!('Notification' in window)) {
      console.warn('Notifications not supported in this browser.');
      return false;
    }

    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  static async registerServiceWorker() {
    if (!('serviceWorker' in navigator)) return null;

    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered with scope:', registration.scope);
      return registration;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      return null;
    }
  }

  static async scheduleTransitAlert(title, message, delayMinutes = 1) {
    if (Notification.permission !== 'granted') return;

    // In a real production app, this would be handled by a backend sending a push via FCM/VAPID.
    // For this implementation, we simulate a local scheduled notification if the tab is open,
    // or use the Service Worker for background handling.
    
    const registration = await navigator.serviceWorker.ready;
    
    // Simulate scheduling by sending a message to the SW or using the Notification API directly
    setTimeout(() => {
      registration.showNotification(title, {
        body: message,
        icon: '/favicon.png',
        badge: '/favicon.png',
        vibrate: [200, 100, 200],
        tag: 'transit-alert',
        renotify: true,
        data: {
          url: window.location.origin + '/horoscope'
        }
      });
    }, delayMinutes * 60000);
  }

  static async enableDailyAlerts() {
    const granted = await this.requestPermission();
    if (granted) {
      await this.registerServiceWorker();
      // Store preference in localStorage
      localStorage.setItem('transit_alerts_enabled', 'true');
      return true;
    }
    return false;
  }
}

export default NotificationService;
