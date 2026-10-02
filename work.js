/* Gallery controls: buttons, thumbnails and local arrow-key navigation. */
(() => {
	const root = document.querySelector('[data-slideshow]');
	if (!root) return;
	const gallery = root.closest('.showcase');
	const slides = [...root.querySelectorAll('.showcase__slide')];
	if (!gallery || !slides.length) return;

	const thumbs = [...gallery.querySelectorAll('[data-shot]')];
	const counters = [...gallery.querySelectorAll('[data-slide-counter]')];
	const prev = gallery.querySelector('[data-slide-prev]');
	const next = gallery.querySelector('[data-slide-next]');
	let index = 0;
	const pad = value => String(value).padStart(2, '0');

	function render() {
		slides.forEach((slide, i) => {
			slide.classList.toggle('is-active', i === index);
			slide.setAttribute('aria-hidden', String(i !== index));
		});
		thumbs.forEach((thumb, i) => {
			thumb.classList.toggle('is-active', i === index);
			thumb.setAttribute('aria-pressed', String(i === index));
		});
		counters.forEach(counter => {
			counter.textContent = pad(index + 1) + ' / ' + pad(slides.length);
		});
	}

	function move(step) {
		index = (index + step + slides.length) % slides.length;
		render();
	}

	prev?.addEventListener('click', () => move(-1));
	next?.addEventListener('click', () => move(1));
	thumbs.forEach((thumb, i) => thumb.addEventListener('click', () => {
		if (i >= slides.length) return;
		index = i;
		render();
	}));

	gallery.addEventListener('keydown', event => {
		if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
		event.preventDefault();
		move(event.key === 'ArrowLeft' ? -1 : 1);
	});

	render();
})();
