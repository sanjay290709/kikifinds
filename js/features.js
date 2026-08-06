/* ============================================================
   KIKIFINDS — ADVANCED FEATURES JS
   Theme Switcher · Vibe Quiz · Quick View · Currency Converter
   Coupon & Checkout Flow · Confetti · Recently Viewed · Order Tracker
   ============================================================ */
(function () {
  'use strict';

  /* ══════════════════════════════════════════════════════════ */
  /*  1. CURRENCY CONVERTER                                     */
  /* ══════════════════════════════════════════════════════════ */
  const CURRENCIES = {
    INR: { symbol: '₹', rate: 1,      code: 'INR' },
    USD: { symbol: '$', rate: 0.012,  code: 'USD' },
    EUR: { symbol: '€', rate: 0.011,  code: 'EUR' },
    GBP: { symbol: '£', rate: 0.0094, code: 'GBP' }
  };

  function getCurrency() {
    return localStorage.getItem('kikifinds_currency') || 'INR';
  }

  window.formatPrice = function (amountINR) {
    const currKey = getCurrency();
    const curr = CURRENCIES[currKey] || CURRENCIES.INR;
    const converted = amountINR * curr.rate;

    if (currKey === 'INR') {
      return `₹${Math.round(converted).toLocaleString('en-IN')}`;
    }
    return `${curr.symbol}${converted.toFixed(2)}`;
  };

  function setCurrency(code) {
    if (!CURRENCIES[code]) return;
    localStorage.setItem('kikifinds_currency', code);
    updateAllPricesOnPage();
    if (typeof showToast !== 'undefined') {
      showToast(`Currency changed to ${code} (${CURRENCIES[code].symbol})`, 'info', '💱');
    }
  }
  window.setCurrency = setCurrency;

  function updateAllPricesOnPage() {
    document.querySelectorAll('[data-price-inr]').forEach(el => {
      const inr = parseFloat(el.getAttribute('data-price-inr'));
      if (!isNaN(inr)) {
        el.textContent = window.formatPrice(inr);
      }
    });

    if (window.renderCartItems) window.renderCartItems();
    if (window.renderWishlist) window.renderWishlist();
    if (window.refreshCollectionsGrid) window.refreshCollectionsGrid();
  }

  /* ══════════════════════════════════════════════════════════ */
  /*  2. LIVE THEME / COLOR SWITCHER                            */
  /* ══════════════════════════════════════════════════════════ */
  const THEMES = {
    chartreuse: {
      accent1: '#e8ff3d', accent1Dim: 'rgba(232, 255, 61, 0.15)',
      accent1Glow: 'rgba(232, 255, 61, 0.28)', textInvert: '#080808'
    },
    coquette: {
      accent1: '#ff9ebb', accent1Dim: 'rgba(255, 158, 187, 0.15)',
      accent1Glow: 'rgba(255, 158, 187, 0.3)', textInvert: '#080808'
    },
    amber: {
      accent1: '#e6a15c', accent1Dim: 'rgba(230, 161, 92, 0.15)',
      accent1Glow: 'rgba(230, 161, 92, 0.3)', textInvert: '#080808'
    },
    vaporwave: {
      accent1: '#00f0ff', accent1Dim: 'rgba(0, 240, 255, 0.15)',
      accent1Glow: 'rgba(0, 240, 255, 0.3)', textInvert: '#080808'
    }
  };

  function applyTheme(themeKey) {
    const t = THEMES[themeKey] || THEMES.chartreuse;
    document.documentElement.style.setProperty('--clr-accent-1', t.accent1);
    document.documentElement.style.setProperty('--clr-accent-1-dim', t.accent1Dim);
    document.documentElement.style.setProperty('--clr-accent-1-glow', t.accent1Glow);
    document.documentElement.style.setProperty('--clr-text-invert', t.textInvert);
    localStorage.setItem('kikifinds_theme', themeKey);

    document.querySelectorAll('.theme-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.theme === themeKey);
    });
  }
  window.applyTheme = applyTheme;

  /* ══════════════════════════════════════════════════════════ */
  /*  3. QUICK VIEW MODAL                                       */
  /* ══════════════════════════════════════════════════════════ */
  window.openQuickView = function (productId) {
    if (typeof PRODUCTS === 'undefined') return;
    const p = PRODUCTS.find(prod => prod.id === productId);
    if (!p) return;

    let modal = document.getElementById('quickview-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'quickview-modal';
      modal.className = 'quickview-modal';
      document.body.appendChild(modal);
    }

    modal.innerHTML = `
      <div class="quickview-overlay" id="quickview-overlay"></div>
      <div class="quickview-dialog">
        <button class="quickview-close" id="quickview-close">✕</button>
        <div class="quickview-grid">
          <div class="quickview-img">
            <img src="${p.image}" alt="${p.name}" onerror="this.src='assets/images/placeholder.jpg'">
          </div>
          <div class="quickview-info">
            <span class="product-aesthetic-tag">${p.category}</span>
            <h2>${p.name}</h2>
            <div class="quickview-price">${window.formatPrice(p.price)}</div>
            <p class="quickview-desc">${p.description}</p>
            ${p.sizes ? `
              <div class="variant-section">
                <div class="variant-heading">Size: <span class="variant-selected-val" id="qv-size-val">${p.sizes[0]}</span></div>
                <div class="size-grid">
                  ${p.sizes.map((s, i) => `<button class="size-btn ${i === 0 ? 'active' : ''}" data-size="${s}">${s}</button>`).join('')}
                </div>
              </div>` : ''}
            <div class="product-actions" style="margin-top:20px;">
              <button class="btn btn-primary" id="qv-add-btn">Add to Cart</button>
              <a href="product.html?id=${p.id}" class="btn btn-outline">View Full Details</a>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.style.overflow = 'hidden';
    modal.classList.add('open');

    modal.querySelectorAll('.size-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        modal.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const sv = modal.querySelector('#qv-size-val');
        if (sv) sv.textContent = btn.dataset.size;
      });
    });

    const close = () => {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    };
    modal.querySelector('#quickview-close').addEventListener('click', close);
    modal.querySelector('#quickview-overlay').addEventListener('click', close);

    modal.querySelector('#qv-add-btn').addEventListener('click', () => {
      if (window.addToCart) window.addToCart(p.id, 1);
      close();
    });
  };

  /* ══════════════════════════════════════════════════════════ */
  /*  4. COUPON & CHECKOUT FLOW WITH CONFETTI                  */
  /* ══════════════════════════════════════════════════════════ */
  const COUPONS = {
    'GENZ10': { discountPct: 10,  code: 'GENZ10' },
    'KIKI20': { discountPct: 20,  code: 'KIKI20' },
    'FREESHIP': { discountPct: 0, freeShip: true, code: 'FREESHIP' }
  };

  window.appliedCoupon = null;

  window.applyCouponCode = function (code) {
    const clean = (code || '').trim().toUpperCase();
    if (COUPONS[clean]) {
      window.appliedCoupon = COUPONS[clean];
      if (typeof showToast !== 'undefined') {
        showToast(`Coupon ${clean} applied!`, 'success', '🏷️');
      }
      if (window.renderCartItems) window.renderCartItems();
      return true;
    } else {
      if (typeof showToast !== 'undefined') {
        showToast('Invalid coupon code.', 'error', '✕');
      }
      return false;
    }
  };

  window.openCheckoutModal = function () {
    const cart = JSON.parse(localStorage.getItem('kiranza_cart') || '[]');
    if (!cart.length) {
      if (typeof showToast !== 'undefined') showToast('Your cart is empty!', 'error');
      return;
    }

    if (window.closeCartDrawer) window.closeCartDrawer();

    let modal = document.getElementById('checkout-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'checkout-modal';
      modal.className = 'checkout-modal';
      document.body.appendChild(modal);
    }

    let subtotal = 0;
    cart.forEach(item => {
      const p = PRODUCTS.find(p => p.id === item.id);
      if (p) subtotal += p.price * item.qty;
    });

    let discount = 0;
    if (window.appliedCoupon && window.appliedCoupon.discountPct) {
      discount = (subtotal * window.appliedCoupon.discountPct) / 100;
    }

    const shipping = subtotal >= 999 || (window.appliedCoupon && window.appliedCoupon.freeShip) ? 0 : 99;
    const finalTotal = Math.max(0, subtotal - discount + shipping);

    modal.innerHTML = `
      <div class="checkout-overlay" id="checkout-overlay"></div>
      <div class="checkout-dialog">
        <button class="checkout-close" id="checkout-close">✕</button>
        <div class="checkout-header">
          <h2>Secure Checkout</h2>
          <span class="checkout-step-badge">Step 1 of 2 — Shipping & Payment</span>
        </div>
        <form class="checkout-form" id="checkout-form">
          <div class="checkout-grid">
            <div class="checkout-fields">
              <h4>Shipping Address</h4>
              <div class="form-group">
                <label>Full Name</label>
                <input type="text" required placeholder="Alex Morgan">
              </div>
              <div class="form-group">
                <label>Email Address</label>
                <input type="email" required placeholder="alex@vibe.com">
              </div>
              <div class="form-group">
                <label>Delivery Address</label>
                <input type="text" required placeholder="Apartment, Street name, City">
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label>Pincode / Postal Code</label>
                  <input type="text" required placeholder="110001">
                </div>
                <div class="form-group">
                  <label>Phone Number</label>
                  <input type="tel" required placeholder="+91 98765 43210">
                </div>
              </div>

              <h4 style="margin-top:24px;">Payment Method</h4>
              <div class="payment-options">
                <label class="payment-radio">
                  <input type="radio" name="payment" value="UPI" checked>
                  <span>📱 UPI / GPay / PhonePe</span>
                </label>
                <label class="payment-radio">
                  <input type="radio" name="payment" value="Card">
                  <span>💳 Credit / Debit Card</span>
                </label>
                <label class="payment-radio">
                  <input type="radio" name="payment" value="COD">
                  <span>💵 Cash on Delivery (COD)</span>
                </label>
              </div>
            </div>

            <div class="checkout-summary-col">
              <h4>Order Summary (${cart.length} item${cart.length > 1 ? 's' : ''})</h4>
              <div class="checkout-items-mini">
                ${cart.map(item => {
                  const p = PRODUCTS.find(p => p.id === item.id);
                  if (!p) return '';
                  return `
                    <div class="checkout-item-mini">
                      <img src="${p.image}" alt="${p.name}">
                      <div>
                        <div class="mini-name">${p.name}</div>
                        <div class="mini-qty">Qty: ${item.qty}</div>
                      </div>
                      <div class="mini-price">${window.formatPrice(p.price * item.qty)}</div>
                    </div>`;
                }).join('')}
              </div>
              <div class="checkout-totals">
                <div class="total-row"><span>Subtotal</span><span>${window.formatPrice(subtotal)}</span></div>
                ${discount ? `<div class="total-row discount"><span>Discount</span><span>-${window.formatPrice(discount)}</span></div>` : ''}
                <div class="total-row"><span>Shipping</span><span>${shipping === 0 ? 'FREE' : window.formatPrice(shipping)}</span></div>
                <div class="total-row grand"><span>Total</span><span>${window.formatPrice(finalTotal)}</span></div>
              </div>
              <button type="submit" class="btn btn-primary" style="width:100%;margin-top:20px;">Complete Order 🎉</button>
            </div>
          </div>
        </form>
      </div>
    `;

    document.body.style.overflow = 'hidden';
    modal.classList.add('open');

    const close = () => {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    };
    modal.querySelector('#checkout-close').addEventListener('click', close);
    modal.querySelector('#checkout-overlay').addEventListener('click', close);

    modal.querySelector('#checkout-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const orderId = 'KIKI-' + Math.floor(100000 + Math.random() * 900000);
      localStorage.setItem('kiranza_cart', '[]');
      if (window.renderCartItems) window.renderCartItems();
      close();
      showOrderSuccessModal(orderId, window.formatPrice(finalTotal));
    });
  };

  function showOrderSuccessModal(orderId, totalFormatted) {
    let modal = document.getElementById('success-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'success-modal';
      modal.className = 'success-modal';
      document.body.appendChild(modal);
    }

    modal.innerHTML = `
      <div class="checkout-overlay"></div>
      <div class="success-dialog reveal-scale">
        <div class="confetti-container" id="confetti-container"></div>
        <div class="success-icon">🎉</div>
        <h2>Vibe Confirmed!</h2>
        <p>Your order <strong>#${orderId}</strong> has been successfully placed.</p>
        <div class="success-details">
          <div class="success-row"><span>Order Total:</span> <strong>${totalFormatted}</strong></div>
          <div class="success-row"><span>Status:</span> <span class="status-pill">Processing</span></div>
          <div class="success-row"><span>Estimated Delivery:</span> <span>3-5 Business Days</span></div>
        </div>
        <div class="success-actions">
          <button class="btn btn-primary" onclick="window.openTrackModal('${orderId}')">Track Order 📦</button>
          <button class="btn btn-outline" onclick="document.getElementById('success-modal').classList.remove('open');document.body.style.overflow=''">Continue Shopping</button>
        </div>
      </div>
    `;

    document.body.style.overflow = 'hidden';
    modal.classList.add('open');
    triggerConfetti(modal.querySelector('#confetti-container'));
  }

  function triggerConfetti(container) {
    if (!container) return;
    const colors = ['#e8ff3d', '#ff5c00', '#00f0ff', '#ff9ebb', '#ffffff'];
    for (let i = 0; i < 45; i++) {
      const particle = document.createElement('div');
      particle.className = 'confetti-particle';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      particle.style.animationDelay = Math.random() * 0.8 + 's';
      particle.style.animationDuration = (Math.random() * 1.5 + 1.8) + 's';
      container.appendChild(particle);
    }
  }

  /* ══════════════════════════════════════════════════════════ */
  /*  5. RECENTLY VIEWED PRODUCTS DOCK                           */
  /* ══════════════════════════════════════════════════════════ */
  window.trackRecentlyViewed = function (productId) {
    let list = JSON.parse(localStorage.getItem('kikifinds_recent') || '[]');
    list = list.filter(id => id !== productId);
    list.unshift(productId);
    if (list.length > 5) list = list.slice(0, 5);
    localStorage.setItem('kikifinds_recent', JSON.stringify(list));
    renderRecentlyViewedDock();
  };

  function renderRecentlyViewedDock() {
    if (typeof PRODUCTS === 'undefined') return;
    const list = JSON.parse(localStorage.getItem('kikifinds_recent') || '[]');
    if (!list.length) return;

    let dock = document.getElementById('recently-viewed-dock');
    if (!dock) {
      dock = document.createElement('div');
      dock.id = 'recently-viewed-dock';
      dock.className = 'recently-viewed-dock';
      document.body.appendChild(dock);
    }

    const items = list.map(id => PRODUCTS.find(p => p.id === id)).filter(Boolean);

    dock.innerHTML = `
      <div class="dock-header">
        <span>Recent Picks</span>
        <button class="dock-toggle" id="dock-toggle">▼</button>
      </div>
      <div class="dock-items" id="dock-items">
        ${items.map(p => `
          <a href="product.html?id=${p.id}" class="dock-item" title="${p.name}">
            <img src="${p.image}" alt="${p.name}">
          </a>`).join('')}
      </div>
    `;

    const toggleBtn = dock.querySelector('#dock-toggle');
    const itemsWrap = dock.querySelector('#dock-items');
    toggleBtn.addEventListener('click', () => {
      const isHidden = itemsWrap.style.display === 'none';
      itemsWrap.style.display = isHidden ? 'flex' : 'none';
      toggleBtn.textContent = isHidden ? '▼' : '▲';
    });
  }

  /* ══════════════════════════════════════════════════════════ */
  /*  6. TRACK MY ORDER TOOL                                    */
  /* ══════════════════════════════════════════════════════════ */
  window.openTrackModal = function (prefillId = '') {
    let modal = document.getElementById('track-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'track-modal';
      modal.className = 'track-modal';
      document.body.appendChild(modal);
    }

    modal.innerHTML = `
      <div class="checkout-overlay" id="track-overlay"></div>
      <div class="track-dialog">
        <button class="track-close" id="track-close">✕</button>
        <h2>Track Your Order 📦</h2>
        <p>Enter your 7-digit Order ID (e.g. #KIKI-84920)</p>
        <form id="track-form" style="margin:20px 0;">
          <div style="display:flex;gap:10px;">
            <input type="text" class="newsletter-input" id="track-input" value="${prefillId}" placeholder="#KIKI-84920" required style="border-radius:8px;">
            <button type="submit" class="btn btn-primary">Track</button>
          </div>
        </form>
        <div class="track-result" id="track-result"></div>
      </div>
    `;

    document.body.style.overflow = 'hidden';
    modal.classList.add('open');

    const close = () => {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    };
    modal.querySelector('#track-close').addEventListener('click', close);
    modal.querySelector('#track-overlay').addEventListener('click', close);

    const form = modal.querySelector('#track-form');
    const input = modal.querySelector('#track-input');
    const res = modal.querySelector('#track-result');

    const runTrack = (val) => {
      if (!val) return;
      res.innerHTML = `
        <div class="tracking-steps">
          <div class="track-step step-done"><span class="step-icon">✓</span> Order Placed<span class="step-time">Yesterday</span></div>
          <div class="track-step step-done"><span class="step-icon">✓</span> Vibe Checked & Packed<span class="step-time">Today, 10:00 AM</span></div>
          <div class="track-step step-active"><span class="step-icon">🚚</span> In Transit<span class="step-time">Expected Tomorrow</span></div>
          <div class="track-step"><span class="step-icon">🏠</span> Out for Delivery<span class="step-time">Pending</span></div>
        </div>
      `;
    };

    form.addEventListener('submit', e => {
      e.preventDefault();
      runTrack(input.value.trim());
    });

    if (prefillId) runTrack(prefillId);
  };

  /* ══════════════════════════════════════════════════════════ */
  /*  7. VIBE QUIZ MODAL (Interactive 3-Step Flow)              */
  /* ══════════════════════════════════════════════════════════ */
  const QUIZ_QUESTIONS = [
    {
      q: "1. What's your ideal Friday night?",
      options: [
        { text: "💿 Flashy dance floor & Y2K glitz", cat: "Y2K" },
        { text: "📚 Rain outside, candle & vintage journal", cat: "Dark Academia" },
        { text: "🎀 Ribbon crafting & tea party with friends", cat: "Coquette" },
        { text: "🧢 Late night urban skate & street food", cat: "Streetwear" }
      ]
    },
    {
      q: "2. Pick your go-to beverage:",
      options: [
        { text: "⚡ Energy drink in a metallic tin", cat: "Y2K" },
        { text: "☕ Double shot espresso in a ceramic demitasse", cat: "Dark Academia" },
        { text: "🍵 Iced matcha latte with oat milk", cat: "Clean Girl" },
        { text: "🌿 Herbal wildflower brew", cat: "Cottagecore" }
      ]
    },
    {
      q: "3. Choose your main character accessory:",
      options: [
        { text: "🦋 Holographic butterfly clips", cat: "Y2K" },
        { text: "👓 Tortoiseshell round glasses", cat: "Dark Academia" },
        { text: "🎀 Blush satin bow headband", cat: "Coquette" },
        { text: "📌 Thrifted cassette pin badge set", cat: "Indie/Alt" }
      ]
    }
  ];

  window.openVibeQuiz = function () {
    let modal = document.getElementById('quiz-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'quiz-modal';
      modal.className = 'quiz-modal';
      document.body.appendChild(modal);
    }

    let currentStep = 0;
    const scores = { 'Y2K': 0, 'Dark Academia': 0, 'Coquette': 0, 'Streetwear': 0, 'Clean Girl': 0, 'Cottagecore': 0, 'Indie/Alt': 0 };

    const renderStep = () => {
      const qData = QUIZ_QUESTIONS[currentStep];
      modal.innerHTML = `
        <div class="checkout-overlay" id="quiz-overlay"></div>
        <div class="quiz-dialog">
          <button class="quiz-close" id="quiz-close">✕</button>
          <div id="quiz-body">
            <span class="section-tag">Aesthetic Matcher (Step ${currentStep + 1} of 3)</span>
            <h2 style="font-family:'Playfair Display',serif;font-size:1.8rem;margin:12px 0 20px;">Find Your Vibe ✦</h2>
            <div class="quiz-question">
              <p class="quiz-q-title" style="font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:1rem;margin-bottom:14px;">${qData.q}</p>
              <div class="quiz-options">
                ${qData.options.map(opt => `
                  <button type="button" class="quiz-opt" data-cat="${opt.cat}">${opt.text}</button>
                `).join('')}
              </div>
            </div>
          </div>
        </div>
      `;

      modal.querySelector('#quiz-close').addEventListener('click', close);
      modal.querySelector('#quiz-overlay').addEventListener('click', close);

      modal.querySelectorAll('.quiz-opt').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          const cat = btn.dataset.cat;
          if (cat) scores[cat] = (scores[cat] || 0) + 1;

          currentStep++;
          if (currentStep < QUIZ_QUESTIONS.length) {
            renderStep();
          } else {
            renderResult();
          }
        });
      });
    };

    const renderResult = () => {
      // Find category with highest score
      let topCat = 'Y2K';
      let max = -1;
      Object.keys(scores).forEach(c => {
        if (scores[c] > max) {
          max = scores[c];
          topCat = c;
        }
      });

      const recs = (typeof PRODUCTS !== 'undefined') ? PRODUCTS.filter(p => p.category === topCat).slice(0, 3) : [];

      const qBody = modal.querySelector('#quiz-body');
      qBody.innerHTML = `
        <div class="quiz-result reveal-scale" style="text-align:center;">
          <span class="section-tag">Match Confirmed!</span>
          <h2 style="font-family:'Playfair Display',serif;font-size:2.4rem;margin:12px 0;color:var(--clr-accent-1);">${topCat}</h2>
          <p style="color:var(--clr-text-muted);margin-bottom:24px;font-size:0.92rem;">Your choices match 88% authentic <strong>${topCat}</strong> aesthetic. Here are your top recommended picks:</p>
          <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-bottom:28px;text-align:left;">
            ${recs.map(p => `
              <div style="background:var(--clr-surface-2);border-radius:10px;padding:12px;border:1px solid var(--clr-border);">
                <img src="${p.image}" alt="${p.name}" style="width:100%;aspect-ratio:3/4;object-fit:cover;border-radius:6px;margin-bottom:8px;">
                <div style="font-size:0.75rem;font-weight:700;line-height:1.2;margin-bottom:4px;">${p.name}</div>
                <div style="font-size:0.8rem;color:var(--clr-accent-1);font-family:'Space Grotesk',sans-serif;font-weight:700;">${window.formatPrice(p.price)}</div>
                <button class="btn btn-primary btn-sm" onclick="addToCart(${p.id});document.getElementById('quiz-modal').classList.remove('open');document.body.style.overflow=''" style="width:100%;margin-top:8px;padding:6px;font-size:0.7rem;">Add to Cart</button>
              </div>
            `).join('')}
          </div>
          <div style="display:flex;gap:12px;justify-content:center;">
            <a href="collections.html?filter=${encodeURIComponent(topCat)}" class="btn btn-primary" onclick="close()">Explore ${topCat} Collection →</a>
            <button class="btn btn-outline" onclick="openVibeQuiz()">Retake Quiz 🔄</button>
          </div>
        </div>
      `;
    };

    const close = () => {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    };

    document.body.style.overflow = 'hidden';
    modal.classList.add('open');
    renderStep();
  };

  /* ══════════════════════════════════════════════════════════ */
  /*  INIT ON DOM LOAD                                          */
  /* ══════════════════════════════════════════════════════════ */
  document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('kikifinds_theme') || 'chartreuse';
    applyTheme(savedTheme);

    const params = new URLSearchParams(window.location.search);
    const pid = parseInt(params.get('id'), 10);
    if (pid && !isNaN(pid)) {
      trackRecentlyViewed(pid);
    } else {
      renderRecentlyViewedDock();
    }
  });

})();
