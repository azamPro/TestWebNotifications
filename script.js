document.addEventListener('DOMContentLoaded', () => {
    // Get elements
    const notificationBtn = document.getElementById('notificationBtn');
    const notificationStatus = document.getElementById('notification-status');
    const permissionStatus = document.getElementById('permission-status');

    // Check if running as installed PWA on iOS
    const isInStandaloneMode = () => 
        (window.matchMedia('(display-mode: standalone)').matches) || 
        (window.navigator.standalone) || 
        document.referrer.includes('android-app://');

    // Show/hide "Add to Home Screen" instructions
    const addToHomeInstructions = document.querySelector('.add-to-home');
    if (addToHomeInstructions) {
        // Only show add to home instructions on iOS Safari and not when already in standalone mode
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
        const isSafari = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
        
        if (!(isIOS && isSafari) || isInStandaloneMode()) {
            addToHomeInstructions.style.display = 'none';
        }
    }

    // Initialize notification status
    checkNotificationPermission();

    // OneSignal Notification Subscription
    notificationBtn.addEventListener('click', async () => {
        try {
            // Check if running as PWA on iOS
            const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
            
            if (isIOS && !isInStandaloneMode()) {
                updateStatus('To receive notifications on iOS devices, please add this website to your home screen first, then open it from your home screen.', 'warning');
                return;
            }
            
            // Wait for OneSignal to be ready
            await new Promise(resolve => {
                if (window.OneSignal) {
                    resolve();
                } else {
                    window.OneSignalDeferred = window.OneSignalDeferred || [];
                    window.OneSignalDeferred.push(() => {
                        resolve();
                    });
                }
            });

            // Show requesting status
            updateStatus('Requesting permission...', 'info');

            // Request notification permission through OneSignal
            const notificationPermission = await window.OneSignal.Notifications.permission;
            
            if (notificationPermission) {
                // Already subscribed
                updateStatus('You are already subscribed to notifications!', 'success');
            } else {
                // Request permission
                await window.OneSignal.Notifications.requestPermission();
                
                // Check if permission was granted
                const newPermission = await window.OneSignal.Notifications.permission;
                if (newPermission) {
                    updateStatus('Successfully subscribed to notifications!', 'success');
                    notificationBtn.textContent = 'Notifications Enabled';
                    notificationBtn.disabled = true;
                    
                    // Get user ID to identify this device/user
                    const userId = await window.OneSignal.User.getOneSignalId();
                    console.log('OneSignal User ID:', userId);
                    
                    // Update permission status display
                    checkNotificationPermission();
                } else {
                    updateStatus('Notification permission was denied. Please enable notifications in your browser settings.', 'error');
                    checkNotificationPermission();
                }
            }
        } catch (error) {
            console.error('Error setting up notifications:', error);
            updateStatus('There was an error setting up notifications. Please try again later.', 'error');
        }
    });

    // Check notification permission and update UI
    async function checkNotificationPermission() {
        try {
            // Wait for OneSignal to be ready
            await new Promise(resolve => {
                if (window.OneSignal) {
                    resolve();
                } else {
                    window.OneSignalDeferred = window.OneSignalDeferred || [];
                    window.OneSignalDeferred.push(() => {
                        resolve();
                    });
                }
            });

            // Get current permission state
            const permission = await window.OneSignal.Notifications.permission;
            
            if (permission) {
                permissionStatus.textContent = 'GRANTED: You are subscribed to notifications';
                permissionStatus.className = 'status-granted';
                notificationBtn.textContent = 'Notifications Enabled';
                notificationBtn.disabled = true;
            } else {
                // Check if permission is denied or not yet requested
                const nativePermission = Notification.permission;
                if (nativePermission === 'denied') {
                    permissionStatus.textContent = 'BLOCKED: Notifications are blocked in your browser settings';
                    permissionStatus.className = 'status-denied';
                } else {
                    permissionStatus.textContent = 'NOT SUBSCRIBED: Click the button above to subscribe';
                    permissionStatus.className = 'status-default';
                }
            }
        } catch (error) {
            console.error('Error checking notification permission:', error);
            permissionStatus.textContent = 'Error checking notification permission';
        }
    }

    // Update status message
    function updateStatus(message, type) {
        notificationStatus.textContent = message;
        
        // Optional: add styling based on message type
        notificationStatus.className = 'status-message';
        if (type) {
            notificationStatus.classList.add(`status-${type}`);
        }
        
        // For error and warning, also show an alert for better visibility
        if (type === 'error' || type === 'warning') {
            alert(message);
        }
    }
}); 