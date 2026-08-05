/* ============================================================
   KIRANZA — COLLECTIONS JS
   Filter pill interactions + Sort Dropdown + dynamic grid rendering
   ============================================================ */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('product-grid');
    const pills = document.querySelectorAll('.filter-pill');
    const countEl = document.getElementById('product-count');
    const sortSelect = document.getElementById('sort-select');

    if (!grid || typeof PRODUCTS === 'undefined') return;

    // Get filter & sort from URL or default
    const params = new URLSearchParams(window.location.search);
    let activeFilter = params.get('filter') || 'all';
    let activeSort = params.get('sort') || 'default';

    if (sortSelect) {
      sortSelect.value = activeSort;
      sortSelect.addEventListener('change', () => {
        activeSort = sortSelect.value;
        renderProducts(activeFilter, activeSort);
      });
    }

    // Set initial active pill
    pills.forEach(pill => {
      const filterVal = pill.getAttribute('data-filter');
      if (filterVal.toLowerCase() === activeFilter.toLowerCase()) {
        pill.classList.add('active');
      } else {
        pill.classList.remove('active');
      }

      pill.addEventListener('click', () => {
        pills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        activeFilter = pill.getAttribute('data-filter');

        // Update URL search without reload
        const newUrl = new URL(window.location.href);
        if (activeFilter === 'all') {
          newUrl.searchParams.delete('filter');
        } else {
          newUrl.searchParams.set('filter', activeFilter);
        }
        window.history.replaceState({}, '', newUrl);

        renderProducts(activeFilter, activeSort);
      });
    });

    // Render products based on category & sort
    function renderProducts(filter, sort = 'default') {
      let filtered = (filter === 'all' || !filter)
        ? [...PRODUCTS]
        : PRODUCTS.filter(p => p.category.toLowerCase() === filter.toLowerCase());

      // Sorting
      if (sort === 'price-low') {
        filtered.sort((a, b) => a.price - b.price);
      } else if (sort === 'price-high') {
        filtered.sort((a, b) => b.price - a.price);
      } else if (sort === 'newest') {
        filtered.sort((a, b) => (b.badge === 'new' ? 1 : 0) - (a.badge === 'new' ? 1 : 0));
      } else if (sort === 'trending') {
        filtered.sort((a, b) => (b.badge === 'hot' ? 1 : 0) - (a.badge === 'hot' ? 1 : 0));
      }

      // Update count text
      if (countEl) {
        countEl.textContent = `${filtered.length} product${filtered.length !== 1 ? 's' : ''}`;
      }

      if (filtered.length === 0) {
        grid.innerHTML = `
          <div style="grid-column: 1 / -1; text-align: center; padding: 80px 20px; color: var(--clr-text-muted);">
            <p style="font-size: 1.2rem; font-family: 'Space Grotesk', sans-serif;">No products found in this vibe.</p>
            <button class="btn btn-outline" style="margin-top: 16px;" onclick="document.querySelector('[data-filter=all]').click()">Show All</button>
          </div>
        `;
        return;
      }

      grid.innerHTML = filtered.map(item => `
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

      // Add event listeners for Add to Cart
      grid.querySelectorAll('.btn-add-cart').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          const pid = parseInt(btn.getAttribute('data-id'), 10);
          if (window.addToCart) window.addToCart(pid);
        });
      });

      // Update wishlist buttons status
      let wishlist = [];
      try { wishlist = JSON.parse(localStorage.getItem('kiranza_wishlist') || '[]'); } catch (e) {}
      grid.querySelectorAll('.wishlist-btn').forEach(btn => {
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
          if (window.updateWishlistCount) window.updateWishlistCount();
        });
      });

      if (window._cursorHover) {
        grid.querySelectorAll('.product-card, .wishlist-btn, .btn-add-cart').forEach(window._cursorHover);
      }
    }

    // Initial Render
    renderProducts(activeFilter, activeSort);
  });

})();
