// Gravity-themed Scroll Animation Handler
class GravityScrollAnimator {
    constructor() {
        this.observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.15
        };

        this.observer = new IntersectionObserver(this.handleIntersection.bind(this), this.observerOptions);
        this.animatedElements = new Set();
    }

    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                this.animateElement(entry.target);
            }
        });
    }

    animateElement(element) {
        if (!this.animatedElements.has(element)) {
            element.classList.add('visible');
            this.animatedElements.add(element);
        }
    }

    triggerInitialLoad() {
        // Add a small delay to ensure smooth animation
        setTimeout(() => {
            const logoContainer = document.querySelector('.logo-container');
            if (logoContainer) {
                logoContainer.classList.add('loaded');
            }
        }, 100);
    }

    observeElements() {
        // Headers with gravity pull effect
        document.querySelectorAll('.text-grid > h1, .about > h1').forEach(el => {
            el.classList.add('animate-on-scroll', 'gravity-pull');
            this.observer.observe(el);
        });

        // Paragraphs with gravity wave effect
        document.querySelectorAll('.contacts-paragraph p, .about > p').forEach(el => {
            el.classList.add('animate-on-scroll', 'gravity-wave');
            this.observer.observe(el);
        });

        // Contact grid items with space distortion
        document.querySelectorAll('.contact-grid > div').forEach(el => {
            el.classList.add('animate-on-scroll', 'space-distort');
            this.observer.observe(el);
        });

        // Services header with orbital entry
        document.querySelectorAll('.services-header').forEach(el => {
            el.classList.add('animate-on-scroll', 'orbital-entry');
            this.observer.observe(el);
        });

        // Location cards with space distortion
        document.querySelectorAll('.card').forEach(el => {
            el.classList.add('animate-on-scroll', 'space-distort');
            this.observer.observe(el);
        });
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.triggerInitialLoad();
            this.observeElements();
        });
    }
}

// Initialize the animator
const gravityAnimator = new GravityScrollAnimator();
gravityAnimator.init(); 