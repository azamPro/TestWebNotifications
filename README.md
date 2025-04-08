# Web Notifications Demo

A demonstration of web push notifications using native web technologies and the OneSignal SDK, with special support for Safari on iOS/iPadOS 16.4+.

## Features

- Web push notifications via OneSignal
- Safari notifications support (including iOS/iPadOS 16.4+)
- Progressive Web App (PWA) capabilities
- Real-time notification permission status display
- Detailed setup instructions for iOS users

## Files

- `index.html` - The main HTML structure with OneSignal integration
- `styles.css` - CSS styling for the notification UI
- `script.js` - JavaScript for notification handling
- `manifest.json` - Web App Manifest required for PWA and iOS notifications
- `OneSignalSDKWorker.js` - Service worker for notifications
- `icon-192x192.png` and `icon-512x512.png` - App icons required for PWA

## How to Use

For desktop browsers:
1. Open the web page in any modern browser
2. Click "Subscribe to Notifications" to grant permission

For iOS/iPadOS Safari notifications (iOS 16.4+ required):
1. Host the website on an HTTPS server
2. Visit the website in Safari on your iOS/iPadOS device
3. Tap the share icon and select "Add to Home Screen"
4. Open the website from the home screen icon
5. Click "Subscribe to Notifications" button

## OneSignal Implementation Details

This demo utilizes the following OneSignal features:

- OneSignal Web SDK v16
- Service worker implementation for push delivery
- Web App Manifest integration
- Permission handling with status feedback
- Special detection for iOS standalone mode
- Adaptive UI for different device types

## Safari Notification Requirements

For Safari notifications to work properly:

1. Website must be served over HTTPS
2. OneSignal service worker must be registered
3. Web App Manifest must be properly configured
4. For iOS/iPadOS, users must add to home screen and open from there
5. iOS/iPadOS 16.4+ required for mobile Safari notifications

## Technical Notes

- The OneSignal Web SDK automatically handles browser compatibility
- Permission states are managed through the OneSignal Notifications API
- Service worker handles notification delivery even when the site is closed
- The Web App Manifest is required for "Add to Home Screen" functionality 