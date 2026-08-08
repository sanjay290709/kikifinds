/* ============================================================
   Kikifinds — MOBILE APP CONTROLLER (js/app.js)
   Core app state, bottom tabs, cart, wishlist, quiz, stories & PWA
   ============================================================ */

(function () {
  'use strict';

  // ── APP STATE ──────────────────────────────────────────────
  const state = {
    currentTab: 'home',
    currentCategory: 'ALL',
    searchQuery: '',
    sortBy: 'default',
    currency: 'INR',
    currencyRates: { INR: 1, USD: 0.012, EUR: 0.011, GBP: 0.0095 },
    currencySymbols: { INR: '₹', USD: '$', EUR: '€', GBP: '£' },
    cart: JSON.parse(localStorage.getItem('kikifinds_cart') || '[]'),
    wishlist: JSON.parse(localStorage.getItem('kikifinds_wishlist') || '[]'),
    couponCode: '',
    discount: 0,
    currentStoryIndex: 0,
    quizStep: 1,
    quizAnswers: [],
  };

  // Stories Data
  const STORIES = [
    {
      id: 1,
      title: 'Coquette Dreams',
      author: '@kiki.coquette',
      image: 'assets/images/cat-coquette.jpg',
      productId: 3,
      badge: 'Coquette Vibe'
    },
    {
      id: 2,
      title: 'Y2K Glitch Drop',
      author: '@kiki.y2k',
      image: 'assets/images/hero.jpg',
      productId: 1,
      badge: 'Y2K Drop'
    },
    {
      id: 3,
      title: 'Dark Academia Study',
      author: '@kiki.academia',
      image: 'assets/images/cat-dark-academia.jpg',
      productId: 2,
      badge: 'Dark Academia'
    },
    {
      id: 4,
      title: 'Streetwear Fits',
      author: '@kiki.street',
      image: 'assets/images/cat-streetwear.jpg',
      productId: 5,
      badge: 'Oversized'
    }
  ];

  // ── INIT APP ───────────────────────────────────────────────
  function initAll() {
    registerServiceWorker();
    initTabNavigation();
    initPillFilters();
    initSearchAndSort();
    initCurrencySelector();
    initThemeSelector();
    initStoryViewer();
    initQuiz();
    renderApp();
    updateBadges();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }

  // ── SERVICE WORKER REGISTRATION ────────────────────────────
  function registerServiceWorker() {
    if ('serviceWorker' in navigator && window.location.protocol.startsWith('http')) {
      navigator.serviceWorker.register('./sw.js')
        .then(() => console.log('Kikifinds SW registered'))
        .catch(err => console.log('SW reg error:', err));
    }
  }

  // ── TAB NAVIGATION ─────────────────────────────────────────
  function initTabNavigation() {
    const tabButtons = document.querySelectorAll('.app-tab-item');
    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.getAttribute('data-tab');
        switchTab(tab);
      });
    });
  }

  window.switchTab = function (tabName) {
    state.currentTab = tabName;

    // Update Tab UI
    document.querySelectorAll('.app-tab-item').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-tab') === tabName);
    });

    // Update Screen View
    document.querySelectorAll('.app-screen').forEach(screen => {
      screen.classList.toggle('active', screen.id === `screen-${tabName}`);
    });

    // Re-render specific screen content
    if (tabName === 'shop') renderShopGrid();
    if (tabName === 'wishlist') renderWishlistGrid();
    if (tabName === 'home') renderHomeGrid();

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ── CURRENCY FORMATTER ─────────────────────────────────────
  function formatPrice(amountInINR) {
    const rate = state.currencyRates[state.currency] || 1;
    const symbol = state.currencySymbols[state.currency] || '₹';
    const converted = Math.round(amountInINR * rate * 100) / 100;
    return `${symbol}${converted.toLocaleString()}`;
  }

  function initCurrencySelector() {
    const selector = document.getElementById('app-currency-select');
    if (selector) {
      selector.value = state.currency;
      selector.addEventListener('change', (e) => {
        state.currency = e.target.value;
        renderApp();
        showToast(`Currency changed to ${state.currency}`);
      });
    }
  }

  // ── THEME SWITCHER ─────────────────────────────────────────
  function initThemeSelector() {
    window.applyAppTheme = function (themeName) {
      document.body.setAttribute('data-theme', themeName);
      localStorage.setItem('kikifinds_theme', themeName);
      showToast(`Theme updated to ${themeName} ✦`);
    };

    const savedTheme = localStorage.getItem('kikifinds_theme');
    if (savedTheme) {
      document.body.setAttribute('data-theme', savedTheme);
    }
  }

  // ── RENDER ENGINE ──────────────────────────────────────────
  function renderApp() {
    renderHomeGrid();
    renderShopGrid();
    renderWishlistGrid();
    renderCart();
  }

  // ── HOME TAB RENDER ────────────────────────────────────────
  function renderHomeGrid() {
    const container = document.getElementById('home-featured-products');
    if (!container || typeof PRODUCTS === 'undefined') return;

    const featured = PRODUCTS.slice(0, 4);
    container.innerHTML = featured.map(p => createProductCardHTML(p)).join('');
  }

  // ── PILL FILTERS ───────────────────────────────────────────
  function initPillFilters() {
    const pills = document.querySelectorAll('.pill-btn');
    pills.forEach(pill => {
      pill.addEventListener('click', () => {
        pills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        state.currentCategory = pill.getAttribute('data-cat') || 'ALL';
        renderShopGrid();
      });
    });
  }

  // ── SEARCH & SORT ──────────────────────────────────────────
  function initSearchAndSort() {
    const searchInput = document.getElementById('app-search-input');
    const sortSelect = document.getElementById('app-sort-select');

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        state.searchQuery = e.target.value.toLowerCase().trim();
        renderShopGrid();
      });
    }

    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        state.sortBy = e.target.value;
        renderShopGrid();
      });
    }
  }

  // ── SHOP TAB RENDER ────────────────────────────────────────
  function renderShopGrid() {
    const container = document.getElementById('shop-products-grid');
    if (!container || typeof PRODUCTS === 'undefined') return;

    let filtered = PRODUCTS.filter(p => {
      const matchCat = state.currentCategory === 'ALL' || p.category === state.currentCategory;
      const matchSearch = !state.searchQuery || 
        p.name.toLowerCase().includes(state.searchQuery) ||
        p.category.toLowerCase().includes(state.searchQuery) ||
        (p.tags && p.tags.some(t => t.toLowerCase().includes(state.searchQuery)));
      return matchCat && matchSearch;
    });

    if (state.sortBy === 'low-high') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (state.sortBy === 'high-low') {
      filtered.sort((a, b) => b.price - a.price);
    }

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
          <div class="empty-state-icon">🔍</div>
          <div class="empty-state-title">No aesthetic items found</div>
          <p style="font-size: 0.78rem;">Try clearing your search or picking another vibe.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = filtered.map(p => createProductCardHTML(p)).join('');
  }

  // ── PRODUCT CARD BUILDER ───────────────────────────────────
  function createProductCardHTML(p) {
    const isWishlisted = state.wishlist.some(item => item.id === p.id);
    const badgeHTML = p.badgeLabel ? `<div class="app-product-card-badge">${p.badgeLabel}</div>` : '';
    const origPriceHTML = p.originalPrice ? `<span class="app-product-orig-price">${formatPrice(p.originalPrice)}</span>` : '';

    return `
      <div class="app-product-card" onclick="openProductDetail(${p.id})">
        <div class="app-product-img-wrap">
          <img src="${p.image}" alt="${p.name}" loading="lazy">
          ${badgeHTML}
          <button class="wishlist-toggle-btn ${isWishlisted ? 'active' : ''}" 
                  onclick="event.stopPropagation(); toggleWishlist(${p.id});" 
                  aria-label="Wishlist">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="${isWishlisted ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </button>
        </div>
        <div class="app-product-info">
          <span class="app-product-cat">${p.category}</span>
          <div class="app-product-title">${p.name}</div>
          <div class="app-product-bottom">
            <div class="app-product-price">
              ${formatPrice(p.price)}${origPriceHTML}
            </div>
            <button class="add-cart-mini-btn" onclick="event.stopPropagation(); addToCart(${p.id});" aria-label="Add to cart">+</button>
          </div>
        </div>
      </div>
    `;
  }

  // ── WISHLIST TAB RENDER ────────────────────────────────────
  function renderWishlistGrid() {
    const container = document.getElementById('wishlist-products-grid');
    if (!container) return;

    if (state.wishlist.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">💖</div>
          <div class="empty-state-title">Your Wishlist is Empty</div>
          <p style="font-size: 0.78rem; margin-bottom: 16px;">Save your favorite aesthetic items for later!</p>
          <button class="pill-btn active" style="margin: 0 auto;" onclick="switchTab('shop')">Explore Shop ✦</button>
        </div>
      `;
      return;
    }

    container.innerHTML = state.wishlist.map(p => createProductCardHTML(p)).join('');
  }

  window.toggleWishlist = function (productId) {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return;

    const idx = state.wishlist.findIndex(item => item.id === productId);
    if (idx >= 0) {
      state.wishlist.splice(idx, 1);
      showToast(`Removed from Wishlist`);
    } else {
      state.wishlist.push(product);
      showToast(`Added to Wishlist 💖`);
    }

    localStorage.setItem('kikifinds_wishlist', JSON.stringify(state.wishlist));
    updateBadges();
    if (state.currentTab === 'wishlist') renderWishlistGrid();
    if (state.currentTab === 'shop') renderShopGrid();
  };

  // ── CART CONTROLLER ────────────────────────────────────────
  window.addToCart = function (productId) {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return;

    const existing = state.cart.find(item => item.id === productId);
    if (existing) {
      existing.qty += 1;
    } else {
      state.cart.push({ ...product, qty: 1 });
    }

    localStorage.setItem('kikifinds_cart', JSON.stringify(state.cart));
    updateBadges();
    renderCart();
    showToast(`Added to Cart 🛒`);
  };

  window.updateCartQty = function (productId, delta) {
    const item = state.cart.find(i => i.id === productId);
    if (!item) return;

    item.qty += delta;
    if (item.qty <= 0) {
      state.cart = state.cart.filter(i => i.id !== productId);
    }

    localStorage.setItem('kikifinds_cart', JSON.stringify(state.cart));
    updateBadges();
    renderCart();
  };

  function renderCart() {
    const container = document.getElementById('cart-items-scroll');
    const totalElem = document.getElementById('cart-total-amount');

    if (!container) return;

    if (state.cart.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">🛒</div>
          <div class="empty-state-title">Your Cart is Empty</div>
          <p style="font-size: 0.78rem;">Explore our aesthetic drops & add items to cart.</p>
        </div>
      `;
      if (totalElem) totalElem.textContent = formatPrice(0);
      return;
    }

    container.innerHTML = state.cart.map(item => `
      <div class="cart-item-row">
        <img class="cart-item-img" src="${item.image}" alt="${item.name}">
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-price">${formatPrice(item.price)}</div>
        </div>
        <div class="cart-qty-ctrl">
          <button class="cart-qty-btn" onclick="updateCartQty(${item.id}, -1)">-</button>
          <span style="font-size:0.8rem; font-weight:700;">${item.qty}</span>
          <button class="cart-qty-btn" onclick="updateCartQty(${item.id}, 1)">+</button>
        </div>
      </div>
    `).join('');

    const subtotal = state.cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const finalTotal = subtotal * (1 - state.discount);

    if (totalElem) totalElem.textContent = formatPrice(finalTotal);
  }

  window.applyCoupon = function () {
    const input = document.getElementById('cart-promo-input');
    if (!input) return;

    const val = input.value.trim().toUpperCase();
    if (val === 'GENZ10') {
      state.discount = 0.10;
      state.couponCode = 'GENZ10';
      showToast('🎉 10% Discount Applied!');
      renderCart();
    } else {
      showToast('❌ Invalid Promo Code');
    }
  };

  window.openCartSheet = function () {
    const overlay = document.getElementById('cart-sheet-overlay');
    const sheet = document.getElementById('cart-sheet');
    if (overlay && sheet) {
      overlay.classList.add('active');
      sheet.classList.add('active');
      renderCart();
    }
  };

  window.closeCartSheet = function () {
    const overlay = document.getElementById('cart-sheet-overlay');
    const sheet = document.getElementById('cart-sheet');
    if (overlay && sheet) {
      overlay.classList.remove('active');
      sheet.classList.remove('active');
    }
  };

  window.triggerCheckout = function () {
    if (state.cart.length === 0) {
      showToast('Cart is empty!');
      return;
    }
    showToast('✨ Order Placed Successfully! (Demo)');
    state.cart = [];
    localStorage.removeItem('kikifinds_cart');
    updateBadges();
    renderCart();
    closeCartSheet();
  };

  // ── PRODUCT DETAIL SHEET ──────────────────────────────────
  window.openProductDetail = function (productId) {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return;

    const overlay = document.getElementById('cart-sheet-overlay');
    const sheet = document.getElementById('product-detail-sheet');
    if (!sheet) return;

    const isWishlisted = state.wishlist.some(item => item.id === product.id);

    sheet.innerHTML = `
      <div class="sheet-handle" onclick="closeProductDetail()"></div>
      <div class="detail-img-box">
        <img src="${product.image}" alt="${product.name}">
      </div>
      <span class="app-product-cat">${product.category}</span>
      <h2 style="font-family:'Playfair Display',serif; font-size:1.4rem; font-weight:800; margin:4px 0 8px 0;">${product.name}</h2>
      <div style="font-family:'Space Grotesk',sans-serif; font-size:1.2rem; font-weight:800; color:var(--clr-accent-1); margin-bottom:12px;">
        ${formatPrice(product.price)}
      </div>
      <p style="font-size:0.8rem; color:var(--clr-text-muted); margin-bottom:16px; line-height:1.5;">
        ${product.description}
      </p>
      ${product.sizes ? `
        <div style="margin-bottom:16px;">
          <div style="font-size:0.75rem; font-weight:700; margin-bottom:6px;">Select Size:</div>
          <div style="display:flex; gap:8px;">
            ${product.sizes.map(s => `<button class="pill-btn">${s}</button>`).join('')}
          </div>
        </div>
      ` : ''}
      <div style="display:flex; gap:10px; margin-top:auto;">
        <button class="checkout-btn" style="flex:1;" onclick="addToCart(${product.id}); closeProductDetail();">Add To Cart 🛒</button>
        <button class="wishlist-toggle-btn ${isWishlisted ? 'active' : ''}" style="position:static; width:48px; height:48px; border-radius:12px;" onclick="toggleWishlist(${product.id})">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="${isWishlisted ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>
      </div>
    `;

    if (overlay) overlay.classList.add('active');
    sheet.classList.add('active');
  };

  window.closeProductDetail = function () {
    const overlay = document.getElementById('cart-sheet-overlay');
    const sheet = document.getElementById('product-detail-sheet');
    if (overlay && sheet) {
      overlay.classList.remove('active');
      sheet.classList.remove('active');
    }
  };

  // ── STORY LOOKBOOK VIEWER ──────────────────────────────────
  function initStoryViewer() {
    window.openStory = function (index) {
      state.currentStoryIndex = index;
      renderStorySlide();
      const modal = document.getElementById('story-modal');
      if (modal) modal.classList.add('active');
    };

    window.closeStory = function () {
      const modal = document.getElementById('story-modal');
      if (modal) modal.classList.remove('active');
    };

    window.nextStory = function () {
      if (state.currentStoryIndex < STORIES.length - 1) {
        state.currentStoryIndex++;
        renderStorySlide();
      } else {
        closeStory();
      }
    };

    window.prevStory = function () {
      if (state.currentStoryIndex > 0) {
        state.currentStoryIndex--;
        renderStorySlide();
      }
    };
  }

  function renderStorySlide() {
    const story = STORIES[state.currentStoryIndex];
    if (!story) return;

    const modal = document.getElementById('story-modal');
    if (!modal) return;

    const linkedProduct = PRODUCTS.find(p => p.id === story.productId);

    modal.innerHTML = `
      <div class="story-progress-indicators">
        ${STORIES.map((_, i) => `
          <div class="story-progress-segment ${i === state.currentStoryIndex ? 'active' : ''}">
            <div class="story-progress-segment-inner"></div>
          </div>
        `).join('')}
      </div>
      <div class="story-header-bar">
        <div class="story-author">
          <div class="story-ring" style="width:34px; height:34px; border:none;">
            <img class="story-author-img" src="${story.image}" alt="">
          </div>
          <span>${story.author}</span>
        </div>
        <button class="story-close-btn" onclick="closeStory()">✕</button>
      </div>
      <div class="story-media-box">
        <img src="${story.image}" alt="${story.title}">
        <div class="story-tap-area story-tap-left" onclick="prevStory()"></div>
        <div class="story-tap-area story-tap-right" onclick="nextStory()"></div>
      </div>
      ${linkedProduct ? `
        <div class="story-bottom-product" onclick="closeStory(); openProductDetail(${linkedProduct.id});">
          <div>
            <div style="font-size:0.65rem; color:var(--clr-accent-1); font-weight:700;">TAGGED PIECE</div>
            <div style="font-size:0.8rem; font-weight:700; color:#fff;">${linkedProduct.name}</div>
          </div>
          <button class="add-cart-mini-btn">Shop</button>
        </div>
      ` : ''}
    `;
  }

  // ── VIBE QUIZ CONTROLLER ───────────────────────────────────
  function initQuiz() {
    window.selectQuizOption = function (category) {
      state.quizAnswers.push(category);
      state.quizStep++;

      if (state.quizStep > 3) {
        showQuizResult();
      } else {
        renderQuizStep();
      }
    };

    window.resetQuiz = function () {
      state.quizStep = 1;
      state.quizAnswers = [];
      renderQuizStep();
    };
  }

  function renderQuizStep() {
    const container = document.getElementById('quiz-step-container');
    if (!container) return;

    const fill = document.getElementById('quiz-progress-fill');
    if (fill) fill.style.width = `${(state.quizStep / 3) * 100}%`;

    const STEPS = [
      {
        title: 'What’s your ideal weekend mood?',
        subtitle: 'Pick the scenario that matches your energy.',
        options: [
          { icon: '📚', text: 'Coffee in an old library with leather journals', cat: 'Dark Academia' },
          { icon: '🎀', text: 'Matcha latte and ribbon styling in soft pink', cat: 'Coquette' },
          { icon: '🧢', text: 'Thrift shopping and listening to underground beats', cat: 'Streetwear' },
          { icon: '💿', text: 'Vinyl records, silver glitter & 2000s time travel', cat: 'Y2K' },
        ]
      },
      {
        title: 'Choose your go-to essential accessory:',
        subtitle: 'The one item you can’t leave home without.',
        options: [
          { icon: '✨', text: 'Dainty gold satellite chain & lip gloss', cat: 'Clean Girl' },
          { icon: '🦋', text: 'Holographic butterfly clips set', cat: 'Y2K' },
          { icon: '📌', text: 'Enamel pin badges on canvas tote', cat: 'Indie/Alt' },
          { icon: '🌿', text: 'Wicker basket and wildflower pouch', cat: 'Cottagecore' },
        ]
      },
      {
        title: 'Select your signature color vibe:',
        subtitle: 'Colors that define your daily look.',
        options: [
          { icon: '🖤', text: 'Amber, espresso brown & dark charcoal', cat: 'Dark Academia' },
          { icon: '🌸', text: 'Blush pink, pearl white & satin sheen', cat: 'Coquette' },
          { icon: '⚡', text: 'Electric chartreuse & heavy grey fleece', cat: 'Streetwear' },
          { icon: '💿', text: 'Iridescent silver, vaporwave cyan & magenta', cat: 'Y2K' },
        ]
      }
    ];

    const current = STEPS[state.quizStep - 1];
    container.innerHTML = `
      <h2 class="quiz-step-title">${current.title}</h2>
      <p class="quiz-step-subtitle">${current.subtitle}</p>
      <div class="quiz-options-list">
        ${current.options.map(opt => `
          <button class="quiz-option-btn" onclick="selectQuizOption('${opt.cat}')">
            <span class="quiz-option-icon">${opt.icon}</span>
            <span>${opt.text}</span>
          </button>
        `).join('')}
      </div>
    `;
  }

  function showQuizResult() {
    const container = document.getElementById('quiz-step-container');
    if (!container) return;

    // Calculate most frequent aesthetic
    const counts = {};
    state.quizAnswers.forEach(cat => counts[cat] = (counts[cat] || 0) + 1);
    const matchedCategory = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b, 'Coquette');

    const recommended = PRODUCTS.filter(p => p.category === matchedCategory).slice(0, 2);

    container.innerHTML = `
      <div class="quiz-result-box">
        <div class="quiz-result-emoji">✦ ✨ ✦</div>
        <div style="font-size:0.75rem; font-weight:700; color:var(--clr-text-muted); text-transform:uppercase;">Your Matched Vibe</div>
        <div class="quiz-result-vibe">${matchedCategory}</div>
        <p class="quiz-result-desc">Your taste is strictly top-tier. Here are the curated drops tailored for your vibe.</p>
        <div class="products-grid" style="margin-bottom:16px;">
          ${recommended.map(p => createProductCardHTML(p)).join('')}
        </div>
        <button class="pill-btn active" style="margin: 0 auto;" onclick="resetQuiz()">Retake Quiz ✦</button>
      </div>
    `;
  }

  // ── BADGES & TOAST ────────────────────────────────────────
  function updateBadges() {
    const cartCount = state.cart.reduce((sum, item) => sum + item.qty, 0);
    const wishlistCount = state.wishlist.length;

    const cartBadge = document.getElementById('app-cart-badge');
    const wishlistBadge = document.getElementById('app-wishlist-badge');

    if (cartBadge) {
      cartBadge.textContent = cartCount;
      cartBadge.style.display = cartCount > 0 ? 'flex' : 'none';
    }
    if (wishlistBadge) {
      wishlistBadge.textContent = wishlistCount;
      wishlistBadge.style.display = wishlistCount > 0 ? 'flex' : 'none';
    }
  }

  function showToast(msg) {
    let toast = document.getElementById('app-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'app-toast';
      toast.className = 'app-toast';
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.classList.add('show');

    setTimeout(() => {
      toast.classList.remove('show');
    }, 2200);
  }

  window.showToast = showToast;

})();
