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
    const isMobile = window.innerWidth <= 768;
    const cardsNeeded = isMobile ? items.length : Math.max(Math.ceil(containerWidth / cardWidth) * 3, items.length * 2);
    const totalCards = items.length;

    // Create cards
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

    // Add navigation arrows for mobile
    if (isMobile) {
        const nav = document.createElement('div');
        nav.className = 'carousel-nav';
        nav.innerHTML = `
            <button class="carousel-nav-button prev">&larr;</button>
            <button class="carousel-nav-button next">&rarr;</button>
        `;
        container.appendChild(nav);
    }

    let position = 0;
    let currentIndex = 0;
    let isPaused = false;
    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;
    let isHorizontalScroll = false;
    let speed = isMobile ? 0 : 0.3;

    if (isMobile) {
        // Show only the first card initially
        cardElements.forEach((card, index) => {
            card.style.transform = `translateY(${index * 100}%)`;
            card.style.opacity = index === 0 ? '1' : '0';
            if (index === 0) card.classList.add('active');
        });
    }

    function updateMobileCards(direction = null) {
        cardElements.forEach((card, index) => {
            const offset = index - currentIndex;
            card.style.transform = `translateY(${offset * 100}%)`;
            card.style.opacity = offset === 0 ? '1' : '0';
            card.classList.toggle('active', offset === 0);
            if (direction === 'next' && offset === 0) {
                card.style.transform = 'translateY(100%)';
                card.style.opacity = '0';
                setTimeout(() => {
                    card.style.transition = 'none';
                    card.style.transform = 'translateY(0)';
                    card.style.opacity = '1';
                    card.style.transition = 'opacity 0.5s ease-in-out, transform 0.5s ease-in-out';
                }, 50);
            } else if (direction === 'prev' && offset === 0) {
                card.style.transform = 'translateY(-100%)';
                card.style.opacity = '0';
                setTimeout(() => {
                    card.style.transition = 'none';
                    card.style.transform = 'translateY(0)';
                    card.style.opacity = '1';
                    card.style.transition = 'opacity 0.5s ease-in-out, transform 0.5s ease-in-out';
                }, 50);
            }
        });
    }

    function snapToBoundary() {
        if (!isMobile) {
            const cardCount = cardElements.length;
            const maxPosition = -(cardCount - 1) * cardWidth;
            if (position > 0) {
                position = 0;
            } else if (position < maxPosition) {
                position = maxPosition;
            }
            if (position === 0 || position === maxPosition) {
                track.style.transition = 'transform 0.3s ease-out';
                track.style.transform = `translateX(${position}px)`;
                setTimeout(() => {
                    track.style.transition = '';
                }, 300);
            }
        }
    }

    function animate() {
        if (!isMobile && !isPaused) {
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

    // Navigation for mobile
    if (isMobile) {
        const prevButton = container.querySelector('.prev');
        const nextButton = container.querySelector('.next');

        prevButton.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + totalCards) % totalCards;
            updateMobileCards('prev');
        });

        nextButton.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % totalCards;
            updateMobileCards('next');
        });
    }

    // Touch event handlers (desktop only)
    if (!isMobile) {
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
    }

    // Handle window resize
    window.addEventListener('resize', () => {
        speed = window.innerWidth <= 768 ? 0 : 0.3;
        if (window.innerWidth <= 768 && !isMobile) {
            location.reload(); // Reload to reinitialize for mobile
        } else if (window.innerWidth > 768 && isMobile) {
            location.reload(); // Reload to reinitialize for desktop
        }
    });

    // Start animation
    animate();
}

function createRightToLeftCarousel(trackId, items) {
    const track = document.getElementById(trackId);
    const container = track.parentElement;
    const cardWidth = 320;
    const containerWidth = container.offsetWidth;
    const isMobile = window.innerWidth <= 768;
    const cardsNeeded = isMobile ? items.length : Math.max(Math.ceil(containerWidth / cardWidth) * 4, items.length * 3);
    const totalCards = items.length;

    // Create cards
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

    // Add navigation arrows for mobile
    if (isMobile) {
        const nav = document.createElement('div');
        nav.className = 'carousel-nav';
        nav.innerHTML = `
            <button class="carousel-nav-button prev">&larr;</button>
            <button class="carousel-nav-button next">&rarr;</button>
        `;
        container.appendChild(nav);
    }

    let position = -cardWidth;
    let currentIndex = 0;
    let isPaused = false;
    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;
    let isHorizontalScroll = false;
    let speed = isMobile ? 0 : 0.3;

    if (isMobile) {
        // Show only the first card initially
        cardElements.forEach((card, index) => {
            card.style.transform = `translateY(${index * 100}%)`;
            card.style.opacity = index === 0 ? '1' : '0';
            if (index === 0) card.classList.add('active');
        });
    }

    function updateMobileCards(direction = null) {
        cardElements.forEach((card, index) => {
            const offset = index - currentIndex;
            card.style.transform = `translateY(${offset * 100}%)`;
            card.style.opacity = offset === 0 ? '1' : '0';
            card.classList.toggle('active', offset === 0);
            if (direction === 'next' && offset === 0) {
                card.style.transform = 'translateY(100%)';
                card.style.opacity = '0';
                setTimeout(() => {
                    card.style.transition = 'none';
                    card.style.transform = 'translateY(0)';
                    card.style.opacity = '1';
                    card.style.transition = 'opacity 0.5s ease-in-out, transform 0.5s ease-in-out';
                }, 50);
            } else if (direction === 'prev' && offset === 0) {
                card.style.transform = 'translateY(-100%)';
                card.style.opacity = '0';
                setTimeout(() => {
                    card.style.transition = 'none';
                    card.style.transform = 'translateY(0)';
                    card.style.opacity = '1';
                    card.style.transition = 'opacity 0.5s ease-in-out, transform 0.5s ease-in-out';
                }, 50);
            }
        });
    }

    function snapToBoundary() {
        if (!isMobile) {
            const cardCount = cardElements.length;
            const maxPosition = -(cardCount - 1) * cardWidth;
            if (position > 0) {
                position = 0;
            } else if (position < maxPosition) {
                position = maxPosition;
            }
            if (position === 0 || position === maxPosition) {
                track.style.transition = 'transform 0.3s ease-out';
                track.style.transform = `translateX(${position}px)`;
                setTimeout(() => {
                    track.style.transition = '';
                }, 300);
            }
        }
    }

    function animate() {
        if (!isMobile && !isPaused) {
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

    // Navigation for mobile
    if (isMobile) {
        const prevButton = container.querySelector('.prev');
        const nextButton = container.querySelector('.next');

        prevButton.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + totalCards) % totalCards;
            updateMobileCards('prev');
        });

        nextButton.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % totalCards;
            updateMobileCards('next');
        });
    }

    // Touch event handlers (desktop only)
    if (!isMobile) {
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
    }

    // Handle window resize
    window.addEventListener('resize', () => {
        speed = window.innerWidth <= 768 ? 0 : 0.3;
        if (window.innerWidth <= 768 && !isMobile) {
            location.reload();
        } else if (window.innerWidth > 768 && isMobile) {
            location.reload();
        }
    });

    // Start animation
    animate();
}

// Initialize carousels
(async () => {
    const { haircuts, beard, other } = await fetchData();
    createLeftToRightCarousel('haircuts-track', haircuts);
    createRightToLeftCarousel('beard-track', beard);
    createLeftToRightCarousel('other-track', other);
})();