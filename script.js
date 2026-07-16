document.addEventListener("DOMContentLoaded", () => {
    // ========================================================= 
    // ГОЛОВНА ОБГОРТКА 
    // Ця подія чекає, поки весь HTML (всі теги) завантажиться на сторінці.
    // ========================================================= 

    
    const configButton = document.querySelector(".config");

    // ========================================================= 
    // ПЕРЕВІРКА ЗБЕРЕЖЕНОЇ ТЕМИ
    // Перевіряємо пам'ять браузера: якщо була збережена світла тема, вмикаємо її.
    // ========================================================= 
    const savedTheme = localStorage.getItem("theme");
    if(savedTheme === "light"){
        document.body.classList.add("light-theme");
    }

    // ========================================================= 
    // СТВОРЕННЯ ВІКНА НАЛАШТУВАНЬ (ПОПАП)
    // Створюємо HTML-код меню налаштувань за допомогою JavaScript і додаємо в body
    // ========================================================= 
    const popup = document.createElement("div");
    popup.id = "theme-popup";
    popup.innerHTML = `
    <div id="theme-window">
        <h2>Theme Settings</h2>
        <button id="dark-theme-btn">Dark Theme</button>
        <button id="light-theme-btn">Light Theme</button>
        <hr style="width:100%;">
        <h3>Background Music</h3>
        <label class="switch">
            <input type="checkbox" id="music-toggle">
            <span>Enable background music</span>
        </label>
        <hr style="width:100%;">
        <h3>Startup Intro</h3>
        <label class="switch">
            <input type="checkbox" id="intro-toggle">
            <span>Enable intro animation & sound</span>
        </label>
        <button id="close-theme-btn">Close</button>
    </div>
    `;
    document.body.appendChild(popup);

    // ========================================================= 
    // ЛОГІКА ПЕРЕМИКАЧІВ (ЗВУК ТА АНІМАЦІЯ)
    // Налаштовуємо перемикачі заставки та музики, зберігаємо їх стан
    // ========================================================= 
    const introToggle = document.getElementById("intro-toggle");
    

    if(localStorage.getItem("introEnabled") === null){
        localStorage.setItem("introEnabled", "true");
    }
    introToggle.checked = localStorage.getItem("introEnabled") === "true";
    
    introToggle.addEventListener("change", () => {
        localStorage.setItem("introEnabled", introToggle.checked);
    });

    const musicToggle = document.getElementById("music-toggle");
    const bg = document.getElementById("bgMusic");

    if(localStorage.getItem("musicEnabled") === null){
        localStorage.setItem("musicEnabled", "true");
    }
    musicToggle.checked = localStorage.getItem("musicEnabled") === "true";

    musicToggle.addEventListener("change", () => {
        localStorage.setItem("musicEnabled", musicToggle.checked);
        if(musicToggle.checked){
            if(localStorage.getItem("musicEnabled") !== "false" && bg){
                bg.play().catch(e => console.log("Аудіо заблоковано", e));
            }
        } else {
            if (bg) {
                bg.pause();
                bg.currentTime = 0;
            }
        }
    });

    // ========================================================= 
    // СТИЛІЗАЦІЯ МЕНЮ
    // Надаємо вікну красивий вигляд прямо через JS
    // ========================================================= 
    popup.style.display = "none";
    popup.style.position = "fixed";
    popup.style.top = "0";
    popup.style.left = "0";
    popup.style.width = "100%";
    popup.style.height = "100%";
    popup.style.background = "rgba(0,0,0,0.6)";
    popup.style.justifyContent = "center";
    popup.style.alignItems = "center";
    popup.style.zIndex = "9999";


    const windowBox = document.getElementById("theme-window");
    const buttons = windowBox.querySelectorAll("button");
    
    buttons.forEach(button => {
        button.style.padding = "12px";
        button.style.fontSize = "18px";
        button.style.cursor = "pointer";
        button.style.border = "none";
        button.style.borderRadius = "10px";
        button.style.width = "220px";
    });

    windowBox.style.background = "#202020";
    windowBox.style.color = "white";
    windowBox.style.padding = "30px";
    windowBox.style.borderRadius = "20px";
    windowBox.style.display = "flex";
    windowBox.style.flexDirection = "column";
    windowBox.style.alignItems = "center";
    windowBox.style.gap = "20px";
    windowBox.style.width = "850px";
    windowBox.style.maxWidth = "90%";

    // ========================================================= 
    // ОБРОБКА КЛІКІВ ПО КНОПКАХ
    // Прописуємо, що робити, коли натискають кнопки меню і теми
    // ========================================================= 
    if(configButton) {
        configButton.addEventListener("click", () => {
            popup.style.display = "flex";
        });
    }

    document.getElementById("close-theme-btn").addEventListener("click", () => {
        popup.style.display = "none";
    });

    document.getElementById("light-theme-btn").addEventListener("click", () => {
        document.body.classList.add("light-theme");
        localStorage.setItem("theme", "light");
        popup.style.display = "none";
    });

    document.getElementById("dark-theme-btn").addEventListener("click", () => {
        document.body.classList.remove("light-theme");
        localStorage.setItem("theme", "dark");
        popup.style.display = "none";
    });

    // ========================================================= 
    // РОБОТА ЕКРАНУ ЗАВАНТАЖЕННЯ ТА АУДІО
    // Керуємо стартовою заставкою та звуками при вході
    // ========================================================= 
    const loader = document.getElementById("loader");
    const intro = document.getElementById("introAudio");
    const introEnabled = localStorage.getItem("introEnabled") !== "false";
    const introAlreadyShown = sessionStorage.getItem("introShown");

    if (loader) {
        if (introEnabled && !introAlreadyShown) {
            
            loader.addEventListener("click", () => {
                loader.classList.add("hide");
                sessionStorage.setItem("introShown", "true");
                setTimeout(() => {
                    if(intro) intro.play().catch(e => console.log(e));
                }, 20); 
            }, { once:true }); 
        } else {
            
            loader.classList.add("hide");
            if(localStorage.getItem("musicEnabled") !== "false" && bg){
                bg.play().catch(e => console.log(e));
            }
        }
    }

    // Коли інтро закінчується — починає грати фонова музика
    if (intro) {
        intro.addEventListener("ended", () => {
            if(localStorage.getItem("musicEnabled") !== "false" && bg){
                bg.play().catch(e => console.log(e));
            }
        });
    }

    // =========================================================
    // ЗАВАНТАЖЕННЯ КАРТИН З API
    // Оптимізовано: збільшений limit, рандомний skip,
    // і ми заборонили кешування для отримання свіжих картин щоразу
    // =========================================================
    const galleryContainer = document.querySelector('.image-gallery-top');

    async function fetchArtworks() {
        if (!galleryContainer) return;

        // --- Показуємо скелетон поки чекаємо ---
        showSkeletons();

        try {
            // Рандомний offset для різноманітності картин
            const skip = Math.floor(Math.random() * 2000);
