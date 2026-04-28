(() => {
	if (typeof window === 'undefined') return;

	const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

	const autoReveal = [
		['#services .section__head', 'reveal'],
		['#services .services',      'reveal'],
		['#services .addons',        'reveal'],
		['#services .discovery',     'reveal'],

		['#work .section__head',     'reveal'],
		['#work .work',              'reveal-stagger'],
		['#work .work__featured',    'reveal'],

		['#stack .section__head',    'reveal'],
		['#stack .stack',            'reveal-stagger'],

		['#process .section__head',  'reveal'],
		['#process .process',        'reveal reveal-stagger'],

		['#contact .cta__label',     'reveal'],
		['#contact .cta__title',     'reveal'],
		['#contact .cta__actions',   'reveal'],
	];

	autoReveal.forEach(([sel, cls]) => {
		const el = document.querySelector(sel);
		if (el) cls.split(' ').forEach(c => el.classList.add(c));
	});

	if (reduced) {
		document.querySelectorAll('.reveal, .reveal-stagger').forEach(el => {
			el.classList.add('is-visible');
		});
		return;
	}

	const io = new IntersectionObserver((entries) => {
		entries.forEach(entry => {
			if (entry.isIntersecting) {
				entry.target.classList.add('is-visible');
				io.unobserve(entry.target);
			}
		});
	}, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

	document.querySelectorAll('.reveal, .reveal-stagger').forEach(el => io.observe(el));
})();

(() => {
	if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
	const portrait = document.querySelector('.portrait');
	if (!portrait) return;

	let ticking = false;
	const update = () => {
		const y = window.scrollY;
		if (y < 800) {
			portrait.style.setProperty('--portrait-y', `${(y * -0.04).toFixed(2)}px`);
			portrait.style.transform = `translateY(var(--portrait-y, 0))`;
		}
		ticking = false;
	};
	window.addEventListener('scroll', () => {
		if (!ticking) {
			requestAnimationFrame(update);
			ticking = true;
		}
	}, { passive: true });
})();