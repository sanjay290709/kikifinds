/* ============================================================
   KIRANZA — PRODUCT DETAIL JS
   Load product from URL · Gallery · Related products · Cart
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  if (typeof PRODUCTS === 'undefined') return;

  // ── Load product from URL id param ────────────────────────
  const params    = new URLSearchParams(window.location.search);
  const productId = parseInt(params.get('id'));
  const product   = PRODUCTS.find(p => p.id === productId);

  if (!product) {
    document.getElementById('product-detail-wrap').innerHTML = `
      <div style="padding: 200px 40px; text-align:center; color: var(--clr-text-muted)">
        <p style="font-size:3rem; margin-bottom:16px;">🔍</p>
        <p>Product not found.</p>
        <a href="collections.html" class="btn btn-primary" style="margin-top:24px; display:inline-flex;">Back to Collections</a>
      </div>`;
    return;
  }

  // ── Update page title ──────────────────────────────────────
  document.title = `${product.name} — Kiranza`;

  // ── Populate detail layout ─────────────────────────────────
  populateProduct(product);
  loadRelated(product);

  // ── Gallery logic ──────────────────────────────────────────
  function populateProduct(p) {
    const images = p.images && p.images.length ? p.images : [p.image];

    // Main image
    const mainImg = document.getElementById('gallery-main-img');
    if (mainImg) {
      mainImg.src = images[0];
      mainImg.alt = p.name;
      mainImg.onerror = function() { this.src = 'assets/images/placeholder.jpg'; };
    }

    // Thumbnails
    const thumbsWrap = document.getElementById('gallery-thumbs');
    if (thumbsWrap) {
      thumbsWrap.innerHTML = images.map((img, i) => `
        <div class="gallery-thumb ${i === 0 ? 'active' : ''}" data-index="${i}">
          <img src="${img}" alt="${p.name} view ${i + 1}"
               onerror="this.src='assets/images/placeholder.jpg'">
        </div>`).join('');

      thumbsWrap.querySelectorAll('.gallery-thumb').forEach(thumb => {
        thumb.addEventListener('click', () => {
          const idx = parseInt(thumb.dataset.index);
          mainImg.src = images[idx];
          thumbsWrap.querySelectorAll('.gallery-thumb').forEach(t => t.classList.remove('active'));
          thumb.classList.add('active');
        });
      });
    }

    // Aesthetic tag
    setEl('product-detail-aesthetic', p.category);

    // Name
    setEl('product-detail-name', p.name);

    // Price
    setEl('product-detail-price', `₹${p.price.toLocaleString('en-IN')}`);

    // Description
    setEl('product-detail-description', p.description);

    // Tags
    const tagsEl = document.getElementById('product-detail-tags');
    if (tagsEl) {
      tagsEl.innerHTML = p.tags.map(t =>
        `<span class="product-tag">${t}</span>`
      ).join('');
    }

    // Badge
    const badgeEl = document.getElementById('product-detail-badge');
    if (badgeEl && p.badge) {
      badgeEl.innerHTML = `<span class="product-badge badge-${p.badge}" style="position:static; display:inline-block; margin-bottom:16px">${p.badgeLabel}</span>`;
    }

    // Wishlist button
    const wishBtn = document.getElementById('detail-wishlist-btn');
    if (wishBtn) {
      wishBtn.textContent = isWishlisted(p.id) ? '♥ Wishlisted' : '♡ Wishlist';
      wishBtn.classList.toggle('active', isWishlisted(p.id));
      wishBtn.addEventListener('click', () => {
        toggleWishlist(p.id, {
          textContent: '', classList: { add: () => {}, remove: () => {} }
        });
        wishBtn.textContent = isWishlisted(p.id) ? '♥ Wishlisted' : '♡ Wishlist';
        wishBtn.style.borderColor = isWishlisted(p.id) ? 'var(--clr-accent-1)' : '';
        wishBtn.style.color = isWishlisted(p.id) ? 'var(--clr-accent-1)' : '';
      });
    }

    // Add to cart button
    const cartBtn = document.getElementById('detail-cart-btn');
    if (cartBtn) {
      cartBtn.addEventListener('click', () => {
        cartBtn.textContent = '✓ Added!';
        cartBtn.style.background = 'var(--clr-accent-2)';
        setTimeout(() => {
          cartBtn.textContent = 'Add to Cart';
          cartBtn.style.background = '';
        }, 2000);
      });
    }
  }

  // ── Load related products ──────────────────────────────────
  function loadRelated(p) {
    const relatedWrap = document.getElementById('related-scroll');
    if (!relatedWrap) return;

    const related = PRODUCTS
      .filter(pr => pr.category === p.category && pr.id !== p.id)
      .slice(0, 5);

    const fallback = PRODUCTS.filter(pr => pr.id !== p.id && pr.badge).slice(0, 5);
    const toShow   = related.length >= 2 ? related : fallback;

    relatedWrap.innerHTML = toShow.map(pr => createProductCardHTML(pr)).join('');
    attachCardListeners(relatedWrap);
  }

  // ── Helper ────────────────────────────────────────────────
  function setEl(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  }

});
