document.addEventListener('DOMContentLoaded', () => {
    // Get elements
    const changeColorBtn = document.getElementById('changeColorBtn');
    const contactForm = document.getElementById('contactForm');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('nav a');
    const notificationBtn = document.getElementById('notificationBtn');

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

    // Background color changer
    const colors = ['#f8f9fa', '#e9ecef', '#dee2e6', '#ced4da', '#adb5bd'];
    let colorIndex = 0;

    changeColorBtn.addEventListener('click', () => {
        colorIndex = (colorIndex + 1) % colors.length;
        document.body.style.backgroundColor = colors[colorIndex];
    });

    // OneSignal Notification Subscription
    notificationBtn.addEventListener('click', async () => {
        try {
            // Check if running as PWA on iOS
            const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
            
            if (isIOS && !isInStandaloneMode()) {
                alert('To receive notifications on iOS devices, please add this website to your home screen first, then open it from your home screen.');
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

            // Request notification permission through OneSignal
            const notificationPermission = await window.OneSignal.Notifications.permission;
            
            if (notificationPermission) {
                // Already subscribed
                alert('You are already subscribed to notifications!');
            } else {
                // Request permission
                await window.OneSignal.Notifications.requestPermission();
                
                // Check if permission was granted
                const newPermission = await window.OneSignal.Notifications.permission;
                if (newPermission) {
                    alert('Thank you for subscribing to notifications!');
                    notificationBtn.textContent = 'Notifications Enabled';
                    notificationBtn.disabled = true;
                    
                    // Get user ID to identify this device/user
                    const userId = await window.OneSignal.User.getOneSignalId();
                    console.log('OneSignal User ID:', userId);
                    
                    // Send a welcome notification
                    sendTestNotification();
                } else {
                    alert('Notification permission was denied. Please enable notifications in your browser settings.');
                }
            }
        } catch (error) {
            console.error('Error setting up notifications:', error);
            alert('There was an error setting up notifications. Please try again later.');
        }
    });

    // Function to send a test notification
    async function sendTestNotification() {
        try {
            // This would typically be done server-side in a production app
            // Here we're just demonstrating the client-side capability
            if (window.OneSignal) {
                console.log('Sending test notification...');
                
                // In iOS/Safari, we can't trigger notifications directly from the client
                // However, we can show a message indicating success
                if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
                    console.log('On iOS, notifications must be sent from the server');
                }
            }
        } catch (error) {
            console.error('Error sending notification:', error);
        }
    }

    // Form submission
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;
        
        // In a real application, you would send this data to a server
        console.log('Form submitted with:', { name, email, message });
        
        // Show a success message
        alert(`Thank you ${name}! Your message has been received.`);
        contactForm.reset();
    });

    // Smooth scrolling for navigation
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            window.scrollTo({
                top: targetSection.offsetTop - 70,
                behavior: 'smooth'
            });
        });
    });

    // Add a simple animation for sections when they come into view
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = 1;
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        section.style.opacity = 0;
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(section);
    });
}); 