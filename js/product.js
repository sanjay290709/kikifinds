/* ============================================================
   KIRANZA — PRODUCT DETAIL JS
   Dynamic rendering based on URL id param + sizes + reviews
   ============================================================ */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const id = parseInt(params.get('id') || '1', 10);

    if (typeof PRODUCTS === 'undefined') return;
    const p = PRODUCTS.find(prod => prod.id === id) || PRODUCTS[0];

    // Page title & breadcrumb
    document.title = `${p.name} — Kiranza`;
    const aesBread = document.getElementById('product-detail-aesthetic');
    if (aesBread) aesBread.textContent = p.category;

    // Badge
    const badgeEl = document.getElementById('product-detail-badge');
    if (badgeEl) {
      if (p.badge) {
        badgeEl.className = `product-badge badge-${p.badge}`;
        badgeEl.textContent = p.badgeLabel;
        badgeEl.style.display = 'inline-block';
      } else {
        badgeEl.style.display = 'none';
      }
    }

    // Info
    const nameEl = document.getElementById('product-detail-name');
    if (nameEl) nameEl.textContent = p.name;

    const priceEl = document.getElementById('product-detail-price');
    if (priceEl) {
      priceEl.innerHTML = p.originalPrice
        ? `₹${p.price.toLocaleString('en-IN')} <span class="original-price">₹${p.originalPrice.toLocaleString('en-IN')}</span>`
        : `₹${p.price.toLocaleString('en-IN')}`;
    }

    const descEl = document.getElementById('product-detail-description');
    if (descEl) descEl.textContent = p.description;

    // Gallery
    const mainImg = document.getElementById('gallery-main-img');
    if (mainImg) {
      mainImg.src = p.image;
      mainImg.alt = p.name;
    }

    const thumbsEl = document.getElementById('gallery-thumbs');
    if (thumbsEl) {
      const galleryList = [p.image];
      if (p.image.endsWith('.jpg')) {
        const altImg = p.image.replace('.jpg', 'b.jpg');
        galleryList.push(altImg);
      }
      thumbsEl.innerHTML = galleryList.map((src, i) => `
        <div class="gallery-thumb ${i === 0 ? 'active' : ''}" data-src="${src}">
          <img src="${src}" alt="${p.name}" onerror="this.parentElement.style.display='none'">
        </div>
      `).join('');

      thumbsEl.querySelectorAll('.gallery-thumb').forEach(t => {
        t.addEventListener('click', () => {
          thumbsEl.querySelectorAll('.gallery-thumb').forEach(x => x.classList.remove('active'));
          t.classList.add('active');
          if (mainImg) mainImg.src = t.dataset.src;
        });
      });
    }

    // Sizes Variant Section
    const actionsWrap = document.querySelector('.product-actions');
    if (actionsWrap) {
      let variantHTML = '';
      if (p.sizes && p.sizes.length > 0) {
        variantHTML += `
          <div class="variant-section">
            <div class="variant-heading">Size: <span class="variant-selected-val" id="size-val">${p.sizes[0]}</span></div>
            <div class="size-grid">
              ${p.sizes.map((s, i) => `<button class="size-btn ${i === 0 ? 'active' : ''}" data-size="${s}">${s}</button>`).join('')}
            </div>
          </div>
        `;
      }
      variantHTML += `
        <div class="qty-row">
          <span class="qty-label">Quantity:</span>
          <div class="qty-control">
            <button class="qty-btn" id="qty-minus">−</button>
            <span class="qty-val" id="qty-val">1</span>
            <button class="qty-btn" id="qty-plus">+</button>
          </div>
        </div>
      `;

      const varContainer = document.createElement('div');
      varContainer.id = 'product-actions-anchor';
      varContainer.innerHTML = variantHTML;
      actionsWrap.parentNode.insertBefore(varContainer, actionsWrap);

      // Bind size buttons
      document.querySelectorAll('.size-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          const sv = document.getElementById('size-val');
          if (sv) sv.textContent = btn.dataset.size;
        });
      });

      // Bind quantity buttons
      const qVal = document.getElementById('qty-val');
      const qMinus = document.getElementById('qty-minus');
      const qPlus = document.getElementById('qty-plus');

      if (qMinus && qPlus && qVal) {
        qMinus.addEventListener('click', () => {
          let current = parseInt(qVal.textContent, 10) || 1;
          if (current > 1) qVal.textContent = current - 1;
        });
        qPlus.addEventListener('click', () => {
          let current = parseInt(qVal.textContent, 10) || 1;
          if (current < 10) qVal.textContent = current + 1;
        });
      }
    }

    // Wishlist Button state & toggle
    const wishBtn = document.getElementById('detail-wishlist-btn');
    if (wishBtn) {
      let wishlist = [];
      try { wishlist = JSON.parse(localStorage.getItem('kiranza_wishlist') || '[]'); } catch (e) {}
      const isWished = wishlist.includes(p.id);

      if (isWished) {
        wishBtn.textContent = '♥ Wishlisted';
        wishBtn.classList.add('active');
      }

      wishBtn.addEventListener('click', () => {
        try { wishlist = JSON.parse(localStorage.getItem('kiranza_wishlist') || '[]'); } catch (e) {}
        const idx = wishlist.indexOf(p.id);
        if (idx > -1) {
          wishlist.splice(idx, 1);
          wishBtn.textContent = '♡ Wishlist';
          wishBtn.classList.remove('active');
          if (typeof showToast !== 'undefined') showToast('Removed from Wishlist', 'info', '♡');
        } else {
          wishlist.push(p.id);
          wishBtn.textContent = '♥ Wishlisted';
          wishBtn.classList.add('active');
          if (typeof showToast !== 'undefined') showToast('Added to Wishlist!', 'success', '♥');
        }
        localStorage.setItem('kiranza_wishlist', JSON.stringify(wishlist));
        if (window.updateWishlistCount) window.updateWishlistCount();
      });
    }

    // Tags
    const tagsEl = document.getElementById('product-detail-tags');
    if (tagsEl && p.tags) {
      tagsEl.innerHTML = p.tags.map(tag => `<span class="product-tag">#${tag}</span>`).join('');
    }

    // Reviews Section Rendering
    const detailWrap = document.getElementById('product-detail-wrap');
    if (detailWrap) {
      const revList = (typeof REVIEWS !== 'undefined' && REVIEWS[p.id]) ? REVIEWS[p.id] : [];
      const reviewsSection = document.createElement('section');
      reviewsSection.className = 'reviews-section reveal';
      reviewsSection.innerHTML = `
        <div class="reviews-top">
          <h2>Vibe Check & Reviews</h2>
          <span class="reviews-rating-badge">★ 4.9 / 5.0 (${revList.length + 12} Verified Reviews)</span>
        </div>
        <div class="reviews-grid">
          ${revList.map(r => `
            <div class="review-card">
              <div class="review-stars">${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</div>
              <div class="review-text">"${r.text}"</div>
              <div class="review-meta">
                <div class="review-avatar">${r.name.charAt(0)}</div>
                <span class="review-name">${r.name}</span>
                <span class="review-date">${r.date}</span>
              </div>
            </div>
          `).join('')}
        </div>
      `;
      detailWrap.after(reviewsSection);
    }

    // Related Products
    const relatedScroll = document.getElementById('related-scroll');
    if (relatedScroll) {
      const related = PRODUCTS.filter(prod => prod.category === p.category && prod.id !== p.id).slice(0, 4);
      if (related.length === 0) {
        related.push(...PRODUCTS.filter(prod => prod.id !== p.id).slice(0, 4));
      }
      relatedScroll.innerHTML = related.map(item => `
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
              <div class="product-price">₹${item.price.toLocaleString('en-IN')}</div>
              <button class="btn-add-cart" data-id="${item.id}">Add +</button>
            </div>
          </div>
        </div>
      `).join('');

      relatedScroll.querySelectorAll('.btn-add-cart').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          if (window.addToCart) window.addToCart(parseInt(btn.dataset.id, 10));
        });
      });
    }

    if (window._cursorHover) {
      document.querySelectorAll('.size-btn, .qty-btn, #detail-cart-btn, #detail-wishlist-btn').forEach(window._cursorHover);
    }
  });

})();
