/* ============================================================
   KIRANZA — COLLECTIONS PAGE JS
   Filter pills · Product grid render · URL param sync
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  const grid   = document.getElementById('product-grid');
  const pills  = document.querySelectorAll('.filter-pill');
  const count  = document.getElementById('product-count');

  if (!grid || typeof PRODUCTS === 'undefined') return;

  // ── Read filter from URL ───────────────────────────────────
  const params        = new URLSearchParams(window.location.search);
  let activeFilter    = params.get('filter') || 'all';

  // ── Render all products ────────────────────────────────────
  renderGrid(activeFilter);
  syncPills(activeFilter);

  // ── Filter pill clicks ─────────────────────────────────────
  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      activeFilter = pill.dataset.filter;
      syncPills(activeFilter);
      renderGrid(activeFilter);

      // Update URL without reload
      const url = new URL(window.location);
      if (activeFilter === 'all') url.searchParams.delete('filter');
      else url.searchParams.set('filter', activeFilter);
      window.history.replaceState({}, '', url);
    });
  });

  // ── Render grid ────────────────────────────────────────────
  function renderGrid(filter) {
    const filtered = filter === 'all'
      ? PRODUCTS
      : PRODUCTS.filter(p => p.category === filter);

    if (!filtered.length) {
      grid.innerHTML = `
        <div class="empty-state">
          <span>🔍</span>
          <p>No products in this vibe yet — check back soon!</p>
        </div>`;
      if (count) count.textContent = '0 products';
      return;
    }

    grid.innerHTML = filtered.map((p, i) => `
      <div class="product-grid-item reveal reveal-d${(i % 4) + 1}">
        ${createProductCardHTML(p)}
      </div>
    `).join('');

    if (count) {
      count.textContent = `${filtered.length} product${filtered.length !== 1 ? 's' : ''}`;
    }

    // Re-attach listeners & re-observe reveals
    attachCardListeners(grid);
    reObserveReveals(grid);
  }

  // ── Sync active pill UI ────────────────────────────────────
  function syncPills(filter) {
    pills.forEach(pill => {
      pill.classList.toggle('active', pill.dataset.filter === filter);
    });
  }

  // ── Re-observe scroll reveal for newly added items ─────────
  function reObserveReveals(container) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    container.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  }

});
