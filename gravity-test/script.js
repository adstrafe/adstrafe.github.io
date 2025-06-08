async function fetchData() {
    const response = await fetch('data/pricing.json');

    const data = await response.json();
    return data;
}

function createLeftToRightCarousel(trackId, items) {
    const track = document.getElementById(trackId);
    const container = track.parentElement;
    const cardWidth = 320;
    const containerWidth = container.offsetWidth;
    const cardsNeeded = Math.max(Math.ceil(containerWidth / cardWidth) * 3, items.length * 2);
    const totalCards = items.length;

    // Store cards for repositioning
    const cardElements = [];
    for (let i = 0; i < cardsNeeded; i++) {
        const item = items[i % totalCards];
        const card = document.createElement('div');
        card.className = 'carousel-card';
        card.innerHTML = `
            <h3>${item.title}</h3>
            ${item.description ? `<p>${item.description}</p>` : ''}
            <p class="price">${item.price}</p>
        `;
        track.appendChild(card);
        cardElements.push(card);
    }

    let position = 0;
    let isPaused = false;
    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;
    let isHorizontalScroll = false;
    let speed = window.innerWidth <= 768 ? 0 : 0.3;

    function snapToBoundary() {
        const cardCount = cardElements.length;
        const maxPosition = -(cardCount - 1) * cardWidth;
        
        // Only snap if we're beyond the boundaries
        if (position > 0) {
            position = 0;
        } else if (position < maxPosition) {
            position = maxPosition;
        }

        // Add smooth transition only when snapping
        if (position === 0 || position === maxPosition) {
            track.style.transition = 'transform 0.3s ease-out';
            track.style.transform = `translateX(${position}px)`;
            setTimeout(() => {
                track.style.transition = '';
            }, 300);
        }
    }

    function animate() {
        if (!isPaused) {
            position -= speed;
            if (position <= -cardWidth) {
                position += cardWidth;
                const firstCard = cardElements.shift();
                track.appendChild(firstCard);
                cardElements.push(firstCard);
            }
            track.style.transform = `translateX(${position}px)`;
        }
        requestAnimationFrame(animate);
    }

    // Handle window resize
    window.addEventListener('resize', () => {
        speed = window.innerWidth <= 768 ? 0 : 0.3;
    });

    // Touch event handlers
    track.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        isHorizontalScroll = false;
    });

    track.addEventListener('touchmove', (e) => {
        touchEndX = e.touches[0].clientX;
        touchEndY = e.touches[0].clientY;
        
        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;
        
        // Determine if the scroll is primarily horizontal
        if (!isHorizontalScroll && Math.abs(deltaX) > Math.abs(deltaY)) {
            isHorizontalScroll = true;
            isPaused = true;
            e.preventDefault();
        }
        
        if (isHorizontalScroll) {
            position += deltaX * 0.5;
            track.style.transform = `translateX(${position}px)`;
            touchStartX = touchEndX;
            touchStartY = touchEndY;
        }
    });

    track.addEventListener('touchend', () => {
        isPaused = false;
        isHorizontalScroll = false;
        snapToBoundary();
    });

    // Start animation
    animate();
}

function createRightToLeftCarousel(trackId, items) {
    const track = document.getElementById(trackId);
    const container = track.parentElement;
    const cardWidth = 320;
    const containerWidth = container.offsetWidth;
    const cardsNeeded = Math.max(Math.ceil(containerWidth / cardWidth) * 4, items.length * 3);
    const totalCards = items.length;

    // Store cards for repositioning
    const cardElements = [];
    for (let i = 0; i < cardsNeeded; i++) {
        const item = items[i % totalCards];
        const card = document.createElement('div');
        card.className = 'carousel-card';
        card.innerHTML = `
            <h3>${item.title}</h3>
            ${item.description ? `<p>${item.description}</p>` : ''}
            <p class="price">${item.price}</p>
        `;
        track.appendChild(card);
        cardElements.push(card);
    }

    let position = -cardWidth;
    let isPaused = false;
    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;
    let isHorizontalScroll = false;
    let speed = window.innerWidth <= 768 ? 0 : 0.3;

    function snapToBoundary() {
        const cardCount = cardElements.length;
        const maxPosition = -(cardCount - 1) * cardWidth;
        
        // Only snap if we're beyond the boundaries
        if (position > 0) {
            position = 0;
        } else if (position < maxPosition) {
            position = maxPosition;
        }

        // Add smooth transition only when snapping
        if (position === 0 || position === maxPosition) {
            track.style.transition = 'transform 0.3s ease-out';
            track.style.transform = `translateX(${position}px)`;
            setTimeout(() => {
                track.style.transition = '';
            }, 300);
        }
    }

    function animate() {
        if (!isPaused) {
            position += speed;
            if (position >= 0) {
                position -= cardWidth;
                const lastCard = cardElements.pop();
                track.insertBefore(lastCard, track.firstChild);
                cardElements.unshift(lastCard);
            }
            track.style.transform = `translateX(${position}px)`;
        }
        requestAnimationFrame(animate);
    }

    // Handle window resize
    window.addEventListener('resize', () => {
        speed = window.innerWidth <= 768 ? 0 : 0.3;
    });

    // Touch event handlers
    track.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        isHorizontalScroll = false;
    });

    track.addEventListener('touchmove', (e) => {
        touchEndX = e.touches[0].clientX;
        touchEndY = e.touches[0].clientY;
        
        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;
        
        // Determine if the scroll is primarily horizontal
        if (!isHorizontalScroll && Math.abs(deltaX) > Math.abs(deltaY)) {
            isHorizontalScroll = true;
            isPaused = true;
            e.preventDefault();
        }
        
        if (isHorizontalScroll) {
            position += deltaX * 0.5;
            track.style.transform = `translateX(${position}px)`;
            touchStartX = touchEndX;
            touchStartY = touchEndY;
        }
    });

    track.addEventListener('touchend', () => {
        isPaused = false;
        isHorizontalScroll = false;
        snapToBoundary();
    });

    // Start animation
    animate();
}

// Initialize carousels
(async () => {
    const { haircuts, beard, other } = await fetchData();
    createLeftToRightCarousel('haircuts-track', haircuts); // Left-to-right
    createRightToLeftCarousel('beard-track', beard); // Right-to-left
    createLeftToRightCarousel('other-track', other); // Left-to-right
})();
