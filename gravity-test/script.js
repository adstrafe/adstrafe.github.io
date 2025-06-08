async function fetchData() {
    const response = await fetch('data/pricing.json');

    const data = await response.json();
    return data;
}

function createLeftToRightCarousel(trackId, items) {
    const track = document.getElementById(trackId);
    const container = track.parentElement;
    const cardWidth = 320; // Card width (300px) + margins (10px + 10px)
    const containerWidth = container.offsetWidth;
    const cardsNeeded = Math.max(Math.ceil(containerWidth / cardWidth) * 3, items.length * 2); // Ensure enough cards
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
    const speed = 0.3; // Pixels per frame

    function animate() {
        position -= speed; // Move left
        if (position <= -cardWidth) {
            position += cardWidth; // Reset position
            const firstCard = cardElements.shift(); // Remove first card
            track.appendChild(firstCard); // Append to end
            cardElements.push(firstCard); // Update array
        }
        track.style.transform = `translateX(${position}px)`;
        requestAnimationFrame(animate);
    }

    // Start animation
    animate();
}

function createRightToLeftCarousel(trackId, items) {
    const track = document.getElementById(trackId);
    const container = track.parentElement;
    const cardWidth = 320; // Card width (300px) + margins (10px + 10px)
    const containerWidth = container.offsetWidth;
    const cardsNeeded = Math.max(Math.ceil(containerWidth / cardWidth) * 4, items.length * 3); // More cards for smaller sets
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

    let position = -cardWidth; // Start offset to align cards
    const speed = 0.3; // Pixels per frame

    function animate() {
        position += speed; // Move right
        if (position >= 0) { // Reposition when card fully exits right edge
            position -= cardWidth; // Reset position
            const lastCard = cardElements.pop(); // Remove last card
            track.insertBefore(lastCard, track.firstChild); // Prepend to start
            cardElements.unshift(lastCard); // Update array
        }
        track.style.transform = `translateX(${position}px)`;
        requestAnimationFrame(animate);
    }

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
