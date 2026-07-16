const galleryContainer = document.querySelector('.image-gallery-top');

async function fetchArtworks() {
    try {
        const response = await fetch('https://openaccess-api.clevelandart.org/api/artworks/?has_image=1&limit=50&type=Painting');
        const data = await response.json();
        const artworks = data.data.filter(art => art.images && art.images.web);
        const selected = artworks.sort(() => 0.5 - Math.random()).slice(0, 3);
        
        renderGallery(selected);
    } catch (e) { 
        console.error("Помилка:", e); 
    }
}

function renderGallery(artworks) {
    galleryContainer.innerHTML = ''; 
    
    // Вирівнюємо картини в лінію
    galleryContainer.style.display = 'flex';
    galleryContainer.style.justifyContent = 'center';
    galleryContainer.style.gap = '40px';
    galleryContainer.style.flexWrap = 'wrap';

    artworks.forEach(art => {
        const img = document.createElement('img');
        img.src = art.images.web.url;
        img.alt = art.title;
        
        // ЖОРСТКІ РОЗМІРИ: тепер вони будуть однаковими і акуратними
        img.style.width = '300px';
        img.style.height = '400px';
        img.style.objectFit = 'cover'; 
        img.style.border = '10px solid #e8e8e8'; 
        img.style.boxShadow = '10px 10px 20px rgba(0,0,0,0.5)'; 
        img.style.cursor = 'pointer';
        
        // Перехід на іншу сторінку при кліку
        img.onclick = () => {
            saveToProfile(art);
            window.location.href = `details.html?id=${art.id}`;
        };

        galleryContainer.appendChild(img);
    });
}

function saveToProfile(art) {
    let profile = JSON.parse(localStorage.getItem('userProfile')) || [];
    if (!profile.find(item => item.id === art.id)) {
        profile.push({ id: art.id, imgUrl: art.images.web.url });
        localStorage.setItem('userProfile', JSON.stringify(profile));
    }
}

fetchArtworks();
