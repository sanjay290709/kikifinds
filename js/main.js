/* ============================================================
   KIRANZA — MAIN JS
   Global interactivity, nav scroll, scroll reveal, wishlist,
   and dynamic homepage section rendering
   ============================================================ */

(function () {
  'use strict';

  /* ── 1. Navbar Scroll Effect ───────────────────────────────── */
  function initNavbar() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    const onScroll = () => {
      if (window.scrollY > 40) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ── 2. Scroll Reveal Animations ───────────────────────────── */
  function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
    if (!reveals.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    reveals.forEach(el => observer.observe(el));
  }

  /* ── 3. Render Homepage Trending Grid ──────────────────────── */
  function renderTrending() {
    const scrollContainer = document.getElementById('trending-scroll');
    if (!scrollContainer || typeof PRODUCTS === 'undefined') return;

    const trendingProducts = PRODUCTS.filter(p => p.badge === 'hot' || p.badge === 'new' || p.badge === 'sale').slice(0, 8);

    scrollContainer.innerHTML = trendingProducts.map(item => `
      <div class="product-card">
        <a href="product.html?id=${item.id}">
          <div class="product-card-img">
            <img src="${item.image}" alt="${item.name}" loading="lazy" onerror="this.src='assets/images/placeholder.jpg'">
            ${item.badge ? `<span class="product-badge badge-${item.badge}">${item.badgeLabel}</span>` : ''}
            <button class="wishlist-btn" data-id="${item.id}" aria-label="Wishlist">♡</button>
          </div>
        </a>
        <div class="product-card-body">
          <span class="product-aesthetic-tag">${item.category}</span>
          <a href="product.html?id=${item.id}"><h3 class="product-title">${item.name}</h3></a>
          <div class="product-footer">
            <div class="product-price">
              ₹${item.price.toLocaleString('en-IN')}
              ${item.originalPrice ? `<span class="original-price">₹${item.originalPrice.toLocaleString('en-IN')}</span>` : ''}
            </div>
            <button class="btn-add-cart" data-id="${item.id}">Add +</button>
          </div>
        </div>
      </div>
    `).join('');

    bindProductCardEvents(scrollContainer);
  }

  /* ── 4. Render Homepage New In Strip ───────────────────────── */
  function renderNewIn() {
    const container = document.getElementById('new-in-grid');
    if (!container || typeof PRODUCTS === 'undefined') return;

    const newInProducts = PRODUCTS.filter(p => p.badge === 'new').slice(0, 4);

    container.innerHTML = newInProducts.map(item => `
      <div class="product-card">
        <a href="product.html?id=${item.id}">
          <div class="product-card-img">
            <img src="${item.image}" alt="${item.name}" loading="lazy" onerror="this.src='assets/images/placeholder.jpg'">
            <span class="product-badge badge-new">✦ New</span>
            <button class="wishlist-btn" data-id="${item.id}" aria-label="Wishlist">♡</button>
          </div>
        </a>
        <div class="product-card-body">
          <span class="product-aesthetic-tag">${item.category}</span>
          <a href="product.html?id=${item.id}"><h3 class="product-title">${item.name}</h3></a>
          <div class="product-footer">
            <div class="product-price">₹${item.price.toLocaleString('en-IN')}</div>
            <button class="btn-add-cart" data-id="${item.id}">Add +</button>
          </div>
        </div>
      </div>
    `).join('');

    bindProductCardEvents(container);
  }

  /* ── Bind product card interactions (Cart + Wishlist) ───────── */
  function bindProductCardEvents(parent) {
    parent.querySelectorAll('.btn-add-cart').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const pid = parseInt(btn.getAttribute('data-id'), 10);
        if (window.addToCart) window.addToCart(pid);
      });
    });

    let wishlist = [];
    try { wishlist = JSON.parse(localStorage.getItem('kiranza_wishlist') || '[]'); } catch (e) {}

    parent.querySelectorAll('.wishlist-btn').forEach(btn => {
      const pid = parseInt(btn.getAttribute('data-id'), 10);
      if (wishlist.includes(pid)) {
        btn.textContent = '♥';
        btn.classList.add('active');
      }

      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        let currentList = [];
        try { currentList = JSON.parse(localStorage.getItem('kiranza_wishlist') || '[]'); } catch (err) {}

        const index = currentList.indexOf(pid);
        if (index > -1) {
          currentList.splice(index, 1);
          btn.textContent = '♡';
          btn.classList.remove('active');
          if (typeof showToast !== 'undefined') showToast('Removed from Wishlist', 'info', '♡');
        } else {
          currentList.push(pid);
          btn.textContent = '♥';
          btn.classList.add('active');
          if (typeof showToast !== 'undefined') showToast('Added to Wishlist!', 'success', '♥');
        }
        localStorage.setItem('kiranza_wishlist', JSON.stringify(currentList));
        updateWishlistCount();
      });
    });

    if (window._cursorHover) {
      parent.querySelectorAll('.product-card, .wishlist-btn, .btn-add-cart').forEach(window._cursorHover);
    }
  }

  /* ── 5. Wishlist Badge Counter ─────────────────────────────── */
  function updateWishlistCount() {
    let wishlist = [];
    try { wishlist = JSON.parse(localStorage.getItem('kiranza_wishlist') || '[]'); } catch (e) {}
    document.querySelectorAll('.wishlist-badge').forEach(b => {
      b.style.display = wishlist.length ? 'flex' : 'none';
      b.textContent = wishlist.length > 9 ? '9+' : wishlist.length;
    });
  }
  window.updateWishlistCount = updateWishlistCount;

  /* ── 6. Newsletter Subscription Form ──────────────────────── */
  function initNewsletter() {
    const form = document.getElementById('newsletter-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      const email = input ? input.value.trim() : '';

      if (email && email.includes('@')) {
        if (typeof showToast !== 'undefined') {
          showToast('Welcome to the squad! Check your inbox soon. ✦', 'success');
        }
        input.value = '';
      } else {
        if (typeof showToast !== 'undefined') {
          showToast('Please enter a valid email address.', 'error');
        }
      }
    });
  }

  /* ── Init Everything ───────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initScrollReveal();
    renderTrending();
    renderNewIn();
    initNewsletter();
    updateWishlistCount();
  });

})();
