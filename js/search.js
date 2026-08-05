/* ============================================================
   Kikifinds — SEARCH JS
   Full-screen live search overlay with highlighted results
   ============================================================ */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    const overlay = document.getElementById('search-overlay');
    const input   = document.getElementById('search-input');
    const results = document.getElementById('search-results');
    const hint    = document.getElementById('search-hint');
    const close   = document.getElementById('search-close');
    const trigger = document.getElementById('search-btn');
    if (!overlay || !input || !results) return;

    /* ── Open / close ────────────────────────────────────────── */
    const open = () => {
      overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
      setTimeout(() => input.focus(), 80);
      render('');
    };
    const shut = () => {
      overlay.classList.remove('open');
      document.body.style.overflow = '';
      input.value = '';
    };

    trigger?.addEventListener('click', open);
    close?.addEventListener('click', shut);
    overlay.addEventListener('click', e => { if (e.target === overlay) shut(); });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && overlay.classList.contains('open')) shut();
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); open(); }
    });

    /* ── Live search ─────────────────────────────────────────── */
    input.addEventListener('input', () => render(input.value.trim().toLowerCase()));

    function render(q) {
      if (typeof PRODUCTS === 'undefined') return;
      const hits = q
        ? PRODUCTS.filter(p =>
            p.name.toLowerCase().includes(q) ||
            p.category.toLowerCase().includes(q) ||
            (p.tags || []).some(t => t.toLowerCase().includes(q))
          ).slice(0, 8)
        : PRODUCTS.slice(0, 6);

      if (hint) hint.textContent = q ? `${hits.length} result${hits.length !== 1 ? 's' : ''} for "${q}"` : 'Popular picks';

      if (!hits.length) {
        results.innerHTML = `<div class="search-no-results"><p>No results for "<strong>${q}</strong>"</p><p style="margin-top:8px;font-size:0.8rem">Try a different keyword, colour, or aesthetic.</p></div>`;
        return;
      }

      results.innerHTML = hits.map(p => `
        <a href="product.html?id=${p.id}" class="search-result">
          <div class="search-result-img">
            <img src="${p.image}" alt="${p.name}" onerror="this.src='assets/images/placeholder.jpg'">
          </div>
          <div>
            <div class="search-result-cat">${p.category}</div>
            <div class="search-result-name">${hl(p.name, q)}</div>
            <div class="search-result-price">₹${p.price.toLocaleString('en-IN')}</div>
          </div>
          ${p.badge ? `<span class="product-badge badge-${p.badge}" style="position:static;flex-shrink:0">${p.badgeLabel}</span>` : ''}
        </a>`).join('');

      // Bind cursor hover for new elements
      if (window._cursorHover) results.querySelectorAll('.search-result').forEach(window._cursorHover);
    }

    function hl(text, q) {
      if (!q) return text;
      return text.replace(new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'),
        '<mark style="background:var(--clr-accent-1);color:var(--clr-text-invert);border-radius:2px;padding:0 2px;">$1</mark>');
    }
  });
})();
