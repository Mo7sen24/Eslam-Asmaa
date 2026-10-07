
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

    const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyPqMq0SQ9xPrD83ahZb_gR8fzi5zeqfimQx1KaE4UVYJPb2nWGl8BN-OSfjvnKOXGr/exec"; 



    let isPlaying = false;

    bgMusic.volume = 0.3;



    // ===============================================

    // 🚀 كود Auto Scroll المحسّن للموبايل والكمبيوتر

    // ===============================================

    let isAutoScrolling = false;

    let animationFrameId = null;

    const scrollSpeed = 0.5; // سرعة التمرير (يمكنك تقليلها إلى 0.5 لتكون أبطأ أو زيادتها)



    function autoScrollStep() {

        if (!isAutoScrolling) return;



        // تحريك الشاشة لأسفل

        window.scrollBy(0, scrollSpeed);



        // التحقق مما إذا كانت الصفحة وصلت للنهاية

        const reachedBottom = (window.innerHeight + window.scrollY) >= (document.documentElement.scrollHeight - 5);



        if (reachedBottom) {

            stopAutoScroll();

        } else {

            // استدعاء الفريم التالي لضمان حركة سلسة على الهواتف

            animationFrameId = requestAnimationFrame(autoScrollStep);

        }

    }



    function startAutoScroll() {

        if (isAutoScrolling) return;

        isAutoScrolling = true;

        animationFrameId = requestAnimationFrame(autoScrollStep);

    }



    function stopAutoScroll() {

        if (!isAutoScrolling) return;

        isAutoScrolling = false;

        if (animationFrameId) {

            cancelAnimationFrame(animationFrameId);

        }

    }



    // إيقاف السكرول فقط عند التفاعل الفعلي (سحب الشاشة بـ touchmove بدلاً من مجرد اللمس)

    window.addEventListener('wheel', stopAutoScroll, { passive: true });

    window.addEventListener('touchmove', stopAutoScroll, { passive: true });

    window.addEventListener('keydown', (e) => {

        if (['ArrowUp', 'ArrowDown', 'Space', 'PageUp', 'PageDown'].includes(e.code)) {

            stopAutoScroll();

        }

    });



    // إيقاف السكرول لو الضيف بدأ يكتب في النموذج

    if (wishForm) {

        wishForm.addEventListener('focusin', stopAutoScroll);

    }

    // ===============================================



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



            // 🎯 تشغيل السكرول التلقائي بعد ظهور المحتوى الرئيسي

            startAutoScroll();

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

    const weddingDate = new Date(2026, 10, 05, 20, 0, 0).getTime();



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
// 4. Send Wishes Form to Google Sheets

wishForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('guest-name').value.trim();
    const message = document.getElementById('guest-message').value.trim();

    if (!name || !message) {
        return;
    }

    // منع الضغط أكثر من مرة أثناء الإرسال
    submitBtn.disabled = true;
    submitBtn.innerHTML =
        'جاري الإرسال... <i class="fa-solid fa-spinner fa-spin"></i>';

    try {
        const formData = new FormData();

        formData.append('name', name);
        formData.append('message', message);

        const response = await fetch(SCRIPT_URL, {
            method: 'POST',
            body: formData
        });

        const result = await response.json();

        if (result.success) {
            handleSuccess();
        } else {
            throw new Error(result.error || 'حدث خطأ أثناء الإرسال');
        }

    } catch (error) {

        console.error('Error:', error);

        submitBtn.disabled = false;
        submitBtn.innerHTML =
            'إرسال التهنئة <i class="fa-solid fa-paper-plane"></i>';

        alert('حدث خطأ أثناء إرسال التهنئة. حاول مرة أخرى.');
    }
});

function handleSuccess() {

    submitBtn.disabled = false;

    submitBtn.innerHTML =
        'إرسال التهنئة <i class="fa-solid fa-paper-plane"></i>';

    successMessage.classList.remove('hidden');

    wishForm.reset();

    setTimeout(() => {
        successMessage.classList.add('hidden');
    }, 5000);
}


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
