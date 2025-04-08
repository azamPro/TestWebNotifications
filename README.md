# Basic Web Page with Notifications

A simple web page created using native web technologies: HTML, CSS, and JavaScript, with OneSignal web push notifications integration for Safari (including iOS/iPadOS 16.4+).

## Features

- Responsive design that works on mobile and desktop
- Navigation with smooth scrolling
- Contact form with basic validation
- Background color changer
- Section animations when scrolling into view
- Web push notifications via OneSignal (Safari compatible, including iOS)
- Progressive Web App (PWA) capabilities

## Files

- `index.html` - The main HTML structure with OneSignal integration
- `styles.css` - CSS styling for the page
- `script.js` - JavaScript for interactivity and notification handling
- `manifest.json` - Web App Manifest for PWA functionality
- `OneSignalSDKWorker.js` - Service worker for notifications and offline support
- `icon-192x192.png` and `icon-512x512.png` - App icons for various devices

## How to Run

For desktop browsers:
1. Simply open the `index.html` file in any modern web browser.

For iOS/iPadOS Safari notifications (iOS 16.4+ required):
1. Host the website on an HTTPS server (required for production; local testing uses allowLocalhostAsSecureOrigin flag)
2. Visit the website in Safari on your iOS/iPadOS device
3. Tap the share icon and select "Add to Home Screen"
4. Open the website from the home screen icon
5. Click "Subscribe to Notifications" button

## OneSignal Integration

This project uses OneSignal for web push notifications. The integration includes:

- OneSignal SDK integration in the HTML head
- A properly configured Web App Manifest
- Service worker implementation
- "Add to Home Screen" instructions for iOS users
- Notification subscription button
- JavaScript code to handle permission requests and notification subscription

### Safari Notification Setup Requirements

For Safari notifications to work properly:

1. Your website needs to be served over HTTPS
2. OneSignal service worker must be registered properly
3. Web App Manifest must be properly configured
4. For iOS/iPadOS, users must add the website to their home screen and open it from there
5. iOS/iPadOS 16.4+ is required for mobile Safari notifications

## Future Enhancements

- Add more pages
- Implement a dark mode toggle
- Add more interactive elements
- Connect the contact form to a backend service 