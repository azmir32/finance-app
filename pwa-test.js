// PWA Testing Script - Run this in browser console
console.log('🔍 PWA Testing Script Started...\n');

// Test 1: Check if Service Worker is registered
async function testServiceWorker() {
  console.log('1️⃣ Testing Service Worker...');
  
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        console.log('✅ Service Worker is registered:', registration.scope);
        console.log('   Active:', registration.active ? 'Yes' : 'No');
        console.log('   Waiting:', registration.waiting ? 'Yes' : 'No');
      } else {
        console.log('❌ No Service Worker registration found');
      }
    } catch (error) {
      console.log('❌ Service Worker test failed:', error);
    }
  } else {
    console.log('❌ Service Worker not supported');
  }
}

// Test 2: Check if Manifest is loaded
function testManifest() {
  console.log('\n2️⃣ Testing Web App Manifest...');
  
  const manifestLink = document.querySelector('link[rel="manifest"]');
  if (manifestLink) {
    console.log('✅ Manifest link found:', manifestLink.href);
    
    // Try to fetch manifest
    fetch(manifestLink.href)
      .then(response => response.json())
      .then(manifest => {
        console.log('✅ Manifest loaded successfully');
        console.log('   Name:', manifest.name);
        console.log('   Short name:', manifest.short_name);
        console.log('   Icons:', manifest.icons?.length || 0, 'icons found');
        console.log('   Shortcuts:', manifest.shortcuts?.length || 0, 'shortcuts found');
      })
      .catch(error => {
        console.log('❌ Failed to load manifest:', error);
      });
  } else {
    console.log('❌ No manifest link found');
  }
}

// Test 3: Check PWA Installation Support
function testInstallation() {
  console.log('\n3️⃣ Testing PWA Installation...');
  
  // Check if beforeinstallprompt event is supported
  let deferredPrompt;
  window.addEventListener('beforeinstallprompt', (e) => {
    console.log('✅ beforeinstallprompt event fired');
    deferredPrompt = e;
  });
  
  // Check if app is already installed
  if (window.matchMedia('(display-mode: standalone)').matches) {
    console.log('✅ App is running in standalone mode (installed)');
  } else {
    console.log('ℹ️ App is not installed (running in browser)');
  }
  
  // Check if app can be installed
  if (deferredPrompt) {
    console.log('✅ App can be installed');
  } else {
    console.log('ℹ️ Install prompt not available (may need to meet criteria)');
  }
}

// Test 4: Check Push Notifications
function testPushNotifications() {
  console.log('\n4️⃣ Testing Push Notifications...');
  
  if ('serviceWorker' in navigator && 'PushManager' in window) {
    console.log('✅ Push notifications are supported');
    
    // Check if user has granted permission
    if (Notification.permission === 'granted') {
      console.log('✅ Notification permission granted');
    } else if (Notification.permission === 'denied') {
      console.log('❌ Notification permission denied');
    } else {
      console.log('ℹ️ Notification permission not set');
    }
  } else {
    console.log('❌ Push notifications not supported');
  }
}

// Test 5: Check Offline Support
function testOfflineSupport() {
  console.log('\n5️⃣ Testing Offline Support...');
  
  if ('caches' in window) {
    console.log('✅ Cache API is supported');
    
    // List all caches
    caches.keys().then(cacheNames => {
      console.log('   Caches found:', cacheNames.length);
      cacheNames.forEach(name => {
        console.log('   -', name);
      });
    });
  } else {
    console.log('❌ Cache API not supported');
  }
}

// Test 6: Check HTTPS
function testHTTPS() {
  console.log('\n6️⃣ Testing HTTPS...');
  
  if (location.protocol === 'https:') {
    console.log('✅ Site is served over HTTPS');
  } else if (location.hostname === 'localhost') {
    console.log('ℹ️ Running on localhost (HTTPS not required)');
  } else {
    console.log('❌ Site is not served over HTTPS (required for PWA)');
  }
}

// Run all tests
async function runAllTests() {
  await testServiceWorker();
  testManifest();
  testInstallation();
  testPushNotifications();
  testOfflineSupport();
  testHTTPS();
  
  console.log('\n🎉 PWA Testing Complete!');
  console.log('📱 Try installing the app to test the full PWA experience');
}

// Run tests
runAllTests();

// Export for manual testing
window.pwaTest = {
  testServiceWorker,
  testManifest,
  testInstallation,
  testPushNotifications,
  testOfflineSupport,
  testHTTPS,
  runAllTests
};
