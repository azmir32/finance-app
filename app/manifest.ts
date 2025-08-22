import type { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Expense Tracker AI - Smart Finance Management',
    short_name: 'Expense Tracker',
    description: 'Track expenses, manage budgets, and get AI-powered financial insights with our intelligent expense tracker PWA.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    display_override: ['window-controls-overlay', 'standalone', 'minimal-ui'],
    orientation: 'portrait-primary',
    background_color: '#ffffff',
    theme_color: '#3b82f6',
    categories: ['finance', 'productivity', 'utilities'],
    lang: 'en',
    dir: 'ltr',
    prefer_related_applications: false,
    icons: [
      {
        src: '/icons/icon-72x72.png',
        sizes: '72x72',
        type: 'image/png',
        purpose: 'maskable'
      },
      {
        src: '/icons/icon-96x96.png',
        sizes: '96x96',
        type: 'image/png',
        purpose: 'maskable'
      },
      {
        src: '/icons/icon-128x128.png',
        sizes: '128x128',
        type: 'image/png',
        purpose: 'maskable'
      },
      {
        src: '/icons/icon-144x144.png',
        sizes: '144x144',
        type: 'image/png',
        purpose: 'maskable'
      },
      {
        src: '/icons/icon-152x152.png',
        sizes: '152x152',
        type: 'image/png',
        purpose: 'maskable'
      },
      {
        src: '/icons/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable'
      },
      {
        src: '/icons/icon-384x384.png',
        sizes: '384x384',
        type: 'image/png',
        purpose: 'maskable'
      },
      {
        src: '/icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable'
      }
    ],
    screenshots: [
      {
        src: '/screenshots/desktop-1.png',
        sizes: '1280x720',
        type: 'image/png',
        form_factor: 'wide',
        label: 'Expense Tracker Dashboard'
      },
      {
        src: '/screenshots/mobile-1.png',
        sizes: '390x844',
        type: 'image/png',
        form_factor: 'narrow',
        label: 'Mobile Expense Tracking'
      }
    ],
    shortcuts: [
      {
        name: 'Add New Record',
        short_name: 'Add Record',
        description: 'Quickly add a new expense or income record',
        url: '/',
        icons: [
          {
            src: '/icons/shortcut-add-96x96.png',
            sizes: '96x96',
            type: 'image/png'
          }
        ]
      },
      {
        name: 'View Dashboard',
        short_name: 'Dashboard',
        description: 'View your complete financial dashboard',
        url: '/',
        icons: [
          {
            src: '/icons/shortcut-dashboard-96x96.png',
            sizes: '96x96',
            type: 'image/png'
          }
        ]
      },
      {
        name: 'AI Insights',
        short_name: 'Insights',
        description: 'Get AI-powered financial insights and recommendations',
        url: '/',
        icons: [
          {
            src: '/icons/shortcut-insights-96x96.png',
            sizes: '96x96',
            type: 'image/png'
          }
        ]
      }
    ],
    related_applications: []
  }
}