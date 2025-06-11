import { GravityScrollAnimator } from './animations.mjs'

async function fetchData() {
	const response = await fetch('data/pricing.json');
	if (!response.ok) {
		throw new Error('Failed to fetch pricing.json');
	}
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

function initializeReservationTabs(data) {
	const barberTabs = document.querySelectorAll('#barber-tabs .barber-tab');
	const barberContents = document.querySelectorAll('.barber-content');
	const serviceTabs = {
		lucie: document.querySelectorAll('#lucie-service-tabs .service-tab'),
		david: document.querySelectorAll('#david-service-tabs .service-tab')
	};
	const serviceContents = {
		lucie: {
			haircuts: document.getElementById('lucie-haircuts'),
			beard: document.getElementById('lucie-beard'),
			other: document.getElementById('lucie-other')
		},
		david: {
			haircuts: document.getElementById('david-haircuts'),
			beard: document.getElementById('david-beard'),
			other: document.getElementById('david-other')
		}
	};

	function populateServiceCards(barber, category, container) {
		container.innerHTML = '';
		const services = data[category]?.filter(item => item.enabled && item[`url_${barber}`]) || [];
		if (services.length === 0) {
			console.warn(`No services found for ${barber} in category ${category}`);
			container.innerHTML = '<p>Žádné služby k dispozici.</p>';
			return;
		}
		const serviceContainer = document.createElement('div');
		serviceContainer.className = 'service-card-container';
		services.forEach(item => {
			const card = document.createElement('div');
			card.className = 'service-card';
			card.innerHTML = `
				<h3>${item.title}</h3>
				${item.description ? `<p>${item.description}</p>` : ''}
				<p class="price">${item.price}</p>
				<a href="${item[`url_${barber}`]}" class="reserve-button" target="_blank">Rezervovat</a>
			`;
			serviceContainer.appendChild(card);
		});
		container.appendChild(serviceContainer);

		const animator = new GravityScrollAnimator();
		serviceContainer.querySelectorAll('.service-card').forEach((el, index) => {
			el.classList.add('animate-on-scroll', 'space-distort');
			el.style.transitionDelay = `${0.1 * (index + 1)}s`;
			animator.observer.observe(el);
		});
	}

	function activateTab(tabs, contents, activeTab) {
		tabs.forEach(tab => tab.classList.remove('active'));
		contents.forEach(content => content.classList.remove('active'));
		activeTab.classList.add('active');
		let contentId;
		if (activeTab.dataset.barber) {
			contentId = `${activeTab.dataset.barber}-content`;
		} else {
			const barber = activeTab.closest('.barber-content').id.split('-')[0];
			contentId = `${barber}-${activeTab.dataset.category}`;
		}
		const content = document.getElementById(contentId);
		if (content) {
			content.classList.add('active');
			console.log(`Activated content: ${contentId}`);
		} else {
			console.error(`Content not found for ID: ${contentId}`);
		}
	}

	barberTabs.forEach(tab => {
		tab.addEventListener('click', () => {
			activateTab(barberTabs, barberContents, tab);
			const barber = tab.dataset.barber;
			const defaultCategory = 'haircuts';
			const defaultTab = serviceTabs[barber][0];
			activateTab(serviceTabs[barber], Object.values(serviceContents[barber]), defaultTab);
			populateServiceCards(barber, defaultCategory, serviceContents[barber][defaultCategory]);
		});
	});

	Object.keys(serviceTabs).forEach(barber => {
		serviceTabs[barber].forEach(tab => {
			tab.addEventListener('click', () => {
				activateTab(serviceTabs[barber], Object.values(serviceContents[barber]), tab);
				populateServiceCards(barber, tab.dataset.category, serviceContents[barber][tab.dataset.category]);
			});
		});
	});

	const animator = new GravityScrollAnimator();
	barberTabs.forEach((el, index) => {
		el.classList.add('animate-on-scroll', 'stagger-item');
		el.style.transitionDelay = `${0.1 * (index + 1)}s`;
		animator.observer.observe(el);
	});
	Object.keys(serviceTabs).forEach(barber => {
		serviceTabs[barber].forEach((el, index) => {
			el.classList.add('animate-on-scroll', 'stagger-item');
			el.style.transitionDelay = `${0.1 * (index + 1)}s`;
			animator.observer.observe(el);
		});
	});

	activateTab(barberTabs, barberContents, barberTabs[0]);
	activateTab(serviceTabs.lucie, Object.values(serviceContents.lucie), serviceTabs.lucie[0]);
	populateServiceCards('lucie', 'haircuts', serviceContents.lucie.haircuts);
}
// Initialize
(async () => {
	const data = await fetchData();
	createLeftToRightCarousel('haircuts-track', data.haircuts);
	createRightToLeftCarousel('beard-track', data.beard);
	createLeftToRightCarousel('other-track', data.other);
	initializeReservationTabs(data);
})();