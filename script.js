document.addEventListener('DOMContentLoaded', () => {

    // --- 1. إعدادات رابط Google Apps Script ---
    // استبدل هذا الرابط برابط Web App الخاص بك من Google Apps Script
    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwZmtocSbyFnW4OadJR5rMK0viqGTiwkSll95mKpfFDHnWTzjNiJIJn2PzT0kj6BUerCw/exec';


    // --- 2. إدارة تشغيل الصوت ---
    const audio = document.getElementById('wedding-audio');
    const enterBtn = document.getElementById('enter-btn');
    const welcomeOverlay = document.getElementById('welcome-overlay');
    const audioToggleBtn = document.getElementById('audio-toggle-btn');
    let isPlaying = false;

    enterBtn.addEventListener('click', () => {
        welcomeOverlay.style.display = 'none';
        playAudio();
    });

    audioToggleBtn.addEventListener('click', () => {
        if (isPlaying) {
            audio.pause();
            audioToggleBtn.innerHTML = '<i class="fa-solid fa-music-slash"></i>';
            isPlaying = false;
        } else {
            playAudio();
        }
    });

    function playAudio() {
        audio.play().then(() => {
            isPlaying = true;
            audioToggleBtn.innerHTML = '<i class="fa-solid fa-music"></i>';
        }).catch(err => {
            console.log("Audio play deferred:", err);
        });
    }


    // --- 3. العداد التنازلي ---
    // تم ضبط تاريخ الزفاف على 15 نوفمبر 2026 الساعة 8 مساءً
    const weddingDate = new Date("2026-11-05T20:00:00").getTime();

    const timer = setInterval(() => {
        const now = new Date().getTime();
        const distance = weddingDate - now;

        if (distance < 0) {
            clearInterval(timer);
            document.getElementById('countdown').innerHTML = "<h4>أهلاً بكم في زفافنا اليوم!</h4>";
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById('days').innerText = days < 10 ? '0' + days : days;
        document.getElementById('hours').innerText = hours < 10 ? '0' + hours : hours;
        document.getElementById('minutes').innerText = minutes < 10 ? '0' + minutes : minutes;
        document.getElementById('seconds').innerText = seconds < 10 ? '0' + seconds : seconds;
    }, 1000);


    // --- 4. إرسال نموذج التهاني ---
    const wishForm = document.getElementById('wishForm');
    const submitBtn = document.getElementById('submitBtn');

    wishForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const name = document.getElementById('guestName').value.trim();
        const message = document.getElementById('guestMessage').value.trim();

        if (!name || !message) {
            alert('يرجى ملء جميع الحقول');
            return;
        }

        submitBtn.disabled = true;
        submitBtn.innerText = 'جاري الإرسال...';

        const payload = {
            name: name,
            message: message
        };

        fetch(SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors', // لضمان إرسال الطلب لـ Apps Script بدون مشاكل Cross-Origin
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        })
        .then(() => {
            alert('شكراً لك! تم إرسال تهنئتك بنجاح.');
            wishForm.reset();
        })
        .catch(error => {
            console.error('Error:', error);
            alert('حدث خطأ أثناء الإرسال، يرجى المحاولة لاحقاً.');
        })
        .finally(() => {
            submitBtn.disabled = false;
            submitBtn.innerText = 'إرسال التهنئة';
        });
    });

});
