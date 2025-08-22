self.addEventListener('push', function (event) {
  if (event.data) {
    const data = event.data.json()
    
    // Custom notification options based on notification type
    const getNotificationOptions = (type = 'default') => {
      const baseOptions = {
        body: data.body,
        icon: data.icon || '/icons/icon-192x192.png',
        badge: data.badge || '/icons/badge-72x72.png',
        data: {
          dateOfArrival: Date.now(),
          primaryKey: data.id || '1',
          type: type,
          url: data.url || '/',
          ...data.customData
        },
        requireInteraction: data.requireInteraction || false,
        silent: data.silent || false,
        tag: data.tag || 'expense-tracker',
        renotify: data.renotify || true,
        actions: data.actions || []
      }

      // Custom vibration patterns for different notification types
      const vibrationPatterns = {
        'expense-alert': [200, 100, 200, 100, 200], // Strong alert for expense warnings
        'budget-reminder': [100, 50, 100, 50, 100], // Medium alert for budget reminders
        'achievement': [300, 100, 300], // Celebration pattern for achievements
        'default': [100, 50, 100] // Default pattern
      }

      // Custom icons for different notification types
      const iconMap = {
        'expense-alert': '/icons/expense-alert-192x192.png',
        'budget-reminder': '/icons/budget-reminder-192x192.png',
        'achievement': '/icons/achievement-192x192.png',
        'default': '/icons/icon-192x192.png'
      }

      return {
        ...baseOptions,
        icon: data.icon || iconMap[type] || iconMap.default,
        vibrate: data.vibrate || vibrationPatterns[type] || vibrationPatterns.default,
        badge: data.badge || '/icons/badge-72x72.png'
      }
    }

    const options = getNotificationOptions(data.type)
    event.waitUntil(self.registration.showNotification(data.title, options))
  }
})

self.addEventListener('notificationclick', function (event) {
  console.log('Notification click received:', event.notification.data)
  
  // Close the notification
  event.notification.close()
  
  // Get notification data
  const notificationData = event.notification.data
  
  // Handle different notification types
  if (event.action) {
    // Handle action button clicks
    handleNotificationAction(event.action, notificationData)
  } else {
    // Handle main notification click
    handleNotificationClick(notificationData)
  }
})

function handleNotificationClick(data) {
  const urlToOpen = data.url || '/'
  
  event.waitUntil(
    clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    }).then(function (clientList) {
      // Check if there's already a window/tab open with the target URL
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i]
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus()
        }
      }
      
      // If no window/tab is open, open a new one
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen)
      }
    })
  )
}

function handleNotificationAction(action, data) {
  switch (action) {
    case 'view-expense':
      event.waitUntil(clients.openWindow('/expenses'))
      break
    case 'set-budget':
      event.waitUntil(clients.openWindow('/budget'))
      break
    case 'dismiss':
      // Just close the notification (already done)
      break
    default:
      // Default action - open main app
      handleNotificationClick(data)
  }
}