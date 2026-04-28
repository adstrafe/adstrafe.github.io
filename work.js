/* Slideshow: cycle .showcase__slide, sync .shots__item.is-active */
(function () {
	const root = document.querySelector('[data-slideshow]');
	if (!root) return;

	const slides = [...root.querySelectorAll('.showcase__slide')];
	const thumbs = [...document.querySelectorAll('[data-shot]')];
	const counterEl = document.querySelector('[data-slide-counter]');
	const prevBtn = document.querySelector('[data-slide-prev]');
	const nextBtn = document.querySelector('[data-slide-next]');

	if (!slides.length) return;

	let idx = 0;
	const total = slides.length;

	function render() {
		slides.forEach((s, i) => s.classList.toggle('is-active', i === idx));
		thumbs.forEach((t, i) => t.classList.toggle('is-active', i === idx));
		if (counterEl) {
			counterEl.textContent = String(idx + 1).padStart(2, '0') + ' / ' + String(total).padStart(2, '0');
		}
	}

	prevBtn && prevBtn.addEventListener('click', () => { idx = (idx - 1 + total) % total; render(); });
	nextBtn && nextBtn.addEventListener('click', () => { idx = (idx + 1) % total; render(); });
	thumbs.forEach((t, i) => t.addEventListener('click', () => { idx = i; render(); }));

	document.addEventListener('keydown', (e) => {
		if (e.key === 'ArrowLeft')  { idx = (idx - 1 + total) % total; render(); }
		if (e.key === 'ArrowRight') { idx = (idx + 1) % total; render(); }
	});

	render();
})();