# Basic Web Page with Notifications

A simple web page created using native web technologies: HTML, CSS, and JavaScript, with OneSignal web push notifications integration for Safari.

## Features

- Responsive design that works on mobile and desktop
- Navigation with smooth scrolling
- Contact form with basic validation
- Background color changer
- Section animations when scrolling into view
- Web push notifications via OneSignal (Safari compatible)

## Files

- `index.html` - The main HTML structure with OneSignal integration
- `styles.css` - CSS styling for the page
- `script.js` - JavaScript for interactivity and notification handling

## How to Run

Simply open the `index.html` file in any modern web browser.

## OneSignal Integration

This project uses OneSignal for web push notifications. The integration includes:

- OneSignal SDK integration in the HTML head
- A notification subscription button
- JavaScript code to handle permission requests and notification subscription

### Safari Notification Setup Requirements

For Safari notifications to work properly:

1. Your website needs to be served over HTTPS
2. You need to create a Safari push certificate through Apple's developer portal
3. Configure the certificate in your OneSignal dashboard
4. The website must be properly configured with the OneSignal service

## Future Enhancements

- Add more pages
- Implement a dark mode toggle
- Add more interactive elements
- Connect the contact form to a backend service 