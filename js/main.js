/* ============================================================
   KIRANZA — MAIN JS
   Navbar · Scroll Reveal · Marquee · Trending Strip · Newsletter
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ── Navbar scroll behaviour ────────────────────────────────
  const navbar = document.getElementById('navbar');
  if (navbar) {
    const onScroll = () => {
      navbar.classList.toggle('scrolled', window.scrollY > 40);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ── Active nav link ────────────────────────────────────────
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    if (link.getAttribute('href') === currentPage) {
      link.classList.add('active');
    }
  });

  // ── Scroll Reveal (IntersectionObserver) ───────────────────
  const revealTargets = document.querySelectorAll('.reveal, .reveal-left, .reveal-scale');
  if (revealTargets.length) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    revealTargets.forEach(el => revealObserver.observe(el));
  }

  // ── Trending strip (homepage) ──────────────────────────────
  const trendingContainer = document.getElementById('trending-scroll');
  if (trendingContainer && typeof PRODUCTS !== 'undefined') {
    const trendingProducts = PRODUCTS.filter(p => p.badge).slice(0, 8);
    trendingContainer.innerHTML = trendingProducts.map(p => createProductCardHTML(p)).join('');
    attachCardListeners(trendingContainer);
  }

  // ── Newsletter form ────────────────────────────────────────
  const newsletterForm = document.getElementById('newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', e => {
      e.preventDefault();
      const input = newsletterForm.querySelector('input[type="email"]');
      const btn   = newsletterForm.querySelector('button[type="submit"]');
      if (!input.value) return;
      btn.textContent = '✓ Subscribed!';
      btn.style.background = 'var(--clr-accent-2)';
      input.value = '';
      setTimeout(() => {
        btn.textContent = 'Subscribe';
        btn.style.background = '';
      }, 3000);
    });
  }

  // ── Wishlist persistence ───────────────────────────────────
  updateWishlistButtons();

});

/* ── Product Card HTML ──────────────────────────────────────── */
function createProductCardHTML(product) {
  const badge = product.badge
    ? `<span class="product-badge badge-${product.badge}">${product.badgeLabel}</span>` : '';

  return `
    <div class="product-card" data-id="${product.id}" data-category="${product.category}">
      <div class="product-card-img-wrap">
        <img src="${product.image}" alt="${product.name}" loading="lazy"
             onerror="this.src='assets/images/placeholder.jpg'">
        ${badge}
        <button class="wishlist-btn ${isWishlisted(product.id) ? 'active' : ''}"
                data-id="${product.id}" aria-label="Add to wishlist">
          ${isWishlisted(product.id) ? '♥' : '♡'}
        </button>
        <div class="product-card-actions">
          <a href="product.html?id=${product.id}" class="quick-view-btn">View Product</a>
        </div>
      </div>
      <div class="product-card-info">
        <span class="product-aesthetic">${product.category}</span>
        <h3 class="product-name">${product.name}</h3>
        <span class="product-price">₹${product.price.toLocaleString('en-IN')}</span>
      </div>
    </div>`;
}

/* ── Attach card event listeners ────────────────────────────── */
function attachCardListeners(container) {
  container.querySelectorAll('.wishlist-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();
      const id = parseInt(btn.dataset.id);
      toggleWishlist(id, btn);
    });
  });
}

/* ── Wishlist helpers ───────────────────────────────────────── */
function getWishlist() {
  try { return JSON.parse(localStorage.getItem('kiranza_wishlist') || '[]'); }
  catch { return []; }
}
function isWishlisted(id) { return getWishlist().includes(id); }
function toggleWishlist(id, btn) {
  const list = getWishlist();
  const idx  = list.indexOf(id);
  if (idx === -1) {
    list.push(id);
    btn.textContent = '♥';
    btn.classList.add('active');
  } else {
    list.splice(idx, 1);
    btn.textContent = '♡';
    btn.classList.remove('active');
  }
  localStorage.setItem('kiranza_wishlist', JSON.stringify(list));
}
function updateWishlistButtons() {
  document.querySelectorAll('.wishlist-btn[data-id]').forEach(btn => {
    const id = parseInt(btn.dataset.id);
    if (isWishlisted(id)) {
      btn.textContent = '♥';
      btn.classList.add('active');
    }
  });
}

/* ── Format price ───────────────────────────────────────────── */
function formatPrice(price) {
  return `₹${price.toLocaleString('en-IN')}`;
}
