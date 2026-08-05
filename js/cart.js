/* ============================================================
   KIRANZA — CART JS
   Cart drawer · Add / Remove / Qty · Badge · Totals
   ============================================================ */
(function () {
  'use strict';

  /* ── Storage ─────────────────────────────────────────────── */
  const KEY = 'kiranza_cart';
  function getCart()       { try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch { return []; } }
  function persist(cart)   { localStorage.setItem(KEY, JSON.stringify(cart)); updateBadge(); renderItems(); }

  /* ── Mutations ───────────────────────────────────────────── */
  window.addToCart = function (id, qty = 1) {
    if (typeof PRODUCTS === 'undefined') return;
    const p = PRODUCTS.find(p => p.id === id);
    if (!p) return;
    const cart = getCart();
    const ex   = cart.find(i => i.id === id);
    if (ex) ex.qty = Math.min(ex.qty + qty, 10);
    else cart.push({ id, qty });
    persist(cart);
    if (typeof showToast !== 'undefined') showToast(`${p.name} added!`, 'success', '🛒');
    openCartDrawer();
  };

  function removeItem(id) {
    persist(getCart().filter(i => i.id !== id));
    if (typeof showToast !== 'undefined') showToast('Item removed', 'info', '✕');
  }
  function changeQty(id, delta) {
    const cart = getCart();
    const item = cart.find(i => i.id === id);
    if (!item) return;
    item.qty = Math.max(1, Math.min(item.qty + delta, 10));
    persist(cart);
  }

  /* ── Badge ───────────────────────────────────────────────── */
  function updateBadge() {
    const total = getCart().reduce((s, i) => s + i.qty, 0);
    document.querySelectorAll('.cart-badge').forEach(b => {
      b.style.display = total ? 'flex' : 'none';
      b.textContent   = total > 9 ? '9+' : total;
    });
  }

  /* ── Drawer open/close ───────────────────────────────────── */
  function openCartDrawer() {
    renderItems();
    document.getElementById('cart-drawer')?.classList.add('open');
    document.getElementById('cart-overlay')?.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeCartDrawer() {
    document.getElementById('cart-drawer')?.classList.remove('open');
    document.getElementById('cart-overlay')?.classList.remove('open');
    document.body.style.overflow = '';
  }
  window.openCartDrawer  = openCartDrawer;
  window.closeCartDrawer = closeCartDrawer;

  /* ── Render items ────────────────────────────────────────── */
  function renderItems() {
    const body  = document.getElementById('cart-items');
    const total = document.getElementById('cart-total');
    const cnt   = document.querySelector('.cart-drawer-count');
    if (!body || typeof PRODUCTS === 'undefined') return;

    const cart = getCart();
    const count = cart.reduce((s, i) => s + i.qty, 0);
    if (cnt) cnt.textContent = count;

    if (!cart.length) {
      body.innerHTML = `<div class="cart-empty-state"><div class="icon">🛒</div><p>Your cart is empty.<br>Add something vibe-worthy!</p></div>`;
      if (total) total.textContent = '₹0';
      return;
    }

    let sub = 0;
    body.innerHTML = cart.map(item => {
      const p = PRODUCTS.find(p => p.id === item.id);
      if (!p) return '';
      sub += p.price * item.qty;
      return `
      <div class="cart-item">
        <div class="cart-item-img"><img src="${p.image}" alt="${p.name}" onerror="this.src='assets/images/placeholder.jpg'"></div>
        <div>
          <div class="cart-item-cat">${p.category}</div>
          <div class="cart-item-name">${p.name}</div>
          <div class="cart-item-price">₹${(p.price*item.qty).toLocaleString('en-IN')}</div>
        </div>
        <div class="cart-item-actions">
          <div class="cart-qty">
            <button class="cart-qty-btn" data-id="${p.id}" data-d="-1">−</button>
            <span class="cart-qty-num">${item.qty}</span>
            <button class="cart-qty-btn" data-id="${p.id}" data-d="1">+</button>
          </div>
          <button class="cart-remove" data-id="${p.id}">Remove</button>
        </div>
      </div>`;
    }).join('');

    if (total) total.textContent = `₹${sub.toLocaleString('en-IN')}`;

    body.querySelectorAll('.cart-qty-btn').forEach(b =>
      b.addEventListener('click', () => changeQty(+b.dataset.id, +b.dataset.d)));
    body.querySelectorAll('.cart-remove').forEach(b =>
      b.addEventListener('click', () => removeItem(+b.dataset.id)));
  }

  /* ── Init ────────────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', () => {
    updateBadge();

    document.getElementById('cart-btn')?.addEventListener('click', openCartDrawer);
    document.getElementById('cart-overlay')?.addEventListener('click', closeCartDrawer);
    document.getElementById('cart-drawer-close')?.addEventListener('click', closeCartDrawer);

    // Product detail page add to cart
    const detailBtn = document.getElementById('detail-cart-btn');
    if (detailBtn) {
      detailBtn.addEventListener('click', () => {
        const id = +new URLSearchParams(location.search).get('id');
        const qty = +( document.getElementById('qty-val')?.textContent || 1 );
        if (id) addToCart(id, qty);
      });
    }

    document.getElementById('cart-checkout-btn')?.addEventListener('click', () => {
      if (typeof showToast !== 'undefined') showToast('Checkout coming soon! 🚀', 'info');
    });
  });

})();
