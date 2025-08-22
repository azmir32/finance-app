'use client'

import { useState } from 'react'

export default function PwaTestButton() {
  const [testResults, setTestResults] = useState<string[]>([])
  const [isRunning, setIsRunning] = useState(false)

  const runPwaTests = async () => {
    setIsRunning(true)
    setTestResults([])
    
    const results: string[] = []
    
    // Capture console.log output
    const originalLog = console.log
    console.log = (...args) => {
      results.push(args.join(' '))
      originalLog.apply(console, args)
    }

    try {
      // Test 1: Service Worker
      results.push('🔍 Testing Service Worker...')
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.getRegistration()
        if (registration) {
          results.push('✅ Service Worker is registered')
        } else {
          results.push('❌ No Service Worker registration found')
        }
      } else {
        results.push('❌ Service Worker not supported')
      }

      // Test 2: Manifest
      results.push('\n🔍 Testing Web App Manifest...')
      const manifestLink = document.querySelector('link[rel="manifest"]')
      if (manifestLink) {
        results.push('✅ Manifest link found')
        try {
          const response = await fetch(manifestLink.getAttribute('href')!)
          const manifest = await response.json()
          results.push(`✅ Manifest loaded: ${manifest.name}`)
        } catch (error) {
          results.push('❌ Failed to load manifest')
        }
      } else {
        results.push('❌ No manifest link found')
      }

      // Test 3: Installation
      results.push('\n🔍 Testing PWA Installation...')
      if (window.matchMedia('(display-mode: standalone)').matches) {
        results.push('✅ App is running in standalone mode (installed)')
      } else {
        results.push('ℹ️ App is not installed (running in browser)')
      }

      // Test 4: Push Notifications
      results.push('\n🔍 Testing Push Notifications...')
      if ('serviceWorker' in navigator && 'PushManager' in window) {
        results.push('✅ Push notifications are supported')
        if (Notification.permission === 'granted') {
          results.push('✅ Notification permission granted')
        } else {
          results.push('ℹ️ Notification permission not set')
        }
      } else {
        results.push('❌ Push notifications not supported')
      }

      // Test 5: HTTPS
      results.push('\n🔍 Testing HTTPS...')
      if (location.protocol === 'https:') {
        results.push('✅ Site is served over HTTPS')
      } else if (location.hostname === 'localhost') {
        results.push('ℹ️ Running on localhost (HTTPS not required)')
      } else {
        results.push('❌ Site is not served over HTTPS')
      }

      results.push('\n🎉 PWA Testing Complete!')
      results.push('📱 Try installing the app to test the full PWA experience')

    } catch (error) {
      results.push(`❌ Test failed: ${error}`)
    } finally {
      console.log = originalLog
      setTestResults(results)
      setIsRunning(false)
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          PWA Testing
        </h3>
        <button
          onClick={runPwaTests}
          disabled={isRunning}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg text-sm font-medium transition-colors"
        >
          {isRunning ? 'Running Tests...' : 'Run PWA Tests'}
        </button>
      </div>

      {testResults.length > 0 && (
        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3 max-h-64 overflow-y-auto">
          <pre className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
            {testResults.join('\n')}
          </pre>
        </div>
      )}

      <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
        <p><strong>Quick PWA Checks:</strong></p>
        <ul className="list-disc list-inside mt-2 space-y-1">
          <li>Look for install icon (📱) in browser address bar</li>
          <li>Check if app opens in standalone window when installed</li>
          <li>Test offline functionality by disconnecting internet</li>
          <li>Verify push notifications work (if subscribed)</li>
        </ul>
      </div>
    </div>
  )
}
