// =========================================================
// ГЛОБАЛЬНИЙ МЕНЕДЖЕР ФОНОВОЇ МУЗИКИ
// Зберігає позицію при переході між сторінками,
// відновлює відтворення максимально швидко
// =========================================================

(function () {
    const POSITION_KEY = 'velora_music_position';
    const TIMESTAMP_KEY = 'velora_music_timestamp';

    const bg = document.getElementById('bgMusic');
    if (!bg) return;

    // Якщо музика вимкнена в налаштуваннях — не граємо
    if (localStorage.getItem('musicEnabled') === 'false') return;

    // =========================================================
    // ВІДНОВЛЕННЯ ПОЗИЦІЇ
    // =========================================================
    function getResumePosition() {
        const savedPos = parseFloat(localStorage.getItem(POSITION_KEY)) || 0;
        const savedTime = parseInt(localStorage.getItem(TIMESTAMP_KEY)) || 0;

        if (savedPos > 0 && savedTime > 0) {
            const elapsed = (Date.now() - savedTime) / 1000;
            return savedPos + elapsed;
        }
        return 0;
    }

    function setPosition() {
        let resumeAt = getResumePosition();
        if (resumeAt > 0) {
            if (bg.duration && bg.duration > 0) {
                resumeAt = resumeAt % bg.duration;
            }
            bg.currentTime = resumeAt;
        }
    }

    // =========================================================
    // ЗАПУСК МУЗИКИ
    // Намагаємось запустити одразу; якщо браузер блокує —
    // чекаємо будь-яку взаємодію (клік, скрол, клавіша, тач)
    // =========================================================
    let started = false;

    function tryPlay() {
        if (started) return;

        setPosition();

        const promise = bg.play();
        if (promise !== undefined) {
            promise.then(() => {
                started = true;
                removeInteractionListeners();
            }).catch(() => {
                // Браузер заблокував — чекаємо на взаємодію
                addInteractionListeners();
            });
        }
    }

    function onInteraction() {
        if (started) return;
        setPosition();
        bg.play().then(() => {
            started = true;
            removeInteractionListeners();
        }).catch(() => {});
    }

    const events = ['click', 'touchstart', 'keydown', 'scroll', 'mousemove'];

    function addInteractionListeners() {
        events.forEach(evt => {
            document.addEventListener(evt, onInteraction, { once: true, passive: true });
        });
    }

    function removeInteractionListeners() {
        events.forEach(evt => {
            document.removeEventListener(evt, onInteraction);
        });
    }

    // Встановлюємо позицію як тільки metadata готова
    if (bg.readyState >= 1) {
        tryPlay();
    } else {
        bg.addEventListener('loadedmetadata', tryPlay, { once: true });
        // Також пробуємо одразу (metadata може бути кешована)
        tryPlay();
    }

    // =========================================================
    // ЗБЕРЕЖЕННЯ ПОЗИЦІЇ ПЕРЕД ВИХОДОМ
    // =========================================================
    function savePosition() {
        if (!bg.paused && bg.currentTime > 0) {
            localStorage.setItem(POSITION_KEY, bg.currentTime.toString());
            localStorage.setItem(TIMESTAMP_KEY, Date.now().toString());
        }
    }

    window.addEventListener('beforeunload', savePosition);

    // Зберігаємо також при кліку на будь-яке посилання
    document.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        const imgInput = e.target.closest('input[type="image"]');
        if ((link || imgInput) && !bg.paused) {
            savePosition();
        }
    }, true);
})();
