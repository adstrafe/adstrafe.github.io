(function () {
  'use strict';

  var HEADER_OFFSET = 62;

  var REVEAL_SELECTOR = [
    '[data-variant] section:not(:first-of-type) > div:not(.mb-contact-overlay)',
    '[data-variant] section:not(:first-of-type) > h2',
    '[data-variant] section:not(:first-of-type) > p',
    '[data-variant] footer > div'
  ].join(',');

  var revealObserver = ('IntersectionObserver' in window)
    ? new IntersectionObserver(function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('rv-in');
            observer.unobserve(entry.target);
          }
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 })
    : null;

  function revealCheck() {
    var viewportH = window.innerHeight || document.documentElement.clientHeight;
    var docHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
    var atEnd = (window.pageYOffset + viewportH) >= (docHeight - 40);
    var guard = atEnd ? 0 : 60;

    var elements = document.querySelectorAll(REVEAL_SELECTOR);
    for (var i = 0; i < elements.length; i++) {
      var el = elements[i];
      if (el.classList.contains('rv-in')) continue;

      var rect = el.getBoundingClientRect();
      if (rect.height === 0 && rect.width === 0) continue;

      if (revealObserver) revealObserver.observe(el);
      if (rect.top < viewportH - guard && rect.bottom > 0) {
        el.classList.add('rv-in');
      }
    }
  }

  window.addEventListener('scroll', revealCheck, { passive: true });
  window.addEventListener('resize', revealCheck);
  document.addEventListener('visibilitychange', function () {
    if (!document.hidden) revealCheck();
  });

  function scrollToSection(label) {
    var el = document.querySelector('section[data-mbsec="' + label + '"]');
    if (!el) return;
    var y = el.getBoundingClientRect().top + window.pageYOffset - HEADER_OFFSET;
    window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
  }

  var GALLERY = [
    { src: 'img/DSCF0136.webp',  title: 'Mramor Calacatta',              category: 'Kuchyně' },
    { src: 'img/DSCF0245.webp',  title: 'Kámen & bazén',                 category: 'Wellness' },
    { src: 'img/LHS_7291h.webp', title: 'Sauna',                         category: 'Wellness' },
    { src: 'img/LHS_7327h.webp', title: 'Koupelna se saunou',            category: 'Wellness' },
    { src: 'img/DSCF0266.webp',  title: 'Vstup do wellness & bambus',    category: 'Wellness' },
    { src: 'img/LHS_2727h.webp', title: 'Velkoformátový kámen',          category: 'Koupelna' },
    { src: 'img/LHS_2721h.webp', title: 'Kámen & dubová skříňka',        category: 'Koupelna' },
    { src: 'img/LHZ_9728h.webp', title: 'Sprchový kout',                 category: 'Koupelna' },
    { src: 'img/LHZ_9754h.webp', title: 'Mramor & panoramatické okno',   category: 'Koupelna' },
    { src: 'img/LHZ_9769h.webp', title: 'Mramor & ořech',                category: 'Koupelna' },
    { src: 'img/LHS_7295h.webp', title: 'Vana & mosazné baterie',        category: 'Koupelna' },
    { src: 'img/LHS_7401h.webp', title: 'Výhled do údolí',               category: 'Koupelna' },
    { src: 'img/LHS_7354h.webp', title: 'Prosklená stěna',               category: 'Koupelna' },
    { src: 'img/LHZ_9507h.webp', title: 'Tmavý mramor',                  category: 'Toaleta' },
    { src: 'img/LHS_7373h.webp', title: 'Panoramatická koupelna',        category: 'Koupelna' }
  ];

  var lightbox = document.getElementById('mb-lb');
  var lbImage = lightbox.querySelector('img');
  var lbTitle = lightbox.querySelector('.lb-t');
  var lbCategory = lightbox.querySelector('.lb-c');
  var lbCounter = lightbox.querySelector('.lb-n');
  var lbIndex = 0;

  function lbRender() {
    var item = GALLERY[lbIndex];
    lbImage.src = item.src;
    lbImage.alt = (item.title || '') + ' — ' + (item.category || '');
    lbTitle.textContent = item.title || '';
    lbCategory.textContent = item.category || '';
    lbCounter.textContent = (lbIndex + 1) + ' / ' + GALLERY.length;

    var neighbours = [
      (lbIndex + 1) % GALLERY.length,
      (lbIndex - 1 + GALLERY.length) % GALLERY.length
    ];
    neighbours.forEach(function (j) {
      var preload = new Image();
      preload.src = GALLERY[j].src;
    });
  }

  function lbOpen(index) {
    lbIndex = (((index || 0) % GALLERY.length) + GALLERY.length) % GALLERY.length;
    lbRender();
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function lbOpenBySrc(src) {
    var index = 0;
    for (var i = 0; i < GALLERY.length; i++) {
      if (GALLERY[i].src === src) {
        index = i;
        break;
      }
    }
    lbOpen(index);
  }

  function lbClose() {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function lbStep(delta) {
    lbIndex = (lbIndex + delta + GALLERY.length) % GALLERY.length;
    lbRender();
  }

  lightbox.querySelector('.lb-close').addEventListener('click', lbClose);
  lightbox.querySelector('.lb-prev').addEventListener('click', function () { lbStep(-1); });
  lightbox.querySelector('.lb-next').addEventListener('click', function () { lbStep(1); });
  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) lbClose();
  });

  document.addEventListener('keydown', function (e) {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') lbClose();
    else if (e.key === 'ArrowRight') lbStep(1);
    else if (e.key === 'ArrowLeft') lbStep(-1);
  });

  var NAV_LABELS = {
    'GALERIE': 'gallery',
    'O NÁS': 'about',
    'KONTAKT': 'contact'
  };

  function wire() {
    document.querySelectorAll('section[data-mbsec="hero"] nav span').forEach(function (el) {
      var text = (el.textContent || '').replace(/\s+/g, ' ').trim();
      var label = NAV_LABELS[text];
      if (!label) return;
      el.classList.add('mb-tap');
      el.addEventListener('click', function () { scrollToSection(label); });
    });

    var gallery = document.querySelector('section[data-mbsec="gallery"]');
    if (!gallery) return;

    gallery.querySelectorAll('img').forEach(function (img) {
      var tile = img.parentElement;
      if (!tile) return;
      tile.classList.add('mb-tap');

      var entry = null;
      for (var i = 0; i < GALLERY.length; i++) {
        if (GALLERY[i].src === img.getAttribute('src')) {
          entry = GALLERY[i];
          break;
        }
      }
      if (entry) {
        var caption = document.createElement('span');
        caption.className = 'mb-cap';
        caption.textContent = entry.title;
        tile.appendChild(caption);
      }
    });

    gallery.addEventListener('click', function (e) {
      var node = e.target.closest('div');
      var img = null;
      while (node && node !== gallery && gallery.contains(node)) {
        var candidate = node.querySelector('img');
        if (candidate) {
          img = candidate;
          break;
        }
        node = node.parentElement;
      }
      if (img && gallery.contains(img)) {
        var src = img.getAttribute('src');
        if (src && src.indexOf('img/') === 0) {
          e.preventDefault();
          lbOpenBySrc(src);
        }
      }
    });
  }

  var menu = document.getElementById('mb-menu');
  if (menu) {
    var burgers = document.querySelectorAll('.mb-burger');

    function setBurgerState(expanded) {
      burgers.forEach(function (b) {
        b.setAttribute('aria-expanded', expanded ? 'true' : 'false');
      });
    }

    function openMenu() {
      menu.classList.add('open');
      menu.setAttribute('aria-hidden', 'false');
      setBurgerState(true);
      document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
      menu.classList.remove('open');
      menu.setAttribute('aria-hidden', 'true');
      setBurgerState(false);
      document.body.style.overflow = '';
    }

    burgers.forEach(function (b) {
      b.addEventListener('click', function () {
        if (menu.classList.contains('open')) closeMenu();
        else openMenu();
      });
    });

    menu.querySelector('.mb-menu-close').addEventListener('click', closeMenu);

    menu.querySelectorAll('a[data-go]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        e.preventDefault();
        closeMenu();
        setTimeout(function () { scrollToSection(a.getAttribute('data-go')); }, 20);
      });
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.classList.contains('open')) closeMenu();
    });
  }

  revealCheck();
  try {
    wire();
  } catch (err) {
    if (window.console && console.error) console.error('[mb] wiring failed', err);
  }
})();
