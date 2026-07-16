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

        

            // =========================================================
            // ФІЛЬТР КОНТЕНТУ (дитячий проєкт)
            // Пропускаємо картини з назвами/описами, що містять
            // слова пов'язані з оголенням або непристойним змістом
            // =========================================================
            const BLOCKED_WORDS = [
                'nude', 'naked', 'bath', 'bather', 'bathing',
                'venus', 'erotic', 'sensual', 'odalisque',
                'harem', 'courtesan', 'prostitut', 'brothel',
                'undress', 'disrob', 'uncloth',
                'leda', 'bacchana', 'nymph', 'satyr',
                'breast', 'buttock', 'torso'
            ];

            // Регулярний вираз для CJK ієрогліфів (китайські, японські, корейські)
            const CJK_REGEX = /[\u3000-\u9fff\uF900-\uFAFF\u{20000}-\u{2FA1F}]/u;

            // Відділи музею, які виключаємо
            const BLOCKED_DEPARTMENTS = [
                'chinese', 'japanese', 'korean', 'asian',
                'islamic', 'indian'
            ];

            function isSafe(art) {
                const text = [
                    art.title || '',
                    art.description || '',
                    art.wall_description || '',
                    art.technique || ''
                ].join(' ').toLowerCase();

                // Перевірка на заборонені слова
                if (BLOCKED_WORDS.some(word => text.includes(word))) return false;

                // Перевірка на ієрогліфи в назві
                if (CJK_REGEX.test(art.title || '')) return false;

                // Перевірка відділу музею
                const dept = (art.department || '').toLowerCase();
                if (BLOCKED_DEPARTMENTS.some(d => dept.includes(d))) return false;

                return true;
            }

            // limit=100: беремо багато, щоб гарантовано знайти 3 безпечні картини
            const url =
                `https://openaccess-api.clevelandart.org/api/artworks/?has_image=1` +
                `&limit=100&skip=${skip}&type=Painting`;

            const response = await fetch(url, { cache: 'no-store' });
            const data = await response.json();

            let artworks = (data.data || [])
                .filter(art => art.images && art.images.web)
                .filter(isSafe)
                .slice(0, 3);

            // Fallback: якщо за цим skip не знайшло 3 — запитуємо з початку колекції
            if (artworks.length < 3) {
                const fallbackSkip = Math.floor(Math.random() * 500);
                const fallbackRes = await fetch(
                    `https://openaccess-api.clevelandart.org/api/artworks/?has_image=1&limit=100&skip=${fallbackSkip}&type=Painting`,
                    { cache: 'no-store' }
                );
                const fallbackData = await fallbackRes.json();
                artworks = (fallbackData.data || [])
                    .filter(art => art.images && art.images.web)
                    .filter(isSafe)
                    .sort(() => 0.5 - Math.random())
                    .slice(0, 3);
            }

            renderGallery(artworks);
        } catch (e) {
            console.error('Помилка завантаження картин:', e);
            galleryContainer.innerHTML = '';
        }
    }

    // =========================================================
    // СКЕЛЕТОН-ЗАГЛУШКИ
    // Показуємо сірі блоки з анімацією поки картини завантажуються
    // =========================================================
    function showSkeletons() {
        galleryContainer.innerHTML = '';
        galleryContainer.style.display = 'flex';
        galleryContainer.style.justifyContent = 'center';
        galleryContainer.style.gap = '40px';
        galleryContainer.style.flexWrap = 'wrap';

    

        for (let i = 0; i < 3; i++) {
            const skeleton = document.createElement('div');
            skeleton.style.cssText = [
                'width:300px', 'height:400px',
                'background:linear-gradient(90deg,#2a2a2a 25%,#3a3a3a 50%,#2a2a2a 75%)',
                'background-size:400% 100%',
                'animation:shimmer 1.4s ease infinite',
                'border:10px solid #e8e8e8',
                'box-shadow:10px 10px 20px rgba(0,0,0,0.5)',
                'border-radius:2px'
            ].join(';');
            galleryContainer.appendChild(skeleton);
        }

        // Додаємо @keyframes shimmer якщо ще немає
        if (!document.getElementById('shimmer-style')) {
            const style = document.createElement('style');
            style.id = 'shimmer-style';
            style.textContent = `
                @keyframes shimmer {
                    0%   { background-position: 100% 0; }
                    100% { background-position: -100% 0; }
                }
                .gallery-img-fade {
                    opacity: 0;
                    transition: opacity 0.4s ease, transform 0.3s ease, box-shadow 0.3s ease;
                }
                .gallery-img-fade.loaded {
                    opacity: 1;
                }
                .gallery-img-fade.loaded:hover {
                    transform: translateY(-12px) scale(1.03);
                    box-shadow: 0px 20px 40px rgba(0,0,0,0.6) !important;
                }
            `;
            document.head.appendChild(style);
        }
    }

    // =========================================================
    // ВІДМАЛЬОВКА ГАЛЕРЕЇ
    // Плавна поява: картина стає видимою тільки після повного завантаження
    // =========================================================
    function renderGallery(artworks) {
        galleryContainer.innerHTML = '';
        galleryContainer.style.display = 'flex';
        galleryContainer.style.justifyContent = 'center';
        galleryContainer.style.gap = '40px';
        galleryContainer.style.flexWrap = 'wrap';

        artworks.forEach(art => {
            const wrapper = document.createElement('div');
            wrapper.style.cssText = 'position:relative;width:300px;height:400px;';

            // Скелетон під зображенням поки воно грузиться
            const skeleton = document.createElement('div');
            skeleton.style.cssText = [
                'position:absolute', 'inset:0',
                'background:linear-gradient(90deg,#2a2a2a 25%,#3a3a3a 50%,#2a2a2a 75%)',
                'background-size:400% 100%',
                'animation:shimmer 1.4s ease infinite',
                'border:10px solid #e8e8e8'
            ].join(';');
            wrapper.appendChild(skeleton);

            const img = document.createElement('img');
            img.src = art.images.web.url;
            img.alt = art.title;
            img.decoding = 'async';   // не блокує рендер
            img.fetchPriority = 'high'; // браузер завантажує в першу чергу
            img.classList.add('gallery-img-fade');

            img.style.cssText = [
                'position:absolute', 'inset:0',
                'width:300px', 'height:400px',
                'object-fit:cover',
                'border:10px solid #e8e8e8',
                'box-shadow:10px 10px 20px rgba(0,0,0,0.5)',
                'cursor:pointer'
            ].join(';');

            // Плавна поява після завантаження, прибираємо скелетон
            img.onload = () => {
                skeleton.remove();
                img.classList.add('loaded');
            };
            img.onerror = () => {
                skeleton.remove();
            };

            img.onclick = () => {
                saveToProfile(art);
                showArtworkOverlay(art.id, art.images.web.url, art.title);
            };

            wrapper.appendChild(img);
            galleryContainer.appendChild(wrapper);
        });
    }

    // Автоматичне оновлення кожні 15 секунд прибрано за бажанням користувача.

                          

    // ========================================================= 
    // ЗБЕРЕЖЕННЯ В ПРОФІЛЬ
    // ========================================================= 
    function saveToProfile(art) {
        let profile = JSON.parse(localStorage.getItem('userProfile')) || [];
        if (!profile.find(item => item.id === art.id)) {
            profile.push({ id: art.id, imgUrl: art.images.web.url, title: art.title || 'Untitled' });
            localStorage.setItem('userProfile', JSON.stringify(profile));
        }
    }

    // ========================================================= 
    // ARTWORK DETAIL OVERLAY
    // Завантажуємо деталі з API і показуємо в оверлеї
    // ========================================================= 
    const artworkOverlay = document.getElementById('artwork-overlay');
    const artworkBack = document.getElementById('artwork-back');

    function fixNumbers(text) {
        return text.replace(/(\d+)/g, '<span class="normal-numbers">$1</span>');
    }

    async function showArtworkOverlay(artId, imgUrl = '', title = '') {
        if (!artworkOverlay) return;
        artworkOverlay.classList.add('open');
        artworkOverlay.scrollTop = 0;

        // Скидаємо або ставимо передані базові дані відразу
        if (imgUrl) {
            document.getElementById('detail-thumb').src = imgUrl;
            document.getElementById('detail-full').src = imgUrl;
        } else {
            document.getElementById('detail-thumb').src = '';
            document.getElementById('detail-full').src = '';
        }
        document.getElementById('detail-name').textContent = title || 'Loading...';
        document.getElementById('detail-artist').textContent = 'Artist: —';
        document.getElementById('detail-year').textContent = 'Year: —';
        document.getElementById('detail-style').textContent = 'Style: —';
        document.getElementById('detail-desc').textContent = 'Loading description...';

        try {
            const res = await fetch(`https://openaccess-api.clevelandart.org/api/artworks/${artId}`);
            const data = await res.json();
            const art = data.data;

            // Якщо ми не мали imgUrl раніше, ставимо тепер
            if (!imgUrl) {
                document.getElementById('detail-thumb').src = art.images.web.url;
                document.getElementById('detail-full').src = art.images.web.url;
            }
            document.getElementById('detail-name').textContent = art.title || title || 'Unknown';

            const author = art.creators && art.creators.length > 0
                ? art.creators[0].description : 'Unknown Artist';
            document.getElementById('detail-artist').innerHTML = fixNumbers(`Artist: ${author}`);
            document.getElementById('detail-year').innerHTML = fixNumbers(`Year: ${art.creation_date || 'Unknown'}`);
            document.getElementById('detail-style').innerHTML = fixNumbers(`Style: ${art.technique || art.style || 'Unknown'}`);

            let desc = art.wall_description || art.description || '';
            if (!desc.trim()) {
                const titleName = art.title || 'This artwork';
                const year = art.creation_date || '';
                desc = `<em>"${titleName}"</em> (${year}) is a captivating work from the Cleveland Museum of Art's collection. The composition invites the viewer into a world shaped by the artist's unique perspective.`;
            }
            document.getElementById('detail-desc').innerHTML = desc;
        } catch (e) {
            document.getElementById('detail-desc').textContent = 'Could not load artwork details.';
        }
    }

    if (artworkBack) {
        artworkBack.addEventListener('click', () => {
            artworkOverlay.classList.remove('open');
            // Оновлюємо картинки при поверненні назад
            fetchArtworks();
        });
    }


                          

    // ========================================================= 
    // PROFILE OVERLAY
    // ========================================================= 
    const profileOverlay = document.getElementById('profile-overlay');
    const profileBack = document.getElementById('profile-back');
    const profileBtn = document.querySelector('.profile');

    function showProfileOverlay() {
        if (!profileOverlay) return;
        profileOverlay.classList.add('open');
        profileOverlay.scrollTop = 0;

        const grid = document.getElementById('profile-grid');
        const counter = document.getElementById('profile-counter');
        const clearBtn = document.getElementById('profile-clear');
        const profile = JSON.parse(localStorage.getItem('userProfile')) || [];

        grid.innerHTML = '';

        if (profile.length === 0) {
            counter.textContent = '';
            clearBtn.style.display = 'none';
            grid.innerHTML = '<p class="profile-empty">You haven\'t viewed any artworks yet. Go explore the gallery!</p>';
            return;
        }

        counter.textContent = `${profile.length} artwork${profile.length !== 1 ? 's' : ''} viewed`;
        clearBtn.style.display = 'inline-block';

        profile.forEach(item => {
            const card = document.createElement('div');
            card.className = 'p-card';

            const img = document.createElement('img');
            img.src = item.imgUrl;
            img.alt = item.title || 'Artwork';
            img.loading = 'lazy';

            const title = document.createElement('p');
            title.className = 'p-card-title';
            title.textContent = item.title || 'Untitled';

            card.appendChild(img);
            card.appendChild(title);
            card.addEventListener('click', () => {
                showArtworkOverlay(item.id, item.imgUrl, item.title);
            });
            grid.appendChild(card);
        });

        // Clear history
        clearBtn.onclick = () => {
            if (confirm('Clear all viewing history?')) {
                localStorage.removeItem('userProfile');
                grid.innerHTML = '<p class="profile-empty">History cleared!</p>';
                counter.textContent = '';
                clearBtn.style.display = 'none';
            }
        };
    }

    if (profileBtn) {
        profileBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showProfileOverlay();
        });
    }
    if (profileBack) {
        profileBack.addEventListener('click', () => {
            profileOverlay.classList.remove('open');
        });
    }

    fetchArtworks();
});

