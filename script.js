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
