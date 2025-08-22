import { useState, useEffect } from 'react'
import { PushNotificationManager } from './PwaComponents'

function InstallPrompt() {
  const [isIOS, setIsIOS] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [showInstallPrompt, setShowInstallPrompt] = useState(false)
 
  useEffect(() => {
    // Check if running on iOS
    setIsIOS(
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
    )
 
    // Check if already installed as PWA
    setIsStandalone(window.matchMedia('(display-mode: standalone)').matches)
    
    // Listen for beforeinstallprompt event (Android/Chrome)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowInstallPrompt(true)
    }
    
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])
 
  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      if (outcome === 'accepted') {
        setDeferredPrompt(null)
        setShowInstallPrompt(false)
      }
    }
  }
 
  // Don't show if already installed or no install prompt available
  if (isStandalone || (!showInstallPrompt && !isIOS)) {
    return null
  }
 
  return (
    <div className="fixed bottom-4 left-4 right-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-lg z-50">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Install Expense Tracker
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
            Get quick access to your finances
          </p>
        </div>
        
        {!isIOS && showInstallPrompt && (
          <button
            onClick={handleInstallClick}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Install
          </button>
        )}
        
        <button
          onClick={() => setShowInstallPrompt(false)}
          className="ml-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
        >
          ✕
        </button>
      </div>
      
      {isIOS && (
        <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            <strong>iOS Instructions:</strong> Tap the share button 
            <span className="mx-1">⎋</span>
            and select "Add to Home Screen"
            <span className="mx-1">➕</span>
          </p>
        </div>
      )}
    </div>
  )
}

export default function PwaComponentsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          PWA Features
        </h1>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <PushNotificationManager />
        </div>
        
        <InstallPrompt />
      </div>
    </div>
  )
}