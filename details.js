const urlParams = new URLSearchParams(window.location.search);
const artId = urlParams.get('id');

function fixNumbers(text) {
    return text.replace(/(\d+)/g, '<span class="normal-numbers">$1</span>');
}

async function loadDetails() {
    if (!artId) return;

    try {
        const res = await fetch(`https://openaccess-api.clevelandart.org/api/artworks/${artId}`);
        const data = await res.json();
        const art = data.data;

        document.querySelector('.full-image').src = art.images.web.url;
        document.querySelector('.image').src = art.images.web.url;
        document.querySelector('.name').textContent = art.title;
        
        const infoTexts = document.querySelectorAll('.info-text');
        
        if (infoTexts.length >= 3) {
            const author = art.creators && art.creators.length > 0 ? art.creators[0].description : "Unknown Artist";
            
            // Використовуємо innerHTML замість textContent, щоб спрацювали стилі для цифр
            infoTexts[0].innerHTML = fixNumbers(`Artist: ${author}`);
            infoTexts[1].innerHTML = fixNumbers(`Year: ${art.creation_date || "Unknown"}`);
            infoTexts[2].innerHTML = fixNumbers(`Style: ${art.technique || "Unknown"}`);
        }
    } catch (error) {
        console.error("Помилка:", error);
    }
}

loadDetails();
