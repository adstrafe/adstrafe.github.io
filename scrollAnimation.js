const [aboutNode, projectsNode, contactNode] = document.querySelectorAll('.scroll-animation');

const ANIMATION_EPSILON = 0.1;
const ANIMATION_SPEED = 0.01;

let currentValue = window.scrollY;
let targetValue = currentValue;
let startTime = 0.0;
let isDirty = false;
let isRunning = false;

window.addEventListener('scroll', e => {
	isDirty = true;
	startTime = e.timeStamp;

	if (!isRunning) {
		requestAnimationFrame(updateScrollEffects);
		isRunning = true;
	}
});

function updateScrollEffects(time) {
	if (isDirty) {
		targetValue = window.scrollY;
		isDirty = false;
	}

	const dv = targetValue - currentValue;
	if (Math.abs(dv) < ANIMATION_EPSILON) {
		currentValue = targetValue;
		isRunning = false;
	}
	else {
		const dt = time - startTime;
		currentValue += dv / (dt * ANIMATION_SPEED + 1.0);

		requestAnimationFrame(updateScrollEffects);
	}

	// update CSS vars
	updateScrollValue(aboutNode, currentValue);
	updateScrollValue(projectsNode, currentValue);
	updateScrollValue(contactNode, currentValue);
}

function updateScrollValue(node, offset) {
	const vh = window.innerHeight * 0.7;
	node.style.setProperty('--x', Math.max(0.0, Math.min(1.0, (offset + vh - node.offsetTop) / (node.offsetHeight * 0.8))).toFixed(3));
}