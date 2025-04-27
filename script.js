document.addEventListener('DOMContentLoaded', () => {
    const notificationBtn = document.getElementById('notificationBtn');
    const permissionStatus = document.getElementById('permission-status');
    const addToHomeInstructions = document.querySelector('.add-to-home');
    

    const cards_container = document.getElementById("cards-container");
    const tpl = document.getElementById('card-tpl');
    const parent = document.getElementById('card-container');


    // Check if running as installed PWA on iOS
    function isInStandaloneMode() {
        return (
            (window.matchMedia('(display-mode: standalone)').matches) || // checks if the website is installed
            (window.navigator.standalone) ||  // checks if the website is installed (for ios)
            document.referrer.includes('android-app://') // checks if the website is opened from an adroid app
        );
    }

    // Show/hide "Add to Home Screen" instructions
    // Only show add to home instructions on iOS Safari and not when already in standalone mode
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    const isSafari = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
    if (!(isIOS && isSafari) || isInStandaloneMode()) {
        addToHomeInstructions.style.display = 'none';
    }
    
    // Initialize notification status
    checkNotificationPermission();

    notificationBtn.addEventListener('click', async () => {
        updateStatus('جاري طلب تفعيل الإشعارات...', 'info');

        // Check if running as PWA on iOS
        if (isIOS && !isInStandaloneMode()) {
            updateStatus('لتفعيل الإشعارات على أجهزة iOS، يُرجى إضافة هذا الموقع إلى الشاشة الرئيسية أولاً، ثم فتحه من الشاشة الرئيسية.', 'denied');
            return;
        }
        
        // Wait for OneSignal to be ready
        console.log("Debugging: ", "Checking with OneSignal");
        await CallOneSignal();
        
        // Request permission
        console.log("Debugging: ", "Requestion Notification Permission...");
        await window.OneSignal.Notifications.requestPermission();

        checkNotificationPermission();
    });

    // Check notification permission and update UI
    async function checkNotificationPermission() {
        try {
            
            await CallOneSignal();

            let permission = await window.OneSignal.Notifications.permission;
            if (permission) {
                updateStatus('تم الاشتراك بنجاح!', 'granted'); // Successfully subscribed to notifications!
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
            updateStatus('حصل خطأ! حاول مرة اخرى', 'denied')
        }
    }

    function updateStatus(message, type) {
        permissionStatus.textContent = message;
        permissionStatus.className = `status-${type}`
        if (type) {
            permissionStatus.classList.add(`status-${type}`);
        }
    }

    async function CallOneSignal(){
        return new Promise(resolve => {
            if (window.OneSignal) {
                resolve();
                console.log("Debugging: ", "OneSignal is ready");
            } else {
                console.log("Debugging: ", "OneSignal is NOT ready deferring...");
                window.OneSignalDeferred = window.OneSignalDeferred || [];
                window.OneSignalDeferred.push(() => {
                    console.log("Debugging: ", "OneSignal is now Ready!");
                    resolve();
                });
            }
        });
    }

//====================================Project Showcase Section================================

    load_projects('projects.json').then(projects => {
        add_projects_html(projects)
    });

    function add_projects_html(projects) {
        projects.forEach(p => {
            const card = tpl.content.cloneNode(true);
    
            /* fill title + section -------------------------------------------------- */
            card.querySelector('#card-title').textContent = p["Project Title"];
            card.querySelector('#card-dept').textContent = p["Department"];
    
            /* robust tag handling --------------------------------------------------- */
            const raw = p["Project Field"] ?? "";                       // may be array or string
            const tags = Array.isArray(raw)
                ? raw
                : raw.split(',').map(t => t.trim()).filter(Boolean);
    
            const tagBox = card.querySelector('#card-tags');
            tags.forEach(tag => tagBox.insertAdjacentHTML(
                'beforeend',
                `<span class="bg-black/90 text-white text-xs font-semibold px-2 py-0.5 rounded">${tag}</span>`
            ));
    
            /* poster image ---------------------------------------------------------- */
            const img = card.querySelector('#card-image');
            img.src = p["Project Poster"];
            img.alt = p["Project Title"];

            parent.appendChild(card);                                     // add to page
        });
    }


    async function load_projects(filePath) {
        try {
          const response = await fetch(filePath);
          if (!response.ok) {
            throw new Error('Failed to fetch JSON');
          }
          const data = await response.json();
          return data;
        } catch (error) {
          console.error('Error fetching JSON:', error);
          return null;
        }
      }
    
}); 