(() => {
	const toggle = document.querySelector('.nav__toggle');
	const links = document.querySelector('.nav__links');
	if (!toggle || !links) return;

	toggle.addEventListener('click', () => {
		const open = links.classList.toggle('nav__links--open');
		toggle.classList.toggle('open', open);
		toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
	});

	links.addEventListener('click', e => {
		if (e.target.closest('.nav__link')) {
			links.classList.remove('nav__links--open');
			toggle.classList.remove('open');
			toggle.setAttribute('aria-expanded', 'false');
		}
	});

	document.addEventListener('click', event => {
		const link = event.target.closest('.nav a[href]');
		if (!link || event.defaultPrevented || event.button !== 0 ||
			event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
		if (link.hash || link.href !== window.location.href ||
			(link.target && link.target !== '_self') || link.hasAttribute('download')) return;
		event.preventDefault();
	});
})();

(() => {
	const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
	if (reducedMotion.matches || !('IntersectionObserver' in window)) return;

	const observer = new IntersectionObserver(entries => {
		entries.forEach(entry => {
			if (!entry.isIntersecting || !entry.target.classList.contains('reveal-pending')) return;
			observer.unobserve(entry.target);
			entry.target.classList.remove('reveal-pending');
			if (!reducedMotion.matches) entry.target.classList.add('reveal-in');
		});
	}, { threshold: 0, rootMargin: '0px 0px 80px 0px' });

	document.querySelectorAll('.section__head, .example, .offer, .project, .step, .contact__title, .contact__cta, .showcase__figure, .project-section').forEach(element => {
		if (element.getBoundingClientRect().top <= window.innerHeight) return;
		if (element.matches('.step')) {
			const index = [...element.parentElement.querySelectorAll('.step')].indexOf(element);
			element.style.setProperty('--reveal-delay', index * 120 + 'ms');
		}
		element.classList.add('reveal-pending');
		observer.observe(element);
	});

	document.addEventListener('focusin', event => {
		const element = event.target.closest('.reveal-pending');
		if (!element) return;
		observer.unobserve(element);
		element.classList.remove('reveal-pending');
	});

	reducedMotion.addEventListener('change', () => {
		if (!reducedMotion.matches) return;
		observer.disconnect();
		document.querySelectorAll('.reveal-pending').forEach(element => element.classList.remove('reveal-pending'));
	});
})();
