document.addEventListener('DOMContentLoaded', () => {
    // Get elements
    const notificationBtn = document.getElementById('notificationBtn');
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
                updateStatus('لتفعيل الإشعارات على أجهزة iOS، يُرجى إضافة هذا الموقع إلى الشاشة الرئيسية أولاً، ثم فتحه من الشاشة الرئيسية.', 'denied');
                return;
            }
            
            updateStatus('طلب تفعيل الإشعارات..', 'info');

            // Wait for OneSignal to be ready
            console.log("Debugging: ", "Checking with OneSignal");
            await CallOneSignal();

            // Request notification permission through OneSignal
            const notificationPermission = await window.OneSignal.Notifications.permission;
            
            if (notificationPermission) {
                updateStatus('انت مشترك من قبل!', 'granted'); // You are already subscribed to notifications!
            } else {
                // Request permission
                console.log("Debugging: ", "Requesting Permission...");
                const newPermission = await window.OneSignal.Notifications.permission;
                if (newPermission) {

                    // Get user ID to identify this device/user
                    const userId = await window.OneSignal.User.getOneSignalId();
                    console.log('OneSignal User ID:', userId);
                    
                    // Update permission status display
                    checkNotificationPermission();

                } else {
                    updateStatus('تم رفض طلب الإشعارات الرجاء تفعيل الإشعارات في الإعدادات', 'denied'); // Notification permission was denied. Please enable notifications in your browser settings.
                    checkNotificationPermission();
                }
            }
        } catch (error) {
            console.error('Error setting up notifications:', error);
            updateStatus('There was an error setting up notifications. Please try again later.', 'denied');
            
        }
    });

    // Check notification permission and update UI
    async function checkNotificationPermission() {
        try {
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
            // 🔧 Use try/catch for permission access
            let permission;
            try {
                permission = await window.OneSignal.Notifications.permission;
            } catch (e) {
                console.warn("Permission getter threw an error:", e);
                return;
            }
    
            if (permission) {
                updateStatus('تم الاشتراك بنجاح!', 'success'); // Successfully subscribed to notifications!
                notificationBtn.textContent = 'الإشعارات مفعلة'; // Notifications Enabled
                notificationBtn.disabled = true;
            } else {
                const nativePermission = Notification.permission;
                if (nativePermission === 'denied') {
                    updateStatus('محظور: تم حظر الإشعارات من إعدادات المتصفح', 'denied')
                } else {
                    updateStatus('غير مشترك: اضغط على الزر أعلاه للاشتراك', 'denied')
                }
            }
        } catch (error) {
            console.error('Error checking notification permission:', error);
            // permissionStatus.textContent = 'Error checking notification permission';
            updateStatus('حصل خطأ! حاول مرة اخرى', 'denied')
        }
    }

    // Update status message
    function updateStatus(message, type) {
        permissionStatus.textContent = message;
        permissionStatus.className = `status-${type}`
        if (type) {
            permissionStatus.classList.add(`status-${type}`);
        }
    }

    async function CallOneSignal(){
        new Promise(resolve => {
            if (window.OneSignal) {
                resolve();
                console.log("Debugging: ", "OneSignal is ready");
            } else {
                console.log("Debugging: ", "OneSignal is NOT ready something went wrong...");
                window.OneSignalDeferred = window.OneSignalDeferred || [];
                window.OneSignalDeferred.push(() => {
                    resolve();
                });
            }
        });
    }
}); 