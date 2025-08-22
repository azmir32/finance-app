import { useState, useEffect } from "react"
import { 
  subscribeUser as subscribeUserAction, 
  unsubscribeUser as unsubscribeUserAction,
  sendTestNotification as sendTestNotificationAction,
  sendExpenseAlert,
  sendBudgetReminder,
  sendAchievementNotification,
  sendWeeklySummary
} from "../actions"

// Utility function to convert VAPID key
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - base64String.length % 4) % 4)
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/')

  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

function PushNotificationManager() {
  const [isSupported, setIsSupported] = useState(false)
  const [subscription, setSubscription] = useState<PushSubscription | null>(null)
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState<string>('')
 
  useEffect(() => {
    // Check for basic service worker support
    if ('serviceWorker' in navigator) {
      setIsSupported(true)
      registerServiceWorker()
    }
    
    // Log browser capabilities for debugging
    console.log('PWA Support Check:', {
      serviceWorker: 'serviceWorker' in navigator,
      pushManager: 'PushManager' in window,
      notifications: 'Notification' in window,
      userAgent: navigator.userAgent,
      isIOS: /iPad|iPhone|iPod/.test(navigator.userAgent),
      isSafari: /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent)
    })
  }, [])
 
  async function registerServiceWorker() {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
        updateViaCache: 'none',
      })
      const sub = await registration.pushManager.getSubscription()
      setSubscription(sub)
    } catch (error) {
      console.error('Service Worker registration failed:', error)
      setStatus('Failed to register service worker')
    }
  }
 
  async function subscribeToPush() {
    setIsLoading(true)
    setStatus('')
    
    try {
      const registration = await navigator.serviceWorker.ready
      const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
        ) as unknown as BufferSource,
      })
      setSubscription(sub)
      
      const serializedSub = JSON.parse(JSON.stringify(sub))
      const result = await subscribeUserAction(serializedSub)
      
      if (result.success) {
        setStatus('Successfully subscribed to notifications!')
      } else {
        setStatus('Failed to subscribe: ' + result.error)
      }
    } catch (error) {
      console.error('Subscription failed:', error)
      setStatus('Failed to subscribe to notifications')
    } finally {
      setIsLoading(false)
    }
  }
 
  async function unsubscribeFromPush() {
    setIsLoading(true)
    setStatus('')
    
    try {
      await subscription?.unsubscribe()
      setSubscription(null)
      
      const result = await unsubscribeUserAction()
      if (result.success) {
        setStatus('Successfully unsubscribed from notifications')
      } else {
        setStatus('Failed to unsubscribe: ' + result.error)
      }
    } catch (error) {
      console.error('Unsubscription failed:', error)
      setStatus('Failed to unsubscribe from notifications')
    } finally {
      setIsLoading(false)
    }
  }
 
  async function sendTestNotification() {
    if (!message.trim()) {
      setStatus('Please enter a message')
      return
    }
    
    setIsLoading(true)
    setStatus('')
    
    try {
      const result = await sendTestNotificationAction(message)
      if (result.success) {
        setStatus('Test notification sent successfully!')
        setMessage('')
      } else {
        setStatus('Failed to send notification: ' + result.error)
      }
    } catch (error) {
      console.error('Send notification failed:', error)
      setStatus('Failed to send test notification')
    } finally {
      setIsLoading(false)
    }
  }

  async function sendFinanceNotification(type: string) {
    setIsLoading(true)
    setStatus('')
    
    try {
      let result
      switch (type) {
        case 'expense-alert':
          result = await sendExpenseAlert(150.00, 'Food & Dining')
          break
        case 'budget-reminder':
          result = await sendBudgetReminder(75)
          break
        case 'achievement':
          result = await sendAchievementNotification('Great job staying under budget this week!')
          break
        case 'weekly-summary':
          result = await sendWeeklySummary(450.00, 200.00)
          break
        default:
          result = await sendTestNotificationAction('Finance notification test')
      }
      
      if (result.success) {
        setStatus(`${type} notification sent successfully!`)
      } else {
        setStatus(`Failed to send ${type} notification: ` + result.error)
      }
    } catch (error) {
      console.error('Send finance notification failed:', error)
      setStatus(`Failed to send ${type} notification`)
    } finally {
      setIsLoading(false)
    }
  }
 
  if (!isSupported) {
    return (
      <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
        <p className="text-yellow-800 dark:text-yellow-200">
          Service Worker is not supported in this browser. PWA features may be limited.
        </p>
      </div>
    )
  }

  // Check for push notification support separately
  const isPushSupported = 'serviceWorker' in navigator && 'PushManager' in window
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
  const isSafari = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent)
 
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          Push Notifications
        </h3>
        {subscription && (
          <span className="px-2 py-1 text-xs bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-full">
            Active
          </span>
        )}
      </div>

      {status && (
        <div className={`p-3 rounded-lg text-sm ${
          status.includes('Success') || status.includes('successfully') 
            ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200' 
            : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200'
        }`}>
          {status}
        </div>
      )}

      {subscription ? (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <p className="text-gray-700 dark:text-gray-300">
              You are subscribed to push notifications.
            </p>
            <button 
              onClick={unsubscribeFromPush}
              disabled={isLoading}
              className="px-3 py-1 text-sm bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-lg transition-colors"
            >
              {isLoading ? 'Unsubscribing...' : 'Unsubscribe'}
            </button>
          </div>
          
          {isIOS && isSafari && (
            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <p className="text-blue-800 dark:text-blue-200 text-xs">
                💡 iOS Safari: Install the app for the best push notification experience
              </p>
            </div>
          )}

          <div className="space-y-3">
            <h4 className="font-medium text-gray-900 dark:text-white">Test Notifications</h4>
            
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => sendFinanceNotification('expense-alert')}
                disabled={isLoading}
                className="px-3 py-2 text-sm bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors"
              >
                Expense Alert
              </button>
              <button
                onClick={() => sendFinanceNotification('budget-reminder')}
                disabled={isLoading}
                className="px-3 py-2 text-sm bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 text-white rounded-lg transition-colors"
              >
                Budget Reminder
              </button>
              <button
                onClick={() => sendFinanceNotification('achievement')}
                disabled={isLoading}
                className="px-3 py-2 text-sm bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded-lg transition-colors"
              >
                Achievement
              </button>
              <button
                onClick={() => sendFinanceNotification('weekly-summary')}
                disabled={isLoading}
                className="px-3 py-2 text-sm bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white rounded-lg transition-colors"
              >
                Weekly Summary
              </button>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter custom notification message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
              <button 
                onClick={sendTestNotification}
                disabled={isLoading || !message.trim()}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
              >
                {isLoading ? 'Sending...' : 'Send Test'}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {!isPushSupported && (
            <div className="p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
              <p className="text-orange-800 dark:text-orange-200 text-sm">
                {isIOS && isSafari 
                  ? "Push notifications have limited support in iOS Safari. Try installing the app for better experience."
                  : "Push notifications are not supported in this browser."
                }
              </p>
            </div>
          )}
          
          <p className="text-gray-700 dark:text-gray-300">
            Get notified about your expenses, budget alerts, and financial insights.
          </p>
          
          {isPushSupported ? (
            <button 
              onClick={subscribeToPush}
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium transition-colors"
            >
              {isLoading ? 'Subscribing...' : 'Subscribe to Notifications'}
            </button>
          ) : (
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Install the app to access all PWA features.
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export { PushNotificationManager }