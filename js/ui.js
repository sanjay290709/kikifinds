/* ============================================================
   KIRANZA — UI ENHANCEMENTS JS
   Page Transitions · Scroll Progress · Announcement Bar ·
   Mobile Menu · Custom Cursor · Parallax · Lightbox ·
   Sticky Cart Bar · Toast System
   ============================================================ */
(function () {
  'use strict';

  /* ── Page transitions ─────────────────────────────────────── */
  function initPageTransitions() {
    document.body.classList.add('page-ready');
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href]');
      if (!link) return;
      const href = link.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('mailto:') ||
          href.startsWith('tel:') || link.target === '_blank' ||
          (href.startsWith('http') && !href.includes(location.hostname))) return;
      e.preventDefault();
      document.body.classList.remove('page-ready');
      setTimeout(() => { window.location.href = href; }, 360);
    });
  }

  /* ── Scroll progress bar ─────────────────────────────────── */
  function initScrollProgress() {
    const bar = document.getElementById('scroll-progress');
    if (!bar) return;
    const onScroll = () => {
      const pct = window.scrollY / Math.max(1, document.documentElement.scrollHeight - innerHeight);
      bar.style.width = Math.min(pct * 100, 100) + '%';
    };
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ── Announcement bar ────────────────────────────────────── */
  function initAnnouncementBar() {
    const bar   = document.getElementById('announcement-bar');
    const close = document.getElementById('announcement-close');
    if (!bar) return;
    if (sessionStorage.getItem('ann-dismissed')) {
      bar.classList.add('dismissed');
      document.body.classList.add('no-announcement');
    }
    if (close) {
      close.addEventListener('click', () => {
        bar.classList.add('dismissed');
        document.body.classList.add('no-announcement');
        sessionStorage.setItem('ann-dismissed', '1');
      });
    }
  }

  /* ── Mobile menu ─────────────────────────────────────────── */
  function initMobileMenu() {
    const burger  = document.getElementById('nav-hamburger');
    const menu    = document.getElementById('mobile-menu');
    const overlay = document.getElementById('menu-overlay');
    const close   = document.getElementById('mobile-menu-close');
    if (!burger || !menu || !overlay) return;

    const open  = () => { menu.classList.add('open'); overlay.classList.add('open'); document.body.style.overflow = 'hidden'; };
    const shut  = () => { menu.classList.remove('open'); overlay.classList.remove('open'); document.body.style.overflow = ''; };

    burger.addEventListener('click', open);
    overlay.addEventListener('click', shut);
    if (close) close.addEventListener('click', shut);
  }

  /* ── Custom cursor ───────────────────────────────────────── */
  function initCursor() {
    if (!window.matchMedia('(pointer: fine)').matches) return;
    const dot  = document.createElement('div'); dot.id = 'cursor';   dot.className = 'cursor';
    const ring = document.createElement('div'); ring.id = 'cursor-f'; ring.className = 'cursor-follower';
    document.body.appendChild(dot); document.body.appendChild(ring);

    let mx = 0, my = 0, rx = 0, ry = 0;
    document.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      dot.style.left = mx + 'px'; dot.style.top = my + 'px';
    });
    (function raf() {
      rx += (mx - rx) * 0.12; ry += (my - ry) * 0.12;
      ring.style.left = Math.round(rx) + 'px'; ring.style.top = Math.round(ry) + 'px';
      requestAnimationFrame(raf);
    })();

    const hover = (el) => {
      el.addEventListener('mouseenter', () => { dot.classList.add('cursor-hover'); ring.classList.add('cursor-hover'); });
      el.addEventListener('mouseleave', () => { dot.classList.remove('cursor-hover'); ring.classList.remove('cursor-hover'); });
    };
    document.querySelectorAll('a, button, .product-card, .col-card, .filter-pill, .size-btn, .aesthetic-card-about').forEach(hover);
    document.addEventListener('mousedown', () => dot.classList.add('cursor-click'));
    document.addEventListener('mouseup',   () => dot.classList.remove('cursor-click'));
    document.addEventListener('mouseleave', () => { dot.style.opacity='0'; ring.style.opacity='0'; });
    document.addEventListener('mouseenter', () => { dot.style.opacity='1'; ring.style.opacity='0.45'; });

    // expose for dynamic elements
    window._cursorHover = hover;
  }

  /* ── Parallax hero ───────────────────────────────────────── */
  function initParallax() {
    const img = document.querySelector('.hero-visual img');
    if (!img || window.innerWidth < 768) return;
    window.addEventListener('scroll', () => {
      img.style.transform = `translateY(${window.scrollY * 0.28}px)`;
    }, { passive: true });
  }

  /* ── Lightbox ────────────────────────────────────────────── */
  function initLightbox() {
    const lb    = document.getElementById('lightbox');
    const lbImg = document.getElementById('lightbox-img');
    const close = document.getElementById('lightbox-close');
    if (!lb) return;

    const open  = (src) => { lbImg.src = src; lb.classList.add('open'); document.body.style.overflow = 'hidden'; };
    const shut  = () => { lb.classList.remove('open'); document.body.style.overflow = ''; };

    const mainWrap = document.getElementById('gallery-main');
    if (mainWrap) mainWrap.addEventListener('click', () => {
      const src = document.getElementById('gallery-main-img')?.src;
      if (src) open(src);
    });

    if (close) close.addEventListener('click', shut);
    lb.addEventListener('click', e => { if (e.target === lb) shut(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') shut(); });
    window._openLightbox = open;
  }

  /* ── Sticky cart bar ─────────────────────────────────────── */
  function initStickyBar() {
    const bar     = document.getElementById('sticky-cart-bar');
    const actions = document.getElementById('product-actions-anchor');
    if (!bar || !actions) return;

    const obs = new IntersectionObserver(([entry]) => {
      bar.classList.toggle('visible', !entry.isIntersecting);
    }, { threshold: 0.2 });
    obs.observe(actions);

    const stickyBtn = document.getElementById('sticky-add-btn');
    const mainBtn   = document.getElementById('detail-cart-btn');
    if (stickyBtn && mainBtn) stickyBtn.addEventListener('click', () => mainBtn.click());
  }

  /* ── Toast system (global) ───────────────────────────────── */
  window.showToast = function (msg, type = 'success', icon = null) {
    let wrap = document.getElementById('toast-container');
    if (!wrap) {
      wrap = document.createElement('div');
      wrap.id = 'toast-container';
      wrap.className = 'toast-container';
      document.body.appendChild(wrap);
    }
    const icons = { success: '✓', error: '✕', info: '✦' };
    const t = document.createElement('div');
    t.className = `toast toast-${type}`;
    t.innerHTML = `<span class="toast-icon">${icon || icons[type] || '✦'}</span><span>${msg}</span>`;
    wrap.appendChild(t);
    requestAnimationFrame(() => requestAnimationFrame(() => t.classList.add('show')));
    setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 400); }, 3000);
  };

  /* ── Populate sticky product info from DOM ───────────────── */
  function populateStickyBar() {
    const name  = document.getElementById('product-detail-name')?.textContent;
    const price = document.getElementById('product-detail-price')?.textContent;
    const img   = document.getElementById('gallery-main-img')?.src;
    if (document.getElementById('sticky-product-name')) document.getElementById('sticky-product-name').textContent = name || '';
    if (document.getElementById('sticky-product-price')) document.getElementById('sticky-product-price').textContent = price || '';
    const stickyImg = document.querySelector('.sticky-product-img img');
    if (stickyImg && img) stickyImg.src = img;
  }

  /* ── Init all ────────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', () => {
    initPageTransitions();
    initScrollProgress();
    initAnnouncementBar();
    initMobileMenu();
    initCursor();
    initParallax();
    initLightbox();
    initStickyBar();
    setTimeout(populateStickyBar, 300);
  });

})();
