document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const splashScreen = document.getElementById('splash-screen');
    const enterBtn = document.getElementById('enter-btn');
    const mainContent = document.getElementById('main-content');
    const bgMusic = document.getElementById('bg-music');
    const musicToggle = document.getElementById('music-toggle');
    const wishForm = document.getElementById('wish-form');
    const submitBtn = document.getElementById('submit-btn');
    const successMessage = document.getElementById('success-message');

    // ⚠️ ضع لينك Google Apps Script هنا عندما تجهزه مستقبلاً
    const SCRIPT_URL = ""; 

    let isPlaying = false;
    bgMusic.volume = 0.3;
    // 1. Enter Button & Audio Play
    enterBtn.addEventListener('click', () => {
        bgMusic.volume = 0.3;
        bgMusic.play().then(() => {
            isPlaying = true;
            musicToggle.classList.remove('hidden');
        }).catch(err => {
            console.log("Audio play failed automatically:", err);
            isPlaying = false;
            musicToggle.classList.remove('hidden');
        });

        splashScreen.classList.add('fade-out');
        
        setTimeout(() => {
            splashScreen.style.display = 'none';
            mainContent.classList.remove('hidden');
        }, 1000);
    });

    // 2. Music Toggle Floating Button
    musicToggle.addEventListener('click', () => {
        if (isPlaying) {
            bgMusic.pause();
            musicToggle.querySelector('i').className = 'fa-solid fa-compact-disc';
            isPlaying = false;
        } else {
            bgMusic.volume = 0.3;
            bgMusic.play();
            musicToggle.querySelector('i').className = 'fa-solid fa-compact-disc fa-spin';
            isPlaying = true;
        }
    });

    // 3. Countdown Timer Functionality
    const weddingDate = new Date(2026, 11, 5, 19, 0, 0).getTime();

    function updateCountdown() {
        const now = new Date().getTime();
        const difference = weddingDate - now;

        if (difference > 0) {
            const days = Math.floor(difference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((difference % (1000 * 60)) / 1000);

            document.getElementById('days').innerText = days < 10 ? '0' + days : days;
            document.getElementById('hours').innerText = hours < 10 ? '0' + hours : hours;
            document.getElementById('minutes').innerText = minutes < 10 ? '0' + minutes : minutes;
            document.getElementById('seconds').innerText = seconds < 10 ? '0' + seconds : seconds;
        } else {
            document.getElementById('countdown').innerHTML = "<h3 style='color: var(--dark-pink);'>تم بحمد الله عقد القران! 🎉</h3>";
        }
    }

    setInterval(updateCountdown, 1000);
    updateCountdown();

    // 4. Send Wishes Form to Google Sheets
    wishForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('guest-name').value.trim();
        const message = document.getElementById('guest-message').value.trim();

        if (!name || !message) return;

        // تغيير حالة الزر أثناء الإرسال
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'جاري الإرسال... <i class="fa-solid fa-spinner fa-spin"></i>';

        // إذا كان رابط الـ Script متوفر يتم الإرسال، وإلا يظهر نجاح وهمي حتى تقوم بالربط
        if (SCRIPT_URL) {
            const formData = new FormData(wishForm);
            fetch(SCRIPT_URL, { method: 'POST', body: formData })
                .then(response => {
                    handleSuccess();
                })
                .catch(error => {
                    console.error('Error!', error.message);
                    handleSuccess(); // لتجربة واجهة المستخدم حتى عند حدوث خطأ أثناء التطوير
                });
        } else {
            // تجربة العرض بدون كود الـ Backend
            setTimeout(() => {
                handleSuccess();
            }, 800);
        }
    });

    function handleSuccess() {
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'إرسال التهنئة <i class="fa-solid fa-paper-plane"></i>';
        successMessage.classList.remove('hidden');
        wishForm.reset();

        setTimeout(() => {
            successMessage.classList.add('hidden');
        }, 5000);
    }
});
