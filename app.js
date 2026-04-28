/* ==========================================================================
   Mobile nav toggle
   ========================================================================== */

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
})();