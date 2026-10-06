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

    // رابط Google Apps Script
    const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyzK12FD1LbBlmGWTfW1AIu8XyK4z_k9VbrsO6lmNagZxZFlh5RJ2GoUBlj_ifGQwVq2Q/exec"; 

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

    // 3. Countdown Timer Functionality (مضبوط على 5 مايو 2026 الساعة 7 مساءً)
    const weddingDate = new Date("2026-11-11T19:00:00").getTime();

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

        submitBtn.disabled = true;
        submitBtn.innerHTML = 'جاري الإرسال... <i class="fa-solid fa-spinner fa-spin"></i>';

        if (SCRIPT_URL) {
            const formData = new FormData(wishForm);
            fetch(SCRIPT_URL, { method: 'POST', body: formData })
                .then(response => {
                    handleSuccess();
                })
                .catch(error => {
                    console.error('Error!', error.message);
                    handleSuccess();
                });
        } else {
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
