document.addEventListener('DOMContentLoaded', () => {
    const gallery = document.getElementById('profileGallery');
    
    const savedArtworks = JSON.parse(localStorage.getItem('userProfile')) || [];

    const totalSlots = Math.max(12, savedArtworks.length);

    for (let i = 0; i < totalSlots; i++) {
        const square = document.createElement('div');
        square.className = 'black-square';

        if (savedArtworks[i]) {
            const img = document.createElement('img');
            img.src = savedArtworks[i].imgUrl;
            img.className = 'collected-img';
            
            img.onclick = () => {
                window.location.href = `details.html?id=${savedArtworks[i].id}`;
            };

            square.appendChild(img);
        }
        
        gallery.appendChild(square);
    }
});
